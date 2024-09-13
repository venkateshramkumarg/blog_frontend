import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ShimmerPost from './ShimmerPost';

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null); 
    const [comment, setComment] = useState('');
    const [error, setError] = useState({ comment: '' });
    const sessionData = JSON.parse(sessionStorage.getItem('sessionStorage') || '{}'); 
    const { user_name } = sessionData;

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/post/${id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data.comments);
            console.log(data)
            setPost({
                ...data,
                userInteraction: data.liked_by.some(user => user.user_name === user_name) ? 'like' 
                                 : data.disliked_by.some(user => user.user_name === user_name) ? 'dislike'
                                 : 'none'
            });
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!comment)
        {
            setError((prev) => ({
                ...prev,
                comment:'Comment is required',
            }));
            return;
        }
        try {
            const response = await fetch('https://blog-backend-final.onrender.com/api/comments/create', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: comment, post_id: post.id, user_name: user_name })
            });
            const data = await response.json();
            console.log(data);
            setComment('');
            await fetchData();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }


    const handleInteraction = async (interactionType) => 
    {
        if (!post) return;

        let endpoint1,endpoint2 ,newInteraction, likesChange = 0, dislikesChange = 0;

        if (interactionType === 'like') {
            if (post.userInteraction === 'like') {
                endpoint1 = 'http://localhost:3000/api/posts/decrement/like';
                newInteraction = 'none';
                likesChange = -1;
            } else {
                endpoint1 = 'http://localhost:3000/api/posts/increment/like';
                if(post.userInteraction=='dislike')
                {
                    endpoint2='http://localhost:3000/api/posts/decrement/dislike'
                }
                newInteraction = 'like';
                likesChange = 1;
                if (post.userInteraction === 'dislike') {
                    dislikesChange = -1;
                }
            }
        } else {
            if (post.userInteraction === 'dislike') {
                endpoint1 = 'http://localhost:3000/api/posts/decrement/dislike';
                newInteraction = 'none';
                dislikesChange = -1;
            } else {
                endpoint1 = 'http://localhost:3000/api/posts/increment/dislike';
                console.log('inside dislike1');
                if(post.userInteraction=='like')
                {   console.log('inside dislike2');
                
                    endpoint2='http://localhost:3000/api/posts/decrement/like'
                }
                newInteraction = 'dislike';
                dislikesChange = 1;
                if (post.userInteraction === 'like') {
                    likesChange = -1;
                }
            }
        }

        setPost(prevPost => ({
            ...prevPost,
            likes: prevPost.likes + likesChange,
            dislikes: prevPost.dislikes + dislikesChange,
            userInteraction: newInteraction,
            liked_by: newInteraction === 'like'
                ? [...prevPost.liked_by, { user_name: user_name }]
                : prevPost.liked_by.filter(user => user.user_name !== user_name),
            disliked_by: newInteraction === 'dislike'
                ? [...prevPost.disliked_by, { user_name: user_name }]
                : prevPost.disliked_by.filter(user => user.user_name !== user_name)
        }));

        try {
            const response1 = await fetch(endpoint1, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: post.id, user_name: user_name })
            });
            const result1 = await response1.json();
            console.log(result1.message);
        } catch (error) {
            console.error(`Error ${interactionType}ing post:`, error);
        }
        if(endpoint2)
            {
                try {
                    console.log(post.id,user_name);
                    
                    const response2 = await fetch(endpoint2, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ post_id: post.id, user_name: user_name })
                    });
                    const result2 = await response2.json();
                    console.log(result2.message);
                } catch (error) {
                    console.error(`Error ${interactionType}ing post:`, error);
                }  
            }

    };
    const getRelativeTime = (isoDate) => {
        const now = new Date();
        const date = new Date(isoDate);
        const diffInMs = now - date;

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return days === 1 ? "1 day ago" : `${days} days ago`;
        } else if (hours > 0) {
            return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
        } else if (minutes > 0) {
            return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
        } else if (seconds > 0) {
            return "Just now";
        } else {
            return "Just now";
        }
    };

    return user_name===undefined?(
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl text-center mt-5'>
            <h1 className='text-3xl font-bold mb-5 text-red-600'>Login Required</h1>
            <p className='text-lg mb-4'>Please login to view post.</p>
            <Link to='/' className='text-blue-500 underline hover:text-blue-700 text-xl'>Login</Link>
        </div>
        
    ):!post?(
        <div>
            <ShimmerPost />
        </div>
    ):
    (
        <div>
            <div className='max-w-2xl bg-white mx-auto mb-5 mt-5'>
                <div className='mb-7'>
                    <Link className='hover:underline text-blue-500 flex items-center gap-1' to='/posts'>{<FaArrowLeft className='size-4' />}Back to Posts</Link>
                </div>
                <div className='flex justify-between items-center border-b border-gray-400 pb-4 mb-4'>
                    <div className='flex items-center w-36 justify-start gap-3'>
                        <img src={post.User.avatar_url} alt="" className='size-8 rounded-full' />
                        <h2 className='text-xl font-semibold'>{post.user_name}</h2>
                    </div>
                    <div>
                        <p>{getRelativeTime(post.created_at)}</p>
                    </div>
                </div>
                <h2 className='font-bold text-2xl mb-4'>{post.title}</h2>
                <div className='flex justify-center mb-4'>
                        {post.image && (
                                <img 
                                    src={post.image} 
                                    alt="Post image" 
                                    className="w-full h-auto mt-2"
                                />
                            )}
                    
                </div>
                <p className='mb-4 overscroll-contain'>{post.content}</p>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-3 items-center'>
                        <div className='flex items-center'>
                            <button onClick={() => handleInteraction('like')}>
                                {post.userInteraction === 'like' ? <AiFillLike className='size-6' fill='blue' /> : <AiOutlineLike className='size-6' fill='blue' />}
                            </button>
                            <p className='text-xl'>{post.likes}</p>
                        </div>
                        <div className='flex items-center'>
                            <button onClick={() => handleInteraction('dislike')}>
                                {post.userInteraction === 'dislike' ? <AiFillDislike className='size-6' fill='red' /> : <AiOutlineDislike className='size-6' fill='red' />}
                            </button>
                            <p>{post.dislikes}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-2xl mx-auto'>
                <h2 className='text-2xl font-semibold mb-5'>Comments</h2>
                <div className='mb-5'>
                    <form onSubmit={handleSubmit}>
                        <textarea 
                            className={`w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none h-24 ${error.comment ? 'border-red-500' : 'focus:border-blue-500'}`}
                            onChange={handleChange}
                            value={comment}
                            placeholder='Write a comment...'
                            onFocus={() => setError((prev) => ({ ...prev, comment: '' }))}
                        ></textarea>
                        {error.comment && <p className='text-red-500'>{error.comment}</p>}
                        <button className='bg-blue-500 text-white rounded-md px-3 py-2 font-semibold mt-5'>Post Comment</button>
                    </form>
                </div>
            </div>

            <div className=''>
                {post.comments && post.comments.map((comment, index) => (
                    <div key={index} className='max-w-2xl bg-white mx-auto p-4 border border-gray-300 shadow-md rounded-md mb-5'>
                        <div className='flex justify-between mb-2 items-center'>
                            <div className='flex items-center gap-3'>
                                <img src={comment.User.avatar_url} alt="" className='size-8 rounded-full' />
                                <h2 className='text-base text-gray-400'>{comment.user_name}</h2>
                            </div>
                            <div>
                                <p className='text-base text-gray-400'>{getRelativeTime(comment.created_at)}</p>
                            </div>
                        </div>
                        <p className=''>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Post;