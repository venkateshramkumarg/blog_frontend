import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { Link } from 'react-router-dom';

function Search() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const sessionData = JSON.parse(sessionStorage.getItem('sessionStorage') || '{}'); 
    const { user_name } = sessionData;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://blog-backend-final.onrender.com/api/posts/all', {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const datas = await response.json();
            console.log(datas);
            setData(datas);
            setFilteredData(datas);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        const filtered = data.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
    };

    return user_name===undefined?(
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl text-center mt-5'>
            <h1 className='text-3xl font-bold mb-5 text-red-600'>Login Required</h1>
            <p className='text-lg mb-4'>Please login to search posts.</p>
            <Link to='/' className='text-blue-500 underline hover:text-blue-700 text-xl'>Login</Link>
        </div>
    ):search==''?(
        <div>
            <NavBar />
            <div className="mx-auto max-w-2xl">
                <input 
                    type="text" 
                    placeholder="Search for Title" 
                    onChange={handleChange}
                    value={search}
                    className="w-full border border-gray-400 p-2 rounded-md mb-4" 
                />
                <p>Search to view post</p>
            </div>
        </div>
    ): (
        <div>
            <NavBar />
            <div className="mx-auto max-w-2xl">
                <input 
                    type="text" 
                    placeholder="Search for Title" 
                    onChange={handleChange}
                    value={search}
                    className="w-full border border-gray-400 p-2 rounded-md mb-4" 
                />
                {filteredData.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <ul>
                        {filteredData.map((post) => (
                            <li key={post.id} className="border-b border-gray-300 p-2">
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
                                <a href={`/${post.id}`} className="text-blue-500 hover:underline">Read More</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Search;
