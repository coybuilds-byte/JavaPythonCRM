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
        return {
            "name": self._extract_name(text),
            "email": self._extract_email(text),
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
        email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
        return email_match.group(0) if email_match else None

    def _extract_phone(self, text: str) -> Optional[str]:
        phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else None

    def _extract_address(self, text: str) -> Optional[str]:
        # NLTK GPE strategy combined with Zip code regex
        zip_pattern = r'\b\d{5}(?:-\d{4})?\b'
        
        try:
            for line in text.split('\n'):
                if re.search(zip_pattern, line):
                    return line.strip()
                    
            # Fallback: Look for GPE using NLTK
            tokens = nltk.word_tokenize(text[:2000]) # Tokenize first chunk
            tags = nltk.pos_tag(tokens)
            chunks = nltk.ne_chunk(tags)
            for chunk in chunks:
                 if hasattr(chunk, 'label') and chunk.label() == 'GPE':
                     return ' '.join(c[0] for c in chunk)
        except Exception:
            pass
            
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
