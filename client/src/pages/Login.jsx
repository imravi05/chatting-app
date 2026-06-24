import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      console.log("Validation Failed: Username empty"); // DEBUG
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      console.log("Validation Failed: Password empty"); // DEBUG
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("1. Submit Button Clicked"); // DEBUG

    if (validateForm()) {
      console.log("2. Validation Passed. Sending data:", values); // DEBUG
      console.log("3. Target URL:", loginRoute); // DEBUG

      try {
        const { data } = await axios.post(loginRoute, {
          username: values.username,
          password: values.password,
        });

        console.log("4. Server Response:", data); // DEBUG

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (err) {
        console.error("ERROR: Axios Request Failed", err); // DEBUG
        toast.error("Server Error. Is the backend running?", toastOptions);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #2a2a3e 0%, #1f1f2e 50%, #2d2d40 100%);
  animation: fadeIn 0.6s ease;
  padding: 1rem;
  box-sizing: border-box;
  
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
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1 {
      color: #e8e8f0;
      text-transform: uppercase;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 2px;
      
      @media screen and (max-width: 600px) {
        font-size: 1.5rem;
      }
    }
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    background: linear-gradient(135deg, rgba(34, 34, 48, 0.9) 0%, rgba(26, 26, 38, 0.85) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2.5rem 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    width: 100%;
    max-width: 400px;
    
    @media screen and (max-width: 620px) {
      padding: 2rem;
      gap: 1rem;
      max-width: 100%;
    }
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    color: #e8e8f0;
    font-size: 0.95rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    font-family: inherit;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
    
    &:focus {
      border: 1px solid rgba(255, 255, 255, 0.25);
      background-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      outline: none;
    }
  }
  
  button {
    background: linear-gradient(135deg, #4a5a7e 0%, #3d4d6b 100%);
    color: #e8e8f0;
    padding: 0.8rem 2rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
    
    &:hover {
      background: linear-gradient(135deg, #5a6a8e 0%, #4d5d7b 100%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  span {
    color: rgba(232, 232, 240, 0.8);
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    font-size: 0.9rem;
    
    a {
      color: #7a8aba;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.3s ease;
      
      &:hover {
        color: #8a9ac8;
        text-decoration: underline;
      }
    }
  }
`;

export default Login;