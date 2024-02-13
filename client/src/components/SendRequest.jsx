import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';


function SendRequest() {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const { isLoggedIn,check } = useAuth();

    useEffect(()=>{
      check()
  },[])
    const sendRequest = async () => {
        const obj = {
            email: email,
            amount: amount
        };
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.post("http://localhost:3000/sendRequest", obj, config);
            console.log(response.data.message);
            setAmount('')
            setEmail('')
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    return (
        <div className="send-request-container">
            <Header />
            {isLoggedIn ? (
                <div>
                    <h2 style={{backgroundColor:'#0c2447',margin:"0px",color:"white"}}>Send Money Request</h2>
                    <div className="request-form" style={{backgroundColor:'#0c2447',height:"700px"}}>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease"}}
                    />
                    <br />
                        <input
                        type="text"
                        placeholder="Amount"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-field"
                        style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                    />
                    <br />
                        <button onClick={sendRequest} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2440", color: "#fff", transition: "0.5s ease-in-out" }}>Submit</button>
                    </div>
                </div>
            ) : (
                <div>Please log in to send a money request.</div>
            )}
        </div>
    );
}

export default SendRequest;
