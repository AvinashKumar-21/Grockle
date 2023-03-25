import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  async function loginSubmit(ev) {
    ev.preventDefault();
    try {
      const userInfo = await axios.post("/login", { email, password });
      setUser(userInfo.data);
      setRedirect(true);
    } catch (e) {
      alert("Login Failed");
    }
  }
  if (redirect) return <Navigate to={"/"} />;
  return (
    <div className="mt-2 grow flex items-center justify-around">
      <div className="">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="text-blue-500 underline" to="/register">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
