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
  color: white;
  flex-direction: column;
  span {
    color: #4e0eff;
  }
`;