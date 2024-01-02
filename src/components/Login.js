import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./common/Input";
import Button from "./common/Button";

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

const redirectUrl = process.env.REACT_APP_BASE_URL + "/login";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = "user-read-private user-read-email";

function Login() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  useEffect(() => {
    async function handleGetAccessToken() {
      console.log("this is ran");
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");
      let token;
      console.log(code);
      if (code) {
        try {
          token = await getAccessToken(code);
          currentToken.save(token);

          // Remove code from URL so we can refresh correctly.
          const url = new URL(window.location.href);
          url.searchParams.delete("code");

          const updatedUrl = url.search ? url.href : url.href.replace("?", "");
          window.history.replaceState({}, document.title, updatedUrl);

          let user = await getUserData();
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home");
        } catch (err) {
          console.error(err);
        }
      }
    }
    handleGetAccessToken();
  }, []);

  async function redirectToSpotifyAuthorize() {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce(
      (acc, x) => acc + possible[x % possible.length],
      ""
    );

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest("SHA-256", data);

    const code_challenge_base64 = btoa(
      String.fromCharCode(...new Uint8Array(hashed))
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    window.localStorage.setItem("code_verifier", code_verifier);

    const authUrl = new URL(authorizationEndpoint);
    const params = {
      response_type: "code",
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  async function getAccessToken(code) {
    console.log("local storage", localStorage.getItem("code_verifier"));
    const params = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/login",
      code_verifier: localStorage.getItem("code_verifier"),
    };

    console.log(params);

    let response = await axios.post(
      tokenEndpoint,
      new URLSearchParams(params).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  }

  async function getUserData() {
    let response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    console.log(currentToken.access_token);
    // const response = await fetch("https://api.spotify.com/v1/me", {
    //   method: "GET",
    //   headers: { Authorization: "Bearer " + currentToken.access_token },
    // });
    console.log(response.data.images[0].url);
    return response.data;
  }

  const handleEmailInputChange = (e) => {
    e.preventDefault();
    setEmailInput(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
  };

  const onLoginSubmit = (e) => {
    e.preventDefault();
  };

  const toggleShowEmailLogin = () => {
    setShowEmailLogin(!showEmailLogin);
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="flex flex-col justify-center items-center space-y-10 w-1/3 border-2 border-theme-red pt-10 pb-10 pl-4 pr-4">
        <h1 className="text-4xl text-theme-peach">Login</h1>
        <div className="flex flex-col items-center text-theme-red">
          <button
            onClick={redirectToSpotifyAuthorize}
            className="group flex items-center space-x-2 ring-1 pl-6 pr-6 pt-2 pb-2 rounded-lg ring-theme-peach hover:bg-theme-peach hover:ring-theme-blue"
          >
            <img
              alt="spotify logo"
              src="./spotify_logo.png"
              className="h-6"
            ></img>
            <p className="text-theme-peach group-hover:text-theme-blue">
              Login with Spotify
            </p>
          </button>
          <p>recommended</p>
        </div>
        <div className="flex flex-col w-full items-center">
          <div className="flex items-center w-full justify-center">
            <hr className="border-1 border-theme-grey w-1/4" />
            <div className="ml-4 mr-4 text-theme-grey">
              or sign in with email
            </div>
            <hr className="border-1 border-theme-grey w-1/4" />
          </div>
          <div>
            {showEmailLogin ? (
              <img
                alt="email login"
                src="./uparrow.png"
                className="h-3 hover:cursor-pointer hover:-translate-y-0.5"
                onClick={toggleShowEmailLogin}
              ></img>
            ) : (
              <img
                alt="email login"
                src="./downarrow.png"
                className="h-3 hover:cursor-pointer hover:translate-y-0.5"
                onClick={toggleShowEmailLogin}
              ></img>
            )}
          </div>
        </div>

        {showEmailLogin ? (
          <div className="w-full">
            <form
              onSubmit={onLoginSubmit}
              className="flex flex-col space-y-4 text-theme-peach"
            >
              <label className="text-theme-peach">Email</label>
              <Input
                value={emailInput}
                onChange={handleEmailInputChange}
                type="email"
              ></Input>
              <label className="text-theme-peach">Password</label>
              <Input
                value={passwordInput}
                onChange={handlePasswordInputChange}
                type="password"
              ></Input>
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  <input type="checkbox"></input>
                  <p>Remember me</p>
                </div>
                <p>Forgot password?</p>
              </div>
              <div className="w-full">
                <button className="group pl-6 pr-6 pt-2 pb-2 w-full rounded-lg  bg-theme-red hover:bg-theme-peach hover:ring-theme-blue">
                  <p className="group-hover:text-theme-blue text-theme-grey">
                    Login
                  </p>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Login;
