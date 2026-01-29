import requests
from requests.auth import HTTPBasicAuth

url = "http://localhost:8080/api/email/send"
auth = HTTPBasicAuth("jesse@precisionsourcemanagement.com", "Staffpass1!")
headers = {"Content-Type": "application/json"}
payload = {
    "to": "test@example.com",
    "subject": "Test Email from Script",
    "body": "This is a test email body."
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, headers=headers, auth=auth)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
