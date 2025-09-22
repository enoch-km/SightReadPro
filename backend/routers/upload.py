from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import aiofiles
from datetime import datetime
import uuid
from typing import List
import music21
from models import UploadResponse, Exercise, FileType, DifficultyLevel

router = APIRouter(prefix="/upload", tags=["upload"])

# Create uploads directory if it doesn't exist
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    '.pdf': FileType.PDF,
    '.jpg': FileType.JPG,
    '.jpeg': FileType.JPEG,
    '.png': FileType.PNG,
    '.musicxml': FileType.MUSICXML,
    '.xml': FileType.XML
}

def get_file_type(filename: str) -> FileType:
    """Determine file type from extension"""
    ext = os.path.splitext(filename.lower())[1]
    return ALLOWED_EXTENSIONS.get(ext, FileType.PDF)

def is_musicxml_file(filename: str) -> bool:
    """Check if file is MusicXML"""
    ext = os.path.splitext(filename.lower())[1]
    return ext in ['.musicxml', '.xml']

async def save_uploaded_file(file: UploadFile, filename: str) -> str:
    """Save uploaded file to disk"""
    file_path = os.path.join(UPLOADS_DIR, filename)
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return file_path

def parse_musicxml_with_music21(file_path: str) -> List[Exercise]:
    """
    Parse MusicXML file using music21 and generate exercises
    
    TODO: Implement AI-powered exercise generation:
    - Analyze musical complexity
    - Identify challenging sections
    - Generate appropriate difficulty levels
    - Create measure-based chunks
    """
    try:
        # Load the score
        score = music21.converter.parse(file_path)
        
        # For now, create dummy exercises based on the score
        # This is a placeholder for real AI analysis
        exercises = []
        
        # Get basic score information
        key_signature = score.keySignature.tonic.name if score.keySignature else "C"
        time_signature = f"{score.timeSignature.numerator}/{score.timeSignature.denominator}" if score.timeSignature else "4/4"
        
        # Count measures
        total_measures = len(score.parts[0].getElementsByClass('Measure'))
        
        # Create exercises in 2-4 bar chunks
        chunk_size = 4
        exercise_id = 1
        
        for i in range(0, total_measures, chunk_size):
            end_measure = min(i + chunk_size, total_measures)
            measures_range = f"{i + 1}-{end_measure}"
            
            # Determine difficulty based on measure position (simple heuristic)
            if i < total_measures // 3:
                difficulty = DifficultyLevel.EASY
                xp_reward = 10
            elif i < 2 * total_measures // 3:
                difficulty = DifficultyLevel.MEDIUM
                xp_reward = 15
            else:
                difficulty = DifficultyLevel.HARD
                xp_reward = 20
            
            # Extract notes from this measure range (simplified)
            notes = []
            rhythm_pattern = []
            
            # TODO: Implement real note extraction and rhythm analysis
            # For now, use dummy data
            if difficulty == DifficultyLevel.EASY:
                notes = ['C4', 'D4', 'E4', 'F4']
                rhythm_pattern = ['quarter', 'quarter', 'quarter', 'quarter']
            elif difficulty == DifficultyLevel.MEDIUM:
                notes = ['G4', 'A4', 'B4', 'C5', 'D5']
                rhythm_pattern = ['eighth', 'eighth', 'quarter', 'eighth', 'quarter']
            else:
                notes = ['F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5']
                rhythm_pattern = ['eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth']
            
            exercise = Exercise(
                id=exercise_id,
                measures=measures_range,
                difficulty=difficulty,
                title=f"Measures {measures_range}",
                key_signature=key_signature,
                time_signature=time_signature,
                notes=notes,
                rhythm_pattern=rhythm_pattern,
                xp_reward=xp_reward,
                created_at=datetime.now()
            )
            
            exercises.append(exercise)
            exercise_id += 1
        
        return exercises
        
    except Exception as e:
        print(f"Error parsing MusicXML: {e}")
        # Return fallback exercises if parsing fails
        return [
            Exercise(
                id=1,
                measures="1-4",
                difficulty=DifficultyLevel.EASY,
                title="Fallback Exercise",
                key_signature="C",
                time_signature="4/4",
                notes=['C4', 'D4', 'E4', 'F4'],
                rhythm_pattern=['quarter', 'quarter', 'quarter', 'quarter'],
                xp_reward=10,
                created_at=datetime.now()
            )
        ]

@router.post("/score", response_model=UploadResponse)
async def upload_score(
    file: UploadFile = File(..., description="Upload PDF, JPG, or MusicXML file")
):
    """
    Upload a score file (PDF, JPG, or MusicXML)
    
    - **PDF/JPG**: File is saved and filename returned
    - **MusicXML**: File is parsed and exercises generated
    """
    
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_type = get_file_type(file.filename)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_id = str(uuid.uuid4())[:8]
    extension = os.path.splitext(file.filename)[1]
    new_filename = f"{timestamp}_{file_id}{extension}"
    
    try:
        # Save file
        file_path = await save_uploaded_file(file, new_filename)
        
        exercises = None
        
        # Parse MusicXML files
        if is_musicxml_file(file.filename):
            try:
                exercises = parse_musicxml_with_music21(file_path)
                message = f"MusicXML file uploaded and parsed successfully. Generated {len(exercises)} exercises."
            except Exception as e:
                message = f"File uploaded but parsing failed: {str(e)}"
                # Still return the file info even if parsing fails
        else:
            message = f"File uploaded successfully. Saved as {new_filename}"
        
        return UploadResponse(
            message=message,
            filename=new_filename,
            file_type=file_type,
            exercises=exercises
        )
        
    except Exception as e:
        # Clean up file if it was saved
        file_path = os.path.join(UPLOADS_DIR, new_filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.get("/files")
async def list_uploaded_files():
    """List all uploaded files"""
    try:
        files = []
        for filename in os.listdir(UPLOADS_DIR):
            file_path = os.path.join(UPLOADS_DIR, filename)
            if os.path.isfile(file_path):
                file_type = get_file_type(filename)
                file_size = os.path.getsize(file_path)
                files.append({
                    "filename": filename,
                    "file_type": file_type,
                    "size_bytes": file_size,
                    "uploaded_at": datetime.fromtimestamp(os.path.getctime(file_path)).isoformat()
                })
        
        return {"files": files, "total_count": len(files)}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list files: {str(e)}"
        )

@router.delete("/files/{filename}")
async def delete_uploaded_file(filename: str):
    """Delete an uploaded file"""
    try:
        file_path = os.path.join(UPLOADS_DIR, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        os.remove(file_path)
        
        return {"message": f"File {filename} deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )


