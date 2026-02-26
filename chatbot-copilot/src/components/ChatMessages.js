import React, { useEffect, useRef } from "react";

export default function ChatMessages({ messages }) {
  const scrollRef = useRef(null);

  // Autoscroll suave
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <>
      {/* Inyectamos el keyframe directamente para no depender de tailwind.config */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-animation {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
        style={{ height: "400px" }}
      >
        {messages.map((m, index) => {
          const isUser = m.from === "user";

          return (
            <div
              key={m.id || index}
              className={`flex ${isUser ? "justify-end" : "justify-start"} message-animation`}
            >
              <div className="max-w-[85%]">
                <p className={`text-[10px] uppercase mb-1 font-bold text-slate-400 ${isUser ? "text-right" : "text-left"}`}>
                  {isUser ? "Tú" : "Bot de Soporte"}
                </p>

                <div
                  className={`p-3 shadow-sm text-sm ${
                    isUser
                      ? "bg-blue-600 text-white rounded-l-lg rounded-tr-lg"
                      : "bg-white text-slate-700 border border-slate-200 rounded-r-lg rounded-tl-lg"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}