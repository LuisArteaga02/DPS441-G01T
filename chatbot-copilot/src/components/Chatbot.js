"use client";

import React, { useState, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import faqsData from "../data/faqs.json"; 

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "¡Hola! 👋 Soy tu asistente de la Escuela de Computación. Haz clic en una pregunta o escribe tu duda:" },
  ]);
  const [suggestions, setSuggestions] = useState([]);

  // Cargar 3 preguntas al azar del JSON al iniciar
  useEffect(() => {
    const randoms = [...faqsData].sort(() => 0.5 - Math.random()).slice(0, 3);
    setSuggestions(randoms);
  }, []);

  async function handleSend(textFromButton) {
    const text = typeof textFromButton === 'string' ? textFromButton : input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: Date.now(), from: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        from: "bot", 
        text: data.answers?.[0]?.answer || "Lo siento, no tengo información sobre eso. Intenta con otra pregunta." 
      }]);
      
      // Actualizar sugerencias con otras 3 preguntas al azar para mantener el flujo
      setSuggestions([...faqsData].sort(() => 0.5 - Math.random()).slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-xl p-4 mx-auto my-5 bg-blue-700 rounded-xl shadow-2xl font-sans">
      <div className="bg-white rounded-lg mb-4 h-[450px] overflow-hidden flex flex-col relative">
        <ChatMessages messages={messages} />
        
        <div className="p-3 bg-slate-100 border-t flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button 
              key={s.id} 
              onClick={() => handleSend(s.question)} 
              className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-full hover:bg-amber-400 hover:text-blue-900 transition-all font-bold"
            >
              {s.question.replace(/[¿?]/g, '')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu pregunta aquí..." 
          className="p-3 grow rounded-lg outline-none text-sm"
        />
        <button 
          onClick={() => handleSend()} 
          className="px-6 bg-amber-400 text-blue-900 font-bold rounded-lg hover:bg-amber-500"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}