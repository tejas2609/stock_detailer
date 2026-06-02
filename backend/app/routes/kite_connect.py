from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from kiteconnect import KiteConnect, KiteTicker
from services.stocks.nse_fetcher import get_kite_instruments
from services.clients import redis_client
from routes.auth import get_current_user
import os

router = APIRouter()

api_key = os.getenv("KITE_API_KEY")
kite = KiteConnect(api_key=api_key)

def login_kite():    
    return kite.login_url()

@router.get("/kite/login")
async def kite_login():
    return RedirectResponse(url=login_kite())

@router.get("/kite-callback")
async def kite_callback(request_token: str, request: Request):
    data = kite.generate_session(request_token, api_secret=os.getenv("KITE_SECRET_KEY"))
    redis_client.set("kite_access_token", data["access_token"])
    kite.set_access_token(data["access_token"])
    create_kws(data["access_token"])
    return {"message": "Kite login successful"}

@router.get("/kite/instruments")
async def get_instruments():
    print("Fetching instruments from Kite")
    instruments = get_kite_instruments()
    return {"instruments": instruments}
kws = None

def on_connect(ws, response):
    tokens = list(map(int, redis_client.smembers('subscribed_stocks')))
    
    if tokens:
        ws.subscribe(tokens)
        ws.set_mode(ws.MODE_FULL, tokens)
    
    print("Kite connected")


def on_close(ws, code, reason):
    print("Kite disconnected")

def create_kws(access_token: str):
    global kws
    kws = KiteTicker(
        api_key,
        access_token
    )
    kws.on_connect = on_connect
    kws.on_ticks = tick_stocks
    kws.on_close = on_close
    kws.connect(threaded=True)
    
    return kws

@router.get("/kite/subscribe")
def subscribe_to_stock(token: int, current_user: dict = Depends(get_current_user)):

    user_id = current_user["id"]
    
    try:
    
        old_token = redis_client.get(f"user:{user_id}:viewing")

        if old_token and old_token != str(token):
            unsubscribe_from_stock(int(old_token), user_id)

        redis_client.set(f"user:{user_id}:viewing", token)
        redis_client.sadd(f"stock:{token}:users", user_id)

        if kws:
            if redis_client.scard(f"stock:{token}:users") == 1:
                kws.subscribe([token])
                kws.set_mode(kws.MODE_FULL, [token])
            
        return {"message": f"Subscribed to stock with token {token}"}

    except Exception as e:
        return {"error": f"Error subscribing to stock with token {token}: {str(e)}"}
    
@router.get("/kite/unsubscribe")            
def unsubscribe_from_stock(token: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    try:
        print(redis_client.get(f"user:{user_id}:viewing"))
        redis_client.delete(f"user:{user_id}:viewing")
        redis_client.srem(f"stock:{token}:users", user_id)
        print(kws.is_connected())
        if kws and kws.is_connected():
            if redis_client.scard(f"stock:{token}:users") == 0:
                kws.unsubscribe([token])
        
        return {
            "message": f"Unsubscribed from stock with token {token}"
        }
    except Exception as e:
        return {
            "error": f"Error unsubscribing from stock with token {token}: {str(e)}"
        }

def tick_stocks(ws, ticks):
    print(ticks)