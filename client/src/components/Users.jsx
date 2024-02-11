import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from './Cards';
import Header from './Header';

function Users() {
    const { isLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [password,setPassword]=useState('');
    const [isViewable,setIsViewable]=useState(false);
    


    useEffect(() => {
        const getUser = async () => {
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
                const res = await axios.get('http://localhost:3000/users', config);
                setUsers(res.data);
            } catch (err) {
                setError(err.response.data.message); 
            }
        };
        getUser();
    }, []);

    const handleSubmit = () => {
        if (password === "123") {
            setIsViewable(true);
        } else {
            setIsViewable(false);
        }
    };

    

    return (
        <div style={{backgroundColor:"#0b2447"}}>
            <Header />
            
            {isLoggedIn && isViewable ? (
                <div className="users" style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                    {users.map((user, index) => (
                        <div 
                            key={user._id} 
                        
                            style={{
                                backgroundColor:  '#0b2447',
                                color: "#fff",
                                padding: "10px",
                                margin: "5px",
                                borderRadius: '5px',
                                transition: "0.5s ease-in-out"
                            }}
                        >
                            <Card
                                username={user.username}
                                email={user.email}
                                balance={user.balance}
                                number={user.number}
                                transaction={user.transactions.length}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h1 style={{color:"#a5d7e8",height:"1000px"}}>Please log in to view users</h1>
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

export default Users;
