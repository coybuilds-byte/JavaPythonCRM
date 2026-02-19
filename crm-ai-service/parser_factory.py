from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import nltk
import re

class ResumeParser(ABC):
    @abstractmethod
    def parse(self, text: str) -> Dict[str, Any]:
        pass

class NltkResumeParser(ResumeParser):
    def __init__(self):
        # Ensure resources are downloaded (idempotent)
        resources = [
            ('tokenizers/punkt', 'punkt'),
            ('tokenizers/punkt_tab', 'punkt_tab'),
            ('chunkers/maxent_ne_chunker', 'maxent_ne_chunker'),
            ('chunkers/maxent_ne_chunker_tab', 'maxent_ne_chunker_tab'),
            ('corpora/words', 'words'),
            ('taggers/averaged_perceptron_tagger', 'averaged_perceptron_tagger'),
            ('taggers/averaged_perceptron_tagger_eng', 'averaged_perceptron_tagger_eng')
        ]
        for path_id, download_id in resources:
            try:
                nltk.data.find(path_id)
            except LookupError:
                nltk.download(download_id)

    def parse(self, text: str) -> Dict[str, Any]:
        email = self._extract_email(text)
        name = self._extract_name(text)
        
        # Fallback: If name unknown but email exists, derive from email
        if name == "Unknown Candidate" and email:
            try:
                username = email.split('@')[0]
                # distinct first.last or first_last
                clean_name = re.sub(r'[._-]', ' ', username).title()
                # If it looks like a name (has spaces), use it
                if " " in clean_name:
                    name = clean_name
                else:
                    name = clean_name # Better than nothing
            except Exception:
                pass

        return {
            "name": name,
            "email": email,
            "phone": self._extract_phone(text),
            "address": self._extract_address(text),
            "skills": self._extract_skills(text),
        }

    def _extract_name(self, text: str) -> str:
        # NLTK NER strategy
        try:
            for line in text.split('\n')[:10]: # Check first 10 lines
                if not line.strip(): continue
                tokens = nltk.word_tokenize(line)
                tags = nltk.pos_tag(tokens)
                chunks = nltk.ne_chunk(tags)
                
                for chunk in chunks:
                    if hasattr(chunk, 'label') and chunk.label() == 'PERSON':
                        return ' '.join(c[0] for c in chunk)
                        
            # Fallback: First non-empty line
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            if lines and len(lines[0].split()) < 5:
                return lines[0]
        except Exception as e:
            print(f"NLTK Name Error: {e}")
            
        return "Unknown Candidate"

    def _extract_email(self, text: str) -> Optional[str]:
        # Loosen email regex to catch case issues or complex domains
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        return email_match.group(0) if email_match else None

    def _extract_phone(self, text: str) -> Optional[str]:
        # Loosen phone: Matches 10-digit strings that *might* be phones, even if formatting is weird
        # Look for sequences of 10-15 digits with common separators
        phone_pattern = r'(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})'
        phones = re.findall(phone_pattern, text)
        
        # Filter out "years" like 2020-2024 which might match the loose pattern if we aren't careful
        valid_phones = []
        for p in phones:
            digits = re.sub(r'\D', '', p)
            if len(digits) >= 10:
                 valid_phones.append(p.strip())
                 
        return valid_phones[0] if valid_phones else None

    def _extract_address(self, text: str) -> Optional[str]:
        # Strategy 1: Look for Zip Code (US) - Strong signal
        zip_pattern = r'\b\d{5}(?:-\d{4})?\b'
        
        lines = text.split('\n')
        for line in lines[:20]: # Check top 20 lines usually has address
            if re.search(zip_pattern, line):
                # If line has a zip, it's likely an address line.
                # Clean it up - remove labels like "Address:"
                clean_line = re.sub(r'(?i)address[:\s]*', '', line).strip()
                return clean_line
            
        # Strategy 2: Look for City, State pattern (e.g. "San Francisco, CA")
        # Matches "Word, XX" where XX is 2 uppercase letters
        city_state_pattern = r'([A-Z][a-z]+(?: [A-Z][a-z]+)*,\s*[A-Z]{2})'
        for line in lines[:20]:
             match = re.search(city_state_pattern, line)
             if match:
                 return line.strip()

        return None

    def _extract_skills(self, text: str) -> list:
        # Simple lookup is robust. NLTK can just tokenize better to avoid partial matches
        common_skills = {
            "Java", "Python", "React", "Angular", "Vue", "Spring Boot", "Node.js", 
            "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
            "Machine Learning", "AI", "Data Science", "Git", "CI/CD",
            "Communication", "Leadership", "Management", "Agile", "Scrum",
            "JavaScript", "TypeScript", "HTML", "CSS", "C++", "C#", ".NET",
            "Rest API", "GraphQL", "Microservices"
        }
        
        found_skills = set()
        text_lower = text.lower()
        
        # Improve matching by tokenizing
        tokens = set(nltk.word_tokenize(text_lower))
        
        for skill in common_skills:
            skill_lower = skill.lower()
            # Multi-word skills check
            if " " in skill_lower:
                if skill_lower in text_lower:
                    found_skills.add(skill)
            # Single word skills check (exact token match)
            elif skill_lower in tokens:
                found_skills.add(skill)
                
        return list(found_skills)

class ParserFactory:
    @staticmethod
    def get_parser(type: str = "nltk") -> ResumeParser:
        if type == "llm":
             raise NotImplementedError("LLM Parser not configured yet")
        return NltkResumeParser()
