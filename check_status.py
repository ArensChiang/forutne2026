import requests
import json

url = "https://fortune2026-pro.pages.dev/api/fortune"
print(f"Testing URL: {url}")

try:
    response = requests.post(url, json={"topic": "test"}, timeout=15)
    print(f"HTTP Status: {response.status_code}")
    
    if response.status_code == 502:
        try:
            data = response.json()
            print(f"Permission Check: {data.get('permissionCheck', 'UNKNOWN')}")
            print("-" * 20)
            print("Debug Logs:")
            logs = data.get('debugLog', [])
            for i, log in enumerate(logs):
                print(f"Log #{i+1}: {log}")
            print("-" * 20)
        except Exception as e:
            print(f"Failed to parse JSON: {e}")
            print("Raw text:", response.text[:200])
    
    elif response.status_code == 200:
        print("Success! AI Fortune Generated.")
        print(response.json())
        
    else:
        print(f"Unexpected Status: {response.status_code}")
        print(response.text[:200])

except Exception as e:
    print(f"Request failed: {e}")
