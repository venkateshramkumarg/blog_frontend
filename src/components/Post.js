import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import ShimmerPost from './ShimmerPost';

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null); 
    const [comment, setComment] = useState('');
    const { user_name } = JSON.parse(sessionStorage.getItem('sessionStorage'));

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
            setPost({
                ...data,
                userInteraction: data.liked_by.some(user => user.user_name === user_name) ? 'like' : 'none'
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
        try {
            const response = await fetch('http://localhost:3000/api/comments/create', {
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

    const handleInteraction = async (interactionType) => {
        if (!post) return;

        let endpoint, newInteraction, likesChange;

        if (interactionType === 'like') {
            endpoint = 'http://localhost:3000/api/posts/like';
            if (post.userInteraction === 'like') {
                newInteraction = 'none';
                likesChange = -1;
            } else {
                newInteraction = 'like';
                likesChange = post.userInteraction === 'dislike' ? 1 : 1;
            }
        } else {
            endpoint = 'http://localhost:3000/api/posts/dislike';
            if (post.userInteraction === 'dislike') {
                newInteraction = 'none';
                likesChange = 0;
            } else {
                newInteraction = 'dislike';
                likesChange = post.userInteraction === 'like' ? -1 : 0;
            }
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: post.id, user_name: user_name })
            });
            const result = await response.json();
            if (result.message === "Post Liked" || result.message === "Post Disliked") {
                setPost(prevPost => ({
                    ...prevPost,
                    likes: prevPost.likes + likesChange,
                    dislikes: newInteraction === 'dislike' ? prevPost.dislikes + 1 : 
                              prevPost.userInteraction === 'dislike' ? prevPost.dislikes - 1 : 
                              prevPost.dislikes,
                    userInteraction: newInteraction,
                    liked_by: newInteraction === 'like'
                        ? [...prevPost.liked_by, { user_name: user_name }]
                        : prevPost.liked_by.filter(user => user.user_name !== user_name)
                }));
            }
        } catch (error) {
            console.error(`Error ${interactionType}ing post:`, error);
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

    if (!post) {
        return (
            <div>
                <NavBar />
                <ShimmerPost />
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className='max-w-2xl bg-white mx-auto mb-5'>
                <div className='mb-7'>
                    <Link className='hover:underline text-blue-500 flex items-center gap-1' to='/posts'>{<FaArrowLeft className='size-4' />}Back to Posts</Link>
                </div>
                <div className='flex justify-between items-center border-b border-gray-400 pb-4 mb-4'>
                    <div className='flex items-center w-36 justify-start gap-3'>
                        <img src="https://t4.ftcdn.net/jpg/02/32/98/33/360_F_232983351_z5CAl79bHkm6eMPSoG7FggQfsJLxiZjY.jpg" alt="" className='size-8 rounded-full' />
                        <h2 className='text-xl font-semibold'>{post.user_name}</h2>
                    </div>
                    <div>
                        <p>{getRelativeTime(post.created_at)}</p>
                    </div>
                </div>
                <h2 className='font-bold text-2xl mb-4'>{post.title}</h2>
                <p className='mb-4'>{post.content}</p>
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
                            className='w-full ring-2 ring-gray-400 p-2 rounded-md focus:outline-none focus:ring-blue-500' 
                            onChange={handleChange}
                            value={comment}
                        ></textarea>
                        <button className='bg-blue-500 text-white rounded-md px-3 py-2 font-semibold mt-5'>Post Comment</button>
                    </form>
                </div>
            </div>

            <div className=''>
                {post.comments && post.comments.map((comment, index) => (
                    <div key={index} className='max-w-2xl bg-white mx-auto p-4 border border-gray-300 shadow-md rounded-md mb-5'>
                        <div className='flex justify-between mb-2 items-center'>
                            <div className='flex items-center gap-3'>
                                <img src="https://t4.ftcdn.net/jpg/02/32/98/33/360_F_232983351_z5CAl79bHkm6eMPSoG7FggQfsJLxiZjY.jpg" alt="" className='size-8 rounded-full' />
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