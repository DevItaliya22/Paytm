import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

function Transactions() {
    const { isLoggedIn,check } = useAuth();
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [password, setPassword] = useState('');
    const [isViewable, setIsViewable] = useState(false);

    useEffect(() => {
        const getTransactions = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Please login first");
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const res = await axios.get('http://localhost:3000/transactions', config);
                setTransactions(res.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };
        getTransactions();
    }, []);
    useEffect(()=>{
        check()
    },[])
    const handleSubmit = () => {
        if (password === "123") {
            setIsViewable(true);
        } else {
            setIsViewable(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#0b2447" }}>
            <Header />

            {isLoggedIn && isViewable ? (
                <div className="transactions" style={{ display: 'flex', flexDirection: 'column' }}>
                    {transactions.map((transaction, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: '#0b2447',
                                color: "#fff",
                                padding: "10px",
                                margin: "5px",
                                borderRadius: '5px',
                                transition: "0.5s ease-in-out"
                            }}
                        >
                            <p>From: {transaction.from}</p>
                            <p>To: {transaction.to}</p>
                            <p>Received: {transaction.received}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h1 style={{ color: "#a5d7e8", height: "1000px" }}>Please log in to view transactions</h1>
                    <input
                        type='text'
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        style={{ width: "330px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                    />
                    <input
                        type="submit"
                        onClick={handleSubmit}
                        style={{
                            width: "350px",
                            padding: "10px",
                            margin: "30px auto",
                            border: "none",
                            backgroundColor: '#0b2447',
                            color: "#fff",
                            transition: "0.5s ease-in-out"
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Transactions;
