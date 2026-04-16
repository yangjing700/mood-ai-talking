import requests
import keyring

KEYRING_SERVICE = "emotion_chat_ai"
KEYRING_USERNAME = "dashscope_api_key"
API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
MODEL_NAME = "qwen-plus-latest"

api_key = keyring.get_password(KEYRING_SERVICE, KEYRING_USERNAME)
print(f"Using API key: {api_key[:10]}...{api_key[-5:]}")

payload = {
    "model": MODEL_NAME,
    "messages": [{"role": "user", "content": "你好"}]
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

try:
    response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
