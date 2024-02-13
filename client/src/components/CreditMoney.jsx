import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CreditMoney() {
  const { isLoggedIn,check } = useAuth();
  const [password, setPassword] = useState('');
  const [realPassword, setRealPassword] = useState('');
  const [amount, setAmount] = useState(0);
  const [showAmountField, setShowAmountField] = useState(false);
  const [balance, setBalance] = useState(0);
  const [submittedPassword, setSubmittedPassword] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const getPassword = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      try {
        const data = await axios.get("http://localhost:3000/showpassword", config);
        setRealPassword(data.data.password);
      } catch (err) {
        console.log("Error getting real password:", err);
      }
    };

    getPassword();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const getBalance = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      try {
        const response = await axios.get("http://localhost:3000/balance", config);
        setBalance(response.data.balance);
      } catch (err) {
        console.log("Error getting balance:", err);
      }
    };

    getBalance();
  }, );
  useEffect(()=>{
    check()
},[])

  const handlePasswordSubmit = () => {
    if (password === realPassword) {
      setShowAmountField(true);
      setSubmittedPassword(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const handleCreditMoney = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const data2 = {
      amount: amount
    };

    try {
      const response = await axios.post("http://localhost:3000/creditmoney", data2, config);
      const updatedBalance = response.data.balance;
      setBalance(updatedBalance); 
      setAmount(0); 
      
    } catch (err) {
      console.log("Error crediting money:", err);
      alert("Error crediting money. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="main-container" style={{backgroundColor:"#19376d",width:"100%",height:"615px"}}>
        <div style={{backgroundColor:'#19376d',margin:'0 auto',width:'400px',padding:'30px'}}>
          <h1 style={{color:"white"}}>Credit Amount</h1>
          <input
            type='password'
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            style={{ width: "330px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
          />
          <button onClick={handlePasswordSubmit} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2447", color: "#fff", transition: "0.5s ease-in-out" }}>Submit</button>
          {showAmountField && submittedPassword && (
            <div>
              <p>Balance: ${balance}</p>
              <input
                type='number'
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                style={{ width: "330px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
              />
              <button onClick={handleCreditMoney} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2447", color: "#fff", transition: "0.5s ease-in-out" }}>Credit Money</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditMoney;
