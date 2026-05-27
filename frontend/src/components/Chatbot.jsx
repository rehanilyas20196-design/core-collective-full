import React from 'react';
import Messages from './Messages';

const Chatbot = ({ setPage, handleBack }) => {
  return <Messages setPage={setPage} handleBack={handleBack} />;
};

export default Chatbot;
