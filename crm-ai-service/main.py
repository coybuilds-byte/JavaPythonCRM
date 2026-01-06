from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pdfminer.high_level import extract_text as extract_pdf_text
import docx
import io
import re

app = FastAPI(title="CRM AI Service", version="1.0.0")

class CandidateProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    text_content: Optional[str] = None

def extract_text(file_content: bytes, filename: str) -> str:
    text = ""
    try:
        if filename.lower().endswith(".pdf"):
            with io.BytesIO(file_content) as f:
                text = extract_pdf_text(f)
        elif filename.lower().endswith(".docx"):
            with io.BytesIO(file_content) as f:
                doc = docx.Document(f)
                text = "\n".join([p.text for p in doc.paragraphs])
        else:
            text = file_content.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error extracting text: {e}")
        # In a real app, log this better
    return text

def extract_entities(text: str):
    # Simple Fallback logic
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return lines[0] if lines else "Unknown Candidate"

def extract_contact_info(text: str):
    email = None
    email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
    if email_match:
        email = email_match.group(0)
        
    phone = None
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        phone = phone_match.group(0)
        
    return email, phone

def extract_skills(text: str):
    common_skills = [
        "Java", "Python", "React", "Angular", "Vue", "Spring Boot", "Node.js", 
        "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
        "Machine Learning", "AI", "Data Science", "Git", "CI/CD",
        "Communication", "Leadership", "Management"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found_skills.append(skill)
            
    return list(set(found_skills))

@app.post("/parse-resume", response_model=CandidateProfile)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    content = await file.read()
    text = extract_text(content, file.filename)
    
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")
    
    name = extract_entities(text)
    email, phone = extract_contact_info(text)
    skills = extract_skills(text)
    
    return CandidateProfile(
        name=name,
        email=email,
        phone=phone,
        skills=skills,
        text_content=text[:1000] # Truncated
    )

@app.get("/health")
def health():
    return {"status": "ok", "service": "crm-ai-service"}
