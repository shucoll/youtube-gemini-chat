import React, { useState, useEffect } from 'react';
import './App.css';

import ChatBox from './components/ChatBox/ChatBox';

function App() {

  //For development mode
  // const [currentTabUrl, setCurrentTabUrl] = useState('Azvc28Mjgy8');

  // Not for development mode. Only works as chrome extension
  const [currentTabUrl, setCurrentTabUrl] = useState('');
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        console.log(tabs[0].url);
        setCurrentTabUrl(tabs[0].url);
      }
    });
  }, []);

  return <ChatBox videoId={currentTabUrl} />;
}

export default App;
