import React, { useState } from "react";
import { UserType } from "../types";
import { useAddUserMutation } from "./userApi";
import { useAppDispatch } from "../hooks";
import { setToken } from "./tokenSlice";
import { setLoggedInUser } from "./loggedInUserSlice";

export const NewUser = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setCPassword] = useState("");
  const [page, setPage] = useState(1);
  const [addUser] = useAddUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user: Partial<UserType> = {
      name: name,
      email: email,
      password: password,
      c_password: c_password,
    };
    
    const result = await addUser(user);
    if (result.data?.token) {
      dispatch(setToken(result.data.token));
    }
    if (result.data?.user) {
      dispatch(
        setLoggedInUser({
          name: result.data.user.name,
          email: result.data.user.email,
        })
      );
    }
  };

  const nextPage = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(page + 1);
  };

  const prevPage = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(page - 1);
  };

  return (
    <div style={{ height: "100vh", width: "50vh", margin: "auto", padding: "1%" }}>
      <form>
        {page === 1 && (
          <>
            <h2 className="title">Who are you?</h2>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </>
        )}
        {page === 2 && (
          <>
            <h2 className="title">What is your email address, {name}?</h2>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </>
        )}
        {page === 3 && (
          <>
            <h2 className="title">Choose a password</h2>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </>
        )}
        {page === 4 && (
          <>
            <h2 className="title">Confirm your password</h2>
            <input
              className="input"
              type="password"
              value={c_password}
              onChange={(e) => setCPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </>
        )}
        {page === 5 && (
          <>
            <h2 className="title">Finish account creation</h2>
            <button type="submit" className="button" onClick={(e) => handleSubmit(e)}>Submit</button>
          </>
        )}
        <div className="mt-5">
        <button onClick={(e) => prevPage(e)} disabled={page <= 1 ? true : false} className="button mr-2">Previous</button>
        <button onClick={(e) => nextPage(e)} disabled={page >= 5 ? true : false} className="button">Next</button>
        </div>
      </form>
    </div>
  );
};
