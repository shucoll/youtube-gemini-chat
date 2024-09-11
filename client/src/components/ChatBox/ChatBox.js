import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';

import Loader from '../Loader/Loader';

import './ChatBox.css';

let socket;

function ChatBox({ videoId }) {
  const [socketState, setSocketState] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [isContextSet, setIsContextSet] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket = io('http://localhost:4000');

    socket.on('connect', () => {
      setSocketState(true);
    });

    socket.on('contextSet', (message) => {
      const textMessage = message.response.candidates[0].content.parts[0].text;

      setChat((prevChat) => [
        ...prevChat,
        { sender: 'system', text: textMessage },
      ]);

      setChat((prevChat) => [
        ...prevChat,
        {
          sender: 'system',
          text: "This is a small summary of what the video is about. I'm here for any further questions that you have.",
        },
      ]);

      setLoading(false);
      setIsContextSet(true);
    });

    socket.on('response', (response) => {
      const textMessage = response.response.candidates[0].content.parts[0].text;

      setChat((prevChat) => [
        ...prevChat,
        { sender: 'system', text: textMessage },
      ]);
      setLoading(false);
    });

    socket.on('error', (error) => {
      setChat((prevChat) => [...prevChat, { sender: 'system', text: error }]);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketState && videoId) {
      socket.emit('setContext', videoId);
    }
  }, [socketState, videoId]);

  const sendQuestion = (e) => {
    e.preventDefault();
    if (socketState && question) {
      socket.emit('askQuestion', question);
      setChat((prevChat) => [...prevChat, { sender: 'user', text: question }]);
      setQuestion('');
      setLoading(true);
    }
  };

  return (
    <div className='chatbot-container'>
      <div className='chat-header'>Youtube Chat</div>

      {!isContextSet ? (
        <div className='context-loader-container'>
          <Loader size='60px' center />
          <h4>Retrieving video transcript and setting context</h4>
        </div>
      ) : (
        <>
          <Messages chat={chat} loading={loading} />
          {loading ? (
            <div className='loader-container'>
              <Loader />
            </div>
          ) : null}
          <Input
            question={question}
            setQuestion={setQuestion}
            sendQuestion={sendQuestion}
          />
        </>
      )}
    </div>
  );
}

export default ChatBox;
