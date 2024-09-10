import { useState, useEffect } from "react";
import NavBar from "./NavBar";

function Search() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/posts/all', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: 1, limit: 30 })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const datas = await response.json();
            setData(datas);
            setFilteredData(datas); // Initialize filteredData with the fetched data
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        // Filter the data based on the search query
        const filtered = data.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
    };

    return (
        <div>
            <NavBar />
            <div className="mx-auto max-w-2xl p-4">
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
