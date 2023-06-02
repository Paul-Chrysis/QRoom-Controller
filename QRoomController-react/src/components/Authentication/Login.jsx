import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateToken } from "../../features/Userdetails/UserDetailsSlice";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React from "react";
import axios from "../../api/axios";
import Logo from "../thirdLayer/Logo";

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
      setAuth({ user, pwd, token });
      dispatch(updateToken(`Bearer ${token}`));

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
    <div className="wrapper">
      <Logo />
      <section className="auth-form">
        <p ref={errorRef} className={errorMsg ? "errmsg" : "hide"}>
          {errorMsg}
        </p>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />

          <button>Sign In</button>
        </form>
        <p>
          Need an Account?
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </div>
  );
};

export default Login;
