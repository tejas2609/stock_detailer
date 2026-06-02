def is_relevant_article(article, company):
    title = article.get("title", "").lower()
    summary = article.get("summary", "").lower()
    content = f"{title} {summary}"

    # Target keywords for filtering
    company_terms = [
        company.lower(),
        company.lower().replace(" ", ""),
        company.lower().split()[0]  # First word of the company name
    ]

    for term in company_terms:
        if term in content:
            return True

    return False

def filter_relevant_articles(articles, company):
    filtered = []
    for article in articles:
        if is_relevant_article(article, company):
            filtered.append(article)
    return filtered