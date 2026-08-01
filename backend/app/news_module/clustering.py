import os
import json
from dotenv import load_dotenv
from groq import Groq
from news_module.graph_builder import filter_relevant_articles

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
news_filter_client = Groq(api_key=os.getenv("GROQ_NEWS_UNIQUE_MODEL_API_KEY"))

def cluster_articles_with_groq(articles, company_name):
    relevant_articles = filter_relevant_articles(articles, company_name)
    
    if not relevant_articles:
        return {"name": company_name, "type": "root", "children": []}

    token_proof_payload = []
    url_cache = {} 
    
    for art in relevant_articles[:20]: 
        art_id = art["id"]
        url_cache[art_id] = art.get("url", "") 
        
        truncated_title = art["title"][:80] + "..." if len(art["title"]) > 80 else art["title"]
        
        token_proof_payload.append({
            "id": art_id,
            "title": truncated_title,
            "source": art["source"]
        })

    token_proof_payload = filter_unique_news(token_proof_payload)
    
    response_schema = """
        {
        "name": "<company_name>",
        "type": "root",
        "children": [
            {
            "name": "<cluster_name>",
            "type": "theme",
            "children": [
                {
                "name": "<exact_article_title>",
                "id": "<article_id>",
                "source": "<source>",
                "type": "article"
                }
            ]
            }
        ]
        }
    """
    
    prompt = f"""
    You are a data engineer structuring news for a D3.js Hierarchical Tree Chart.
    Target Stock: {company_name}
    
    Articles Data:
    {json.dumps(token_proof_payload, separators=(',', ':'))}
    
    Task:
    You are a news clustering engine.

        Given a list of deduplicated news articles

        Cluster the articles into 2–6 major news themes and return ONLY a D3.js hierarchy JSON.

        Rules:

        - Categorize the articles into 2-6 clusters, based on the common event/progress/topic/business context they share.
        - The output schema is gven below
        - Do not write duplicate articles
        - The articles which do not share are standalone articles and should be placed in the new theme named 'standalone'.
        
        Output schema:

        {response_schema}

    Return valid JSON only. No explanations, markdown, or additional text.Output only valid JSON.
    """
    
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
        
        if "children" in tree_data:
            for child in tree_data["children"]:
                if child.get("type") in ["article", "standalone_article"] and child.get("id") in url_cache:
                    child["url"] = url_cache[child["id"]]
                elif "children" in child:  # Look inside Theme branch blocks
                    for sub_child in child["children"]:
                        if sub_child.get("id") in url_cache:
                            sub_child["url"] = url_cache[sub_child["id"]]
                            
        return tree_data
    except Exception as e:
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