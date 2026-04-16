"""
API Key 设置工具

使用方法：
  1. 设置密钥：python setup_key.py
  2. 验证密钥：python setup_key.py --check
  3. 删除密钥：python setup_key.py --delete
"""

import keyring
import sys

KEYRING_SERVICE = "emotion_chat_ai"
KEYRING_USERNAME = "dashscope_api_key"


def set_key():
    """设置 API Key 到系统密钥环"""
    print("=" * 40)
    print("  API Key 安全设置工具")
    print("=" * 40)
    print(f"服务名称: {KEYRING_SERVICE}")
    print(f"用户名称: {KEYRING_USERNAME}")
    print(f"存储位置: Windows 凭据管理器")
    print()

    # 检查是否已存在
    existing = keyring.get_password(KEYRING_SERVICE, KEYRING_USERNAME)
    if existing:
        print(f"⚠️  已存在 API Key（前6位: {existing[:6]}...）")
        choice = input("是否覆盖？(y/n): ").strip().lower()
        if choice != "y":
            print("已取消")
            return

    # 输入新密钥
    api_key = input("请输入 API Key: ").strip()
    if not api_key:
        print("❌ API Key 不能为空")
        return

    # 确认
    print(f"\n即将存储 API Key（前6位: {api_key[:6]}...）到系统密钥环")
    confirm = input("确认？(y/n): ").strip().lower()
    if confirm != "y":
        print("已取消")
        return

    # 存储
    try:
        keyring.set_password(KEYRING_SERVICE, KEYRING_USERNAME, api_key)
        print("\n✅ API Key 已安全存储到 Windows 凭据管理器")
        print("   现在可以启动后端服务了：python backend/app.py")
    except Exception as e:
        print(f"\n❌ 存储失败: {e}")


def check_key():
    """验证 API Key 是否存在"""
    api_key = keyring.get_password(KEYRING_SERVICE, KEYRING_USERNAME)
    if api_key:
        print(f"✅ API Key 已存在（前6位: {api_key[:6]}...，共{len(api_key)}位）")
    else:
        print("❌ API Key 不存在，请运行: python setup_key.py")


def delete_key():
    """删除 API Key"""
    existing = keyring.get_password(KEYRING_SERVICE, KEYRING_USERNAME)
    if not existing:
        print("❌ API Key 不存在")
        return

    confirm = input("确定要删除 API Key 吗？(y/n): ").strip().lower()
    if confirm != "y":
        print("已取消")
        return

    try:
        keyring.delete_password(KEYRING_SERVICE, KEYRING_USERNAME)
        print("✅ API Key 已删除")
    except Exception as e:
        print(f"❌ 删除失败: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == "--check":
            check_key()
        elif arg == "--delete":
            delete_key()
        else:
            print("未知参数，用法：")
            print("  python setup_key.py         # 设置密钥")
            print("  python setup_key.py --check  # 验证密钥")
            print("  python setup_key.py --delete # 删除密钥")
    else:
        set_key()
