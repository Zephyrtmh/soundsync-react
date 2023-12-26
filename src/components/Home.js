import React from "react";
import { useState } from "react";

function Home() {
  const [roomToJoin, setRoomToJoin] = useState();

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    console.log(roomToJoin);
    //Check if room requires password
    let requiresPassword = true;

    if (requiresPassword) {
    }
    setRoomToJoin("");
  };

  const handleRoomChange = (e) => {
    setRoomToJoin(e.target.value);
  };
  return (
    <div>
      <button>create room</button>
      <div>
        <form onSubmit={handleJoinRoomSubmit}>
          <input
            type="text"
            value={roomToJoin}
            onChange={handleRoomChange}
          ></input>
          <button type="submit">join room</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
