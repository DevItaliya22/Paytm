import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { isLoggedIn,logout ,check} = useAuth();
  const navigate = useNavigate();


  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };
   const handleLogout=()=>{
    localStorage.removeItem('token')
    logout();
    navigate('/')
   }

  return (
    <div style={{ margin: "0", padding: "0", position: "sticky", top: "0" }}>
      <div className="header-main" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0B2447", color: "#A5D7E8", height: "80px" }}>
        {isLoggedIn ? (
          <>

            <h2 style={{ color: "#7393B3", marginLeft: "20px" }}>Payment Application</h2>


            <button className="header-button" onClick={()=>{navigate('/users')}} style={{ color: "#A5D7E8", width: "100px", height: "40px", backgroundColor: "#0B2447", borderRadius: "20px", border: "0px black solid", marginRight: "30px", cursor: "pointer", transition: "background-color 0.3s ease", fontWeight: "400" }}>Users</button>
            
            <button className="header-button" onClick={handleLogout} style={{ color: "#A5D7E8", width: "100px", height: "40px", backgroundColor: "#0B2447", borderRadius: "20px", border: "0px black solid", marginRight: "30px", cursor: "pointer", transition: "background-color 0.3s ease", fontWeight: "400" }}>Log Out</button>
          </>
        ) : (
          <>
            <h2 style={{ color: "#7393B3", marginLeft: "20px" }}>Payment Application</h2>
            <div>
              <button className="header-button" onClick={handleSignUp} style={{ color: "#A5D7E8", width: "100px", height: "40px", backgroundColor: "#0B2447", borderRadius: "20px", border: "0px black solid", marginRight: "30px", cursor: "pointer", transition: "background-color 0.3s ease", fontWeight: "400" }}>Sign Up</button>
              <button className="header-button" onClick={handleLogin} style={{ color: "#A5D7E8", width: "100px", height: "40px", backgroundColor: "#0B2447", borderRadius: "20px", border: "0px black solid", marginRight: "30px", cursor: "pointer", transition: "background-color 0.3s ease", fontWeight: "400" }}>Log In</button>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
