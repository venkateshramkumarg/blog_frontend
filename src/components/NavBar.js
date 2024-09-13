import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function NavBar() {
    const navBars = [
        { path: '/posts', element: 'Posts' },
        {path:'/write',element:'Write'},
        {path:'/search',element:'Search'}
    ];
    const navigate=useNavigate();

    const handleClick = () => { 
        sessionStorage.removeItem('sessionStorage');
        navigate('/');
    }

    const location = useLocation();

    const getLinkClassName = (path) => location.pathname === path ? 'text-blue-500' : 'text-black';

    return (
        <div className='sm:max-w-2xl mx-auto mt-5 md:mb-5 max-w-md flex justify-between items-center'>
            <div>
                <ul className='flex justify-center space-x-4'>
                    {navBars.map((navBar, index) => (
                        <li key={index}>
                            <Link to={navBar.path} className={`text-xl font-semibold font-mono ${getLinkClassName(navBar.path)}`}>
                                {navBar.element}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button className='bg-blue-500 text-white px-2 py-1 rounded-md' onClick={handleClick}>LogOut</button>
            </div>

        </div>
    );
}

export default NavBar;
