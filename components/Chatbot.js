"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chatbot.module.css';
import Image from 'next/image';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Assalamualaikum! Ada yang bisa saya bantu seputar Yayasan Al Mubarak?' }
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
    <div className={styles.chatbotContainer}>
      {/* TOMBOL CHAT: KEMBALI PAKAI IMAGE */}
      <button 
        className={styles.chatBubble} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          // Ikon Close kita kecilkan ukurannya di sini (20x20)
          <Image src="/icons/close.svg" alt="Tutup" width={20} height={20} />
        ) : (
          // Ikon Chat ukuran standar
          <Image src="/icons/chat-ai.svg" alt="Buka Chat" width={32} height={32} />
        )}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>AI Assistant Al Mubarak</h3>
            <p>Ditenagai oleh Google AI</p>
          </div>
          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.aiMessage}`}>
                <div className={styles.loadingDots}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.chatForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa saja..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              <Image src="/icons/send.svg" alt="Kirim" width={24} height={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}