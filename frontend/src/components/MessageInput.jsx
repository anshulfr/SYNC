import React, { useState } from 'react'
import { Send } from 'lucide-react'

const MessageInput = ({ onSendMessage }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    
    onSendMessage(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4 bg-gray-800 rounded-b-lg">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-gray-700"
        />
        <button 
          type="submit"
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  )
}

export default MessageInput