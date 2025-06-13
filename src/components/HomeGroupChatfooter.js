import React, { useState, useRef } from 'react';
import '../css/HomeGroupChatfooter.css';

function HomeGroupChatfooter({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

 const handleSend = () => {
  if (message.trim() || images.length > 0) {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessage = {
      sender: 'You', // or 'me', for clarity
      text: message.trim(),
      images: images,
      time: currentTime,
    };

    if (typeof onSendMessage === 'function') {
      onSendMessage(newMessage);
    }

    setMessage('');
    setImages([]);
    setShowPreview(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(selected);
    setShowPreview(true);
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Fullscreen Preview */}
      {showPreview && (
        <div className="fullscreen-preview">
          <div className="image-scroll-container">
            {images.map((img, index) => (
              <img key={index} src={img.preview} alt={`Preview ${index}`} />
            ))}
          </div>
          <button className="fullscreen-send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      )}

      {/* Input Footer */}
      {!showPreview && (
        <div className="footer-input-container">
          <div className="message-box">
            <img src="./images/smile.png" alt="Emoji" />

            <input
              type="text"
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
              autoFocus
            />

            <img
              src="./images/photo.png"
              alt="Select photos"
              onClick={handlePhotoClick}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <button className="send-button" onClick={handleSend}>
            <img src="./images/Icon.png" alt="Send" />
          </button>
        </div>
      )}
    </>
  );
}

export default HomeGroupChatfooter;
