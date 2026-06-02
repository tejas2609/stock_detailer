from fastapi import APIRouter, Request, WebSocket
from fastapi.responses import JSONResponse
from services.database.stocks_db import fetch_stocks_from_supabase
from services.websocket.socket_manager import manager
import json
from services.stocks.stock_details import add_stock_watcher, remove_stock_watcher, start_polling
from fastapi import WebSocketDisconnect

router = APIRouter()

@router.get("/stocks")
async def get_stocks(exchange: str, req: Request, offset: int = 0, limit: int = 100):
    if req.method != "GET":
        return JSONResponse(status_code=405, content={"error": "Method not allowed. Use GET."})
    
    if not exchange and exchange.upper() not in ["NSE", "BSE"]:
        return JSONResponse(status_code=400, content={"error": "Invalid exchange. Must be 'NSE' or 'BSE'."})
    
    fetched_result = fetch_stocks_from_supabase(exchange.upper(), offset=offset, limit=limit)
    
    if not fetched_result:
        return JSONResponse(status_code=500, content={"error": "Error fetching stocks"})
    fetched_result['message'] = f"Fetched {len(fetched_result['stocks'])} stocks from {exchange.upper()} exchange."
    
    return JSONResponse(content={"stocks": fetched_result}, status_code=200)

@router.websocket("/ws/stocks")
async def websocket_endpoint(websocket: WebSocket):
    print("websocket endpoint hit")
    print(websocket)
    await manager.connect(websocket)
    subscribed_symbol = None
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            action = payload.get("action")
            symbol = payload.get("symbol")
            
            if action == "subscribe":

                if subscribed_symbol:
                    manager.unsubscribe(subscribed_symbol, websocket)
                    remove_stock_watcher(subscribed_symbol)

                subscribed_symbol = symbol

                manager.subscribe(symbol, websocket)

                count = add_stock_watcher(symbol)

                if count >= 1:
                    await start_polling(symbol)

            elif action == "unsubscribe":

                manager.unsubscribe(symbol, websocket)
                remove_stock_watcher(symbol)

                subscribed_symbol = None

    except WebSocketDisconnect:

        if subscribed_symbol:
            manager.unsubscribe(subscribed_symbol, websocket)
            remove_stock_watcher(subscribed_symbol)