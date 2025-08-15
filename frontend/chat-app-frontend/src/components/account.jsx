import React, { useEffect, useState } from "react";
import "../styles/account.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
  });

  const [originalData, setOriginalData] = useState(userData);
  const [clickPass, setClickPass] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "https://chat-app-v4.onrender.com/api/v1/users/current-user",
        { withCredentials: true }
      );
      setUserData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.log("Error while getting current user:", err);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (clickEdit) {
      try {
        await axios.patch(
          "https://chat-app-v4.onrender.com/api/v1/users/update-account",
          {
            username: userData.username,
            fullname: userData.fullname,
            email: userData.email,
          },
          { withCredentials: true }
        );
        setOriginalData(userData);
        console.log("Account updated successfully");
      } catch (err) {
        console.log("Error while editing info:", err);
      }
    } else {
      setOriginalData(userData);
    }
    setClickEdit(!clickEdit);
  };

  const handleEditCancel = () => {
    setUserData(originalData);
    setClickEdit(false);
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassToggle = async () => {
    if (clickPass) {
      try {
        const res = await axios.post(
          "https://chat-app-v4.onrender.com/api/v1/users/change-password",
          {
            currentPassword: passData.currentPassword,
            newPassword: passData.newPassword,
          },
          { withCredentials: true }
        );
        alert(res.data.message);
        setPassData({ currentPassword: "", newPassword: "" });
      } catch (err) {
        console.log("Error while changing password:", err);
      }
    }
    setClickPass(!clickPass);
  };

  const handlePassCancel = () => {
    setPassData({ currentPassword: "", newPassword: "" });
    setClickPass(false);
  };

  return (
    <div className="account-div">
      <h1>Account</h1>
      <span className="naviHome-span" onClick={() => navigate("/")}>
        Home
      </span>

      <div className="info-div">
        <span className="profilePic">
          {userData.username ? userData.username[0].toUpperCase() : ""}
        </span>

        <p>
          Username:{" "}
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>
        <p>
          Fullname:{" "}
          <input
            type="text"
            name="fullname"
            value={userData.fullname}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>
        <p>
          Email:{" "}
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>

        <div className="accountButton-div">
          <button onClick={handleEditToggle}>
            {clickEdit ? "Save" : "Edit"}
          </button>
          {clickEdit && <button onClick={handleEditCancel}>Cancel</button>}
        </div>
      </div>

      <div className="password-div">
        <div className="accountButton-div">
          <button onClick={handlePassToggle}>
            {clickPass ? "Save" : "Change Password"}
          </button>
          {clickPass && <button onClick={handlePassCancel}>Cancel</button>}
        </div>

        {clickPass && (
          <div className="passInput-div">
            <p>
              Current Password:{" "}
              <input
                type="password"
                name="currentPassword"
                value={passData.currentPassword}
                onChange={handlePassChange}
              />
            </p>
            <p>
              New Password:{" "}
              <input
                type="password"
                name="newPassword"
                value={passData.newPassword}
                onChange={handlePassChange}
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
