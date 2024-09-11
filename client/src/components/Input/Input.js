import './Input.css';

const Input = ({ question, sendQuestion, setQuestion }) => {
  return (
    <form onSubmit={sendQuestion} className='chat-footer'>
      <input
        type='text'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder='Ask a Question:'
      />
      <button type='submit'>Send</button>
    </form>
  );
};

export default Input;
