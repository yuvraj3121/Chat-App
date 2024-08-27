import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chats from "./chats";
import ChatArea from "./chatArea";
import "../styles/homePage.css";
import { MdManageAccounts } from "react-icons/md";
import { useSelector } from "react-redux";

import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isClicked, setIsClicked] = useState(false);

  // useEffect(() => {
  //   axios
  //     .post(
  //       "http://localhost:8000/api/v1/users/refresh-token",
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // });

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".userProfile-span") &&
      !e.target.closest(".userProfileDetail-span")
    ) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await axios
      .post(
        `http://localhost:8000/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => console.log("error while logout: ", err));
  };

  if (Object.keys(user).length === 0) {
    return null;
  }

  return (
    <div className="home-div">
      <span className="userProfile-span">
        <p className="userProfilePic" onClick={() => setIsClicked(true)}>
          {user.username[0]}
        </p>
      </span>
      {isClicked && (
        <span className="userProfileDetail-span">
          <span className="userProfilePic-span">{user.username[0]}</span>
          <p>{user.username}</p>
          <p>{user.fullname}</p>
          <span className="profileButtons-span">
            <button onClick={() => navigate("/Account")}>
              Account <MdManageAccounts />
            </button>
            <button onClick={handleLogout}>Logout</button>
          </span>
        </span>
      )}
      <Chats />
      <ChatArea />
    </div>
  );
};

export default HomePage;
