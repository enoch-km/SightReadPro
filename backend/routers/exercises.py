from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from models import Exercise, DailyExercisesResponse, DifficultyLevel
from db import db

router = APIRouter(prefix="/exercises", tags=["exercises"])

@router.get("/daily/{user_id}", response_model=DailyExercisesResponse)
async def get_daily_exercises(
    user_id: str,
    limit: int = Query(default=5, ge=1, le=20, description="Number of exercises to return"),
    difficulty: Optional[DifficultyLevel] = Query(None, description="Filter by difficulty level")
):
    """
    Get daily exercises for a specific user
    
    TODO: Implement AI-powered exercise selection:
    - Analyze user's current level and progress
    - Select exercises based on learning objectives
    - Ensure appropriate difficulty progression
    - Consider user's practice history and preferences
    """
    
    try:
        # Get exercises for the user
        exercises = db.get_daily_exercises_for_user(user_id, limit=limit)
        
        # Filter by difficulty if specified
        if difficulty:
            exercises = [ex for ex in exercises if ex.difficulty == difficulty]
        
        # If no exercises found, return sample exercises
        if not exercises:
            exercises = db.get_exercises(limit=limit, difficulty=difficulty.value if difficulty else None)
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        return DailyExercisesResponse(
            user_id=user_id,
            date=current_date,
            exercises=exercises,
            total_count=len(exercises)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get daily exercises: {str(e)}"
        )

@router.get("/", response_model=List[Exercise])
async def get_all_exercises(
    limit: int = Query(default=20, ge=1, le=100, description="Number of exercises to return"),
    difficulty: Optional[DifficultyLevel] = Query(None, description="Filter by difficulty level"),
    offset: int = Query(default=0, ge=0, description="Number of exercises to skip")
):
    """
    Get all available exercises with optional filtering
    
    TODO: Implement advanced filtering:
    - Filter by musical key
    - Filter by time signature
    - Filter by exercise length (measures)
    - Search by title or description
    """
    
    try:
        exercises = db.get_exercises(limit=limit, difficulty=difficulty.value if difficulty else None)
        
        # Apply offset (simple pagination)
        if offset > 0:
            exercises = exercises[offset:offset + limit]
        
        return exercises
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get exercises: {str(e)}"
        )

@router.get("/{exercise_id}", response_model=Exercise)
async def get_exercise_by_id(exercise_id: int):
    """Get a specific exercise by ID"""
    
    try:
        # Get all exercises and find the one with matching ID
        exercises = db.get_exercises(limit=1000)  # Get all exercises
        exercise = next((ex for ex in exercises if ex.id == exercise_id), None)
        
        if not exercise:
            raise HTTPException(
                status_code=404,
                detail=f"Exercise with ID {exercise_id} not found"
            )
        
        return exercise
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get exercise: {str(e)}"
        )

@router.get("/difficulty/{difficulty}", response_model=List[Exercise])
async def get_exercises_by_difficulty(
    difficulty: DifficultyLevel,
    limit: int = Query(default=10, ge=1, le=50, description="Number of exercises to return")
):
    """Get exercises by difficulty level"""
    
    try:
        exercises = db.get_exercises(limit=limit, difficulty=difficulty.value)
        return exercises
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get exercises by difficulty: {str(e)}"
        )

@router.get("/random/{count}", response_model=List[Exercise])
async def get_random_exercises(
    count: int,
    difficulty: Optional[DifficultyLevel] = Query(None, description="Filter by difficulty level")
):
    """
    Get random exercises for practice
    
    TODO: Implement smart randomization:
    - Ensure variety in difficulty levels
    - Avoid repeating recent exercises
    - Consider user's learning progress
    """
    
    try:
        exercises = db.get_exercises(limit=count, difficulty=difficulty.value if difficulty else None)
        return exercises
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get random exercises: {str(e)}"
        )

@router.get("/stats/summary")
async def get_exercise_stats():
    """Get summary statistics about available exercises"""
    
    try:
        all_exercises = db.get_exercises(limit=1000)  # Get all exercises
        
        # Count by difficulty
        difficulty_counts = {}
        for exercise in all_exercises:
            difficulty = exercise.difficulty.value
            difficulty_counts[difficulty] = difficulty_counts.get(difficulty, 0) + 1
        
        # Calculate average XP reward
        total_xp = sum(ex.xp_reward for ex in all_exercises)
        avg_xp = total_xp / len(all_exercises) if all_exercises else 0
        
        return {
            "total_exercises": len(all_exercises),
            "difficulty_distribution": difficulty_counts,
            "average_xp_reward": round(avg_xp, 2),
            "total_xp_available": total_xp,
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get exercise stats: {str(e)}"
        )

@router.get("/search/{query}")
async def search_exercises(
    query: str,
    limit: int = Query(default=10, ge=1, le=50, description="Number of results to return")
):
    """
    Search exercises by title or description
    
    TODO: Implement advanced search:
    - Full-text search across all fields
    - Fuzzy matching for typos
    - Search by musical characteristics
    - Relevance scoring
    """
    
    try:
        all_exercises = db.get_exercises(limit=1000)  # Get all exercises
        
        # Simple text search (case-insensitive)
        query_lower = query.lower()
        matching_exercises = []
        
        for exercise in all_exercises:
            # Search in title
            if exercise.title and query_lower in exercise.title.lower():
                matching_exercises.append(exercise)
                continue
            
            # Search in key signature
            if exercise.key_signature and query_lower in exercise.key_signature.lower():
                matching_exercises.append(exercise)
                continue
            
            # Search in time signature
            if exercise.time_signature and query_lower in exercise.time_signature.lower():
                matching_exercises.append(exercise)
                continue
            
            # Search in difficulty
            if query_lower in exercise.difficulty.value.lower():
                matching_exercises.append(exercise)
                continue
        
        # Limit results
        matching_exercises = matching_exercises[:limit]
        
        return {
            "query": query,
            "results": matching_exercises,
            "total_found": len(matching_exercises),
            "search_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search exercises: {str(e)}"
        )
