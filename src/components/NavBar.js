import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const navBars = [
        { path: '/posts', element: 'Posts' },
        {path:'/write',element:'Write'},
        {path:'/search',element:'Search'}
    ];

    const location = useLocation();

    const getLinkClassName = (path) => location.pathname === path ? 'text-blue-500' : 'text-black';

    return (
        <div className='sm:max-w-2xl mx-auto mt-5 md:mb-5 max-w-md'>
            <ul className='flex gap-5 items-center'>
                {navBars.map((item) => (
                    <li key={item.path} className='font-semibold text-xl font-serif'>
                        <Link to={item.path} className={getLinkClassName(item.path)}>
                            {item.element}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NavBar;
