import React from "react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabaseUrl = "https://fdihsvoogljtmndllknu.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Home() {
  const navigate = useNavigate();
  const [roomToJoinInput, setroomToJoinInput] = useState();
  const [roomToJoin, setRoomToJoin] = useState();
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [channelPasswordInput, setChannelPasswordInput] = useState();

  const handleJoinRoomSubmit = async (e) => {
    e.preventDefault();
    console.log(roomToJoinInput);
    //Check if room requires password

    let { data: channels, error } = await supabase
      .from("channel")
      .select("*")
      .eq("channel_name", roomToJoinInput);
    console.log(channels);
    if (channels.length !== 0) {
      let channel = channels[0];
      setRoomToJoin(channel);

      if (!channel.public) {
        setPasswordRequired(true);
      } else {
        alert("join room");
      }
    } else {
      alert("No such room exists. Check your spelling");
    }

    setroomToJoinInput("");
  };

  const handleRoomChange = (e) => {
    setroomToJoinInput(e.target.value);
  };

  const handleChannelPasswordChange = (e) => {
    e.preventDefault();
    setChannelPasswordInput(e.target.value);
  };

  const handleSubmitChannelPassword = async (e) => {
    e.preventDefault();
    console.log(roomToJoin.channel_name);
    console.log(e.target.value);
    let { data: channels, error } = await supabase
      .from("channel")
      .select("channel_name, public_channel_id")
      .eq("channel_name", roomToJoin.channel_name)
      .eq("channel_password", channelPasswordInput);

    console.log(channels);
    if (channels.length === 1) {
      //correct password
      alert("correct password");
      //navigate to chatroom
      navigate(`/chat/${channels[0].public_channel_id}`);
    } else {
      alert("wrong password");
    }
  };

  return (
    <div>
      <button>create room</button>
      <div>
        <form onSubmit={handleJoinRoomSubmit}>
          <input
            type="text"
            value={roomToJoinInput}
            onChange={handleRoomChange}
          ></input>
          <button type="submit">join room</button>
        </form>
      </div>
      {passwordRequired ? (
        <div>
          <form onSubmit={handleSubmitChannelPassword}>
            <input
              type="password"
              value={channelPasswordInput}
              onChange={handleChannelPasswordChange}
            ></input>
            <button type="submit" onClick={handleSubmitChannelPassword}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Home;
