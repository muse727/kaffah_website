"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chatbot.module.css';
import Image from 'next/image';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Assalamualaikum! Ada yang bisa saya bantu seputar Yayasan Al Mubarak?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        throw new Error('Gagal merespons. Coba lagi.');
      }

      const result = await response.json();
      setMessages((prev) => [...prev, { role: 'ai', text: result.text }]);

    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button 
        className={`${styles.chatBubble} ${isOpen ? styles.chatBubbleHidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className={styles.bubbleContent}>
          {isOpen ? (
            <Image src="/icons/close.svg" alt="Tutup" width={24} height={24} />
          ) : (
            <>
              <Image src="/icons/chat-ai.svg" alt="Buka Chat" width={24} height={24} />
              <span className={styles.notificationPulse}></span>
            </>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowVisible : ''}`}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerContent}>
            <div className={styles.botAvatar}>
              <Image src="/icons/chat-ai.svg" alt="AI" width={20} height={20} />
            </div>
            <div className={styles.headerText}>
              <h3>AI Assistant Al Mubarak</h3>
              <p>Ditenagai oleh Google AI</p>
            </div>
          </div>
          <button 
            className={styles.minimizeBtn}
            onClick={() => setIsOpen(false)}
          >
            <Image src="/icons/minimize.svg" alt="Minimize" width={18} height={18} />
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messageList}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${
                msg.role === 'user' ? styles.userMessage : styles.aiMessage
              } ${styles.messageSlideIn}`}
            >
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className={styles.scrollAnchor} />
        </div>

        {/* Input Form */}
        <form className={styles.chatForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa saja..."
              disabled={loading}
              className={styles.messageInput}
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ''}`}
            >
              <Image src="/icons/send.svg" alt="Kirim" width={30} height={25} />
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}