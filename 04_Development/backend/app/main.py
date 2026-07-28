from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.captures.controller import router as captures_router
from .modules.ai.controller import router as ai_router
from .modules.timeline.controller import router as timeline_router
from .modules.home.controller import router as home_router
from .modules.graph.controller import router as graph_router
from .modules.notifications.controller import router as notifications_router
from .modules.persona.controller import router as persona_router
from app.modules.automation.controller import router as automation_router
from app.modules.collaboration.controller import router as collaboration_router
from app.modules.billing.controller import router as billing_router
from app.modules.users.controller import router as users_router
from app.modules.storage.controller import router as storage_router
from .modules.voice.controller import router as voice_router
from .modules.filters.controller import router as filters_router
from .modules.security.controller import router as security_router
from app.modules.migration.controller import router as migration_router

from contextlib import asynccontextmanager
from .core.database import SessionLocal
from .modules.billing import subscription_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed billing plans
    db = SessionLocal()
    try:
        subscription_service.seed_default_plans(db)
    finally:
        db.close()
    yield
    # Shutdown logic

app = FastAPI(
    title="YRecall API",
    description="Backend API for YRecall - AI Life Operating System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(captures_router, prefix="/api/v1/captures", tags=["Captures"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(timeline_router, prefix="/api/v1/timeline", tags=["Timeline"])
app.include_router(home_router, prefix="/api/v1/home", tags=["Home"])
app.include_router(graph_router, prefix="/api/v1/graph", tags=["Graph"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(persona_router, prefix="/api/v1/persona", tags=["Persona"])
app.include_router(automation_router, prefix="/api/v1/automation", tags=["Automation"])
app.include_router(collaboration_router, prefix="/api/v1/collaboration", tags=["Collaboration"])
app.include_router(billing_router, prefix="/api/v1/billing", tags=["Billing"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(storage_router, prefix="/api/v1/storage", tags=["Storage"])
app.include_router(migration_router, prefix="/api/v1/migration", tags=["Migration"])
app.include_router(voice_router, prefix="/api/v1/voice", tags=["Voice"])
app.include_router(filters_router, prefix="/api/v1/filters", tags=["Filters"])
app.include_router(security_router, prefix="/api/v1/security", tags=["Security"])
@app.get("/health")
def health_check():
    return {"status": "ok"}
