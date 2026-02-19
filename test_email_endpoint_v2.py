import urllib.request
import json
import base64

url = "http://localhost:8080/api/email/send"
username = "jesse@precisionsourcemanagement.com"
password = "Staffpass1!"

# Basic Auth Header
credentials =f"{username}:{password}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()
headers = {
    "Authorization": f"Basic {encoded_credentials}",
    "Content-Type": "application/json"
}

payload = {
    "to": "test@example.com",
    "subject": "Test Email from Script",
    "body": "This is a test email body."
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
