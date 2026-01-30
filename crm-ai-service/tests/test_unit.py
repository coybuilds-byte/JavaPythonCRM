import sys
import os
import pytest
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import main

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

def test_extract_entities():
    name = main.extract_entities(SAMPLE_TEXT)
    assert name == "Jesse James", f"Expected 'Jesse James', got '{name}'"

def test_extract_contact_info():
    email, phone, cell = main.extract_contact_info(SAMPLE_TEXT)
    assert email == "jesse.james@example.com"
    assert phone == "(555) 123-4567"
    # The current logic might pick the second number as cell
    assert cell == "(555) 987-6543"

def test_extract_address():
    address = main.extract_address(SAMPLE_TEXT)
    assert address == "123 Main St, Austin, TX 78701"

def test_extract_skills():
    skills = main.extract_skills(SAMPLE_TEXT)
    # Check for presence of expected skills
    expected_skills = ["Java", "Spring Boot", "React", "SQL"]
    for skill in expected_skills:
        assert skill in skills, f"Missing skill: {skill}"

def test_extract_current_title():
    # Construct a text where the title is clear and in the expected range
    text_with_title = """
    Jesse James
    Senior Java Developer
    """
    title = main.extract_current_title(text_with_title)
    # Logic looks for "Developer" in the line
    assert title is not None
    assert "Developer" in title
