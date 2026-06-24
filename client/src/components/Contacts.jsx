import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && (
        <Container>
          <div className="brand">
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={index}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  {/* Avatar Placeholder (Use Initials if no image) */}
                  <div className="avatar">
                    <img
                      src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${contact.username}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${currentUserName}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background: linear-gradient(135deg, #222230 0%, #1a1a25 100%);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  
  @media screen and (max-width: 720px) {
    grid-template-rows: 8% 70% 22%;
  }
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    background: linear-gradient(90deg, #3a3a4e 0%, #2d2d3e 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    
    h3 {
      color: #e8e8f0;
      text-transform: uppercase;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
      
      @media screen and (max-width: 600px) {
        font-size: 1rem;
      }
    }
  }
  
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.6rem;
    padding: 0.8rem 0;
    background: linear-gradient(180deg, rgba(34, 34, 48, 0.8) 0%, rgba(26, 26, 38, 0.9) 100%);
    
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
    
    .contact {
      background: linear-gradient(135deg, rgba(70, 70, 90, 0.4) 0%, rgba(60, 60, 80, 0.3) 100%);
      backdrop-filter: blur(10px);
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.6rem 0.8rem;
      display: flex;
      gap: 0.8rem;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      
      &:hover {
        background: linear-gradient(135deg, rgba(80, 80, 110, 0.5) 0%, rgba(70, 70, 100, 0.4) 100%);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      
      .avatar {
        img {
          height: 2.2rem;
          width: 2.2rem;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
      }
      
      &:hover .avatar img {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
        transform: scale(1.05);
      }
      
      .username {
        h3 {
          color: #d8d8e0;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.3s ease;
        }
      }
    }
    
    .selected {
      background: linear-gradient(135deg, rgba(80, 100, 130, 0.6) 0%, rgba(70, 90, 120, 0.5) 100%);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      
      .username h3 {
        color: #ffffff;
        font-weight: 700;
      }
    }
  }

  .current-user {
    background: linear-gradient(135deg, #1a1a25 0%, #222230 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
    padding: 0.8rem;
    flex-wrap: wrap;
    
    @media screen and (max-width: 600px) {
      gap: 1rem;
      padding: 0.6rem;
    }
    
    .avatar {
      img {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
        flex-shrink: 0;
      }
      
      &:hover img {
        box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
        transform: scale(1.05);
      }
    }
    
    .username {
      h2 {
        color: #e8e8f0;
        font-weight: 600;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      }
      
      @media screen and (max-width: 600px) {
        h2 {
          font-size: 0.85rem;
          max-width: 100px;
        }
      }
    }
  }
`;