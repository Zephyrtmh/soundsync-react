import React, { useState } from "react";
import Chat from "./Chat";
import "./Channel.css";

function Channel() {
  const [showChat, setShowChat] = useState(false);

  const handleKeyDown = () => {
    setShowChat(!showChat);
  };

  // Attach the event listener when the component mounts
  document.addEventListener("keydown", handleKeyDown);

  return (
    <div className="channel-display-container">
      <div className="channel-navigation-bar">channels</div>
      <div className="channel">
        <div>live stream</div>
        <div className="chat">
          <Chat></Chat>
        </div>
      </div>
    </div>
  );
}

export default Channel;
