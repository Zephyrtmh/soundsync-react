import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";
import Input from "./common/Input";
import axios from "axios";

import "./Chat.css";
import { useSupabase } from "../hooks/supabase";

function Chat() {
  const { chatId } = useParams();
  const [userTextInput, setUserTextInput] = useState();
  const [user, setUser] = useState();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [retrievingMessages, setRetrievingMessages] = useState(true);

  const supabase = useSupabase();

  const handleNewMessage = (message) => {
    let newMessages = [...currentMessages, message.payload];
    console.log(message);
    setCurrentMessages(newMessages);
  };

  const channel = supabase.channel(chatId);

  supabase
    .channel(chatId)
    .on("broadcast", { event: "message" }, handleNewMessage)
    .subscribe();

  useEffect(() => {
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    setUser(user);

    retrieveMessages();
    setUpSpotify();
  }, []);

  const retrieveMessages = async () => {
    let { data: messages, error } = await supabase
      .from("message")
      .select("*")
      .eq("public_channel_id", chatId)
      .order("sent_at", { ascending: false })
      .limit(10);

    if (error) {
      setRetrievingMessages(false);
      alert("error retrieving messages");
    }

    setCurrentMessages(messages.reverse());

    setRetrievingMessages(false);
  };

  const setUpSpotify = async () => {
    // get available devices
    let accessToken = localStorage.getItem("access_token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    console.log(config);
    // let response2 = await axios.get("https://api.spotify.com/v1/me", config);
    // let response = await axios.get(
    //   "https://api.spotify.com/v1/me/player/devices",
    //   config
    // );
    // console.log(response);
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
          author: user.display_name,
          body: userTextInput,
          public_channel_id: chatId,
        },
      ])
      .select();

    supabase.channel(chatId).subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "message",
          payload: {
            author: user.display_name,
            body: userTextInput,
            public_channel_id: chatId,
          },
        });
      }
    });
  };

  if (retrievingMessages) {
    return <div>loading</div>;
  }

  return (
    <div>
      <h1>Welcome to Chat: {chatId}</h1>
      <div className="chat-content-container">
        {currentMessages.map((message) => {
          return (
            <div
              className={
                user.display_name === message.author
                  ? "user-message"
                  : "other-user-message"
              }
            >
              <p key={message.id}>{message.body}</p>
              <p>{dayjs(message.sent_at).format("YYYY/MM/DD HH:mm:ss")}</p>
            </div>
          );
        })}
      </div>
      <div className="user-input-container">
        <form onSubmit={handleUserTextInputSubmit}>
          <Input value={userTextInput} onChange={handleUserTextInputChange} />
          <image src="./"></image>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
