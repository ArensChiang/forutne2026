import requests
import json

API_KEY = "AIzaSyBU4Dw5nAV2Tm1T_FJ9A2lVUeOFpXET4go"
URL = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    response = requests.get(URL)
    if response.status_code == 200:
        models = response.json().get('models', [])
        print(f"Found {len(models)} models.")
        for m in models:
            if 'generateContent' in m['supportedGenerationMethods']:
                print(f"- {m['name']}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Connection Error: {e}")
