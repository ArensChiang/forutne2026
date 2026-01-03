import requests
import json

# User's Valid Key
API_KEY = "AIzaSyBU4Dw5nAV2Tm1T_FJ9A2lVUeOFpXET4go"
# Explicitly testing 2.0 Flash
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

topic = "財運"
prompt = "請給我一個簡短的2026新年運勢。"

try:
    print(f"Testing Gemini 2.0 Flash...")
    response = requests.post(
        URL,
        headers={'Content-Type': 'application/json'},
        data=json.dumps({
            "contents": [{ "parts": [{ "text": prompt }] }]
        }),
        timeout=10
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ SUCCESS!")
        print(response.json()['candidates'][0]['content']['parts'][0]['text'])
    else:
        print("❌ FAILED!")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
