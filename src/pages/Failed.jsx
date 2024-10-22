import React from 'react';
import Header from '../components/Header';
import Footers from '../components/Footers';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const Failed = () => {

    const navigate = useNavigate();
    function redirectPricing() {
      navigate("/pricing");
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center py-8'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Payment Failed</p>
                    <p className='text-center font-normal text-black py-4 dark:text-white'>Your payment failed<br></br>You can start the payment process again</p>
                    <Button className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none max-w-sm enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={redirectPricing}>Start Again</Button>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Failed;