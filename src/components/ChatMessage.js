import React, { useContext } from "react";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";

function ChatMessage({ message }) {
	const user = useContext(UserContext);

	return (
		<div>
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
		</div>
	);
}

export default ChatMessage;
