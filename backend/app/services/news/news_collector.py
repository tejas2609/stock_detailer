import yfinance as yf

ticker = yf.Ticker('TATAPOWER.NS')

for news in ticker.get_news(50):
    print(news)