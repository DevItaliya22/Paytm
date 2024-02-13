import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

function Friends() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const {isLoggedIn,check}=useAuth()

    useEffect(()=>{
        check()
    },[])

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get("http://localhost:3000/friends", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFriends(response.data.friends); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching friends:", error);
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ backgroundColor: '#0b2447' }}>
            <Header />
            <h1 style={{ textAlign: 'center', margin: '0', padding: '20px 0', color: 'white' }}>Friends</h1>
            <ul style={{ listStyleType: 'none', padding: "10px" }}>
                {friends.map((friend, index) => (
                    <li key={index} style={{ backgroundColor:"#0b2447", border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px', padding: '10px' ,color:"white"}}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Username: {friend.username}</p>
                        {friend.number && <p style={{ margin: 0, color: 'white' }}>Number: {friend.number}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;
