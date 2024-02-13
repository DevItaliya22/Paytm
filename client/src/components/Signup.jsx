import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../context/AuthContext';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {isLoggedIn,check,login} = useAuth();

    const navigate = useNavigate();


    const handleSubmit = async () => {
        try {
            const obj = {
                email: email,
                password: password,
                number: number,
                username: username
            }
            const response = await axios.post("http://localhost:3000/signup", obj);
            let data = response.data;

            if (data.message === "User already exists") {
                setError("User already exists")
            } else if (data.message === "Invalid input from user") {
                setError("Invalid input from user")
            } else {
                localStorage.setItem("token", data.token);
                navigate('/');
                login();
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setError("Error in signup request");
        }
    }
    useEffect(()=>{
        check()
    },[])
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
            <Header />

            {
                !isLoggedIn ? (
                    <>
                    <div className="uppermain" style={{ backgroundColor: "#0b2447", display: "flex", flexDirection: "row", width: "100%", height: "650px", justifyContent: "center", boxShadow: "5px 10px black" }}>
                <div className="container" style={{ display: "flex", flexDirection: "column", width: "400px", padding: "20px", backgroundColor: "#5d7baf", boxShadow: "5px 10px 10px rgba(165, 215, 232, 0.1)", borderRadius: "10px" }}>
                    <h1 style={{ textAlign: "center", color: "#a5d7e8" }}>Sign Up</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                    />
                    <div style={{ display: 'flex' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            style={{ width: "330px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                        />
                        <button
                            type="button"
                            onClick={handleShowPassword}
                            className="eye-button"
                            style={{ backgroundColor: "#5d7baf", border: "none" }}
                        >
                            {showPassword ? "👁️" : "🔒"}
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="input-field"
                        style={{ width: "350px", padding: "10px", margin: "10px auto", backgroundColor: "#142a47", border: "none", borderRadius: "5px", color: "#1359a4", fontSize: "15px", transition: "0.3s ease" }}
                    />
                    <button onClick={handleSubmit} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2447", color: "#fff", transition: "0.5s ease-in-out" }}>Submit</button>
                    <div className="warningline" style={{ marginTop: "10px", textAlign: "center" }}>
                        <h3>Already have an account?</h3>
                        <Link style={{ color: "black" }}>Log in</Link>
                    </div>
                    <h4 style={{ textAlign: "center", fontFamily: "sans-serif" }}>{error}</h4>
                </div>
            </div>
            </>
                ):(
                    <><h1>Already Logged In</h1></>
                    
                )
            }
            
        </div>
    );
}

export default Signup;
