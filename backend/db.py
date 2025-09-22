import sqlite3
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
from models import User, Exercise, Performance, UserProgress, UserTable, ExerciseTable, PerformanceTable

class Database:
    def __init__(self, db_path: str = "sightreadpro.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get a database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable row access by column name
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                xp INTEGER DEFAULT 0,
                streak INTEGER DEFAULT 0,
                last_active_date TEXT,
                created_at TEXT,
                level INTEGER DEFAULT 1
            )
        ''')
        
        # Create exercises table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                measures TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                title TEXT,
                key_signature TEXT,
                time_signature TEXT,
                notes TEXT,
                rhythm_pattern TEXT,
                xp_reward INTEGER DEFAULT 10,
                created_at TEXT
            )
        ''')
        
        # Create performances table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                exercise_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                accuracy REAL,
                rhythm_score REAL,
                tempo_score REAL,
                practice_time_seconds INTEGER,
                mistakes_count INTEGER,
                notes_played TEXT,
                performance_data TEXT,
                submitted_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (exercise_id) REFERENCES exercises (id)
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_performances_user_id ON performances (user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_performances_exercise_id ON performances (exercise_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_performances_submitted_at ON performances (submitted_at)')
        
        conn.commit()
        conn.close()
        
        # Insert sample data if tables are empty
        self.insert_sample_data()
    
    def insert_sample_data(self):
        """Insert sample exercises for testing"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if exercises table is empty
        cursor.execute('SELECT COUNT(*) FROM exercises')
        if cursor.fetchone()[0] == 0:
            sample_exercises = [
                {
                    'measures': '1-4',
                    'difficulty': 'easy',
                    'title': 'Simple C Major Scale',
                    'key_signature': 'C',
                    'time_signature': '4/4',
                    'notes': json.dumps(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']),
                    'rhythm_pattern': json.dumps(['quarter', 'quarter', 'quarter', 'quarter']),
                    'xp_reward': 10,
                    'created_at': datetime.now().isoformat()
                },
                {
                    'measures': '5-8',
                    'difficulty': 'medium',
                    'title': 'G Major Triad',
                    'key_signature': 'G',
                    'time_signature': '3/4',
                    'notes': json.dumps(['G4', 'B4', 'D5', 'D5', 'B4', 'G4']),
                    'rhythm_pattern': json.dumps(['quarter', 'quarter', 'quarter']),
                    'xp_reward': 15,
                    'created_at': datetime.now().isoformat()
                },
                {
                    'measures': '9-12',
                    'difficulty': 'hard',
                    'title': 'F Major Arpeggio',
                    'key_signature': 'F',
                    'time_signature': '4/4',
                    'notes': json.dumps(['F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'F4']),
                    'rhythm_pattern': json.dumps(['eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'quarter']),
                    'xp_reward': 20,
                    'created_at': datetime.now().isoformat()
                }
            ]
            
            for exercise in sample_exercises:
                cursor.execute('''
                    INSERT INTO exercises (measures, difficulty, title, key_signature, time_signature, notes, rhythm_pattern, xp_reward, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    exercise['measures'],
                    exercise['difficulty'],
                    exercise['title'],
                    exercise['key_signature'],
                    exercise['time_signature'],
                    exercise['notes'],
                    exercise['rhythm_pattern'],
                    exercise['xp_reward'],
                    exercise['created_at']
                ))
            
            conn.commit()
        
        conn.close()
    
    def create_user(self, user_id: str) -> User:
        """Create a new user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        created_at = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO users (user_id, xp, streak, last_active_date, created_at, level)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, 0, 0, current_date, created_at, 1))
        
        conn.commit()
        conn.close()
        
        return User(
            user_id=user_id,
            xp=0,
            streak=0,
            last_active_date=current_date,
            created_at=datetime.fromisoformat(created_at),
            level=1
        )
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
        row = cursor.fetchone()
        
        conn.close()
        
        if row:
            return User(
                user_id=row['user_id'],
                xp=row['xp'],
                streak=row['streak'],
                last_active_date=row['last_active_date'],
                created_at=datetime.fromisoformat(row['created_at']),
                level=row['level']
            )
        return None
    
    def update_user_progress(self, user_id: str, xp_earned: int, streak_updated: bool) -> User:
        """Update user XP and streak"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get current user data
        cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
        row = cursor.fetchone()
        
        if not row:
            # Create user if doesn't exist
            self.create_user(user_id)
            cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
            row = cursor.fetchone()
        
        current_xp = row['xp'] + xp_earned
        current_streak = row['streak']
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        # Update streak if it's a new day
        if streak_updated and row['last_active_date'] != current_date:
            current_streak += 1
        
        # Calculate new level (every 100 XP = 1 level)
        new_level = (current_xp // 100) + 1
        
        # Update user
        cursor.execute('''
            UPDATE users 
            SET xp = ?, streak = ?, last_active_date = ?, level = ?
            WHERE user_id = ?
        ''', (current_xp, current_streak, current_date, new_level, user_id))
        
        conn.commit()
        conn.close()
        
        return User(
            user_id=user_id,
            xp=current_xp,
            streak=current_streak,
            last_active_date=current_date,
            created_at=datetime.fromisoformat(row['created_at']),
            level=new_level
        )
    
    def get_exercises(self, limit: int = 10, difficulty: Optional[str] = None) -> List[Exercise]:
        """Get exercises with optional filtering"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = 'SELECT * FROM exercises'
        params = []
        
        if difficulty:
            query += ' WHERE difficulty = ?'
            params.append(difficulty)
        
        query += ' ORDER BY RANDOM() LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        conn.close()
        
        exercises = []
        for row in rows:
            exercise = Exercise(
                id=row['id'],
                measures=row['measures'],
                difficulty=row['difficulty'],
                title=row['title'],
                key_signature=row['key_signature'],
                time_signature=row['time_signature'],
                notes=json.loads(row['notes']) if row['notes'] else None,
                rhythm_pattern=json.loads(row['rhythm_pattern']) if row['rhythm_pattern'] else None,
                xp_reward=row['xp_reward'],
                created_at=datetime.fromisoformat(row['created_at'])
            )
            exercises.append(exercise)
        
        return exercises
    
    def save_performance(self, performance: Performance) -> int:
        """Save performance record and return performance ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO performances (
                user_id, exercise_id, score, accuracy, rhythm_score, tempo_score,
                practice_time_seconds, mistakes_count, notes_played, performance_data, submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            performance.user_id,
            performance.exercise_id,
            performance.score,
            performance.accuracy,
            performance.rhythm_score,
            performance.tempo_score,
            performance.practice_time_seconds,
            performance.mistakes_count,
            json.dumps(performance.notes_played) if performance.notes_played else None,
            json.dumps(performance.performance_data) if performance.performance_data else None,
            performance.submitted_at.isoformat()
        ))
        
        performance_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return performance_id
    
    def get_user_progress(self, user_id: str) -> Optional[UserProgress]:
        """Get comprehensive user progress"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get user data
        cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
        user_row = cursor.fetchone()
        
        if not user_row:
            conn.close()
            return None
        
        # Get performance statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_exercises,
                AVG(score) as average_score
            FROM performances 
            WHERE user_id = ?
        ''', (user_id,))
        
        perf_row = cursor.fetchone()
        
        conn.close()
        
        return UserProgress(
            user_id=user_id,
            current_xp=user_row['xp'],
            current_level=user_row['level'],
            current_streak=user_row['streak'],
            last_active_date=user_row['last_active_date'],
            total_exercises_completed=perf_row['total_exercises'] if perf_row['total_exercises'] else 0,
            average_score=perf_row['average_score'] if perf_row['average_score'] else 0.0
        )
    
    def get_daily_exercises_for_user(self, user_id: str, limit: int = 5) -> List[Exercise]:
        """Get daily exercises for a specific user"""
        # For now, return random exercises
        # TODO: Implement AI-powered exercise selection based on user level and progress
        return self.get_exercises(limit=limit)

# Global database instance
db = Database()
