import './Message.css';

const Message = ({ message, loading }) => {
  let isSentByUser = false;

  if (message.sender === 'user') {
    isSentByUser = true;
  }

  return isSentByUser ? (
    <div className='messageContainer justifyEnd'>
      <div className='messageBox backgroundGreen'>
        <div className='messageText colorWhite'>{message.text}</div>
      </div>
    </div>
  ) : (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
        <div className='messageText colorDark'>{message.text}</div>
      </div>
    </div>
  );
};

export default Message;
