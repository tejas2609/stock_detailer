from fastapi import APIRouter, Request, WebSocket
from fastapi.responses import JSONResponse
from services.database.stocks_db import fetch_stocks_from_supabase
from fastapi import WebSocketDisconnect
from services.stocks.nse_fetcher import fetch_stock_data
from services.logging.error_handling import error_response

router = APIRouter()

@router.get("/stocks")
async def get_stocks(exchange: str, req: Request):
    if req.method != "GET":
        return error_response(status_code=405, message="Method not allowed. Use GET.")
    
    if not exchange and exchange.upper() not in ["NSE", "BSE"]:
        return error_response(status_code=400, message="Invalid exchange. Must be 'NSE' or 'BSE'.")
    
    fetched_result = fetch_stocks_from_supabase(exchange.upper())
    
    if not fetched_result:
        return error_response(status_code=500, message="Error fetching stocks")
    fetched_result['message'] = f"Fetched {len(fetched_result['stocks'])} stocks from {exchange.upper()} exchange."
    
    return JSONResponse(content={"stocks": fetched_result}, status_code=200)

@router.get("/stock/data/history")
async def get_stock_history(symbol: str, period: str, interval: str, request: Request):
    if request.method != "GET":
        return error_response(status_code=405, message="Method not allowed")

    if not symbol:
        return error_response(status_code=400, message="Symbol is required")

    try:
        stock_data = fetch_stock_data(symbol, interval, period)
        return JSONResponse(content=stock_data, status_code=200)
    except Exception as e:
        return error_response(status_code=500, message=str(e))

@router.get("/stock/data/details")
async def get_stock_history(symbol: str, request: Request):
    if request.method != "GET":
        return error_response(status_code=405, message="Method not allowed")
    
    if not symbol:
        return error_response(status_code=400, message="Symbol is required.")
    
    try:
        stock_data = fetch_stock_data(symbol, details=True)
        return JSONResponse(content=stock_data, status_code=200)
    except Exception as e:
        return error_response(status_code=500, message=str(e))

