from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
import sentry_sdk

from app.api import v1_router
from app.core.config import settings

if settings.SECRET_KEY == "":
    raise HTTPException(
        status_code=500,
        detail="SECRET_KEY environment variable not set",
    )

sentry_sdk.init(
    environment=settings.NODE_ENV,
    dsn=settings.SENTRY_DSN,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    swagger_ui_parameters={"persistAuthorization": True},
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    # currently allow all origins, can set up settings.BACKEND_CORS_ORIGINS
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix=settings.API_STR)
