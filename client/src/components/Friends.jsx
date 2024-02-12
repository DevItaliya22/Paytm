import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

function Friends() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div>
            <Header />
            <h1 style={{ textAlign: 'center',backgroundColor:"#0b2447",margin:"0px",color:"white" }}>Friends</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {friends.map((friend, index) => (
                    <li key={index} style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px', padding: '10px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Username: {friend.username}</p>
                        {friend.number && <p style={{ margin: 0, color: '#555' }}>Number: {friend.number}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;
