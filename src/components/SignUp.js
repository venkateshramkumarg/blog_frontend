import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AvatarGenerator } from 'random-avatar-generator';

function SignUp() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({ user_name: '', password: '', confirm_password: '' });
    const [error, setError] = useState({ user_name: '', password: '', confirm_password:'',avatar_url:'' });
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        const generator = new AvatarGenerator();
        const newAvatars = Array.from({ length: 10 }, () => generator.generateRandomAvatar());
        setAvatars(newAvatars);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setError((prev) => ({ ...prev, avatar_url: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("here")
        console.log(login)
        if(!selectedAvatar||!login.user_name||!login.password||!login.confirm_password){
            if(!login.user_name){
                setError((prev) => ({ ...prev, user_name: 'User Name is required' }));
                console.log("here")
            }
            if(!login.password){
                setError((prev) => ({ ...prev, password: 'Password is required' }));
                console.log("here")
            }
            if(!login.confirm_password){
                console.log("here")
                setError((prev) => ({ ...prev, confirm_password: 'Confirm Password is required' }));
                console.log(error)
            }
            if(!selectedAvatar){
                setError((prev) => ({ ...prev, avatar_url: 'Avatar is required' }));
            }
            return;
        }
        console.log("here")

        if(login.password.length<8){
            setError((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }));
            return;
        }
        if(login.confirm_password.length<8){
            setError((prev) => ({ ...prev,confirm_password:'Password must be at least 8 characters' }));
            return;
        }

        if(login.user_name.length<3){
            setError((prev) => ({ ...prev, user_name: 'User Name must be at least 3 characters' }));
            return;
        }
        if(login.user_name.length>20){
            setError((prev) => ({ ...prev, user_name: 'User Name must be at most 20 characters' }));
            return;
        }


        if (login.password !== login.confirm_password) {
            setError((prev) => ({ ...prev, password: 'Passwords do not match' ,confirm_password:'Passwords do not match' }));
            return;
        }

        try {
            console.log(selectedAvatar)
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_name: login.user_name, 
                    password: login.password,
                    avatar_url: selectedAvatar
                })
            });
            const data = await response.json();
            console.log(data)
            if (data.message === 'User Created') {
                navigate('/');
            } else if (data.message === 'User name already exists') {
                setError((prev) => ({ ...prev, user_name: data.message }));
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-lg">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-700">SIGN UP</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="user_name" className="block text-sm font-semibold mb-1 text-gray-600">User Name</label>
                        <input
                            type="text"
                            name='user_name'
                            onFocus={() => setError((prev) => ({ ...prev, user_name: '' }))}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${error.user_name ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                        {error.user_name && <p className="text-red-500 text-sm mt-1">{error.user_name}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            name='password'
                            onFocus={() => setError((prev) => ({ ...prev, password: '' }))}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${error.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                        {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm_password" className="block text-sm font-semibold mb-1 text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            name='confirm_password'
                            onFocus={() => setError((prev) => ({ ...prev,confirm_password:'' }))}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${error.confirm_password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                        {error.confirm_password && <p className="text-red-500 text-sm mt-1">{error.confirm_password}</p>}
                    </div>
                    <div className='mb-6'>
                        <label className="block text-sm font-semibold mb-2 text-gray-600">Select Avatar</label>
                        <div className="grid grid-cols-5 gap-2">
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                    className={`w-14 h-14 cursor-pointer border-2 rounded-full ${selectedAvatar === avatar ? 'border-blue-500' : 'border-transparent'}`}
                                    onClick={() => {handleAvatarSelect(avatar)}}

                                />
                            ))}
                        </div>
                        {error.avatar_url && <p className="text-red-500 text-sm mt-1">{error.avatar_url}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Already have an account?</p>
                    <Link to='/' className="text-blue-500 hover:underline font-bold">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;