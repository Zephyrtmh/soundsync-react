import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState();

  const currentToken = {
    get access_token() {
      return localStorage.getItem("access_token") || null;
    },
    get refresh_token() {
      return localStorage.getItem("refresh_token") || null;
    },
    get expires_in() {
      return localStorage.getItem("refresh_in") || null;
    },
    get expires() {
      return localStorage.getItem("expires") || null;
    },

    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + expires_in * 1000);
      localStorage.setItem("expires", expiry);
    },
  };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  // async function getUserData() {
  //   let response = await axios.get("https://api.spotify.com/v1/me", {
  //     headers: { Authorization: "Bearer " + currentToken.access_token },
  //   });
  //   // const response = await fetch("https://api.spotify.com/v1/me", {
  //   //   method: "GET",
  //   //   headers: { Authorization: "Bearer " + currentToken.access_token },
  //   // });
  //   setUser(response.data);
  //   console.log(response.data.images[0].url);
  //   return response.data;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="test" element={<div>test</div>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
