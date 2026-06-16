from fastapi import APIRouter
from routes import company, news, auth

router = APIRouter()

router.include_router(company.router)
router.include_router(news.router)
router.include_router(auth.router)
