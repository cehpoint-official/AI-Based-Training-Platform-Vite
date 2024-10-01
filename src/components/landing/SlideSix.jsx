import React from 'react';
import { useNavigate } from "react-router-dom";

const SlideSix = () => {

    const navigate = useNavigate();

    function redirectSignIn() {
        navigate("/signin");
    }
    function redirectSignUp() {
        navigate("/signup");
    }

    return (
        <div className='dark:bg-black px-6 pb-16 pt-10'>
            <div className="flex flex-col max-md:items-center justify-between border border-black bg-white py-10 px-16 dark:border-white dark:bg-black md:flex-row">
                <div className="mb-4 md:mb-0 md:mr-4 max-md:text-center">
                    <h2 className="mb-2 text-4xl max-md:text-2xl font-black dark:text-white">Get Started</h2>
                    <p className="flex items-center font-normal max-md:text-xs text-black dark:text-white">
                        Embark on your learning journey with simplicity Get Started Today.
                    </p>
                </div>
                <div className="flex flex-shrink-0 items-center">
                    <p
                        onClick={redirectSignIn}
                        className="mr-3 inline-flex items-center justify-center border-black text-black border px-3 py-2 font-medium dark:border-white dark:text-white"
                    >

                        SignIn
                    </p>
                    <p
                        onClick={redirectSignUp}
                        className="mr-2 inline-flex items-center justify-center bg-black text-white px-3 py-2 font-medium dark:bg-white dark:text-black"
                    >
                        SignUp

                    </p>

                </div>
            </div>
        </div>
    );
};

export default SlideSix;
