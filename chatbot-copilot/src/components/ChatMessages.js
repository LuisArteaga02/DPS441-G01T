import React from "react";

export default function ChatMessages({ messages }) {
  return (
    <div className="overflow-auto p-3 rounded-md bg-white">
      {messages.map((m) => (
        <div key={m.id} className="my-4">
          <div className="text-xs text-slate-500">{m.from === "user" ? "Tú" : "Bot"}</div>
          <div className={`p-3 rounded-md whitespace-pre-line ${m.from === "user" ? "bg-blue-200" : "bg-slate-200"}`}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}