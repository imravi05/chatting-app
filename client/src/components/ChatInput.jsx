import React, { useState } from "react";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          Send
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 100%;
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(138, 43, 226, 0.2);
  
  @media screen and (max-width: 720px) {
    padding: 0.8rem 1rem;
  }
  
  @media screen and (max-width: 600px) {
    padding: 0.6rem 0.8rem;
  }
  
  .input-container {
    width: 100%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(20, 20, 40, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(138, 43, 226, 0.3);
    padding: 0.5rem 1.2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4),
                inset 0 1px 2px rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    
    &:focus-within {
      background: rgba(30, 30, 60, 0.6);
      border-color: rgba(138, 43, 226, 0.8);
      box-shadow: 0 0 20px rgba(138, 43, 226, 0.4),
                  inset 0 1px 2px rgba(255, 255, 255, 0.08);
    }
    
    input {
      width: 90%;
      height: 40px;
      background-color: transparent;
      color: #e8e8f0;
      border: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      &::selection {
        background-color: rgba(138, 43, 226, 0.4);
      }
      
      &:focus {
        outline: none;
      }
    }
    
    button {
      padding: 0.5rem 1.2rem;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #8a2be2 0%, #da70d6 100%);
      border: none;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
      white-space: nowrap;
      flex-shrink: 0;
      
      &:hover {
        background: linear-gradient(135deg, #9a3bf2 0%, #ea80e6 100%);
        box-shadow: 0 0 15px rgba(138, 43, 226, 0.6);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
        box-shadow: 0 0 5px rgba(138, 43, 226, 0.4);
      }
      
      @media screen and (max-width: 720px) {
        padding: 0.4rem 1rem;
        font-size: 0.8rem;
      }
      
      @media screen and (max-width: 600px) {
        padding: 0.35rem 0.8rem;
        font-size: 0.75rem;
      }
    }
  }
`;