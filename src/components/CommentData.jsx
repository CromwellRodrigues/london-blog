import React, {useState} from 'react'

import { FiEdit, FiTrash2, FiCornerDownRight } from 'react-icons/fi';
import { MdReply } from "react-icons/md";
import Modal from './Modal';

function CommentData({ comment, addReply, deleteComment, editComment }) {
    
    const [reply, setReply] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleReplySubmit = async (e) => {
        e.preventDefault();
        await addReply(comment.id, reply);
        setReply('');
        setShowReplyFrom(false);
    }


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await editComment(comment.id, editedContent);
        setIsEditing(false);
    }


    const handleDeleteClick = () => {
        setIsModalOpen(true);
    }


    const handleDeleteConfirm = () => {
        deleteComment(comment.id);
        setIsModalOpen(false);
    };
    console.log("User picture:", comment.user?.picture);

 
    return (
        <div className="mb-6 capitalize">
            <div className="flex items-start space-x-4">
                
                <img src={
                    comment.user?.picture &&
                        comment.user.picture.trim() !== "" &&
                    !comment.user.picture.includes('gravatar.com/avatar')
                        ? comment.user.picture
                        : '/profile.webp'
                }
                        alt={`${comment.user?.givenName || 'User'}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover filter grayscale"
                   

                />


                <div className="flex-1">
                    <div className="flex justify-between">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {comment.user?.givenName }    
                        </p>
                        <div className="flex items-center space-x-2">

                            {comment.user.id === comment.userId && (
                                <>
                                <button onClick = {() => setIsEditing(true)} 
                                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200" aria-label="Edit">
                                    
                                        <FiEdit />
                                </button>
                                    

                                <button onClick = {handleDeleteClick} 
                                className="text-gray-500 hover:text-red-600 " aria-label="Delete">
                                    
                                            <FiTrash2 />
                                </button>

                                </>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="mt-2">
                            <textarea 
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                                rows="3"
                                required
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                                <button type="button" 
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded-md  dark:text-gray-400 dark:bg-gray-700 "
                                >
                                    Cancel
                                </button>

                                <button type="submit" 
                                
                                    className="px-4 py-2 text-sm  text-white bg-blue-600 rounded-md  "
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-2 text-gray-700 dark:text-gray-400">
                            {comment.content}
                        </p>
                    )}

                    <div className="flex items-center mt-1 space-x-4">
                        <button 
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-sm text-blue-600 hover:underline flex items-center space-x-1" aria-label="Reply"
                        >
                            <MdReply className="mr-1" />
                        </button>

                        {comment.replies?.length > 0 && (
                            <button 
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                                aria-label ="View Replies"
                            >
                                <FiCornerDownRight className= "mr-1 " />
                                
                                {showReplies ? 'Hide Replies' : `View Replies`}
                            </button>
                        )}

                        

                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="mt-4">
                            <textarea 
                                name="reply"
                                placeholder = "Write your reply here..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                                rows="3"
                                required
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                                <button type="button" 
                                    onClick={() => setShowReplyForm(false)}
                                    className="px-4 py-2 text-sm bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400  rounded-md"
                                >
                                    Cancel
                                </button>

                                <button type="submit" 
                               
                                    className="px-4 py-2 text-sm bg-blue-600 text-white  rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                    {showReplies && comment.replies?.length > 0 && (
                        <div className="mt-4 pl-6 border-1-2 border-gray-300 dark:border-gray-700">
                            {comment.replies.map((reply) => (
                                <CommentData
                                    key={reply.id}
                                    comment={reply}
                                    addReply={addReply}
                                    deleteComment={deleteComment}
                                    editComment={editComment} 
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
            />

        </div>

    )

} 

export default CommentData;