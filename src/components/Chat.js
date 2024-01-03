import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";
import Input from "./common/Input";
import axios from "axios";

import "./Chat.css";
import UserContext from "../contexts/UserContext";
import ChatMessage from "./ChatMessage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Chat() {
	const { chatId } = useParams();
	const [userTextInput, setUserTextInput] = useState();
	const [user, setUser] = useState();
	const [currentMessages, setCurrentMessages] = useState([]);
	const [retrievingMessages, setRetrievingMessages] = useState(true);
	const [retrievingChannel, setRetrievingChannel] = useState(true);

	const [channel, setChannel] = useState();

	const userContext = useContext(UserContext);

	const handleNewMessage = (message) => {
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

	//set up upon start up
	useEffect(() => {
		retrieveMessages();
		retrieveChannel();
		setUpSpotify();
	}, []);

	//refresh when userContext changes
	useEffect(() => {
		setUser(userContext);
	}, [userContext]);

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
		// 	"https://api.spotify.com/v1/me/player/devices",
		// 	config
		// );
		// console.log(response2);
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
	};

	if (retrievingMessages || retrievingChannel) {
		return <div>loading</div>;
	}

	return (
		<div>
			<h1>
				Welcome to {channel?.channel_name}, {user.display_name}
			</h1>
			<div className="chat-content-container">
				{currentMessages.map((message) => {
					return <ChatMessage message={message} />;
				})}
			</div>
			<div className="user-input-container">
				<form onSubmit={handleUserTextInputSubmit}>
					<Input value={userTextInput} onChange={handleUserTextInputChange} />
					<img src="./"></img>
					<button>Submit</button>
				</form>
			</div>
		</div>
	);
}

export default Chat;
