import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function WritePost() {
    const navigate = useNavigate();
    const { user_name } = JSON.parse(sessionStorage.getItem('sessionStorage'));
    const [data, setData] = useState({ title: '', content: '', user_name: user_name, image: '' });
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
            console.log(imagePreview)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        try {
            const response = await fetch("http://localhost:3000/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result === "Post Created") {
                navigate('/posts');
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
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
                        className='w-full border border-gray-400 p-2 rounded-md'
                    />
                    {data.title.length !== 0 && <p>{data.title.length}/70</p>}
                </div>
                <div className='mb-5'>
                    <label htmlFor='content' className='block text-xl font-semibold'>Content</label>
                    <textarea 
                        name='content' 
                        value={data.content} 
                        onChange={handleChange}
                        className='w-full border border-gray-400 p-2 rounded-md'
                    ></textarea>
                </div>
                <div className='mb-5'>
                    <label htmlFor='image' className='block text-xl font-semibold'>Image</label>
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