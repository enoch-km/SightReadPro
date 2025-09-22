from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import os

# Import routers
from routers import upload, exercises, users

# Import database
from db import db

# Create FastAPI app
app = FastAPI(
    title="SightReadPro API",
    description="Backend API for SightReadPro music sight-reading app",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(exercises.router, prefix="/exercises", tags=["exercises"])
app.include_router(users.router, prefix="/users", tags=["users"])

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint for SightReadPro API
    
    This API provides endpoints for:
    - Uploading and parsing sheet music
    - Managing daily practice exercises
    - Tracking user performance and progress
    """
    return {
        "message": "Welcome to SightReadPro API! 🎵",
        "version": "1.0.0",
        "description": "Music sight-reading practice platform",
        "endpoints": {
            "upload_score": "/upload/score",
            "get_daily_exercises": "/exercises/daily/{user_id}",
            "submit_performance": "/users/submit_performance",
            "documentation": "/docs"
        },
        "features": [
            "Sheet music upload (PDF, JPG, MusicXML)",
            "MusicXML parsing with music21",
            "Exercise generation and management",
            "User performance tracking",
            "XP and progression system",
            "Daily practice exercises"
        ],
        "timestamp": datetime.now().isoformat()
    }

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Check database connection
        db.get_connection()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "database": "connected",
            "version": "1.0.0"
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "database": "disconnected",
                "error": str(e)
            }
        )

# API info endpoint
@app.get("/api/info", tags=["info"])
async def api_info():
    """Get detailed API information"""
    return {
        "name": "SightReadPro API",
        "version": "1.0.0",
        "description": "A comprehensive API for music sight-reading practice",
        "features": {
            "file_upload": {
                "supported_formats": ["PDF", "JPG", "JPEG", "PNG", "MusicXML", "XML"],
                "max_file_size": "10MB",
                "upload_directory": "uploads/"
            },
            "music_parsing": {
                "engine": "music21",
                "capabilities": [
                    "MusicXML parsing",
                    "Exercise generation",
                    "Difficulty assessment",
                    "Measure-based chunking"
                ]
            },
            "exercise_management": {
                "difficulty_levels": ["easy", "medium", "hard"],
                "exercise_types": ["sight_reading", "rhythm", "scales", "arpeggios"],
                "xp_system": "10-20 XP per exercise based on difficulty"
            },
            "user_progress": {
                "tracking": ["XP", "level", "streak", "performance_history"],
                "analytics": ["accuracy", "rhythm", "tempo", "practice_time"],
                "achievements": ["streak_milestones", "level_ups", "exercise_completion"]
            }
        },
        "database": {
            "type": "SQLite",
            "tables": ["users", "exercises", "performances"],
            "features": ["automatic_user_creation", "sample_data", "indexes"]
        },
        "development_status": {
            "current_version": "MVP",
            "next_features": [
                "AI-powered exercise generation",
                "Audio recording and analysis",
                "Advanced performance analytics",
                "Real-time feedback system"
            ]
        },
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_json": "/openapi.json"
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url.path)
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url.path)
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    print("🎵 Starting SightReadPro API...")
    
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Initialize database
    print("📊 Initializing database...")
    db.init_database()
    print("✅ Database initialized successfully")
    
    print("🚀 SightReadPro API is ready!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    print("🛑 Shutting down SightReadPro API...")

if __name__ == "__main__":
    import uvicorn
    
    print("🎵 SightReadPro API")
    print("=" * 40)
    print("Starting development server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/docs")
    print("🌐 API Info: http://localhost:8000/api/info")
    print("=" * 40)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
