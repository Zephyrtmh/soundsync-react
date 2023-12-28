import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";

const supabaseUrl = "https://fdihsvoogljtmndllknu.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Chat() {
  const { chatId } = useParams();
  const [userTextInput, setUserTextInput] = useState();
  const [user, setUser] = useState();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [retrievingMessages, setRetrievingMessages] = useState(true);

  const handleNewMessage = (message) => {
    // console.log("insert received", message);
    console.log(message.new);
    console.log(currentMessages);
    let newMessages = [...currentMessages, message.new];
    setCurrentMessages(newMessages);
  };

  supabase
    .channel("todos")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "message" },
      handleNewMessage
    )
    .subscribe();

  useEffect(() => {
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    setUser(user);

    retrieveMessages();
  }, []);

  const retrieveMessages = async () => {
    let { data: messages, error } = await supabase
      .from("message")
      .select("*")
      .eq("public_channel_id", chatId)
      .order("sent_at", false)
      .limit(10);

    if (error) {
      setRetrievingMessages(false);
      alert("error retrieving messages");
    }

    setCurrentMessages(messages);

    setRetrievingMessages(false);
  };

  const handleUserTextInputChange = (e) => {
    e.preventDefault();
    setUserTextInput(e.target.value);
  };

  const handleUserTextInputSubmit = async (e) => {
    e.preventDefault();
    //submit chat message
    console.log(chatId);

    const { data, error } = await supabase
      .from("message")
      .insert([
        {
          body: userTextInput,
          public_channel_id: chatId,
        },
      ])
      .select();
  };

  return (
    <div>
      <h1>Welcome to Chat: {chatId}</h1>
      <div className="chat-content-container">
        {currentMessages.map((message) => {
          return (
            <p key={message.id}>
              {message.body}{" "}
              {dayjs(message.sent_at).format("YYYY/MM/DD HH:mm:ss")}
            </p>
          );
        })}
      </div>
      <div className="user-input-container">
        <form onSubmit={handleUserTextInputSubmit}>
          <input value={userTextInput} onChange={handleUserTextInputChange} />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
