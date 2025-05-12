import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/Userdetails/userDetailsSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import Logo from "../thirdLayer/Logo";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Label from "../ui/Label";
import TextInput from "../ui/TextInput";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const NAME_REGEX = /^[A-Z]{1}[a-z]{2,15}$/;
const REGISTER_URL = "/api/v1/auth/register";

const Register = () => {
  const dispatch = useDispatch();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const from = "/";
  const userRef = useRef();
  const errorRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [first, setFirst] = useState("");
  const [validFirst, setValidFirst] = useState(false);
  const [firstFocus, setFirstFocus] = useState(false);

  const [last, setLast] = useState("");
  const [validLast, setValidLast] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = NAME_REGEX.test(first);
    setValidFirst(result);
  }, [first]);

  useEffect(() => {
    const result = NAME_REGEX.test(last);
    setValidLast(result);
  }, [last]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrorMsg("");
  }, [user, pwd, matchPwd, first, last, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = NAME_REGEX.test(first);
    const v4 = NAME_REGEX.test(last);
    const v5 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrorMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username: user,
          firstname: first,
          lastname: last,
          email,
          password: pwd,
        }),
        {
          withCredentials: true,
          headers: { "content-type": "application/json" },
        }
      );
      const token = response?.data?.token;
      const role = response?.data?.role;
      setAuth({ user, pwd, token });
      dispatch(updateUser({ token: `Bearer ${token}`, role: role }));
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMsg("No Server Response");
      } else if (err.response?.status == 409) {
        setErrorMsg("Username Taken");
      } else {
        setErrorMsg("Registration Failed");
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
          <Logo />
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
              <span className={validName ? "text-lime-500 ml-1" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validName || !user ? "hidden" : "text-red-500 ml-1"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              4 to 23 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores and hyphens allowed.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="firstname" value="Name" />
              <span className={validFirst ? "text-lime-500 ml-1" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validFirst || !first ? "hidden" : "text-red-500 ml-1"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="text"
              id="firstname"
              autoComplete="off"
              onChange={(e) => setFirst(e.target.value)}
              required
              onFocus={() => setFirstFocus(true)}
              onBlur={() => setFirstFocus(false)}
            />
            <p
              id="nnote"
              className={
                firstFocus && first && !validFirst
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              3 to 15 characters.
              <br />
              Must begin with an upercase letter and continue with lowercase
              letters.
              <br />
              Numbers, and special characters are not allowed.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="lastname" value="Surname" />
              <span className={validLast ? "text-lime-500 ml-1" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validLast || !last ? "hidden" : "text-red-500 ml-1"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="text"
              id="lastname"
              autoComplete="off"
              onChange={(e) => setLast(e.target.value)}
              required
              onFocus={() => setLastFocus(true)}
              onBlur={() => setLastFocus(false)}
            />
            <p
              id="lnote"
              className={
                lastFocus && last && !validLast
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              3 to 15 characters.
              <br />
              Must begin with an upercase letter and continue with lowercase
              letters.
              <br />
              Numbers, and special characters are not allowed.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
              <span className={validEmail ? "text-lime-500 ml-1" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validEmail || !email ? "hidden" : "text-red-500 ml-1"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="enote"
              className={
                emailFocus && email && !validEmail
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              Must be valid email.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
              <span className={validPwd ? "text-lime-500 ml-1" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validPwd || !pwd ? "hidden" : "text-red-500 ml-1"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                pwdFocus && pwd && !validPwd
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters: !,@,#,$,%.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirm_pwd" value="Confirm Password" />
              <span
                className={
                  validMatch && matchPwd ? "text-lime-500 ml-1" : "hidden"
                }
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validMatch || !matchPwd ? "hidden" : "text-red-500 ml-1"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <TextInput
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="matchnote"
              className={
                matchFocus && !validMatch
                  ? "text-xs rounded-lg bg-black text-azure p-1 relative -bottom-2"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mx-1" />
              Must mutch the first password field.
            </p>
          </div>
          <Button
            type="submit"
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </Button>
          <p>
            Need an Account?
            <span className="inline-block underline font-semibold">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;
