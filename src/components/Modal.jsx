import React from 'react';


function Modal({ isOpen, onClose, onConfirm, title, message }) {

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative z-10 max-w-md w-11/12 md:w=1/3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{message}</p>
            <div className="flex justify-end mt-4 space-x-4">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Delete
            </button>
            </div>
        </div>
        </div>
    );
}

export default Modal;