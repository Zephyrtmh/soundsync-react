import React from "react";

function Button({ type, onClick, children }) {
	return (
		<button
			type={type}
			onClick={onClick}
			className="bg-theme-red rounded-md pl-3 pr-3 pt-2 pb-2 text-theme-grey"
		>
			{children}
		</button>
	);
}

export default Button;
