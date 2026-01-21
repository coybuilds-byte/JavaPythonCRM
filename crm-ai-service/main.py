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
    cell: Optional[str] = None
    address: Optional[str] = None
    skills: List[str] = []
    current_title: Optional[str] = None
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
    # Improved fallback logic: Name is often the first non-empty line
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if not lines:
        return "Unknown Candidate"
    
    # Heuristic: First line is likely name if it's short (e.g. < 5 words)
    first_line = lines[0]
    if len(first_line.split()) < 5:
        return first_line
    return "Unknown Candidate"

def extract_contact_info(text: str):
    email = None
    email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
    if email_match:
        email = email_match.group(0)
        
    # Phone extraction supports multiple formats
    # Looks for (555) 555-5555, 555-555-5555, 555.555.5555
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    
    phone = phones[0] if phones else None
    cell = phones[1] if len(phones) > 1 else None # Heuristic: if 2 nums, maybe 2nd is cell
        
    return email, phone, cell

def extract_address(text: str):
    # Regex for US-style address: 123 Main St, City, ST 12345
    # Anchored to start of line to avoid merging with previous lines
    address_pattern = r'(?m)^(.*?,\s*[A-Z]{2}\s*\d{5})$'
    match = re.search(address_pattern, text)
    if match:
        return match.group(0).strip()
    return None
    
def extract_skills(text: str):
    common_skills = [
        "Java", "Python", "React", "Angular", "Vue", "Spring Boot", "Node.js", 
        "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
        "Machine Learning", "AI", "Data Science", "Git", "CI/CD",
        "Communication", "Leadership", "Management", "Agile", "Scrum",
        "JavaScript", "TypeScript", "HTML", "CSS", "C++", "C#", ".NET"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found_skills.append(skill)
            
    return list(set(found_skills))

def extract_current_title(text: str):
    # Simple heuristic: Look for common role keywords in the first section of text
    # that might indicate the person's current or recent role.
    common_roles = [
        "Software Engineer", "Developer", "Manager", "Director", "VP", "Vice President",
        "Analyst", "Consultant", "Administrator", "Coordinator", "Specialist", "Architect",
        "Lead", "Chief", "Accountant", "Sales", "Representative", "Recruiter", "HR",
        "Designer", "Product Owner", "Scrum Master", "Data Scientist", "DevOps",
        "Controller", "Auditor", "Engineer"
    ]
    
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Check lines 2-10 (assuming line 1 is name)
    # We want a line that looks like a title (short-ish, contains a keyword)
    search_lines = lines[1:15] if len(lines) > 15 else lines[1:]
    
    for line in search_lines:
        if len(line.split()) > 10: # Skip long sentences
            continue
            
        for role in common_roles:
            if role.lower() in line.lower():
                # Clean up the line a bit
                return line.strip()
                
    return None

@app.post("/parse-resume", response_model=CandidateProfile)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    content = await file.read()
    text = extract_text(content, file.filename)
    
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")
    
    name = extract_entities(text)
    email, phone, cell = extract_contact_info(text)
    address = extract_address(text)
    skills = extract_skills(text)
    current_title = extract_current_title(text)
    
    return CandidateProfile(
        name=name,
        email=email,
        phone=phone,
        cell=cell,
        address=address,
        skills=skills,
        current_title=current_title,
        text_content=text[:1000] # Truncated
    )

@app.get("/health")
def health():
    return {"status": "ok", "service": "crm-ai-service"}
