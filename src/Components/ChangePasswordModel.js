import React, { useState } from 'react';
import config from "../config";

const ChangePasswordModal = ({ onClose }) => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleChange = (event) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        });
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        try {
            const response = await fetch(`${config.baseURL}/chnagePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    old_password: passwords.oldPassword,
                    new_password: passwords.newPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                onClose(); // Close modal on successful password change
                alert("Password changed successfully!");
            } else {
                alert(data.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Password change error:", error);
            alert("An error occurred while changing the password.");
        }
    };

    return (
        <div style={{
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
        }}>
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                maxWidth: '500px',
                width: '90%'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}>X</button>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>Old Password:
                        <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 20px)' }} />
                    </label>
                    <label style={{ fontWeight: 'bold' }}>New Password:
                        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 20px)' }} />
                    </label>
                    <label style={{ fontWeight: 'bold' }}>Confirm New Password:
                        <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handleChange} style={{ marginLeft: '10px', padding: '8px', width: 'calc(100% - 20px)' }} />
                    </label>
                    <button type="submit" onClick={handlePasswordChange} style={{
                        padding: '10px 20px',
                        margin: '10px 0',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
