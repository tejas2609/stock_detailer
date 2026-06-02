from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import router as router
from routes import kite_connect
from services.clients import redis_client


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router.router)

@app.on_event("startup")
async def startup_event():
    kite_connect.create_kws(redis_client.get("kite_access_token"))

@app.get("/")
async def root():
    return {"message": "Hello World"}
