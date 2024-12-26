import React from 'react';
import { Menu } from 'lucide-react';

const ChatToolbar = ({ chatName }) => {
  return (
    <div className="flex justify-between p-4 h-12 items-center w-full bg-gray-700   shadow-md">
      <div>
        <h2 className="text-xl font-bold text-white">{chatName}</h2>
      </div>
      <button className="text-gray-300 hover:text-white focus:outline-none bg-gray-700">
        <Menu size={20} />
      </button>
    {/* <button className="text-gray-300 hover:text-white focus:outline-none bg-gray-700" onClick={() => navigate('/join/:joinLink')}>
      Join Chat Room
    </button> */}
    
    </div>
  );
};

export default ChatToolbar;