import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";


export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined); // Who are we talking to?

  // 1. Check Login Status & Load User
  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    };
    checkUser();
  }, [navigate]);

  // 2. Setup Socket Connection (We will use this later)
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // 3. Fetch Contacts List
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        
        {/* LOGIC CHANGE HERE */}
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer 
            currentChat={currentChat} 
            currentUser={currentUser} 
            socket={socket} // Pass the socket down!
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  animation: fadeIn 0.5s ease-in;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  align-items: center;
  background: linear-gradient(135deg, #2a2a3e 0%, #1f1f2e 50%, #2d2d40 100%);
  padding: 0;
  margin: 0;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .container {
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 25% 75%;
    background: linear-gradient(135deg, #2a2a3e 0%, #1f1f2e 50%, #2d2d40 100%);
    border-radius: 0;
    overflow: hidden;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.3);
    gap: 0;
    
    @media screen and (min-width: 1200px) and (max-width: 1600px) {
      grid-template-columns: 30% 70%;
    }
    @media screen and (min-width: 900px) and (max-width: 1200px) {
      grid-template-columns: 32% 68%;
    }
    @media screen and (min-width: 720px) and (max-width: 900px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (max-width: 720px) {
      grid-template-columns: 0% 100%;
    }
  }
`;