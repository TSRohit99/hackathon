"use client"
import toast from 'react-hot-toast';

export const showToastWithCloseButton = (message, type) => {
    const id = toast[type]( 
        <div className="flex justify-between items-center gap-1">
            <span>{message}</span>
            <button
                onClick={() => toast.dismiss(id)}
                className="text-red-500 font-bold ml-4"
            >
                ✕
            </button>
        </div>,
        {
            duration: 10000,
            position: 'top-center',
            style: {
                border: 'none',
                padding: '10px 15px',
                color: '#7F7F7F',
            },
        }
    );
};