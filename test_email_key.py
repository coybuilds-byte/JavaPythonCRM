import requests

api_key = "re_V4sqRwJA_6fH8eunEQDqXbbjkYhfcJ7Az"
url = "https://api.resend.com/emails"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

body = {
    "from": "onboarding@resend.dev",
    "to": "delivered@resend.dev",
    "subject": "Test Email",
    "html": "<p>Testing API Key</p>"
}

try:
    response = requests.post(url, json=body, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
