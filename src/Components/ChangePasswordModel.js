import React from "react";

// Define the modalStyles object with CSS properties
const modalStyles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        maxWidth: '500px',
        width: '90%'
    },
    closeButton: {
        position: 'absolute',
        right: '10px',
        top: '10px',
        border: 'none',
        background: 'none',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

const ChangePasswordModal = ({ onClose, children }) => {
    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.content}>
                <button onClick={onClose} style={modalStyles.closeButton}>X</button>
                {children}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
