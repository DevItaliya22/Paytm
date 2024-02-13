import React, {useEffect }from 'react';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

function Home() {
    const{isLoggedIn,check}=useAuth();
    useEffect(()=>{
        check()
    },[])
    return (
        <div>
            <Header />
            <div  style={{width:"100%",height:"500px",backgroundColor:"0b2447"}}>
                <h1>Welcome to Our Website</h1>
                <p>
                    This is the home page of our website. You can put any content you want here,
                    such as information about your company, featured products or services, or
                    any other relevant information.
                </p>
                <p>
                    Feel free to explore our website and discover what we have to offer.
                </p>
            </div>
        </div>
    );
}

export default Home;
