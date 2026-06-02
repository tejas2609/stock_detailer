from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from services.clients import supabase
from fastapi.security import HTTPBearer


security = HTTPBearer()

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    avatar_url: str = ''
    

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(request: RegisterRequest):
    
    #sanitize input
    
    if( '<' in request.email or '>' in request.email or '<' in request.password or '>' in request.password):
        return JSONResponse(status_code=400, content={"error": "Invalid email or password"})

    response = supabase.auth.sign_up({
        "email": request.email,
        "password": request.password
    })

    user = response.user

    supabase.table("users").insert({
        "id": user.id,
        "username": request.username,
        "first_name": request.first_name,
        "last_name": request.last_name,
        "avatar_url": request.avatar_url,
        "created_at": response.user.created_at.isoformat(),
        "updated_at": response.user.created_at.isoformat()
    }).execute()

    supabase.table("auth_logs").insert({
        "user_id": user.id,
        "action": "REGISTER",
        "created_at": response.user.created_at.isoformat()
    }).execute()

    return {
        "message": "Registration successful"
    }
    
@router.post("/login")
async def login(request: LoginRequest):
    #sanitize input
    
    if( '<' in request.email or '>' in request.email or '<' in request.password or '>' in request.password):
        return JSONResponse(status_code=400, content={"error": "Invalid email or password"})

    response = supabase.auth.sign_in_with_password({
        "email": request.email,
        "password": request.password
    })

    user = response.user

    supabase.table("auth_logs").insert({
        "user_id": user.id,
        "action": "LOGIN",
        "created_at": response.user.created_at.isoformat()
    }).execute()

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }

def get_current_user(credentials=Depends(security)):
    token = credentials.credentials

    user = supabase.auth.get_user(token)

    return {
        "id": user.user.id,
        "email": user.user.email
}
    
@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):

    supabase.auth.sign_out()

    supabase.table("auth_logs").insert({
        "user_id": current_user["id"],
        "action": "LOGOUT",
        "created_at": supabase.auth.get_user().user.created_at.isoformat()
    }).execute()

    return {
        "message": "Logged out"
    }
