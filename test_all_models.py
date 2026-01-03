import requests
import json

API_KEY = "AIzaSyBU4Dw5nAV2Tm1T_FJ9A2lVUeOFpXET4go"
MODELS_TO_TEST = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
]

prompt = "Hello"

print(f"Testing {len(MODELS_TO_TEST)} models with Key ending in ...T4go")
print("-" * 50)

for model in MODELS_TO_TEST:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    try:
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            data=json.dumps({"contents": [{"parts": [{"text": prompt}]}]}),
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"✅ {model}: SUCCESS (200)")
            # print(response.text[:100])
            # Found one! Stop? No, let's see which is best.
        else:
            print(f"❌ {model}: Failed ({response.status_code})")
            # print(response.text[:100])
            
    except Exception as e:
        print(f"⚠️ {model}: Error ({e})")
print("-" * 50)
