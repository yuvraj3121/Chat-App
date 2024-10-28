import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/chatArea.css";
import ChatInput from "./chatInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage } from "../features/chatSlice.js";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { chat, messages } = useSelector((state) => state.chat);
  const [isHovered, setIsHovered] = useState(null);
  const [isClicked, setIsClicked] = useState(null);
  const [editMsg, setEditMsg] = useState({ id: null, content: "" });

  const chatAreaRef = useRef(null);

  console.log(chat);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `https://chat-app-v3-s16n.onrender.com/api/v1/message/getMessages/${chat._id}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setMessages(res.data.data));
    } catch (err) {
      console.log("Error while fetching messages:", err);
    }
  };

  useEffect(() => {
    if (chat && Object.keys(chat).length !== 0) {
      fetchMessages();
    }
  }, [user, chat]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAddMessage = (newMessage) => {
    dispatch(addMessage(newMessage));
  };

  const handleClickOutside = (e) => {
    if (e.target.className !== "hover-span") {
      setIsClicked(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDelete = async (msgId) => {
    await axios
      .delete(
        `https://chat-app-v3-s16n.onrender.com/api/v1/message/delete/${msgId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        fetchMessages();
      })
      .catch((err) => console.log("error deleting msg:", err));
  };

  const handleEdit = async (msgId) => {
    await axios
      .patch(
        `https://chat-app-v3-s16n.onrender.com/api/v1/message/edit/${msgId}`,
        {
          content: editMsg.content,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setEditMsg({ id: null, content: "" });
        fetchMessages();
      })
      .catch((err) => console.log("error deleting msg:", err));
  };

  if (Object.keys(chat).length === 0) {
    return <div className="notChatArea-div"></div>;
  }

  return (
    <div className="chatArea">
      <div className="chatAreaTop-div">{chat.username}</div>
      <div className="chatAreaCenter-div" ref={chatAreaRef}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.senders[0]._id === user._id ? "right" : "left"}
            onMouseEnter={() => setIsHovered(msg._id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {isClicked === msg._id && (
              <span className="clicked-span">
                <span
                  onClick={() => {
                    setEditMsg({ id: msg._id, content: msg.content });
                    console.log(editMsg.content);
                  }}
                >
                  Edit
                </span>
                <span onClick={() => handleDelete(msg._id)}>Delete</span>
              </span>
            )}
            {editMsg.id === msg._id ? (
              <span className="msg">
                <input
                  type="text"
                  value={editMsg.content}
                  onChange={(e) =>
                    setEditMsg({ id: editMsg.id, content: e.target.value })
                  }
                />
                <span className="tick-span" onClick={() => handleEdit(msg._id)}>
                  <TiTick />
                </span>
                <span
                  className="cross-span"
                  onClick={() => setEditMsg({ id: null, content: "" })}
                >
                  <ImCross />
                </span>
              </span>
            ) : (
              <span className="msg">
                {msg.content}
                {isHovered === msg._id && (
                  <span
                    className="hover-span"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsClicked(msg._id);
                    }}
                  >
                    <BsThreeDotsVertical />
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="chatAreaBottom-div">
        <ChatInput addMessage={handleAddMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
