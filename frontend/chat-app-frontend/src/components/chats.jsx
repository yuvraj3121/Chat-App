import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/chats.css";
import { RiChatNewLine } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../features/chatSlice.js";

const Chats = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [chats, setChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [searchChat, setSearchChat] = useState("");

  const [newChat, setNewChat] = useState(false);
  const [findUser, setFindUser] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://chat-app-v4.onrender.com/api/v1/message/userChats/${user._id}`,
        { withCredentials: true }
      );
      setAllChats(res.data.data);
      setChats(res.data.data);
    } catch (err) {
      console.log("Error while fetching messages:", err);
    }
  }, [user._id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (searchChat.trim()) {
      setChats(
        allChats.filter((chat) =>
          chat.senders.username.toLowerCase().includes(searchChat.toLowerCase())
        )
      );
    } else {
      setChats(allChats);
    }
  }, [searchChat, allChats]);

  const handleNewChatSubmit = async (e) => {
    e.preventDefault();
    const username = findUser.trim();
    if (!username) return;

    try {
      const res = await axios.post(
        "https://chat-app-v4.onrender.com/api/v1/users/find-user",
        { username },
        { withCredentials: true }
      );
      setNewUser(res.data.data);
      setError("");
    } catch (err) {
      setNewUser(null);
      setError("User not found!");
    }
    setFindUser("");
  };

  return (
    <div className="chats-div">
      {newChat ? (
        <>
          <h2>New Chat</h2>
          <span
            className="newChat-span"
            onClick={() => {
              setNewChat(false);
              setNewUser(null);
              setError("");
              setFindUser("");
            }}
          >
            <ImCross />
          </span>

          <form onSubmit={handleNewChatSubmit}>
            <input
              type="text"
              value={findUser}
              placeholder="Search username"
              onChange={(e) => {
                setFindUser(e.target.value);
                setError("");
              }}
            />
          </form>

          {newUser ? (
            <div
              className="chat-div"
              onClick={() => {
                dispatch(setChat(newUser));
                setNewUser(null);
                setNewChat(false);
              }}
            >
              {newUser.username}
            </div>
          ) : (
            error && <div className="error-div">{error}</div>
          )}
        </>
      ) : (
        <>
          <h2>Chats</h2>
          <span className="newChat-span" onClick={() => setNewChat(true)}>
            <RiChatNewLine />
          </span>

          <input
            value={searchChat}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchChat(e.target.value)}
          />

          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                className="chat-div"
                key={chat._id}
                onClick={() => dispatch(setChat(chat.senders))}
              >
                {chat.senders.username}
              </div>
            ))
          ) : (
            <p className="no-chats">No chats found</p>
          )}
        </>
      )}
    </div>
  );
};

export default Chats;
