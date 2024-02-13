import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const { isLoggedIn,check } = useAuth();

  useEffect(()=>{
    check()
},[])
  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get("http://localhost:3000/mytransactions", config);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <Header />

      {transactions.length > 0 ? (
        isLoggedIn ? (
          <>
            <h1 style={{ color: 'white', margin: '0 auto', backgroundColor: '#0b2447' }}>My Transactions</h1>
            <div style={{ display: 'flex', backgroundColor: "#0b2448", flexDirection: "column" }}>
              {transactions.map(transaction => (
                <div key={transaction._id} style={{ width: "97%", height: "140px", border: "2px solid white", backgroundColor: "#19376d", display: "flex", flexDirection: "column", color: "#a5d7e8" ,
                padding:"20px"}}>
                  <p>From: {transaction.from_name}</p>
                  <p>To: {transaction.to_name}</p>
                  <p>Received: {transaction.received}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>Login First</div>
          </>
        )
      ) : (
        <>
          <div style={{ height: "550px", color: "white", bgcolot: "#0b2447" }}>No transaction done yet</div>
        </>
      )}
    </div>
  );
}

export default MyTransactions;
