import React from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import UserCourses from '../components/usercourses';
import axiosInstance from "../axios";
import { useEffect } from 'react';
// import { getAuth } from 'firebase/auth';

const Home = () => {
    //     const auth = getAuth();
    //   const user = auth.currentUser;
    //   console.log(auth  )
    useEffect(()=>{
        const fetch= async ()=>{
            try{
                const userId=sessionStorage.getItem('uid');
                const postURL = `/api/courses?userId=${userId}`;
                const res=await axiosInstance.get(postURL);
                sessionStorage.setItem("coursesCreatedToday",res.data.length);
                // console.log(res.data);
    
            }catch(error){
                // console.log(error);
            }
        }
        fetch();
    },[]);
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
