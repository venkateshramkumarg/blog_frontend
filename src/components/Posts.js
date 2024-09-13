
import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { Link } from 'react-router-dom';
import ShimmerPosts from './ShimmerPosts';
import NavBar from './NavBar';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loadMore,setLoadMore]=useState(true)
    const [page, setPage] = useState(1);
    const [noPost,setNoPost]=useState(false)
    const sessionData = JSON.parse(sessionStorage.getItem('sessionStorage') || '{}'); 
    const { user_name } = sessionData;

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const fetchData = async (page) => {
        try {
            const response = await fetch('https://blog-backend-final.onrender.com/api/posts/limit/all', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: page, limit: 2 })
            });
            const {posts:data,hasMany} = await response.json();
            console.log(data,hasMany);
            if(hasMany===false)
            {
                setLoadMore(false)
            }
            else if(data.length===0)
            {
                setNoPost(true)
                console.log("No Post");
                return
                    
            }
            console.log("Post Present");
            if (Array.isArray(data)) {
                setPosts(prevPosts => [...prevPosts, ...data.map(post => ({
                    ...post,
                    userInteraction: post.liked_by.some(user => user.user_name === user_name) ? 'like' 
                                     : post.disliked_by.some(user => user.user_name === user_name) ? 'dislike'
                                     : 'none'
                }))]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
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
                if(post.userInteraction=='like')
                {
                    endpoint2='http://localhost:3000/api/posts/decrement/like'
                }
                newInteraction = 'dislike';
                dislikesChange = 1;
                if (post.userInteraction === 'like') {
                    likesChange = -1;
                }
            }
        }

        setPosts(prevPosts => prevPosts.map(p =>
            p.id === postId
                ? {
                    ...p,
                    likes: p.likes + likesChange,
                    dislikes: p.dislikes + dislikesChange,
                    userInteraction: newInteraction,
                    liked_by: newInteraction === 'like'
                        ? [...p.liked_by, { user_name: user_name }]
                        : p.liked_by.filter(user => user.user_name !== user_name),
                    disliked_by: newInteraction === 'dislike'
                        ? [...p.disliked_by, { user_name: user_name }]
                        : p.disliked_by.filter(user => user.user_name !== user_name)
                }
                : p
        ));

        try {
            const response = await fetch(endpoint1, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, user_name: user_name })
            });
            const result = await response.json();
        } catch (error) {
            console.error(`Error ${interactionType}ing post:`, error);
        }
        if(endpoint2)
        {
            try {
                const response = await fetch(endpoint2, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: postId, user_name: user_name })
                });
                const result = await response.json();
            } catch (error) {
                console.error(`Error ${interactionType}ing post:`, error);
            }  
        }
    };

    return user_name===undefined ? (
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl text-center mt-5'>
            <h1 className='text-3xl font-bold mb-5 text-red-600'>Login Required</h1>
            <p className='text-lg mb-4'>Please login to view posts.</p>
            <Link to='/' className='text-blue-500 underline hover:text-blue-700 text-xl'>Login</Link>
        </div>
    )
    :noPost===true?(
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl'>
            <NavBar />
            <p>No posts available.</p>
        </div>
    ):
    posts.length === 0 ? (
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl'>
            <NavBar />
            <ShimmerPosts />
        </div>
    ) :(
        <div className='max-w-md mx-auto mb-5 sm:max-w-2xl'>
            <NavBar />
            {posts.map((post) => (
                <div key={post.id} className='font-mono bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5'>
                <div className='flex justify-between items-center border-b border-gray-200 pb-3 mb-2'>
                    <div className='flex items-center w-36 justify-start gap-3'>
                        <img src={post.User.avatar_url} alt="" className='size-9 rounded-full' />
                        <h2 className='text-xl text-gray-400'>{post.user_name}</h2>
                    </div>
                    <div className='text-gray-400'>{getRelativeTime(post.created_at)}</div>
                </div>

                <div className='mb-2'>
                    <Link className='font-bold text-2xl hover:underline' to={`/${post.id}`}>{post.title}</Link>
                    <div className='flex justify-center mb-2'>
                        {post.image && (
                                <img 
                                    src={post.image} 
                                    alt="Post image" 
                                    className="w-[200px] h-[150px] mt-2 rounded-lg"
                                />
                            )}
                    
                    </div>
                    <div className='mt-2'>
                        <p className='mb-4 w-full max-h-40 overflow-auto  text-gray-700 tracking-wide p-2 leading-6 text-base'>{post.content}</p>
                    </div>
                    
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
                        <Link to={`/${post.id}`}>
                            <input type="text" placeholder='Add a Comment' className='w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100 placeholder:text-gray-400' />
                        </Link>
                    </div>
                </div>
            ))}
            {loadMore===true?<a
                onClick={handleLoadMore}
                className="text-blue-500 underline hover:text-blue-700 text-bold cursor-pointer"
            >
                Load More
            </a>:null}
        </div>
    );
}

export default Posts;