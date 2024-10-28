import React, { useEffect, useState } from "react";
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
  const [searchChat, setSearchChat] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [findUser, setFindUser] = useState("");
  const [newUser, setNewUser] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://chat-app-v3-s16n.onrender.com/api/v1/message/userChats/${user._id}`,
          {
            withCredentials: true,
          }
        );
        // console.log(res.data.data);
        let resChats = [...res.data.data];
        if (searchChat !== "") {
          setChats(
            resChats.filter((chat) =>
              chat.senders.username
                .toLowerCase()
                .includes(searchChat.toLowerCase())
            )
          );
        } else {
          setChats(resChats);
        }
      } catch (err) {
        console.log("Error while fetching messages:", err);
      }
    };
    fetchMessages();
    console.log("chats:", chats);
  }, [searchChat, user._id, newUser]);

  const handleNewChatSubmit = async (e) => {
    e.preventDefault();
    const username = findUser.trim();
    if (username) {
      await axios
        .post(
          "https://chat-app-v3-s16n.onrender.com/api/v1/users/find-user",
          { username: username },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setNewUser(res.data.data);
          setFindUser("");
          setError("");
        })
        .catch((err) => {
          console.log("error while finding user: ", err);
          setError("User not found!");
        });
    }
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
              setNewUser({});
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
          {newUser.username ? (
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
          {chats.map((chat) => (
            <div
              className="chat-div"
              key={chat._id}
              onClick={() => dispatch(setChat(chat.senders))}
            >
              {chat.senders.username}
              {/* {chat.content} */}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Chats;
