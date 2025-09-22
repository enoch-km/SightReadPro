# SightReadPro API 🎵

A powerful FastAPI backend for the SightReadPro music sight-reading app, featuring sheet music upload, exercise generation, and comprehensive user progress tracking.

## ✨ Features

- **🎼 Sheet Music Upload**: Support for PDF, JPG, PNG, and MusicXML files
- **🎯 MusicXML Parsing**: Advanced parsing using music21 library
- **📚 Exercise Generation**: Automatic creation of practice exercises from uploaded scores
- **🏆 Progress Tracking**: XP system, streaks, levels, and performance analytics
- **📊 User Management**: Comprehensive user profiles and statistics
- **🔍 Search & Filtering**: Find exercises by difficulty, key, time signature
- **📈 Performance Analytics**: Detailed tracking of practice sessions
- **🚀 FastAPI Framework**: Modern, fast, and auto-documented API

## 🏗️ Architecture

```
SightReadPro API/
├── main.py              # FastAPI application entry point
├── models.py            # Pydantic data models and schemas
├── db.py               # SQLite database operations
├── routers/            # API endpoint modules
│   ├── upload.py       # File upload and parsing
│   ├── exercises.py    # Exercise management
│   └── users.py        # User progress and performance
├── uploads/            # Uploaded file storage
├── requirements.txt    # Python dependencies
└── test_curl_requests.sh # API testing script
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd SightReadPro/backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📖 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔌 Core Endpoints

### 1. File Upload (`/upload`)

#### `POST /upload/score`
Upload sheet music files (PDF, JPG, PNG, MusicXML)

**Features:**
- **PDF/JPG/PNG**: Files are saved and filename returned
- **MusicXML**: Automatically parsed and exercises generated
- **Exercise Generation**: Creates 2-4 bar practice chunks
- **Difficulty Assessment**: Automatic difficulty level assignment

**Example Response (MusicXML):**
```json
{
  "message": "MusicXML file uploaded and parsed successfully. Generated 3 exercises.",
  "filename": "20240115_abc123.musicxml",
  "file_type": "musicxml",
  "exercises": [
    {
      "id": 1,
      "measures": "1-4",
      "difficulty": "easy",
      "title": "Measures 1-4",
      "key_signature": "C",
      "time_signature": "4/4",
      "notes": ["C4", "D4", "E4", "F4"],
      "rhythm_pattern": ["quarter", "quarter", "quarter", "quarter"],
      "xp_reward": 10
    }
  ]
}
```

### 2. Exercise Management (`/exercises`)

#### `GET /exercises/daily/{user_id}`
Get personalized daily exercises for a user

#### `GET /exercises/difficulty/{difficulty}`
Filter exercises by difficulty (easy, medium, hard)

#### `GET /exercises/random/{count}`
Get random exercises for practice

#### `GET /exercises/search/{query}`
Search exercises by title, key, or time signature

### 3. User Progress (`/users`)

#### `POST /users/submit_performance`
Submit exercise performance and earn XP

**Request Body:**
```json
{
  "user_id": "user_123",
  "exercise_id": 1,
  "score": 85,
  "accuracy": 88.5,
  "rhythm_score": 82.0,
  "tempo_score": 90.0,
  "practice_time_seconds": 180,
  "mistakes_count": 2,
  "notes_played": ["C4", "D4", "E4", "F4"],
  "performance_data": {
    "tempo_variations": [120, 118, 122],
    "dynamics": ["mf", "mp", "f"]
  }
}
```

#### `GET /users/{user_id}/progress`
Get comprehensive user progress and statistics

#### `GET /users/{user_id}/stats`
Get detailed user analytics and achievements

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_active_date TEXT,
    created_at TEXT,
    level INTEGER DEFAULT 1
);
```

### Exercises Table
```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    measures TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    title TEXT,
    key_signature TEXT,
    time_signature TEXT,
    notes TEXT,           -- JSON string
    rhythm_pattern TEXT,   -- JSON string
    xp_reward INTEGER DEFAULT 10,
    created_at TEXT
);
```

### Performances Table
```sql
CREATE TABLE performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    exercise_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    accuracy REAL,
    rhythm_score REAL,
    tempo_score REAL,
    practice_time_seconds INTEGER,
    mistakes_count INTEGER,
    notes_played TEXT,        -- JSON string
    performance_data TEXT,    -- JSON string
    submitted_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
);
```

## 🧪 Testing

### Run Test Script
```bash
./test_curl_requests.sh
```

### Manual Testing with curl

#### Upload MusicXML File
```bash
curl -X POST -F 'file=@your_file.musicxml' http://localhost:8000/upload/score
```

#### Submit Performance
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "exercise_id": 1, "score": 85}' \
  http://localhost:8000/users/submit_performance
```

#### Get Daily Exercises
```bash
curl http://localhost:8000/exercises/daily/test_user
```

#### Get User Progress
```bash
curl http://localhost:8000/users/test_user/progress
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOADS_DIR=uploads

# Database
DATABASE_PATH=sightreadpro.db
```

### File Upload Settings
- **Supported Formats**: PDF, JPG, JPEG, PNG, MusicXML, XML
- **Max File Size**: 10MB (configurable)
- **Upload Directory**: `uploads/` (auto-created)

## 🚀 Development

### Project Structure
```
backend/
├── main.py                 # FastAPI app and main endpoints
├── models.py               # Pydantic models and validation
├── db.py                  # Database operations and SQLite setup
├── routers/               # Modular API endpoints
│   ├── __init__.py
│   ├── upload.py          # File upload and parsing
│   ├── exercises.py       # Exercise management
│   └── users.py           # User progress tracking
├── uploads/               # File storage directory
├── requirements.txt       # Python dependencies
├── test_curl_requests.sh  # API testing script
└── README.md              # This file
```

### Adding New Features

1. **Create new router** in `routers/` directory
2. **Add Pydantic models** in `models.py`
3. **Update database schema** in `db.py`
4. **Include router** in `main.py`
5. **Add tests** to `test_curl_requests.sh`

### Code Quality
- **Type Hints**: Full Python type annotations
- **Documentation**: Comprehensive docstrings
- **Error Handling**: Proper HTTP status codes
- **Validation**: Pydantic model validation

## 🔮 Future Enhancements

### AI-Powered Features
- **OMR Integration**: Optical Music Recognition for PDF/JPG
- **Smart Exercise Generation**: AI-based difficulty assessment
- **Performance Analysis**: Real-time audio analysis
- **Personalized Learning**: Adaptive exercise selection

### Advanced Analytics
- **Practice Patterns**: User behavior analysis
- **Progress Tracking**: Detailed learning analytics
- **Achievement System**: Gamification features
- **Social Features**: Leaderboards and competitions

### Performance Optimizations
- **Caching**: Redis integration for performance
- **Background Tasks**: Async processing for large files
- **Database Optimization**: Connection pooling and indexing
- **File Compression**: Efficient storage management

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**2. MusicXML Parsing Errors**
- Ensure file is valid MusicXML format
- Check file encoding (UTF-8 recommended)
- Verify music21 installation

**3. Database Errors**
- Check file permissions for SQLite database
- Ensure sufficient disk space
- Verify database file path

**4. File Upload Issues**
- Check file size limits
- Verify supported file formats
- Ensure uploads directory exists

### Debug Mode
Enable debug logging:
```bash
export DEBUG=true
uvicorn main:app --reload --log-level debug
```

## 📚 API Examples

### Complete Workflow

1. **Upload MusicXML Score**
   ```bash
   curl -X POST -F 'file=@score.musicxml' http://localhost:8000/upload/score
   ```

2. **Get Generated Exercises**
   ```bash
   curl http://localhost:8000/exercises/daily/user123
   ```

3. **Submit Performance**
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"user_id": "user123", "exercise_id": 1, "score": 90}' \
     http://localhost:8000/users/submit_performance
   ```

4. **Check Progress**
   ```bash
   curl http://localhost:8000/users/user123/progress
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: `/docs` endpoint when server is running
- **Issues**: Create an issue in the repository
- **Questions**: Check the troubleshooting section above

---

**Happy coding! 🎼✨**

*Built with FastAPI, music21, and ❤️ for music education*
