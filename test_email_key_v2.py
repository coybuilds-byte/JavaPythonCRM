import urllib.request
import json
import ssl

api_key = "re_V4sqRwJA_6fH8eunEQDqXbbjkYhfcJ7Az"
url = "https://api.resend.com/emails"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "User-Agent": "Python-urllib"
}

body = {
    "from": "onboarding@resend.dev",
    "to": "delivered@resend.dev",
    "subject": "Test Email",
    "html": "<p>Testing API Key</p>"
}

# Ignore SSL errors for local testing context if needed, though usually not recommended. 
# But standard context is safer.
ctx = ssl.create_default_context()

req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers)

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print(f"Status: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
