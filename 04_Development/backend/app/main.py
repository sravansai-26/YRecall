from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.captures.controller import router as captures_router
from .modules.ai.controller import router as ai_router
from .modules.timeline.controller import router as timeline_router
from .modules.home.controller import router as home_router
from .modules.graph.controller import router as graph_router
from .modules.notifications.controller import router as notifications_router
from .modules.persona.controller import router as persona_router
from .modules.automation.controller import router as automation_router
from .modules.collaboration.controller import router as collaboration_router
from .modules.billing.controller import router as billing_router

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

@app.get("/health")
def health_check():
    return {"status": "ok"}
