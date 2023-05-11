import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React from "react";
import axios from "../../api/axios";

const AUTHENTICATE_URL = "/api/v1/auth/authenticate";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/scanQR";
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
      const responce = await axios.post(
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
      console.log(JSON.stringify(responce.data));
      console.log(JSON.stringify(responce.accessToken));
      console.log(JSON.stringify(responce));
      const token = responce?.data?.token;
      setAuth({ user, pwd, token });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.responce) {
        setErrorMsg("No Server Responce");
      } else if (err.responce?.status === 400) {
        setErrorMsg("Missing username or password");
      } else if (err.responce?.status === 401) {
        setErrorMsg("Anauthorized");
      } else {
        setErrorMsg("Login Failed");
      }
    }
  };

  return (
    <section>
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
  );
};

export default Login;
