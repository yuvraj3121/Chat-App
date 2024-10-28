import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, email, password } = userData;
    if (
      [fullname, username, email, password].some((field) => field.trim() === "")
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://chat-app-v3-s16n.onrender.com/api/v1/users/register",
        {
          fullname,
          username,
          email,
          password,
        }
      );
      console.log(res);
      dispatch(setUser(res.data.data));
      setUserData({ fullname: "", username: "", email: "", password: "" });
      navigate("/");
    } catch (err) {
      console.log("Error registering:", err);
      alert("Registration failed! Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="reg-mainDiv">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullname"
          type="text"
          value={userData.fullname}
          placeholder="Enter your fullname"
          onChange={handleChange}
        />
        <input
          name="username"
          type="text"
          value={userData.username}
          placeholder="Enter your username"
          onChange={handleChange}
        />
        <input
          name="email"
          type="text"
          value={userData.email}
          placeholder="Enter your email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          value={userData.password}
          placeholder="Enter your password"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
        <span>
          Have already an account?{" "}
          <a onClick={() => navigate("/login")}>Login here</a>
        </span>
      </form>
    </div>
  );
};

export default Register;
