import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          navigate("/test");
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
      headers: { Authorization: "Bearer " + currentToken.access_token },
    });
    // const response = await fetch("https://api.spotify.com/v1/me", {
    //   method: "GET",
    //   headers: { Authorization: "Bearer " + currentToken.access_token },
    // });
    console.log(response.data.images[0].url);
    return response.data;
  }

  return (
    <div>
      <div className="App">
        <button onClick={redirectToSpotifyAuthorize}>Login with Spotify</button>
      </div>
    </div>
  );
}

export default Login;
