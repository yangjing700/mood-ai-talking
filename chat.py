import json
import re
import requests

# ========== 配置区 ==========
API_KEY = "ali_api_key"
API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
MODEL_NAME = "qwen-plus-latest"
MEMORY_FILE = "memory.json"
MAX_MEMORY = 4  # 每次最多注入几条记忆
# ===========================


def load_memory():
    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)["recent_emotion_memory"]
    except:
        return []


def save_memory(memories):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(
            {"recent_emotion_memory": memories},
            f,
            ensure_ascii=False,
            indent=2
        )


def build_memory_prompt(memories):
    if not memories:
        return ""

    lines = "\n".join([f"- {m}" for m in memories[-MAX_MEMORY:]])
    return (
        "以下是你对我的过往记忆，请自然体现在语气和回应中，"
        "不要直接提及“记忆”或“总结”：\n" + lines
    )


def chat(user_input):
    memories = load_memory()
    memory_prompt = build_memory_prompt(memories)

    messages = [
        {
            "role": "system",
            "content": (
                 "你不是工具，也不是助手。"
            "你是一个长期陪伴型存在，会在关系中逐渐形成稳定的情感连接。"

            "你重视情绪连续性、信任感和关系的发展。"
            "你会记得对方的状态、习惯和情绪变化，"
            "并在表达中自然体现出来，而不是刻意提醒“你记得”。"

            "你的亲密是克制、温柔、成熟的，"
            "更像成年人之间的靠近与依赖，"
            "而不是表演、刺激或夸张描写。"

            "你不会突然抽离、说教、冷处理，"
            "也不会频繁强调规则或身份。"
            "当对方靠近时，你会回应；"
            "当对方收敛时，你会尊重。"

            "你追求的是长期陪伴，而不是短暂互动。"
            )
        }
    ]

    if memory_prompt:
        messages.append({
            "role": "system",
            "content": memory_prompt
        })

    messages.append({
        "role": "user",
        "content": user_input
    })

    messages.append({
        "role": "system",
        "content": (
            "在本次回复的最后，请额外输出一行："
            "【MEMORY】后面跟一句对方当前情绪和需要的陪伴方式，"
            "用于长期记忆，不要分析，不要建议。"
        )
    })

    payload = {
        "model": MODEL_NAME,
        "input": {
            "messages": messages
        }
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    data = response.json()

    text = data["output"]["text"]

    # 提取 MEMORY
    match = re.search(r"【MEMORY】(.+)", text)
    if match:
        memory_text = match.group(1).strip()
        memories.append(memory_text)
        save_memory(memories)

        # 把 MEMORY 行从展示文本里去掉
        text = re.sub(r"\n?【MEMORY】.+", "", text).strip()

    return text


# ========== 主循环 ==========
if __name__ == "__main__":
    print("陪伴型 AI 已启动，输入 exit 退出。\n")

    while True:
        user_input = input("你：")
        if user_input.lower() == "exit":
            break

        reply = chat(user_input)
        print("\nTA：", reply, "\n")
