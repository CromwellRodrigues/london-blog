"use client";

import React, { useState } from 'react'

const CommentForm = ({ handleSubmitComment }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleSubmitComment(comment);
        setComment('');


     
    }
  return (
      <form onSubmit={handleSubmit} className="mb-6">
          
          <textarea name="comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                placeholder="Write your comment here..."
              rows="4"
              required
          />

          <div className="flex justify-end mt-4">
              <button type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              >
                  Submit Comment
              </button>
        </div>  
              
        </form>
  )
}

export default CommentForm