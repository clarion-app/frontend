import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAndThen } from "../fetchAndThen";
import { LoginAnswerType } from "../types";
import { useAppDispatch } from "../hooks";
import { setToken } from "./tokenSlice";
import { setLoggedInUser } from "./loggedInUserSlice";
import { backendUrl } from "../build/backendUrl";

const LOGIN_API_ENDPOINT = backendUrl + "/api/user/login";

const Login = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const doLogin = (e: any) => {
    e.preventDefault();
    setMessage("");
    const body = {
      email: email,
      password: password,
    };

    postAndThen(LOGIN_API_ENDPOINT, body, (response: LoginAnswerType) => {
      if (response.message !== undefined) {
        setMessage(response.message);
        return;
      }

      if (response.token !== undefined) {
        dispatch(setToken(response.token));
      }

      if (response.user !== undefined) {
        dispatch(
          setLoggedInUser({
            email: response.user.email,
            name: response.user.name,
          })
        );
      }
      const redirectURL = localStorage.getItem("redirectURL");
      localStorage.removeItem("redirectURL");
      console.log("Redirecting to " + redirectURL);
      if (redirectURL) navigate(redirectURL);
      else navigate("/");
    });
  };

  const onEnter = (e: any) => {
    if (e.key !== "Enter") return;
    doLogin(e);
  };

  return (
    <div style={{ height: "100vh", width: "50vh", margin: "auto", padding: "1%" }}>
      <div className="mr-2 has-text-centered">
        <form action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div>
              <label htmlFor="email-address">Email address</label>
              </div>
              <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
          </div>
            <div className="mt-5">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={onEnter}
              />
            </div>
          <div className="mt-5">
            <button
              type="submit"
              className="button is-primary"
              onClick={(e) => doLogin(e)}
            >
              Log in
            </button>
          </div>

          <div className="mt-5">
            <div>{message}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
