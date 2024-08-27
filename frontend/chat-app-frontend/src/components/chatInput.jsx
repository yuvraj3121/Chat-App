import React, { useEffect, useState } from "react";
import "../styles/chatInput.css";
import { RiSendPlaneFill } from "react-icons/ri";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const ChatInput = ({ addMessage }) => {
  const { chat } = useSelector((state) => state.chat);
  const [input, setInput] = useState({ [chat._id]: "" });

  const handleChange = (e) => {
    setInput({
      ...input,
      [chat._id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = input[chat._id].trim();
    if (content) {
      await axios
        .post(
          `http://localhost:8000/api/v1/message/send/${chat._id}`,
          { content: content },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data.data);
          addMessage(res.data.data);
          setInput({ ...input, [chat._id]: "" });
        })
        .catch((err) => console.log("error sending", err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chatInput-div">
      <input
        type="text"
        placeholder="Type a message"
        value={input[chat._id] || ""}
        onChange={handleChange}
      />
      <span
        type="submit"
        className={input[chat._id] === "" ? "icon-hidden" : "span-icon"}
      >
        <RiSendPlaneFill />
      </span>
    </form>
  );
};

export default ChatInput;
