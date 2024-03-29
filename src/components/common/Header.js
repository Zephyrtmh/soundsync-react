import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

  const onExploreClick = () => {
    navigate("/explore");
  };

  const onSignUpClick = () => {
    navigate("/signup");
  };

  const onHomeClick = () => {
    navigate("/");
  };

  const onLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-8 pr-10 text-theme-peach">
      <div onClick={onHomeClick}>
        <h1 className="text-xl font-bold hover:cursor-pointer ">SoundSync</h1>
      </div>
      <ul className="inline-flex space-x-12">
        <li className="hover:cursor-pointer hover:underline">Explore</li>
        {!user ? (
          <li
            className="hover:cursor-pointer hover:underline"
            onClick={onLoginClick}
          >
            Login
          </li>
        ) : (
          <li className="hover:cursor-pointer hover:underline">Profile</li>
        )}
      </ul>
    </div>
  );
}

export default Header;
