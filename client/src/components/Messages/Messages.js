import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ chat, loading }) => (
  <ScrollToBottom className='messages'>
    {chat.map((message, i) => (
      <div className='chat-body' key={i}>
        <Message message={message} loading={loading} />
      </div>
    ))}
  </ScrollToBottom>
);

export default Messages;
