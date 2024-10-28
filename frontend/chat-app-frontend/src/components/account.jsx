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
  const [clickPass, setClickPass] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);
  const [editData, setEditData] = useState({ userData });
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const getCurrentUser = async () => {
    await axios
      .post(
        "https://chat-app-v3-s16n.onrender.com/api/v1/users/current-user",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log(res.data.data);
        setUserData(res.data.data);
      })
      .catch((err) => console.log("error while getting current user : ", err));
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSave = async () => {
    setEditData(userData);
    if (clickEdit) {
      // console.log("save");
      // console.log(userData);
      await axios
        .patch(
          "https://chat-app-v3-s16n.onrender.com/api/v1/users/update-account",
          {
            username: userData.username,
            fullname: userData.fullname,
            email: userData.email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log("error while editing info:", err));
    }
    setClickEdit(!clickEdit);
  };

  const handleEditCancel = () => {
    setUserData(editData);
    setClickEdit(!clickEdit);
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePassSave = async () => {
    if (clickPass) {
      console.log(passData);
      await axios
        .post(
          "https://chat-app-v3-s16n.onrender.com/api/v1/users/change-password",
          {
            currentPassword: passData.currentPassword,
            newPassword: passData.newPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          alert(res.data.message);
        })
        .catch((err) => console.log("error while editing info:", err));
      setPassData({ currentPassword: "", newPassword: "" });
    }
    setClickPass(!clickPass);
  };

  const handlePassCancel = () => {
    setPassData({ currentPassword: "", newPassword: "" });
    setClickPass(!clickPass);
  };

  return (
    <div className="account-div">
      <h1>Account</h1>
      <span className="naviHome-span" onClick={() => navigate("/")}>
        Home
      </span>
      <div className="info-div">
        <span className="profilePic">{userData.username[0]}</span>
        <p>
          Username :{" "}
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>
        <p>
          Fullname :{" "}
          <input
            type="text"
            name="fullname"
            value={userData.fullname}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>
        <p>
          Email :{" "}
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleEditChange}
            disabled={!clickEdit}
          />
        </p>
        <div className="accountButton-div">
          <button onClick={handleEditSave}>
            {clickEdit ? "Save" : "Edit"}
          </button>
          {clickEdit && <button onClick={handleEditCancel}>Cancel</button>}
        </div>
      </div>
      <div className="password-div">
        <div className="accountButton-div">
          <button onClick={handlePassSave}>
            {clickPass ? "Save" : "Change Password"}
          </button>
          {clickPass && <button onClick={handlePassCancel}>Cancel</button>}
        </div>
        {clickPass && (
          <div className="passInput-div">
            <p>
              Current Password :{" "}
              <input
                type="password"
                name="currentPassword"
                value={passData.currentPassword}
                onChange={handlePassChange}
              />
            </p>
            <p>
              New Password :{" "}
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
