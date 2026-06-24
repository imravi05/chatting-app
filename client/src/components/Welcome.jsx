import React from "react";
import styled from "styled-components";
// import Robot from "../assets/robot.gif"; // You can remove this import if you don't have a GIF

export default function Welcome({ currentUser }) {
  return (
    <Container>
      {/* <img src={Robot} alt="" />  <-- Uncomment if you add an image later */}
      <h1>
        Welcome, <span>{currentUser?.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e8e8f0;
  flex-direction: column;
  background: transparent;
  gap: 1.5rem;
  animation: fadeIn 0.6s ease;
  padding: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    text-align: center;
    line-height: 1.6;
    color: #e8e8f0;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    
    @media screen and (max-width: 600px) {
      font-size: 1.5rem;
    }
    
    span {
      background: linear-gradient(135deg, #da70d6 0%, #8a2be2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
    }
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(232, 232, 240, 0.8);
    text-align: center;
    
    @media screen and (max-width: 600px) {
      font-size: 0.95rem;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;