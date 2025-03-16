import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateUser,
  updateUserName,
} from "../../features/Userdetails/userDetailsSlice";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React from "react";
import axios from "../../api/axios";
import Logo from "../thirdLayer/Logo";

import { Button, Card, Label, TextInput } from "flowbite-react";

const AUTHENTICATE_URL = "/api/v1/auth/authenticate";

const Login = () => {
  const dispatch = useDispatch();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const from = "/";
  const userRef = useRef();
  const errorRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        AUTHENTICATE_URL,
        JSON.stringify({
          username: user,
          password: pwd,
        }),
        {
          headers: { "content-type": "application/json" },
          withCredentials: true,
        }
      );

      const token = response?.data?.token;
      const role = response?.data?.role;
      setAuth({ user, pwd, token });
      dispatch(updateUser({ token: `Bearer ${token}`, role: role }));
      dispatch(updateUserName(user));

      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMsg("Missing username or password");
      } else if (err.response?.status === 403) {
        setErrorMsg("Account does not exist");
      } else if (err.response?.status === 401) {
        setErrorMsg("Anauthorized");
      } else {
        setErrorMsg("Login Failed");
      }
    }
  };

  return (
    <div className="container mx-auto h-dvh content-center">
      <Card className="max-w-sm justify-items-center mx-auto shadow-2xl mt-5">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <p
            ref={errorRef}
            className={
              errorMsg
                ? "border rounded-lg border-red-500 text-red-500 text-center py-1"
                : "hidden"
            }
          >
            {errorMsg}
          </p>
          <Logo></Logo>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput
              id="username"
              type="text"
              required
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
          </div>
          <Button type="submit">Login</Button>
          <p>
            Need an Account?
            <span className="inline-block">
              <Link to="/register" className="underline font-semibold">
                Sign Up
              </Link>
            </span>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
