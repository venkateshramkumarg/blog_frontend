import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({ user_name: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin((prev) => ({ ...prev, [name]: value }));
        console.log(login);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login)
            });
            const data = await response.json();
            console.log(data);
            if (data.message === 'Login Successful') {
                sessionStorage.setItem("sessionStorage", JSON.stringify({ user_name: login.user_name }));
                navigate('/posts');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-lg">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-700">SIGN IN</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="user_name" className="block text-sm font-semibold mb-1 text-gray-600">User Name</label>
                        <input
                            type="text"
                            name='user_name'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            name='password'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Don't have an account?</p>
                    <Link to='/signup' className="text-blue-500 hover:underline font-bold">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
