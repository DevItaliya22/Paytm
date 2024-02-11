import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from './Cards';
import Header from './Header';

function Users() {
    const { isLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

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
    console.log(users);

    return (
        <div style={{backgroundColor:"#0b2447"}}>
            <Header />
            
            {isLoggedIn ? (
                <div className="users" style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                    {users.map((user) => (
                        <Card
                            key={user._id}
                            username={user.username}
                            email={user.email}
                            balance={user.balance}
                            number={user.number}
                            transaction={user.transactions.length}
                        />
                    ))}
                </div>
            ) : (
                <h1 style={{color:"#a5d7e8",height:"1000px"}}>Please log in to view users</h1>
            )}
        </div>
    );
}

export default Users;
