import React, { useState, useRef, useEffect } from 'react';
import HomeGroupChattitle from './HomeGroupChattitle';
import HomeGroupChatfooter from './HomeGroupChatfooter';
import '../css/HomeMessagePage.css';

function HomeMessagePage() {
  const [messages, setMessages] = useState([]);
  const [userMap, setUserMap] = useState({}); // email → fullname

  const bottomRef = useRef(null);
  const previousMessageCountRef = useRef(0);

  // Fetch all users once to get fullname map
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/usernames');
        const data = await res.json();
        // Create email to fullname map
        const map = {};
        data.forEach(({ email, fullname }) => {
          map[email] = fullname;
        });
        setUserMap(map);
      } catch (err) {
        console.error('Failed to load user names:', err);
      }
    };
    fetchUsers();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const userEmail = localStorage.getItem('userEmail');
      const base64Images = await Promise.all(
        newMessage.images.map(async (img) => {
          const response = await fetch(img.preview);
          const blob = await response.blob();
          return await toBase64(blob);
        })
      );

      await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          text: newMessage.text,
          images: base64Images,
          time: newMessage.time,
        }),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // Fetch messages sent by current logged-in user on mount
  useEffect(() => {
    const fetchUserMessages = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const res = await fetch(`http://localhost:5000/api/messages/get/${userEmail}`);
        const data = await res.json();
        const formatted = data.map((msg) => ({
          sender: 'You',
          text: msg.text,
          time: msg.time,
          images: (msg.images || []).map((img) => ({ preview: img })),
        }));
        setMessages(formatted);
        previousMessageCountRef.current = formatted.length;
      } catch (err) {
        console.error('Failed to load user messages:', err);
      }
    };
    fetchUserMessages();
  }, []);

  // Fetch all group messages every 2 seconds, update if new
  useEffect(() => {
    const currentEmail = localStorage.getItem('userEmail');

    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/get');
        const data = await res.json();

        if (!Array.isArray(data)) return;

        const formatted = data.map((msg) => ({
          sender:
            msg.email === currentEmail
              ? 'You'
              : userMap[msg.email] || msg.email, // use fullname or fallback email
          text: msg.text,
          time: msg.time,
          images: (msg.images || []).map((img) => ({ preview: img })),
        }));

        if (formatted.length > previousMessageCountRef.current) {
          setMessages(formatted);
          previousMessageCountRef.current = formatted.length;
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    const intervalId = setInterval(fetchMessages, 2000);
    return () => clearInterval(intervalId);
  }, [userMap]); // <-- Add userMap to deps to fix warning

  return (
    <div className="chat-page">
      <HomeGroupChattitle />

      <div className="message-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.sender === 'You' ? 'sent' : 'received'}`}
          >
            <div className="message-container">
              <div className="message-header">
                <span className="sender-name">{msg.sender}</span>
                <span className="message-time">{msg.time}</span>
              </div>

              <div className="message-bubble">
                {msg.text && <p>{msg.text}</p>}
                {msg.images &&
                  msg.images.map((img, i) => (
                    <img key={i} src={img.preview} alt="sent" className="chat-image" />
                  ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <HomeGroupChatfooter onSendMessage={handleSendMessage} />
    </div>
  );
}

export default HomeMessagePage;
