"use client";


import React, { useState } from "react";
import ChatMessages from "./ChatMessages";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: Date.now(), from: "bot", text: "Hola - Pregúntame sobre servicios o políticas del campus." },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data && data.answers && data.answers.length) {
        data.answers.forEach((a) => {
          setMessages((m) => [...m, { id: `${a.id}-${Date.now()}`, from: "bot", text: `${a.question}\n\n${a.answer}` }]);
        });
      } else {
        setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: "Sorry, I couldn't find a clear answer. Try rephrasing your question." }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + 2, from: "bot", text: "There was an error contacting the FAQ service." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="max-w-1/3 p-4 mx-auto my-5 border-2 border-solid border-white rounded-md bg-blue-500">
      <h2 className="mt-0 text-lg text-center text-white">UBD Chatbot</h2>
      <ChatMessages messages={messages} />

      <div className="flex mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ingresa tu pregunta (ej: '¿Cuál es el calendario académico para este semestre?')"
          rows={2}
          className="p-3 grow bg-white border-0 rounded-md focus:outline-none focus:ring-3 focus:ring-blue-300"
        />
        <div className="flex flex-col gap-2">
          <button onClick={handleSend} disabled={loading} className="ml-2 p-3 bg-amber-300 text-black rounded-md hover:bg-amber-400 focus:outline-none focus:ring-3 focus:ring-blue-300">
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
