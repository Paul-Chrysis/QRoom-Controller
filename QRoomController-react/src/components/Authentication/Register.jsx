import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateToken } from "../../features/Userdetails/UserDetailsSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import Logo from "../thirdLayer/Logo";

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
  const location = useLocation();
  const from = location.state?.from?.pathname || "/scanQR";
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
        }
      );
      const token = response?.data?.token;
      setAuth({ user, pwd, token });
      dispatch(updateToken(token));
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
    <div className="wrapper">
      <Logo />
      <section className="auth-form">
        <p ref={errorRef} className={errorMsg ? "errmsg" : "hide"}>
          {errorMsg}
        </p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username:
            <span className={validName ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validName || !user ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
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
              userFocus && user && !validName ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 23 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores and hyphens allowed.
          </p>

          <label htmlFor="firstname">
            First name:
            <span className={validFirst ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validFirst || !first ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
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
              firstFocus && first && !validFirst ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            3 to 15 characters.
            <br />
            Must begin with an upercase letter and continue with lowercase
            letters.
            <br />
            Numbers, and special characters are not allowed.
          </p>

          <label htmlFor="lastname">
            Last name:
            <span className={validLast ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validLast || !last ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
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
              lastFocus && last && !validLast ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            3 to 15 characters.
            <br />
            Must begin with an upercase letter and continue with lowercase
            letters.
            <br />
            Numbers, and special characters are not allowed.
          </p>

          <label htmlFor="email">
            Email:
            <span className={validEmail ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validEmail || !email ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
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
              lastFocus && last && !validLast ? "instructions" : "hide"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must be valid email.
          </p>

          <label htmlFor="password">
            Password:
            <span className={validPwd ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPwd || !pwd ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            required
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p
            id="pwdnote"
            className={pwdFocus && pwd && !validPwd ? "instructions" : "hide"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters: !,@,#,$,%.
          </p>

          <label htmlFor="confirm_pwd">
            Confirm password:
            <span className={validMatch && matchPwd ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            required
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            id="matchnote"
            className={matchFocus && !validMatch ? "instructions" : "hide"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must mutch the first password field.
          </p>

          <button
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?
          <span className="line">
            <Link to="/login">Sign In</Link>
          </span>
        </p>
      </section>
    </div>
  );
};

export default Register;
