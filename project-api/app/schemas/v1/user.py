from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None

    is_admin: Optional[bool] = False
    is_disabled: Optional[bool] = False


class UserCreate(UserBase):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserUpdateAdmin(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None

    is_admin: Optional[bool] = False
    is_disabled: Optional[bool] = False


class UserUpdatePassword(BaseModel):
    password: str


class UserInDBBase(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    created_at: datetime
    updated_at: datetime


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    hashed_password: str
