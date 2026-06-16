import feedparser
import hashlib
from urllib.parse import quote_plus
from bs4 import BeautifulSoup
from news_module.clustering import cluster_articles_with_groq

def clean_html(raw_html: str) -> str:
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text(separator=" ", strip=True)

def generate_article_id(title: str, source: str) -> str:
    unique = f"{title}-{source}"
    return hashlib.md5(unique.encode()).hexdigest()

def getNews(company: str = "Tata Power") -> dict:
    # URL encode only the company name to preserve the literal ':' character for the filter
    encoded_company = quote_plus(company)
    url = f"https://news.google.com/rss/search?q={encoded_company}+when:3d&hl=en-IN&gl=IN&ceid=IN:en"
    
    print(f"Targeting RSS Feed: {url}")

    # Explicit user agent header to prevent Google from dropping connection blocks
    browser_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    feed = feedparser.parse(url, request_headers=browser_headers)
    seen = set()
    articles = []

    if not feed.entries:
        print("Parsed feed returned 0 entries. Trying broader 7-day horizon lookup...")
        url = f"https://news.google.com/rss/search?q={encoded_company}+when:7d&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(url, request_headers=browser_headers)

    for art in feed.entries:
        title = art.title.strip()
        source = art.source.title.strip() if "source" in art else "Google News"
        summary = clean_html(art.summary) if hasattr(art, "summary") else ""
        article_id = generate_article_id(title, source)

        if article_id in seen:
            continue
        seen.add(article_id)

        articles.append({
            "id": article_id,
            "title": title,
            "source": source,
            "url": art.link if hasattr(art, "link") else "",
            "summary": summary
        })
        
    print(f"Successfully processed {len(articles)} raw feed entries.")
    
    # Process structured nodes via the tight token-capped pipeline
    d3_tree_data = cluster_articles_with_groq(articles, company)
    print(d3_tree_data)
    return d3_tree_data