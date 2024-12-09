import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white dark:bg-zinc-800 w-full max-w-lg p-6 rounded-lg shadow-lg">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                    <AiOutlineClose size={20} />
                </button>

                {/* Modal Content */}
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
