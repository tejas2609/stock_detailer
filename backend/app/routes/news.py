from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from services.logging.error_handling import error_response
from news_module.aggregator import getNews
from services.database.stocks_db import get_company_name_by_symbol

router = APIRouter()

@router.get("/stock/news")
async def get_news(stock: str, request: Request):
    if request.method != "GET":
        return error_response(status_code=405, message="Method not allowed. Use GET.")
    
    if not stock:
        return error_response(status_code=400, message="Stock symbol is required.")

    if not isinstance(stock, str):
        return error_response(status_code=400, message="Stock symbol must be a string.")

    company_name = get_company_name_by_symbol("NSE", stock)
    
    if not company_name:
        return error_response(status_code=404, message=f"Company name not found for stock symbol: {stock}")
    
    try:
        news_data = getNews(company_name)
        return JSONResponse(content={'news_data': news_data}, status_code=200)
    except Exception as e:
        return error_response(status_code=500, message=str(e))