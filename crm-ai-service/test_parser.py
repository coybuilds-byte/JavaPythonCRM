import main
import sys

# Mock Resume Text
sample_text = """
Jesse James
jesse.james@example.com
(555) 123-4567
(555) 987-6543
123 Main St, Austin, TX 78701

Experienced Java Developer with 5 years of experience.
Skills: Java, Spring Boot, React, SQL.
"""

print("Testing Extraction Logic...")
name = main.extract_entities(sample_text)
print(f"Name: {name}")

email, phone, cell = main.extract_contact_info(sample_text)
print(f"Email: {email}")
print(f"Phone: {phone}")
print(f"Cell: {cell}")

address = main.extract_address(sample_text)
print(f"Address: {address}")

skills = main.extract_skills(sample_text)
print(f"Skills: {skills}")

if name == "Jesse James" and email == "jesse.james@example.com" and address == "123 Main St, Austin, TX 78701":
    print("SUCCESS")
else:
    print("FAILURE")
