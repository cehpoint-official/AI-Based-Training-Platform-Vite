import React from 'react';
import Header from '../components/Header';
import Footers from '../components/Footers';
import UserCourses from '../components/Usercourses';

const Home = () => {

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='pb-10'>
                    <UserCourses userId={sessionStorage.getItem('uid')} />
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Home;
