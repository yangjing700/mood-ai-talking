import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
  memory?: string;
}

interface AngelPageProps {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

const AngelCharacter = () => (
  <div className="relative w-full h-full flex items-end justify-center">
    {/* 温暖金色发光效果 */}
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "85%",
        height: "70%",
        background:
          "radial-gradient(ellipse, rgba(251,191,36,0.28) 0%, rgba(253,230,138,0.12) 45%, transparent 70%)",
        filter: "blur(28px)",
      }}
    />
    {/* 角色图片 - 上下浮动效果 */}
    <motion.div
      className="relative w-full h-full flex items-end justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src="/angel-character.png"
        alt="治愈小天使"
        style={{
          filter:
            "sepia(0.38) hue-rotate(-18deg) saturate(1.25) brightness(1.08) drop-shadow(0 0 32px rgba(251,191,36,0.55))",
          objectFit: "contain",
          width: "100%",
          height: "100%",
          transform: "scaleX(-1) rotate(8deg) scale(1.15)",
          transformOrigin: "center bottom",
        }}
      />
    </motion.div>
  </div>
);

const SunRays = () => {
  const rays = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 14,
    length: Math.random() * 80 + 120,
    width: Math.random() * 2 + 1.5,
    opacity: Math.random() * 0.12 + 0.04,
    duration: Math.random() * 4 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 太阳球体 */}
      <div
        className="absolute"
        style={{
          right: "6%",
          top: "-5%",
          width: "280px",
          height: "280px",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(253,230,138,0.12) 45%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* 光线 */}
      {rays.map((r) => (
        <motion.div
          key={r.id}
          className="absolute origin-bottom"
          style={{
            right: "14%",
            top: "-2%",
            width: `${r.width}px`,
            height: `${r.length}px`,
            background: `linear-gradient(to top, rgba(251,191,36,${r.opacity}) 0%, transparent 100%)`,
            transformOrigin: "bottom center",
            rotate: `${r.angle}deg`,
          }}
          animate={{ opacity: [r.opacity, r.opacity * 0.5, r.opacity] }}
          transition={{ duration: r.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* 浮动光粒子 */}
      {Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 85 + 5,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 5,
      })).map((p) => (
        <motion.div
          key={`p-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -20, -40],
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

      {/* 金色闪光星星 */}
      {Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10,
        size: Math.random() * 6 + 8,
        duration: Math.random() * 2 + 2.5,
        delay: Math.random() * 4,
      })).map((sp) => (
        <motion.div
          key={`sp-${sp.id}`}
          className="absolute select-none"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            fontSize: `${sp.size}px`,
            color: "rgba(251,191,36,0.6)",
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.1, 0.5], rotate: [0, 90, 180] }}
          transition={{ duration: sp.duration, repeat: Infinity, delay: sp.delay }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
};

export default function AngelPage({ messages, setMessages }: AngelPageProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          mode: "angel",
        }),
      });

      if (!response.ok) throw new Error("发送失败");

      const data = await response.json();

      const angelMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: data.reply,
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        memory: data.memory || undefined,
      };

      setMessages((prev) => [...prev, angelMessage]);
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
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: "linear-gradient(140deg, #fffde4 0%, #fef9d7 30%, #fff8cc 65%, #fef5c0 100%)",
      }}
    >
      <SunRays />

      {/* 温暖光晕 */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "8%",
          top: "15%",
          width: "320px",
          height: "220px",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: "5%",
          bottom: "20%",
          width: "260px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(253,230,138,0.12) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 flex h-full">
        {/* 左侧：聊天框 */}
        <div className="flex-1 h-full flex items-center py-16 pl-8 pr-4">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative w-full h-full"
          >
            {/* 对话框主体 */}
            <div
              className="w-full h-full rounded-[2rem] border flex flex-col overflow-hidden"
              style={{
                borderColor: "rgba(251,191,36,0.35)",
                background:
                  "linear-gradient(145deg, rgba(255,253,232,0.75) 0%, rgba(254,249,219,0.8) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 0 80px rgba(251,191,36,0.14), 0 8px 32px rgba(251,191,36,0.1), inset 0 0 60px rgba(255,251,204,0.3)",
              }}
            >
              {/* 头部 */}
              <div
                className="px-6 py-4 flex items-center gap-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(251,191,36,0.25)" }}
              >
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-yellow-400"
                  animate={{ opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <span
                  className="text-amber-600/90 text-sm tracking-[0.2em] uppercase select-none"
                  style={{ fontFamily: "serif" }}
                >
                  治愈小天使 · 心里话
                </span>
              </div>

              {/* 消息区域 */}
              <div
                className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(251,191,36,0.3) transparent" }}
              >
                <AnimatePresence initial={false}>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center mt-10 select-none"
                    >
                      <div className="text-4xl mb-4">🌸</div>
                      <p className="text-amber-600/80 text-sm leading-relaxed">
                        嗨～我在这里陪着你呢
                      </p>
                      <p className="text-amber-500/60 text-xs mt-2">
                        有什么想说的，都可以告诉我哦 ✨
                      </p>
                    </motion.div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "ai" && (
                        <div className="w-7 h-7 rounded-full bg-yellow-100 border border-yellow-300/60 flex items-center justify-center text-xs mr-2 mt-1 shrink-0 select-none">
                          😇
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          message.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                        }`}
                        style={
                          message.role === "user"
                            ? {
                                background:
                                  "linear-gradient(135deg, rgba(251,191,36,0.65) 0%, rgba(245,158,11,0.55) 100%)",
                                border: "1px solid rgba(251,191,36,0.4)",
                                color: "#78350f",
                              }
                            : {
                                background: "rgba(255,251,204,0.8)",
                                border: "1px solid rgba(251,191,36,0.3)",
                                color: "#92400e",
                              }
                        }
                      >
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70">{message.time}</div>
                        {message.memory && (
                          <div className="mt-2 text-xs bg-amber-500/20 rounded px-2 py-1 border border-amber-400/30">
                            💕 记得你：{message.memory}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="w-7 h-7 rounded-full bg-yellow-100 border border-yellow-300/60 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">
                        😇
                      </div>
                      <div
                        className="px-4 py-3 rounded-2xl rounded-tl-sm"
                        style={{
                          background: "rgba(255,251,204,0.8)",
                          border: "1px solid rgba(251,191,36,0.3)",
                        }}
                      >
                        <div className="flex gap-1.5 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-amber-400"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.55,
                                repeat: Infinity,
                                delay: i * 0.18,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* 输入框 */}
              <div
                className="px-4 pb-4 pt-3 shrink-0"
                style={{ borderTop: "1px solid rgba(251,191,36,0.22)" }}
              >
                <div className="flex gap-3 items-end">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={autoResize}
                    placeholder="有什么想说的，都可以和我分享～"
                    rows={1}
                    className="flex-1 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
                    style={{
                      background: "rgba(255,253,230,0.8)",
                      border: "1px solid rgba(251,191,36,0.35)",
                      color: "#78350f",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleSend}
                    disabled={!inputText.trim() || isLoading}
                    className="p-3.5 rounded-xl disabled:opacity-35 transition-colors shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(251,191,36,0.8) 0%, rgba(245,158,11,0.7) 100%)",
                      border: "1px solid rgba(251,191,36,0.5)",
                      color: "#78350f",
                    }}
                  >
                    <Send size={17} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 右侧：天使角色 */}
        <div className="w-[38%] md:w-[36%] h-full flex items-end justify-center pb-0 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-[90%] w-auto max-w-[280px]"
          >
            <AngelCharacter />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
