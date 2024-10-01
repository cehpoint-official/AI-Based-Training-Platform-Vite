import React, { useEffect } from 'react';
import { Navbar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { serverURL } from '../../constants';
import axios from 'axios';

const AdminHead = () => {

    const navigate = useNavigate();
    function redirectHome() {
        navigate("/home");
    }

    useEffect(() => {
        async function dashboardData() {
            const postURL = serverURL + `/api/dashboard`;
            const response = await axios.post(postURL);
            sessionStorage.setItem('adminEmail', response.data.admin.email);
            if (response.data.admin.email !== sessionStorage.getItem('email')) {
                redirectHome();
            }
        }
        if (sessionStorage.getItem('adminEmail')) {
            if (sessionStorage.getItem('adminEmail') !== sessionStorage.getItem('email')) {
                redirectHome();
            }
        } else {
            dashboardData();
        }
         // eslint-disable-next-line 
    }, []);

    return (
        <Navbar fluid className='py-5 dark:bg-black bg-white border-black dark:text-white dark:border-white md:border-b'>
            <p className='font-black text-xl'>Admin Panel</p>
        </Navbar>
    );
};

export default AdminHead;