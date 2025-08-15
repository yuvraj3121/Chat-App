import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;
    if ([username, email, password].some((field) => field.trim() === "")) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://chat-app-v4.onrender.com/api/v1/users/login",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.data.user));
      setUserData({ username: "", email: "", password: "" });
      navigate("/");
    } catch (err) {
      alert("Invalid email or password!!");
      console.log("Error logging in:", err);
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
    <div className="log-mainDiv">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <span>
          Not registered?{" "}
          <a onClick={() => navigate("/register")}>Create an account</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
