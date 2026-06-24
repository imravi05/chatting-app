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
  background: linear-gradient(135deg, rgba(70, 70, 90, 0.15) 0%, rgba(60, 60, 80, 0.1) 100%);
  gap: 1.5rem;
  animation: fadeIn 0.6s ease;
  padding: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    line-height: 1.6;
    color: #e8e8f0;
    
    @media screen and (max-width: 600px) {
      font-size: 1.5rem;
    }
    
    span {
      background: linear-gradient(135deg, #7a8aba 0%, #8a9ac8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
  }
  
  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(232, 232, 240, 0.7);
    text-align: center;
    
    @media screen and (max-width: 600px) {
      font-size: 0.95rem;
    }
  }
  
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
`;