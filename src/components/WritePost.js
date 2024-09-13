import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { Link } from 'react-router-dom';

function WritePost() {
    const navigate = useNavigate();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionStorage') || '{}'); 
    const { user_name } = sessionData;
    const [data, setData] = useState({ title: '', content: '', user_name: user_name,image:'' });
    const [error, setError] = useState({ title: '', content: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData((prev) => ({
                    ...prev,
                    image: reader.result
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.title||!data.content) 
        {
            if(!data.title)
            {
                setError((prev) => ({
                    ...prev,
                    title:'Title is required',
                }));
            }
            if(!data.content)
            {
                setError((prev) => ({
                    ...prev,
                    content:'Content is required',
                }));
            }
            return;
        }
        console.log(data)
        try {
            const response = await fetch("https://blog-backend-final.onrender.com/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log(result);
            if (result === "Post Created") {
                navigate('/posts');
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return user_name===undefined?(
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl text-center mt-5'>
            <h1 className='text-3xl font-bold mb-5 text-red-600'>Login Required</h1>
            <p className='text-lg mb-4'>Please login to upload posts.</p>
            <Link to='/' className='text-blue-500 underline hover:text-blue-700 text-xl'>Login</Link>
        </div>
    ): (
        <div className="max-w-2xl mx-auto mt-5 font-mono">
            <NavBar />
            <h1 className="font-semibold">Blogging: Because therapy is expensive and your cat's not a good listener</h1>
            <form className="mt-5" onSubmit={handleSubmit}>
                <div className='mb-5'>
                    <label htmlFor='title' className='block text-xl font-semibold'>Title</label>
                    <input 
                        type='text'
                        name='title'
                        value={data.title} 
                        maxLength={70}
                        onChange={handleChange}
                        onFocus={() => setError((prev) => ({ ...prev, title: '' }))}
                        className={`w-full border border-gray-300  p-2 rounded-md focus:ring-2 focus:outline-none ${error.title ? 'border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {error.title && <p className='text-red-500'>{error.title}</p>}
                    {data.title.length !== 0 && <p>{data.title.length}/70</p>}
                </div>
                <div className='mb-5'>
                    <label htmlFor='content' className='block text-xl font-semibold'>Content</label>
                    <textarea 
                        name='content' 
                        value={data.content}
                        rows={5}
                        onFocus={() => setError((prev) => ({ ...prev, content: '' }))} 
                        onChange={handleChange}
                        className={`w-full border border-gray-300  p-2 rounded-md focus:ring-2 focus:outline-none h-auto ${error.content ? 'border-red-500' : 'focus:border-blue-500'}`}
                    ></textarea>
                    {error.content && <p className='text-red-500'>{error.content}</p>}
                </div>
                <div className='mb-5'>
                    <label htmlFor='image' className='block text-xl font-semibold'>Image(Optinal)</label>
                    <input 
                        type='file' 
                        name='image' 
                        accept='image/*'
                        onChange={handleImageChange}
                        className='w-full border border-gray-400 p-2 rounded-md'
                    />
        
                    {imagePreview && (
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="mt-2 max-w-full h-auto"
                        />
                    )}
                </div>
                <div className='mb-5'>
                    <button className='bg-blue-500 text-white px-3 py-2 rounded-md'>Post</button>
                </div>
            </form>
        </div>
    );
}

export default WritePost;