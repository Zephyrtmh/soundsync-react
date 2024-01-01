import React from "react";

function Input({ type, value, onChange, placeholder }) {
	return (
		<input
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className="border bg-theme-grey rounded-md pl-3"
		></input>
	);
}

export default Input;
