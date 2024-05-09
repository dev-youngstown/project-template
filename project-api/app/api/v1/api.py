from fastapi import APIRouter

from .endpoints import (
    auth,
    admin,
)
from .endpoints import profile

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(auth.router, tags=["Auth"])
v1_router.include_router(admin.router, prefix="/admin", tags=["Admin Only"])
v1_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
