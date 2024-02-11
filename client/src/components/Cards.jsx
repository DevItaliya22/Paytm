import React from 'react';

function Card({ username, email, balance,number,transaction }) {
    return (
        <div >
            <div className="card" style={{backgroundColor:'#19376d',width:"333px",height:'300px',border:'2px #576cbc solid',margin:"20px",color:"white",fontWeight:"500"}}>
                <h2>{username}</h2>
                <p>Email: {email}</p>
                <p>Balance: {balance}</p>
                <p>Number: {number}</p>
                <p>Total Transactions:{transaction}</p>
            </div>
        </div>
    );
}

export default Card;
