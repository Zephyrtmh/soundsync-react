import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
	const navigate = useNavigate();

	const onExploreClick = () => {
		navigate("/explore");
	};

	const onSignUpClick = () => {
		navigate("/signup");
	};

	const onHomeClick = () => {
		navigate("/");
	};

	return (
		<div className="flex justify-between items-center p-8 pr-10 text-theme-peach">
			<div onClick={onHomeClick}>
				<h1 className="text-xl font-bold">SoundSync</h1>
			</div>
			<ul className="inline-flex space-x-12">
				<li>Explore</li>
				<li>Sign up</li>
			</ul>
		</div>
	);
}

export default Header;
//
//
//
