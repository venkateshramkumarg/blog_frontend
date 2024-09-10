import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { Link } from 'react-router-dom';
import ShimmerPosts from './ShimmerPosts';
import NavBar from './NavBar';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const currentUser = 'venky';

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const fetchData = async (page) => {
        try {
            const response = await fetch('http://localhost:3000/api/posts/all', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: page, limit: 2 })
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setPosts(prevPosts => [...prevPosts, ...data.map(post => ({
                    ...post,
                    userInteraction: post.liked_by.some(user => user.user_name === currentUser) ? 'like' : 'none'
                }))]);
            console.log(posts);
                
            } else if (data === "Return No Post") {
                console.log("No more posts available.");
            } else {
                console.error("Unexpected data format:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
        console.log(page);
        
        fetchData(page+1);
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

    const handleInteraction = async (postId, interactionType) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        let endpoint, newInteraction, likesChange, dislikesChange;

        if (interactionType === 'like') {
            endpoint = 'http://localhost:3000/api/posts/like';
            if (post.userInteraction === 'like') {
                newInteraction = 'none';
                likesChange = -1;
                dislikesChange = 0;
            } else {
                newInteraction = 'like';
                likesChange = 1;
                dislikesChange = post.userInteraction === 'dislike' ? -1 : 0;
            }
        } else {
            endpoint = 'http://localhost:3000/api/posts/dislike';
            if (post.userInteraction === 'dislike') {
                newInteraction = 'none';
                likesChange = 0;
                dislikesChange = -1;
            } else {
                newInteraction = 'dislike';
                likesChange = post.userInteraction === 'like' ? -1 : 0;
                dislikesChange = 1;
            }
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, user_name: currentUser })
            });
            const result = await response.json();
            if (result.message === "Post Liked" || result.message === "Post Disliked") {
                setPosts(prevPosts => prevPosts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            likes: p.likes + likesChange,
                            dislikes: p.dislikes + dislikesChange,
                            userInteraction: newInteraction,
                            liked_by: newInteraction === 'like' 
                                ? [...p.liked_by, { user_name: currentUser }]
                                : p.liked_by.filter(user => user.user_name !== currentUser)
                        }
                        : p
                ));
            }
        } catch (error) {
            console.error(`Error ${interactionType}ing post:`, error);
        }
    };

    return posts.length === 0 ? (
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl'>
            <NavBar />
            <ShimmerPosts />
        </div>
    ) : (
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl'>
            <NavBar />
            {posts.map((post) => (
                <div key={post.id} className='font-mono bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5'>
                    <div className='flex justify-between items-center border-b border-gray-200 pb-3 mb-2'>
                        <div className='flex items-center w-36 justify-start gap-3'>
                            <img src="https://t4.ftcdn.net/jpg/02/32/98/33/360_F_232983351_z5CAl79bHkm6eMPSoG7FggQfsJLxiZjY.jpg" alt="" className='size-8 rounded-full' />
                            <h2 className='text-xl text-gray-400'>{post.user_name}</h2>
                        </div>
                        <div className='text-gray-400'>{getRelativeTime(post.created_at)}</div>
                    </div>

                    <div className='mb-2'>
                        <Link className='font-bold text-2xl hover:underline' to={`/${post.id}`}>{post.title}</Link>
                        <p className='mb-4 w-full max-h-40 overflow-auto text-gray-700 tracking-wide p-2 leading-6 text-base'>{post.content}</p>
                    </div>

                    <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                        <div className='flex gap-3 items-center'>
                            <div className='flex items-center'>
                                <button onClick={() => handleInteraction(post.id, 'like')}>
                                    {post.userInteraction === 'like' ? <AiFillLike className='size-6' fill='blue' /> : <AiOutlineLike className='size-6' fill='blue' />}
                                </button>
                                <p className='text-xl'>{post.likes}</p>
                            </div>
                            <div className='flex items-center'>
                                <button onClick={() => handleInteraction(post.id, 'dislike')}>
                                    {post.userInteraction === 'dislike' ? <AiFillDislike className='size-6' fill='red' /> : <AiOutlineDislike className='size-6' fill='red' />}
                                </button>
                                <p>{post.dislikes}</p>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-gray-400 text-base'>{post.comments.length} comments</p>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <Link to={`post/${post.id}`}>
                            <input type="text" placeholder='Add a Comment' className='w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100 placeholder:text-gray-400' />
                        </Link>
                    </div>
                </div>
            ))}
            <a
                onClick={handleLoadMore}
                className="text-blue-500 underline hover:text-blue-700 text-bold cursor-pointer"
            >
                Load More
            </a>
        </div>
    );
}

export default Posts;