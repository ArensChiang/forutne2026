import requests
import json

url = "https://fortune2026-pro.pages.dev/api/fortune"

print(f"Testing Live API: {url}")
print("-" * 50)

try:
    response = requests.post(
        url,
        headers={'Content-Type': 'application/json'},
        data=json.dumps({"topic": "career"})
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {json.dumps(dict(response.headers), indent=2)}")
    print("Response Body:")
    print(response.text[:1000])  # Print first 1000 chars

except Exception as e:
    print(f"Request Failed: {e}")
