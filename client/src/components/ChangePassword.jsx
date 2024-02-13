
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

function ChangePassword() {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [password3, setPassword3] = useState('');
    const { isLoggedIn ,check} = useAuth();

    const updatePassword = async () => {
        const obj = {
            old_password: password1,
            new_password1: password2,
            new_password2: password3
        };
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.post("http://localhost:3000/updatePassword", obj, config);
            console.log(response.data.message);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };
    useEffect(()=>{
        check()
    },[])
    
    return (
        <div className="change-password-container">
            <Header />
            {isLoggedIn ? (
                <div>
                    <h2 style={{backgroundColor:'#0c2447',margin:"0px",color:"white"}}>Change Password</h2>
                    <div className="password-form" style={{backgroundColor:'#0c2447',height:"700px"}}>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease"}}
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={password3}
                            onChange={(e) => setPassword3(e.target.value)}
                            style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                        />
                        <br />
                        <button onClick={updatePassword} style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2440", color: "#fff", transition: "0.5s ease-in-out" }}>Update Password</button>
                    </div>
                </div>
            ) : (
                <div>Please log in to change your password.</div>
            )}
        </div>
    );
}

export default ChangePassword;
