from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from datetime import datetime
from models import Performance, PerformanceResponse, UserProgress, User
from db import db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/submit_performance", response_model=PerformanceResponse)
async def submit_performance(
    performance_data: Dict[str, Any] = Body(..., description="Performance data")
):
    """
    Submit user performance for an exercise
    
    TODO: Implement advanced performance analysis:
    - Audio recording analysis
    - Note accuracy detection
    - Rhythm pattern matching
    - Tempo consistency measurement
    - Real-time feedback generation
    """
    
    try:
        # Extract required fields
        user_id = performance_data.get('user_id')
        exercise_id = performance_data.get('exercise_id')
        score = performance_data.get('score')
        
        # Validate required fields
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        if not exercise_id:
            raise HTTPException(status_code=400, detail="exercise_id is required")
        if score is None or not isinstance(score, int) or score < 0 or score > 100:
            raise HTTPException(status_code=400, detail="score must be an integer between 0 and 100")
        
        # Create performance object
        performance = Performance(
            user_id=user_id,
            exercise_id=exercise_id,
            score=score,
            accuracy=performance_data.get('accuracy'),
            rhythm_score=performance_data.get('rhythm_score'),
            tempo_score=performance_data.get('tempo_score'),
            practice_time_seconds=performance_data.get('practice_time_seconds'),
            mistakes_count=performance_data.get('mistakes_count'),
            notes_played=performance_data.get('notes_played', []),
            performance_data=performance_data.get('performance_data', {}),
            submitted_at=datetime.now()
        )
        
        # Save performance to database
        performance_id = db.save_performance(performance)
        
        # Calculate XP earned (simple formula for now)
        # TODO: Implement sophisticated XP calculation based on:
        # - Exercise difficulty
        # - Performance accuracy
        # - Practice time
        # - Streak bonuses
        # - Level-based multipliers
        
        base_xp = 10  # Base XP for completing exercise
        accuracy_bonus = int((score / 100) * 10)  # Up to 10 bonus XP for accuracy
        xp_earned = base_xp + accuracy_bonus
        
        # Update user progress
        updated_user = db.update_user_progress(user_id, xp_earned, streak_updated=True)
        
        return PerformanceResponse(
            message="Performance submitted successfully!",
            user_id=user_id,
            exercise_id=exercise_id,
            score=score,
            xp_earned=xp_earned,
            new_total_xp=updated_user.xp,
            new_level=updated_user.level,
            streak_updated=True,
            new_streak=updated_user.streak
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit performance: {str(e)}"
        )

@router.get("/{user_id}/progress", response_model=UserProgress)
async def get_user_progress(user_id: str):
    """Get comprehensive user progress and statistics"""
    
    try:
        progress = db.get_user_progress(user_id)
        
        if not progress:
            # Create user if doesn't exist
            db.create_user(user_id)
            progress = db.get_user_progress(user_id)
        
        return progress
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user progress: {str(e)}"
        )

@router.get("/{user_id}/profile", response_model=User)
async def get_user_profile(user_id: str):
    """Get user profile information"""
    
    try:
        user = db.get_user(user_id)
        
        if not user:
            # Create user if doesn't exist
            user = db.create_user(user_id)
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user profile: {str(e)}"
        )

@router.get("/{user_id}/performances")
async def get_user_performances(
    user_id: str,
    limit: int = 20,
    offset: int = 0
):
    """
    Get user's performance history
    
    TODO: Implement advanced performance analytics:
    - Performance trends over time
    - Difficulty progression analysis
    - Weak areas identification
    - Practice pattern analysis
    """
    
    try:
        # Get user to verify they exist
        user = db.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # TODO: Implement performance history retrieval from database
        # For now, return a placeholder response
        
        return {
            "user_id": user_id,
            "performances": [],
            "total_count": 0,
            "limit": limit,
            "offset": offset,
            "message": "Performance history retrieval not yet implemented"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user performances: {str(e)}"
        )

@router.get("/{user_id}/stats")
async def get_user_stats(user_id: str):
    """
    Get detailed user statistics
    
    TODO: Implement comprehensive analytics:
    - Daily/weekly/monthly progress
    - Exercise completion rates
    - Difficulty progression
    - Practice consistency
    - Performance improvement trends
    """
    
    try:
        # Get user progress
        progress = db.get_user_progress(user_id)
        if not progress:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Calculate additional stats
        current_date = datetime.now().strftime('%Y-%m-%d')
        last_active = progress.last_active_date
        
        # Check if user practiced today
        practiced_today = last_active == current_date
        
        # Calculate days since last practice
        if last_active != current_date:
            last_date = datetime.strptime(last_active, '%Y-%m-%d')
            current_datetime = datetime.now()
            days_since_practice = (current_datetime - last_date).days
        else:
            days_since_practice = 0
        
        # Calculate level progress
        xp_in_current_level = progress.current_xp % 100
        xp_to_next_level = 100 - xp_in_current_level
        level_progress_percentage = (xp_in_current_level / 100) * 100
        
        return {
            "user_id": user_id,
            "current_stats": {
                "xp": progress.current_xp,
                "level": progress.current_level,
                "streak": progress.current_streak,
                "total_exercises_completed": progress.total_exercises_completed,
                "average_score": round(progress.average_score, 2)
            },
            "practice_info": {
                "last_active_date": last_active,
                "practiced_today": practiced_today,
                "days_since_practice": days_since_practice,
                "current_streak": progress.current_streak
            },
            "level_progress": {
                "current_level": progress.current_level,
                "xp_in_current_level": xp_in_current_level,
                "xp_to_next_level": xp_to_next_level,
                "level_progress_percentage": round(level_progress_percentage, 2)
            },
            "achievements": {
                "first_exercise": progress.total_exercises_completed > 0,
                "streak_3_days": progress.current_streak >= 3,
                "streak_7_days": progress.current_streak >= 7,
                "streak_30_days": progress.current_streak >= 30,
                "level_5": progress.current_level >= 5,
                "level_10": progress.current_level >= 10,
                "level_20": progress.current_level >= 20
            },
            "last_updated": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user stats: {str(e)}"
        )

@router.post("/{user_id}/reset")
async def reset_user_progress(user_id: str):
    """Reset user progress (for testing purposes)"""
    
    try:
        # TODO: Implement user progress reset
        # This should be protected in production
        
        return {
            "message": f"User {user_id} progress reset successfully",
            "warning": "This endpoint should be disabled in production"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reset user progress: {str(e)}"
        )

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """
    Get global leaderboard
    
    TODO: Implement leaderboard system:
    - XP-based ranking
    - Streak-based ranking
    - Weekly/monthly competitions
    - Category-based leaderboards
    """
    
    try:
        # TODO: Implement leaderboard retrieval
        # For now, return placeholder data
        
        return {
            "leaderboard": [],
            "total_participants": 0,
            "limit": limit,
            "message": "Leaderboard not yet implemented",
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get leaderboard: {str(e)}"
        )


