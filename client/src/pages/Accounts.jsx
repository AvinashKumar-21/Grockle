import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate, useParams } from "react-router";
import { AccountsNav } from "../components/AccountsNav";
import { UserContext } from "../UserContext";
import { Places } from "./Places";

export const Accounts = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  let { subpage } = useParams();

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }
  if (subpage === undefined) {
    subpage = "profile";
  }
  if (!ready) return "Loading...";
  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountsNav />
      {subpage === "profile" && (
        <div className=" text-center max-w-lg mx-auto">
          {" "}
          Logged in as {user.name}. Email: {user.email}
          <div className="mt-2">
            <button className="primary max-w-sm" onClick={logout}>
              Log out
            </button>{" "}
          </div>
        </div>
      )}
      {subpage === "places" && (
        <>
          <Places />
        </>
      )}
    </div>
  );
};
