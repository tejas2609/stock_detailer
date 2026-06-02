import os
from supabase import create_client, Client
import redis
from dotenv import load_dotenv

load_dotenv()

SUP_URL: str = os.getenv("SUPABASE_URL")
print(f"Supabase URL: {SUP_URL}")
SUP_KEY: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUP_URL, SUP_KEY)

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)