try:
    from main import extract_text, extract_entities, extract_contact_info, extract_skills
    
    # Mock resume content
    mock_text = """
    John Doe
    Email: john.doe@example.com
    Phone: (555) 123-4567
    
    Experienced Software Engineer with expertise in Python, Java, and React.
    """
    
    print("Testing Extraction Logic...")
    name = extract_entities(mock_text)
    email, phone = extract_contact_info(mock_text)
    skills = extract_skills(mock_text)
    
    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Phone: {phone}")
    print(f"Skills: {skills}")
    
    if "Python" in skills and email == "john.doe@example.com":
        print("SUCCESS: Core extraction logic verified.")
    else:
        print("FAILURE: Extraction logic missed key fields.")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
