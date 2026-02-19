
import requests
import os

# Configuration
API_URL = "http://localhost:8000/parse-resume"
TEST_FILE_CONTENT = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Jesse James - Java Developer) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000258 00000 n \n0000000345 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n440\n%%EOF"

def create_dummy_pdf():
    filename = "test_resume.pdf"
    with open(filename, "wb") as f:
        f.write(TEST_FILE_CONTENT)
    return filename

def test_upload():
    filename = create_dummy_pdf()
    print(f"Created file: {filename}")
    
    try:
        with open(filename, "rb") as f:
            files = {"file": (filename, f, "application/pdf")}
            print(f"Uploading to {API_URL}...")
            response = requests.post(API_URL, files=files)
            
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response JSON:")
            print(response.json())
            
            data = response.json()
            if "Jesse James" in data.get("text_content", "") or "Jesse James" in data.get("name", ""):
                 print("SUCCESS: Name/Text found in response.")
            else:
                 print("WARNING: Parsed successfully but text content mismatch?")
        else:
            print(f"FAILURE: Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        if os.path.exists(filename):
            os.remove(filename)
            print("Cleaned up test file.")

if __name__ == "__main__":
    test_upload()
