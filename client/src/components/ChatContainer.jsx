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
  background: linear-gradient(135deg, #222230 0%, #1a1a25 100%);
  
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
    background: linear-gradient(90deg, rgba(70, 70, 90, 0.2) 0%, rgba(60, 60, 80, 0.15) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
      }
      
      &:hover .avatar img {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
      }
      
      .username {
        h3 {
          color: #e8e8f0;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
    background: linear-gradient(180deg, rgba(34, 34, 48, 0.6) 0%, rgba(26, 26, 38, 0.8) 100%);
    
    &::-webkit-scrollbar {
      width: 5px;
      &-thumb {
        background: rgba(100, 100, 120, 0.6);
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      &-thumb:hover {
        background: rgba(120, 120, 150, 0.8);
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        word-break: break-word;
        line-height: 1.4;
        
        &:hover {
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
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
        background: linear-gradient(135deg, #4a5a7e 0%, #3d4d6b 100%);
        border-radius: 12px 12px 2px 12px;
      }
    }
    
    .recieved {
      justify-content: flex-start;
      width: 100%;
      .content {
        background: linear-gradient(135deg, rgba(80, 80, 110, 0.4) 0%, rgba(70, 70, 100, 0.3) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #d8d8e8;
        border-radius: 12px 12px 12px 2px;
      }
    }
  }
`;
