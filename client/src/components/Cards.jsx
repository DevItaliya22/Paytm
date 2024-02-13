import React from 'react';
import axios from 'axios';

function Card({ username, email, balance, number, transaction, password }) {
    
    const handleAddFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:3000/addfriends",  {email:email} , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.message); 
        } catch (error) {
            console.error("Error adding friend:", error);
            
        }
    };

    return (
        <div>
            <div className="card" style={{ backgroundColor: '#19376d', width: "333px", height: '300px', border: '2px #576cbc solid', margin: "20px", color: "white", fontWeight: "500" }}>
                <h2>{username}</h2>
                <p>Email: {email}</p>
                <p>Balance: {balance}</p>
                <p>Number: {number}</p>
                <p>Total Transactions:{transaction}</p>
                <p>Password:{password}</p>
                <button onClick={handleAddFriend} className="submit-btn" style={{ width: "300px",padding:'10px',margin: "0px auto", border: "none", borderRadius: "5px", backgroundColor: "#576cbc", color: "#fff", transition: "0.5s ease-in-out" }}>Add Friend</button>
            </div>
        </div>
    );
}

export default Card;
