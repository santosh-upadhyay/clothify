// import { set } from 'mongoose';
import React,{useState,useContext} from 'react';
import axios from 'axios';
import {ShopContext} from '../context/ShopContext'

const OtpLogin = () => {
    const[email,setEmail] = useState('');
    const[otp,setOtp] = useState(''); 
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        try {
            alert("login1")
            const response = await axios.post(backendUrl+'/api/user/verify-otp',{email,otp}); 
            alert("login")
            console.log(response)
            if(response.data.success){
                alert("login")
                setToken(response.data.token)
                alert('Login Successful');
                localStorage.setItem('token',response.data.token)
                navigate('/');
            }   
        } catch (error) {
            alert('Login Failed');
        }   
    }
    const otpgen = async(e)=>{
        e.preventDefault();
        try {
            // alert(response.data.message)
            // alert('Sending OTP');
            const response = await axios.post(backendUrl+'/api/user/otp',{email});
            // alert('Sending OTP');
            console.log(response);
            alert(response.data.message)
            if(response.data.success){
                alert('OTP sent to your email');
                console.log(response.data);
            }
        } catch (error) {
            alert('Error in sending OTP');
    }
}
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100">
            <div className="bg-white p rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb text-center">OTP Login Page</h1>
                <form onSubmit={onSubmitHandler}className="flex flex-col gap-4">
                    <input
                        type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Enter your email" required
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button onClick={otpgen}
                        type="button" 
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Send OTP
                    </button>
                    <input
                        type="text" value={otp} onChange={(e)=>setOtp(e.target.value)}
                        placeholder="Enter OTP" required
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit" 
                        className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors font-semibold"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OtpLogin;
