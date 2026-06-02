from kiteconnect import KiteConnect
from services.clients import redis_client
import os

kite = KiteConnect(api_key=os.getenv("KITE_API_KEY"))
kite.set_access_token(redis_client.get("kite_access_token"))


def get_kite_instruments():
    return kite.instruments("NSE")

def fetch_stock_data(stock_symbol: str) -> dict:
    # Mock data for testing
    return {
        "symbol": stock_symbol,
        "price": 100.0,
        "change": 1.5,
        "volume": 10000,
    }