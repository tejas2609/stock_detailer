import os
import json
from dotenv import load_dotenv
from groq import Groq
from news_module.graph_builder import filter_relevant_articles

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
news_filter_client = Groq(api_key=os.getenv("GROQ_NEWS_UNIQUE_MODEL_API_KEY"))

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
    token_proof_payload = filter_unique_news(token_proof_payload)
    
    prompt = f"""
    You are a data engineer structuring news for a D3.js Hierarchical Tree Chart.
    Target Stock: {company_name}
    
    Articles Data:
    {json.dumps(token_proof_payload, separators=(',', ':'))}
    
    Task:
        You are a precise data analyst. Your task is to cluster a list of articles into a structured JSON tree.

        You are a news clustering engine.

        Given a list of already deduplicated articles {token_proof_payload}, group them into 2-6 broad themes based on their primary subject matter.

        Rules:
        - Each article must belong to exactly one theme.
        - Articles within a theme should share a common topic, event category, or business context.
        - Theme names should be short, clear, and descriptive (2-4 words, Title Case).
        - Do not create duplicate themes with similar meanings.
        - If an article does not fit any group, place it as a standalone article under the root.

        Return a JSON tree using the required schema.

        Output only valid JSON.
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
        
        tree_data = filter_unique_news(tree_data)
        return tree_data
    except Exception as e:
        print(f"Error parsing structural output payload: {e}")
        return {"name": company_name, "type": "root", "children": []}


def reduce_data_for_filter(tree_data, reduced_data=[]):
    try:
        for child in tree_data:
            obj = {}
            obj['name'] = child['name']
            obj['type'] = child['type']
            children = []
            for article in child.get('children', []):
                temp = {'name': article['name'], 'id': article['id']}
                children.append(temp)
            obj['children'] = children
            reduced_data.append(obj)
        
        return reduced_data    
    except Exception as e:
        print('Error', e)
    
        
def filter_unique_news(news):
    
    prompt = f"""
        You are a semantic deduplication engine.

        Given a list of articles {news}, keep only unique news stories.

        Two articles are duplicates if they convey the same underlying fact, event, announcement, action, outcome, state, or information, even if their wording is completely different.

        Examples:
        - "I am Ramesh" and "My name is Ramesh" → duplicate
        - "Apple launches iPhone 18" and "Apple unveils iPhone 18 at keynote" → duplicate

        Compare each article against all previously accepted unique articles.

        When duplicates are found:
        - Keep only one article.
        - Keep the most descriptive and informative title.
        - Discard the rest.

        Return only the deduplicated articles in the same format as input.

        Important:
        Deduplicate by meaning, not wording.
        Output only valid JSON.
        
    """
    
    response = news_filter_client.chat.completions.create(
        model="groq/compound-mini",
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
        return tree_data
    except Exception as e:
        print(f"Error parsing structural output payload: {e}")
        return {}