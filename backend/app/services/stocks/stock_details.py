from services.clients import redis_client
import asyncio
from .nse_fetcher import fetch_stock_data
from services.websocket.socket_manager import manager

def add_stock_watcher(symbol: str):
    key = f"watchers:{symbol}"
    return redis_client.incr(key)

def remove_stock_watcher(symbol: str):
    key = f"watchers:{symbol}"

    count = redis_client.decr(key)
    if count <= 0:
        redis_client.delete(key)
        return 0
    return count

def get_stock_watch_count(symbol: str):
    print(redis_client.ping())
    key = f"watchers:{symbol}"
    count = redis_client.get(key)
    return int(count) if count else 0

active_symbols = set()

async def poll_stocks(symbol: str):
    while True:
        
        count = get_stock_watch_count(symbol)
        
        if count == 0:
            active_symbols.discard(symbol)
            break
        
        quote = fetch_stock_data(symbol)
        
        if quote:
            await manager.broadcast(symbol, quote)
        
        await asyncio.sleep(5)

async def start_polling(symbol: str):

    if symbol in active_symbols:
        return

    active_symbols.add(symbol)

    asyncio.create_task(
        poll_stocks(symbol)
    )