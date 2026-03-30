import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ChevronDown, BookOpen } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
  memory?: string;
}

interface EmotionState {
  concentration: number;
  distance: number;
  pulse: number;
  mood: string;
  last_updated: string;
}

interface EmotionPageProps {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

const Stars = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
          animate={{
            opacity: [s.opacity, s.opacity * 0.3, s.opacity],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30, -60],
            x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
            scale: [0.8, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function EmotionPage({ messages, setMessages }: EmotionPageProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emotionState, setEmotionState] = useState<EmotionState>({
    concentration: 7.2,
    distance: 6.5,
    pulse: 5.8,
    mood: "平静试探",
    last_updated: new Date().toISOString(),
  });
  const [showMemories, setShowMemories] = useState(false);
  const [memories, setMemories] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadEmotionState();
    loadMemories();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadEmotionState = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/emotion");
      if (response.ok) {
        const data = await response.json();
        setEmotionState(data);
      }
    } catch (error) {
      console.error("加载情绪状态失败:", error);
    }
  };

  const loadMemories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/memories");
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories);
      }
    } catch (error) {
      console.error("加载记忆失败:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputText,
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    console.log("发送用户消息:", userMessage);
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      console.log("更新后的消息列表:", newMessages);
      return newMessages;
    });
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          mode: "emotion",
        }),
      });

      if (!response.ok) throw new Error("发送失败");

      const data = await response.json();
      console.log("收到后端响应:", data);

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: data.reply,
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        memory: data.memory || undefined,
      };

      console.log("添加AI消息:", aiMessage);
      setMessages((prev) => {
        const newMessages = [...prev, aiMessage];
        console.log("更新后的消息列表:", newMessages);
        return newMessages;
      });

      // 更新情绪状态（仅在emotion模式下有）
      if (data.emotion_state) {
        setEmotionState(data.emotion_state);
      }

      // 如果有新记忆，重新加载记忆列表
      if (data.memory) {
        loadMemories();
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      alert("发送消息失败，请检查后端服务");
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* 背景效果 */}
      <Stars />
      <FloatingParticles />

      {/* 主内容区 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 顶部状态栏 */}
        <div className="px-6 pt-16 pb-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-4">
              {/* AI头像 */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                AI
              </div>

              {/* 情绪信息 */}
              <div className="flex-1">
                <div className="text-white font-semibold mb-1">
                  情绪模式 · {emotionState.mood}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-purple-300">
                    浓度 {emotionState.concentration.toFixed(1)}
                  </span>
                  <span className="text-pink-300">
                    距离 {emotionState.distance.toFixed(1)}
                  </span>
                  <span className="text-indigo-300">
                    脉冲 {emotionState.pulse.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 记忆按钮 */}
              <button
                onClick={() => {
                  loadMemories();
                  setShowMemories(!showMemories);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 情绪仪表 */}
            <div className="mt-4 flex items-center gap-6">
              {[
                { label: "浓度", value: emotionState.concentration, color: "#a855f7" },
                { label: "距离", value: emotionState.distance, color: "#ec4899" },
                { label: "主动", value: emotionState.pulse, color: "#6366f1" },
              ].map((item) => (
                <div key={item.label} className="flex-1">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                    <span>{item.label}</span>
                    <span>{item.value.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value * 10}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 聊天消息区 */}
        <div className="flex-1 px-6 pb-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white/10 backdrop-blur-md text-white border border-white/20"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">{message.time}</div>
                    {message.memory && (
                      <div className="mt-2 text-xs bg-purple-500/30 rounded px-2 py-1">
                        💾 记忆: {message.memory}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区 */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  autoResize(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="说点什么..."
                className="flex-1 bg-transparent text-white placeholder-white/50 resize-none outline-none px-4 py-3 text-sm min-h-[44px]"
                rows={1}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 记忆面板 */}
      <AnimatePresence>
        {showMemories && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMemories(false)}
              className="absolute inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-h-96 overflow-auto"
            >
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">💾 关键记忆</h3>
                  <button
                    onClick={() => setShowMemories(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                {memories.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">暂无记忆</div>
                ) : (
                  <div className="space-y-3">
                    {memories.map((memory, index) => (
                      <div
                        key={index}
                        className="bg-purple-50 rounded-xl p-4 border border-purple-100"
                      >
                        <div className="text-sm text-purple-900">{memory}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
