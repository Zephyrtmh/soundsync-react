import React, { useContext } from "react";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import "./ChatMessage.css";

function ChatMessage({ message }) {
  const user = useContext(UserContext);

  return (
    <div>
      <div
        className={`${
          user.display_name === message.author
            ? "user-message message flex flex-wrap text-white"
            : "other-user-message message flex flex-wrap text-green-300"
        }`}
      >
        <div className="message-date w-16 truncate ...">
          {dayjs(message.sent_at).format("HH:mm:ss")}
        </div>
        <div className="message-author w-28 truncate ...">{`<${user.display_name}>`}</div>
        <div className="message-body">{message.body}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
