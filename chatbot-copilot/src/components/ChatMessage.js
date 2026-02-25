import React from "react";

export default function ChatMessage({ from, text }) {
  return (
    <div className="my-4">
      <div className="text-xs text-slate-500">{from === "user" ? "Tú" : "Bot"}</div>
      <div className={`p-3 rounded-md whitespace-pre-line ${from === "user" ? "bg-blue-200" : "bg-slate-200"}`}>{text}</div>
    </div>
  );
}