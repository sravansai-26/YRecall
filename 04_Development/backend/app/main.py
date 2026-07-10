from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.captures.controller import router as captures_router
from .modules.ai.controller import router as ai_router

app = FastAPI(
    title="YRecall API",
    description="Backend API for YRecall - AI Life Operating System",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .modules.timeline.controller import router as timeline_router

# Include Routers
app.include_router(captures_router, prefix="/api/v1/captures", tags=["Captures"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(timeline_router, prefix="/api/v1/timeline", tags=["Timeline"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
