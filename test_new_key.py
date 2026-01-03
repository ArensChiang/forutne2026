import requests
import json

# New API Key provided by user
API_KEY = "AIzaSyDqQekMIDL8j-pmdkQOn8kiWm-mx6b7U7E"
MODELS_TO_TEST = [
    "gemini-2.0-flash",
    "gemini-1.5-flash"
]

prompt = "Hello, are you working?"

print(f"Testing new API Key: {API_KEY[:10]}...")
print("-" * 50)

for model in MODELS_TO_TEST:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    try:
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            data=json.dumps({"contents": [{"parts": [{"text": prompt}]}]}),
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"✅ {model}: SUCCESS")
        else:
            print(f"❌ {model}: Failed ({response.status_code}) - {response.text[:100]}")
            
    except Exception as e:
        print(f"⚠️ {model}: Error ({e})")

print("-" * 50)
