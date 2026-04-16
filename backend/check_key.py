import keyring

KEYRING_SERVICE = "emotion_chat_ai"
KEYRING_USERNAME = "dashscope_api_key"

api_key = keyring.get_password(KEYRING_SERVICE, KEYRING_USERNAME)
if api_key:
    print(f"Key found: {api_key[:10]}...{api_key[-5:]}")
    print(f"Length: {len(api_key)}")
else:
    print("No key found in keyring!")
