import React, { useEffect } from "react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import Input from "./common/Input";
import Button from "./common/Button";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const exampleChannelInputPlaceholders = [
  "20s Rock Music",
  "TikTok Songs 2023",
  "Lofi for the Soul",
  "Study With Me",
  "90's Rap",
  "Chill with Friends",
  "Indie Vibes",
  "Feel Good Pop",
  "Electronic Beats",
  "Classic Rock Anthems",
  "Soulful R&B",
  "Country Hits",
  "Upbeat Workout Tunes",
  "Jazz & Blues",
  "EDM Party Mix",
  "Acoustic Favorites",
  "Hip Hop Classics",
  "Reggae Vibes",
  "Latin Fiesta",
  "Alternative Jams",
  "Movie Soundtracks",
  "Folk & Americana",
  "80's Dance Party",
  "Blissful Classical",
  "Metal Mayhem",
  "K-Pop Hits",
  "Funky Grooves",
  "Global Beats",
  "Dreamy Synthwave",
  "Kids' Favorites",
  "Instrumental Focus",
  "Dancehall Madness",
  "World Music Wonders",
  "Chill Electronic",
];

function Home() {
  const navigate = useNavigate();
  const [roomToJoinInput, setroomToJoinInput] = useState();
  const [roomToJoin, setRoomToJoin] = useState();
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [channelPasswordInput, setChannelPasswordInput] = useState();
  const [error, setError] = useState();
  const [
    currentExampleChannelInputPlaceholder,
    setCurrentExampleChannelInputPlaceholder,
  ] = useState(0);
  const [channelCreateInput, setChannelCreateInput] = useState();
  const [isCreate, setIsCreate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleChannelInputPlaceholder(
        (prevIndex) => (prevIndex + 1) % exampleChannelInputPlaceholders.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [exampleChannelInputPlaceholders.length]);

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
        setError(null);
        setPasswordRequired(true);
      } else {
        navigate(`/channel/${channel.public_channel_id}`);
      }
    } else {
      setError({
        errorCode: "201",
        message: "No such room exists. Check your spelling",
      });
    }
  };

  const handleRoomChange = (e) => {
    e.preventDefault();
    setroomToJoinInput(e.target.value);
    setPasswordRequired(false);
    setChannelPasswordInput(null);
    console.log(e.target.value);
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

    if (channels.length === 1) {
      //action when correct password
      //navigate to chatroom
      setroomToJoinInput("");
      navigate(`/channel/${channels[0].public_channel_id}`);
    } else {
      setError({ errorCode: "403", message: "password incorrect" });
    }
  };

  const handleCreateChannelChange = (e) => {
    e.preventDefault();
    setChannelCreateInput(e.target.value);
    console.log(channelCreateInput);
    console.log(roomToJoin);
  };

  const handleCreateChannelSubmit = async (e) => {
    e.preventDefault();
    let { data: channels, error } = await supabase
      .from("channel")
      .insert({ channel_name: channelCreateInput, public: true });
  };

  const toggleCreateJoin = () => {
    if (isCreate) {
      setroomToJoinInput(channelCreateInput);
    } else {
      setChannelCreateInput(roomToJoinInput);
    }
    setIsCreate(!isCreate);
    return;
  };

  return (
    <div className="flex items-center justify-center pt-20">
      <div className="w-4/5 sm:w-1/3">
        <div className="pb-6">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl text-theme-red max-w-xl font-bold pb-6">
            Just in time for the party!
          </h1>
          <p className="text-theme-peach max-w-xl text:lg sm:text-xl">
            Experience a unique blend of shared playlists and interactive
            conversations. Dive into a vibrant community where music and
            connection come together seamlessly. Your social music journey
            begins here!
          </p>
        </div>
        {isCreate ? (
          <div>
            <div>
              <form
                onSubmit={handleCreateChannelSubmit}
                className="flex space-x-4"
              >
                <Input
                  placeholder={
                    exampleChannelInputPlaceholders[
                      currentExampleChannelInputPlaceholder
                    ]
                  }
                  value={channelCreateInput}
                  onChange={handleCreateChannelChange}
                />
                <Button type="submit">Start Now</Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <form onSubmit={handleJoinRoomSubmit} className="flex space-x-4">
                <Input
                  type="text"
                  value={roomToJoinInput}
                  onChange={handleRoomChange}
                />
                <Button type="submit">Join Channel</Button>
              </form>
            </div>
            {passwordRequired ? (
              <div>
                <form
                  onSubmit={handleSubmitChannelPassword}
                  // className="space-y-4"
                >
                  <label className="text-theme-peach">
                    Password<span className="text-theme-red font-bold"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <Input
                      type="password"
                      value={channelPasswordInput}
                      onChange={handleChannelPasswordChange}
                    ></Input>
                    <Button type="submit" onClick={handleSubmitChannelPassword}>
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        <div>
          {error ? <p className="text-theme-red">{error.message}</p> : <p></p>}
        </div>

        <div className="mt-2">
          {isCreate ? (
            <p
              className="text-theme-grey underline hover:cursor-pointer"
              onClick={toggleCreateJoin}
            >
              Already have a channel? Join now.
            </p>
          ) : (
            <p
              className="text-theme-grey underline hover:cursor-pointer"
              onClick={toggleCreateJoin}
            >
              Don't have a channel? Create now.
            </p>
          )}
        </div>
      </div>
      <div className="w-0 invisible sm:visible sm:w-1/3">some art</div>
    </div>
  );
}

export default Home;
