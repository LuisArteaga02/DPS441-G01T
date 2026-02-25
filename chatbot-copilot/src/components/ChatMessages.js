import React from "react";
import ChatMessage from "./ChatMessage";

export default function ChatMessages({ messages }) {
  return (
    <div className="overflow-auto p-3 rounded-md bg-white">
      {messages.map((m) => (
        <ChatMessage key={m.id} from={m.from} text={m.text} />
      ))}
    </div>
  );
}