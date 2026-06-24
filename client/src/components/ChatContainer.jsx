import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  // 1. Fetch History when Chat Changes
  useEffect(() => {
    const fetchHistory = async () => {
      if(currentChat) {
        // We use a custom Room ID logic: "User1_User2"
        // But for this simplified version, we'll just filter by sender/receiver in the backend
        // Wait... our backend route expects a roomId. 
        // Let's generate the roomId here:
        const roomId = [currentUser._id, currentChat._id].sort().join("_");
        
        const response = await axios.get(`${getAllMessagesRoute}/${roomId}`);
        setMessages(response.data);
      }
    };
    fetchHistory();
  }, [currentChat, currentUser]);

  // 2. Handle Sending Message
  const handleSendMsg = async (msg) => {
    const roomId = [currentUser._id, currentChat._id].sort().join("_");

    // A. Send to Backend (Database)
    await axios.post(sendMessageRoute, {
      sender: currentUser._id,
      chatRoomId: roomId, 
      message: msg,
    });

    // B. Send to Socket (Real-time)
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg: msg,
    });

    // C. Update UI instantly
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // 3. Listen for Incoming Messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  // 4. Append Incoming Message to List
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // 5. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${currentChat.username}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${
                  message.fromSelf || message.sender === currentUser._id 
                    ? "sended" 
                    : "recieved"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 8% 84% 8%;
  gap: 0;
  overflow: hidden;
  background: transparent;
  
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
  
  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  @media screen and (min-width: 600px) and (max-width: 720px) {
    grid-template-rows: 15% 70% 15%;
  }
  @media screen and (min-width: 365px) and (max-width: 600px) {
    grid-template-rows: 20% 65% 15%;
  }
  @media screen and (min-width: 320px) and (max-width: 365px) {
    grid-template-rows: 20% 65% 15%;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    background: rgba(15, 15, 30, 0.4);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(138, 43, 226, 0.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0 1rem;
      gap: 1rem;
    }
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      animation: slideIn 0.5s ease;
      min-width: 0;
      
      .avatar {
        img {
          height: 2.2rem;
          width: 2.2rem;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.3);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
      }
      
      &:hover .avatar img {
        box-shadow: 0 0 15px rgba(138, 43, 226, 0.6);
      }
      
      .username {
        h3 {
          color: #e8e8f0;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
  
  .chat-messages {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow: auto;
    padding: 1rem 1.5rem;
    background-color: #0b0b1a;
    background-image: 
      radial-gradient(circle at 30% 70%, rgba(73, 29, 136, 0.4), transparent 60%),
      radial-gradient(circle at 70% 30%, rgba(29, 116, 136, 0.3), transparent 60%),
      url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.9)'/%3E%3Ccircle cx='100' cy='50' r='0.5' fill='rgba(255,255,255,0.4)'/%3E%3Ccircle cx='150' cy='150' r='1.5' fill='rgba(255,255,255,0.7)'/%3E%3Ccircle cx='60' cy='120' r='0.8' fill='rgba(255,255,255,0.5)'/%3E%3Ccircle cx='180' cy='80' r='0.5' fill='rgba(255,255,255,0.6)'/%3E%3Ccircle cx='40' cy='180' r='1' fill='rgba(255,255,255,0.8)'/%3E%3C/svg%3E");
    background-size: 100% 100%, 100% 100%, 250px 250px;
    background-attachment: fixed;
    
    &::-webkit-scrollbar {
      width: 5px;
      &-thumb {
        background: rgba(138, 43, 226, 0.4);
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      &-thumb:hover {
        background: rgba(138, 43, 226, 0.8);
      }
    }
    
    .message {
      display: flex;
      align-items: flex-end;
      animation: fadeIn 0.3s ease;
      width: 100%;
      
      .content {
        max-width: 50%;
        overflow-wrap: break-word;
        padding: 0.6rem 1rem;
        font-size: 0.95rem;
        border-radius: 12px;
        color: #e8e8f0;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        word-break: break-word;
        line-height: 1.4;
        
        &:hover {
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
          transform: translateY(-1px);
        }
        
        @media screen and (max-width: 1080px) {
          max-width: 70%;
        }
        
        @media screen and (max-width: 600px) {
          max-width: 80%;
          padding: 0.5rem 0.8rem;
          font-size: 0.9rem;
        }
      }
    }
    
    .sended {
      justify-content: flex-end;
      width: 100%;
      .content {
        background: linear-gradient(135deg, #8a2be2 0%, #da70d6 100%);
        border-radius: 16px 16px 2px 16px;
        box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
      }
    }
    
    .recieved {
      justify-content: flex-start;
      width: 100%;
      .content {
        background: rgba(29, 116, 136, 0.6);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(29, 116, 136, 0.8);
        color: #ffffff;
        border-radius: 16px 16px 16px 2px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }
    }
  }
`;
