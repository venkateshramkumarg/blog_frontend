import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUp() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({ user_name: '', password: '', confirm_password: '' });
    const [error, setError] = useState({ user_name: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin((prev) => ({ ...prev, [name]: value }));
        console.log(login);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (login.password !== login.confirm_password) {
            setError((prev) => ({ ...prev, password: 'Passwords do not match' }));
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_name: login.user_name, password: login.password })
            });
            const data = await response.json();
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
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${error.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm_password" className="block text-sm font-semibold mb-1 text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            name='confirm_password'
                            onFocus={() => setError((prev) => ({ ...prev, password: '' }))}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${error.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                        {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
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
