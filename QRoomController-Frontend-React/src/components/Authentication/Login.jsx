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

import Card from "../ui/Card";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import Label from "../ui/Label";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        setErrorMsg("Unauthorized");
      } else {
        setErrorMsg("Login Failed");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full shadow-card" rounded="xl">
        <Card.Body className="p-8">
          <div className="text-center mb-6">
            <div className="w-32 mx-auto mb-4">
              <Logo />
            </div>
            <h2 className="text-3xl font-bold text-primary-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          
          {errorMsg && (
            <div 
              ref={errorRef}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
            >
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              id="username"
              type="text"
              required
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              placeholder="Enter your username"
            />
            
            <TextInput
              label="Password"
              id="password"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              placeholder="Enter your password"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Need an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
