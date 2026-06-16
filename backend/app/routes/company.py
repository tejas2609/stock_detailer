from fastapi import APIRouter, Request, WebSocket
from fastapi.responses import JSONResponse
from services.database.stocks_db import fetch_stocks_from_supabase
from fastapi import WebSocketDisconnect
from services.stocks.nse_fetcher import fetch_stock_data

router = APIRouter()

@router.get("/stocks")
async def get_stocks(exchange: str, req: Request, offset: int = 150, limit: int = 250):
    if req.method != "GET":
        return JSONResponse(status_code=405, content={"error": "Method not allowed. Use GET."})
    
    if not exchange and exchange.upper() not in ["NSE", "BSE"]:
        return JSONResponse(status_code=400, content={"error": "Invalid exchange. Must be 'NSE' or 'BSE'."})
    
    fetched_result = fetch_stocks_from_supabase(exchange.upper(), offset=offset, limit=limit)
    
    if not fetched_result:
        return JSONResponse(status_code=500, content={"error": "Error fetching stocks"})
    fetched_result['message'] = f"Fetched {len(fetched_result['stocks'])} stocks from {exchange.upper()} exchange."
    
    return JSONResponse(content={"stocks": fetched_result}, status_code=200)

@router.get("/stock/data/history")
async def get_stock_history(symbol: str, interval: str, period: str, request: Request):
    if request.method != "GET":
        return JSONResponse(status_code=405, content={"error": "Method not allowed. Use GET."})
    
    if not symbol:
        return JSONResponse(status_code=400, content={"error": "Symbol is required."})
    
    try:
        stock_data = fetch_stock_data(symbol, interval, period)
        return JSONResponse(content=stock_data, status_code=200)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/stock/data/details")
async def get_stock_history(symbol: str, request: Request):
    if request.method != "GET":
        return JSONResponse(status_code=405, content={"error": "Method not allowed. Use GET."})
    
    if not symbol:
        return JSONResponse(status_code=400, content={"error": "Symbol is required."})
    
    try:
        stock_data = fetch_stock_data(symbol, details=True)
        return JSONResponse(content=stock_data, status_code=200)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

