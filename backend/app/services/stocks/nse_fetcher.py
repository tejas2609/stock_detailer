from kiteconnect import KiteConnect
from services.clients import redis_client
import os
from services.stocks.stock_details import StockDetails

kite = KiteConnect(api_key=os.getenv("KITE_API_KEY"))
kite.set_access_token(redis_client.get("kite_access_token"))


def get_kite_instruments():
    return kite.instruments("NSE")

def fetch_stock_data(stock_symbol: str, interval: str=None, period: str=None, details=False) -> dict:
    
    stock_details = StockDetails(stock_symbol, interval, period)
    
    try:
        if details:
            resp = stock_details.get_stock_details()
        else:
            resp = stock_details.get_stock_price()
        return {"symbol": stock_symbol, "data": resp}
    except Exception as e:
        return Exception(f"Error fetching stock data: {str(e)}")
