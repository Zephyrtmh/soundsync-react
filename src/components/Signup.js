import React, { useEffect, useState } from "react";
import Input from "./common/Input";
import { useSupabase } from "../hooks/supabase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [confirmPasswordInput, setConfirmPasswordInput] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [passwordMismatch, setPasswordMismatch] = useState();

  const supabase = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (passwordInput !== confirmPasswordInput) {
      setPasswordMismatch(true);
      setErrorMessage("Password does not match.");
    } else {
      setPasswordMismatch(false);
      setErrorMessage(null);
    }
  }, [passwordInput, confirmPasswordInput]);

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: emailInput,
      password: passwordInput,
      options: {
        emailRedirectTo: process.env.REACT_APP_BASE_URL,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setEmailInput("");
      setPasswordInput("");
      setConfirmPasswordInput("");
      navigate("/");
    }
  };

  const handleEmailInputChange = (e) => {
    e.preventDefault();
    setEmailInput(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
  };

  const handleConfirmPasswordInputChange = (e) => {
    e.preventDefault();
    setConfirmPasswordInput(e.target.value);
  };

  const navigateLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="flex flex-col justify-center items-center space-y-10 sm:w-[500px] border-2 border-theme-red pt-10 pb-10 pl-4 pr-4">
        <h1 className="text-4xl text-theme-peach">Sign Up</h1>
        <div className="w-full">
          <form
            onSubmit={onSignupSubmit}
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
            <label className="text-theme-peach">Confirm password</label>
            <Input
              value={confirmPasswordInput}
              onChange={handleConfirmPasswordInputChange}
              type="password"
              className={`${passwordMismatch ? "ring-1 ring-red-400" : ""}`}
            ></Input>
            {errorMessage ? (
              <p className="text-red-700">{errorMessage}</p>
            ) : (
              <></>
            )}

            <p
              className="self-end hover:cursor-pointer"
              onClick={navigateLogin}
            >
              Already have an account?
            </p>
            <div className="w-full">
              <button className="group pl-6 pr-6 pt-2 pb-2 w-full rounded-lg  bg-theme-red hover:bg-theme-peach hover:ring-theme-blue">
                <p className="group-hover:text-theme-blue text-theme-grey">
                  Login
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
