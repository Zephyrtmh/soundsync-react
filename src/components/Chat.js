import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";
import Input from "./common/Input";
import axios from "axios";
import { v4 as uuid } from "uuid";

import "./Chat.css";
import UserContext from "../contexts/UserContext";
import ChatMessage from "./ChatMessage";
import { useSupabase } from "../hooks/supabase";

function Chat() {
  const { chatId } = useParams();
  const [userTextInput, setUserTextInput] = useState("");
  const [user, setUser] = useState();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [retrievingMessages, setRetrievingMessages] = useState(true);
  const [retrievingChannel, setRetrievingChannel] = useState(true);

  const [channel, setChannel] = useState();

  const userContext = useContext(UserContext);

  const supabase = useSupabase();

  const chatBoxContainerRef = useRef(null);
  const bottomOfChatBoxRef = useRef(null);

  const handleNewMessage = (message) => {
    setCurrentMessages((prevMessages) => [...prevMessages, message.payload]);
    // chatBoxContainerRef.current.scrollTop = chatBoxContainerRef.current.height;
    console.log(currentMessages);
    bottomOfChatBoxRef.current.scrollIntoView({ block: "start" });
  };

  const supabaseChannel = supabase.channel(chatId);

  // supabaseChannel.subscribe((status) => {
  //   if (status === "SUBSCRIBED") {
  //     console.log("subscribed");
  //   }
  // });

  useEffect(() => {}, [currentMessages]);

  // set up upon start up
  useEffect(() => {
    supabase
      .channel(chatId)
      .on("broadcast", { event: chatId }, handleNewMessage)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("subscribed");
        }
      });
    retrieveMessages();
    retrieveChannel();
    setUpSpotify();
  }, []);

  //refresh when userContext changes
  useEffect(() => {
    setUser(userContext);
    console.log("user context change");
  }, [userContext]);

  useEffect(() => {
    if (bottomOfChatBoxRef.current) {
      bottomOfChatBoxRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [bottomOfChatBoxRef]);

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

  const retrieveChannel = async () => {
    let { data: channel, error } = await supabase
      .from("channel")
      .select("*")
      .eq("public_channel_id", chatId)
      .limit(1);

    console.log(channel);
    if (error) {
      setRetrievingChannel(false);
      console.error(error);
    }
    setChannel(channel[0]);

    console.log(channel[0]);
    setRetrievingChannel(false);
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

    setUserTextInput("");

    const { data: addedMessage, error } = await supabase
      .from("message")
      .insert([
        {
          author: user.display_name,
          body: userTextInput,
          public_channel_id: chatId,
        },
      ])
      .select();

    supabaseChannel.send({
      type: "broadcast",
      event: chatId,
      payload: {
        id: addedMessage[0].id,
        author: user.display_name,
        body: userTextInput,
        public_channel_id: chatId,
        sent_at: dayjs(),
      },
    });
  };

  if (retrievingMessages || retrievingChannel) {
    return <div>loading</div>;
  }

  return (
    <div className="chat absolute left-0 bottom-0 w-1/3 ">
      <h1>
        Welcome to {channel?.channel_name}, {user.display_name}
      </h1>
      <div
        ref={chatBoxContainerRef}
        className="chat-content-container h-64 overflow-y-auto"
      >
        {currentMessages.map((message) => {
          return <ChatMessage message={message} key={message.id} />;
        })}
        <div
          style={{ float: "left", clear: "both" }}
          ref={bottomOfChatBoxRef}
          className="scroll-mb-10"
        ></div>
      </div>

      <div className="user-input-container">
        <form onSubmit={handleUserTextInputSubmit}>
          <Input value={userTextInput} onChange={handleUserTextInputChange} />
          {/* <img src="./"></img> */}
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
