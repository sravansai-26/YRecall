from pydantic import BaseModel, EmailStr
from typing import Optional

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetVerify(BaseModel):
    email: EmailStr
    code: str

class PasswordResetComplete(BaseModel):
    reset_token: str
    new_password: str

class PasswordResetResponse(BaseModel):
    success: bool
    message: str
    reset_token: Optional[str] = None

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationVerify(BaseModel):
    email: EmailStr
    code: str

class EmailVerificationResponse(BaseModel):
    success: bool
    message: str
