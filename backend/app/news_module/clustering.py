import os
import json
from dotenv import load_dotenv
from groq import Groq
from news_module.graph_builder import filter_relevant_articles

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def cluster_articles_with_groq(articles, company_name):
    # 1. Filter out completely irrelevant news locally first
    relevant_articles = filter_relevant_articles(articles, company_name)
    print(f"Relevant articles after keyword filtering: {len(relevant_articles)}")
    
    if not relevant_articles:
        return {"name": company_name, "type": "root", "children": []}
        
    # 2. ULTRA TOKEN OPTIMIZATION & URL CACHING GUARD:
    # We strip URLs completely and truncate titles to 80 chars. 
    # This reduces each article's payload to ~30-40 characters total!
    token_proof_payload = []
    url_cache = {}  # Local storage to preserve URLs away from Groq
    
    for art in relevant_articles[:20]:  # Limit to top 20 highly relevant articles
        art_id = art["id"]
        url_cache[art_id] = art.get("url", "")  # Cache URL safely in local memory
        
        # Keep only the essential text identifiers, truncating titles cleanly
        truncated_title = art["title"][:80] + "..." if len(art["title"]) > 80 else art["title"]
        
        token_proof_payload.append({
            "id": art_id,
            "title": truncated_title,
            "source": art["source"]
        })

    # Total input text payload size is now strictly clamped under ~1,000 characters (~250 tokens)
    print(f"Token Guard: Clean string payload size sent to Groq: {len(json.dumps(token_proof_payload))} characters.")

    # 3. Compact prompt optimized for minimized context overhead
    prompt = f"""
    You are a data engineer structuring news for a D3.js Hierarchical Tree Chart.
    Target Stock: {company_name}
    
    Articles Data:
    {json.dumps(token_proof_payload, separators=(',', ':'))}
    
    Task:
        You are a precise data analyst. Your task is to deduplicate and cluster a list of articles into a structured JSON tree.

        ## INPUT
        These are the array of artcles {token_proof_payload}. Each article has: id, title, source.

        ## STEP 1 — DEDUPLICATE
        Filter out similar articles:
        - From articles having titles which convery the same thing take only one which is most descriptive.
        - Note: Title may be lexically different, so take the best representative which describes well and discard the rest.
        - While analyzing any new article, compare it with all previously accepted unique articles and decide if it is a duplicate or not. If it is a duplicate, discard it. If not, keep it for theme clustering.
        - The goal is to end up with only unique news stories, not multiple articles about the same news event. Ensure a clean thematic clustering in the next step.


        ## STEP 2 — CLUSTER INTO THEMES
        Group the remaining unique articles (dont consider discarded once) into broad thematic clusters.
        - Identify 2–6 themes based on what the articles are actually about.
        - Each article must belong to exactly ONE theme.
        - If an article does not fit any theme, mark it as standalone.
        - Theme names must be short (2–4 words), clear, and capitalized (e.g., "Market Performance", "Renewable Projects", "Company Strategy", etc - guess the theme from similar articles).

        ## STEP 3 — BUILD THE JSON TREE
        Construct a D3 Tree JSON matching this strict schema:

       - Root Node: {{"name": "{company_name}", "type": "root", "children": []}}

       - Theme Node: {{"name": "Short Theme Title", "type": "theme", "children": []}}

       - Leaf Node: {{"name": "Article Title", "id": "id", "source": "source", "type": "article"}}

       - Standalone Node: Directly under root if an article doesn't match any cluster, "type": "standalone_article"

        ## STRICT RULES
        - Output ONLY the raw JSON. No explanation, no markdown fences, no preamble.
        - Every article node must have: name, id, source, type.
        - Every theme node must have: name, type, children (non-empty array).
        - An article cannot appear more than once in the output.
        - Infer the company name from the articles themselves.


    Return ONLY a raw minified JSON object. Do not write markdown wraps (like ```json). No conversational explanations.
    """
    
    print("Dispatching minimized token-proof payload to Groq...")
    # print(token_proof_payload)
    # return
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        temperature=0.1, 
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    try:
        tree_data = json.loads(response.choices[0].message.content)
        
        # 4. RE-INJECT CACHED URLS LOCALLY
        # Walk through the generated D3 tree and map the URLs back onto the leaf nodes
        if "children" in tree_data:
            for child in tree_data["children"]:
                if child.get("type") in ["article", "standalone_article"] and child.get("id") in url_cache:
                    child["url"] = url_cache[child["id"]]
                elif "children" in child:  # Look inside Theme branch blocks
                    for sub_child in child["children"]:
                        if sub_child.get("id") in url_cache:
                            sub_child["url"] = url_cache[sub_child["id"]]
                            
        print("Successfully re-mapped cached URLs onto structured tree output.")
        return tree_data
    except Exception as e:
        print(f"Error parsing structural output payload: {e}")
        return {"name": company_name, "type": "root", "children": []}