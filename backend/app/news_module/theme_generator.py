from collections import Counter
import re


STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "launches",
    "launch",
    "reaches",
    "india",
    "news",
    "summary"
}


def extract_keywords(cluster_articles):

    text = " ".join([
        article["title"]
        for article in cluster_articles
    ])

    text = text.lower()

    text = re.sub(
        r"[^a-zA-Z\s]",
        " ",
        text
    )

    words = text.split()

    filtered_words = []

    for word in words:

        if word in STOPWORDS:
            continue

        if len(word) <= 2:
            continue

        filtered_words.append(word)

    counter = Counter(
        filtered_words
    )

    return [
        word
        for word, _ in counter.most_common(7)
    ]


def generate_theme(
    cluster_articles,
    cleaned_entities
):

    main_entity = (
        cleaned_entities[0][0]
        if cleaned_entities
        else "Unknown"
    )

    keywords = extract_keywords(
        cluster_articles
    )

    keyword_phrase = " ".join(
        keywords[:3]
    ).title()

    return f"{main_entity} {keyword_phrase}".strip()