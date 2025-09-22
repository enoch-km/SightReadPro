from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class FileType(str, Enum):
    PDF = "pdf"
    JPG = "jpg"
    JPEG = "jpeg"
    PNG = "png"
    MUSICXML = "musicxml"
    XML = "xml"

class User(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    xp: int = Field(default=0, description="User's experience points")
    streak: int = Field(default=0, description="Current practice streak")
    last_active_date: str = Field(default_factory=lambda: datetime.now().strftime('%Y-%m-%d'))
    created_at: datetime = Field(default_factory=datetime.now)
    level: int = Field(default=1, description="User level based on XP")

class Exercise(BaseModel):
    id: int = Field(..., description="Unique exercise identifier")
    measures: str = Field(..., description="Measure range (e.g., '1-4')")
    difficulty: DifficultyLevel = Field(..., description="Exercise difficulty level")
    title: Optional[str] = Field(None, description="Exercise title")
    key_signature: Optional[str] = Field(None, description="Musical key")
    time_signature: Optional[str] = Field(None, description="Time signature")
    notes: Optional[List[str]] = Field(None, description="List of notes in the exercise")
    rhythm_pattern: Optional[List[str]] = Field(None, description="Rhythm pattern")
    xp_reward: int = Field(default=10, description="XP earned for completing this exercise")
    created_at: datetime = Field(default_factory=datetime.now)

class Performance(BaseModel):
    user_id: str = Field(..., description="User who performed the exercise")
    exercise_id: int = Field(..., description="Exercise that was performed")
    score: int = Field(..., ge=0, le=100, description="Performance score (0-100)")
    accuracy: Optional[float] = Field(None, ge=0, le=100, description="Note accuracy percentage")
    rhythm_score: Optional[float] = Field(None, ge=0, le=100, description="Rhythm accuracy percentage")
    tempo_score: Optional[float] = Field(None, ge=0, le=100, description="Tempo consistency percentage")
    practice_time_seconds: Optional[int] = Field(None, description="Time spent practicing")
    mistakes_count: Optional[int] = Field(None, description="Number of mistakes made")
    notes_played: Optional[List[str]] = Field(None, description="Notes that were actually played")
    performance_data: Optional[Dict[str, Any]] = Field(None, description="Additional performance metrics")
    submitted_at: datetime = Field(default_factory=datetime.now)

class UploadResponse(BaseModel):
    message: str = Field(..., description="Upload status message")
    filename: str = Field(..., description="Saved filename")
    file_type: FileType = Field(..., description="Type of uploaded file")
    exercises: Optional[List[Exercise]] = Field(None, description="Generated exercises (for MusicXML)")

class DailyExercisesResponse(BaseModel):
    user_id: str = Field(..., description="User ID")
    date: str = Field(..., description="Date of exercises")
    exercises: List[Exercise] = Field(..., description="List of daily exercises")
    total_count: int = Field(..., description="Total number of exercises")

class PerformanceResponse(BaseModel):
    message: str = Field(..., description="Performance submission message")
    user_id: str = Field(..., description="User ID")
    exercise_id: int = Field(..., description="Exercise ID")
    score: int = Field(..., description="Submitted score")
    xp_earned: int = Field(..., description="XP earned from this performance")
    new_total_xp: int = Field(..., description="Updated total XP")
    new_level: int = Field(..., description="Updated user level")
    streak_updated: bool = Field(..., description="Whether streak was updated")
    new_streak: int = Field(..., description="Updated streak count")

class UserProgress(BaseModel):
    user_id: str = Field(..., description="User ID")
    current_xp: int = Field(..., description="Current XP")
    current_level: int = Field(..., description="Current level")
    current_streak: int = Field(..., description="Current streak")
    last_active_date: str = Field(..., description="Last active date")
    total_exercises_completed: int = Field(..., description="Total exercises completed")
    average_score: float = Field(..., description="Average performance score")

# Database table schemas
class UserTable(BaseModel):
    user_id: str
    xp: int
    streak: int
    last_active_date: str
    created_at: str
    level: int

class ExerciseTable(BaseModel):
    id: int
    measures: str
    difficulty: str
    title: Optional[str]
    key_signature: Optional[str]
    time_signature: Optional[str]
    notes: Optional[str]  # JSON string
    rhythm_pattern: Optional[str]  # JSON string
    xp_reward: int
    created_at: str

class PerformanceTable(BaseModel):
    id: int
    user_id: str
    exercise_id: int
    score: int
    accuracy: Optional[float]
    rhythm_score: Optional[float]
    tempo_score: Optional[float]
    practice_time_seconds: Optional[int]
    mistakes_count: Optional[int]
    notes_played: Optional[str]  # JSON string
    performance_data: Optional[str]  # JSON string
    submitted_at: str


