import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState('');
    const {token,backendUrl} = useContext(ShopContext)
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [verify,setVerify] = useState(false);

    const info = async()=>{
        try{
        const response = await axios.post(backendUrl+'/api/user/profile',{},{headers:{token}})
        setEmail(response.data.user.email);
        setName(response.data.user.name);
        }catch(err){
            toast.error(response.data.message);
        }
    }
    const otpgen = async()=>{
        setShowOtpInput(true)
        try{
           
        const response = await axios.post(backendUrl+'/api/user/otp',{email},{headers:{token}})
        alert(response.data.message)
            
        }catch(err){
            toast.error(response.data.message);
        }
    }

    const verifyOtp = async()=>{
        try{
            const response = await axios.post(backendUrl+'/api/user/emailVerify',{email,otp},{headers:{token}});
            alert(response.data.message)
        }

        catch(err){ 
           toast.error(response.data.message);
        }   
    }
    const isVerify = async()=>{
        try{
            const response = await axios.post(backendUrl+'/api/user/isverified',{},{headers:{token}});
            setVerify(response.data.isVerified);
        }catch(err){
            toast.error(response.data.message);
        }
    }
    useEffect(()=>{
        // only fetch info when backendUrl and token are available
        if(!backendUrl || !token) return;
        info()
        isVerify()
    },[backendUrl,token])

    // If user is not authenticated, show a message and link to login.
    // This return is after all hooks so the hooks call order remains stable.
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4 text-red-600">You must be logged in to view this page.</h2>
                    <a href="/login" className="text-blue-500 underline">Go to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-start">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-12 ml-12">
                <h1 className="text-2xl font-bold mb-6 text-left">Personal Info</h1>
                <div className="flex flex-col gap-6">
                    <p className="text-lg text-gray-800 font-semibold">Username: <span className="font-normal">{name || 'username123'}</span></p>
                    <div className="flex items-center gap-3 flex-nowrap min-w-0">
                        <p className="text-lg text-gray-800 font-semibold mb-0">Email: <span className="font-normal">{email || 'user@example.com'}</span></p>
                        {verify ? (
                            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-400">Verified Email</span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold whitespace-nowrap shadow"
                                    onClick={otpgen}
                                >
                                    SEND OTP
                                </button>
                                <button onClick={verifyOtp}
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold whitespace-nowrap shadow"
                                >
                                    Verify Email
                                </button>
                                {showOtpInput && (
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        style={{ minWidth: '120px' }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
