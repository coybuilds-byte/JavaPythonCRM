import sys
import os
import pytest
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from parser_factory import ParserFactory

# Mock Resume Text
SAMPLE_TEXT = """
Jesse James
jesse.james@example.com
(555) 123-4567
(555) 987-6543
123 Main St, Austin, TX 78701

Experienced Java Developer with 5 years of experience.
Skills: Java, Spring Boot, React, SQL.
"""

@pytest.fixture
def parser():
    return ParserFactory.get_parser("nltk")

def test_parse_structure(parser):
    data = parser.parse(SAMPLE_TEXT)
    assert isinstance(data, dict)
    assert "name" in data
    assert "email" in data
    assert "skills" in data

def test_extract_entities(parser):
    data = parser.parse(SAMPLE_TEXT)
    # The new logic might be strictly looking for PERSON entities. 
    # "Jesse James" usually is detected as PERSON.
    # If fallback triggers, it takes the first line.
    assert "Jesse" in data["name"]

def test_extract_contact_info(parser):
    data = parser.parse(SAMPLE_TEXT)
    assert data["email"] == "jesse.james@example.com"
    assert data["phone"] == "(555) 123-4567"

def test_extract_address(parser):
    data = parser.parse(SAMPLE_TEXT)
    # Spacy + Regex hybrid
    # "Austin" is GPE, "TX" is GPE. 
    # The logic looks for lines with Zip codes first.
    assert data["address"] is not None
    assert "123 Main St" in data["address"]

def test_extract_skills(parser):
    data = parser.parse(SAMPLE_TEXT)
    skills = data["skills"]
    expected_skills = ["Java", "Spring Boot", "React", "SQL"]
    for skill in expected_skills:
        assert skill in skills, f"Missing {skill}"
