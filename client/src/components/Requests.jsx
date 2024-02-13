import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Requests() {
  const [req, setReq] = useState([]);
  const { isLoggedIn, check } = useAuth();

  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:3000/requestReceived", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReq(response.data.requestReceived);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    check();
    getData();
  }, []);

 

  const handleSubmit = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:3000/fulfillRequest", { id: requestId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("done");
      getData()
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  return (
    <div>
      <Header />
      <div>
        {isLoggedIn ? (
          <div>
            {req.map((request, index) => (
              <div key={index} style={{ backgroundColor: request.active ? 'lightblue' : 'pink', border: '2px solid black', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p>{`From: ${request.from_name}`}</p>
                  <p>{`To: ${request.to_name}`}</p>
                  <p>{`Amount: ${request.amount}`}</p>
                </div>
                <div>
                  <button onClick={() => handleSubmit(request.id)} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2447", color: "#fff", transition: "0.5s ease-in-out" }}>Submit</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>hello2</div>
        )}
      </div>
    </div>
  );
}

export default Requests;
