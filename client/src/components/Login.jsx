import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login ,check,isLoggedIn} = useAuth();

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:3000/login", {
                email: email,
                password: password
            });

            let data = response.data;
            console.log(data.token);

            if (data.message === "Invalid email or password") {
                setError("Invalid email or password");
            }else if(data.message==="Invalid input from user")
            {
              setError("Invalid input from user")
            } 
            else {
              console.log(data.token);
                localStorage.setItem("token", data.token);
                navigate("/");
                login();
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError('Error during login. Please try again.');
        }
    };
    useEffect(()=>{
        check()
    },[])

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <Header />

            {
                !isLoggedIn ?(<>
                <div className="uppermain" style={{ backgroundColor: "#0b2447", display: "flex", flexDirection: "row", width: "100%", height: "650px", justifyContent: "center", boxShadow: "5px 10px black" }}>
                <div className="container" style={{ display: "flex", flexDirection: "column", width: "400px", padding: "20px", backgroundColor: "#5d7baf", boxShadow: "5px 10px 10px rgba(165, 215, 232, 0.1)", borderRadius: "10px" }}>
                    <h1 style={{ textAlign: "center", color: "#a5d7e8" }}>Login</h1>
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
                    <button onClick={handleSubmit} className="submit-btn" style={{ width: "350px", padding: "10px", margin: "30px auto", border: "none", borderRadius: "5px", backgroundColor: "#0b2447", color: "#fff", transition: "0.5s ease-in-out" }}>Submit</button>
                    <div className="warningline" style={{ marginTop: "10px", textAlign: "center" }}>
                        <h3>Don't have an account?</h3>
                        <Link style={{ color: "black" }} to="/signup">SignUp</Link>
                    </div>
                    <h4 style={{ textAlign: "center", fontFamily: "sans-serif" }}>{error}</h4>
                </div>
            </div>
                </>):(<>
                    <div>Already Logged In</div>
                </>)
            }
            
        </div>
    );
}

export default Login;
