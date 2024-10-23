import React, { useEffect, useState } from 'react';
import urls from '../../assets/pictures';

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theme, setTheme] = useState('dark');
    const text = ["Generate courses using AI", "Learn and Upskill yourself", "Land your Dream job"];
    const buttons=["Generate","Learn","more"]
    // const toggleTheme = () => {
    //     const newTheme = theme === 'dark' ? 'light' : 'dark';
    //     setTheme(newTheme);
    //     sessionStorage.setItem('theme', newTheme);
    // };
    // useEffect(() => {
    //     const storedTheme = sessionStorage.getItem('darkMode') || 'dark';
    //     setTheme(storedTheme==true?"dark":"light");
    // }, [sessionStorage.getItem('darkMode')]);
    // setInterval(()=>{
    //     handleNext();
    // },1000)

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % urls.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + urls.length) % urls.length);
    };

    return (
        <div className="">
            <div className={`relative overflow-hidden w-full h-96 bg-white dark:bg-black transition-colors duration-500`}>
                <div className="relative w-full h-full">
                    {urls.map((url, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full flex transition-transform duration-500 ease-in-out ${
                                index === currentIndex ? 'translate-x-0' : index > currentIndex ? 'translate-x-full' : '-translate-x-full'
                            }`}
                        >
                            <div className="w-full sm:w-1/4 p-4 sm:p-8 flex flex-col justify-center">
                                <p className="mb-6 px-4 font-bold text-2xl sm:text-3xl text-black dark:text-white">
                                    {text[currentIndex]}
                                </p>
                                <button className="px-4 py-2 rounded-md hover:bg-opacity-80 transition duration-300 bg-black text-white dark:bg-white dark:text-black">
                                    {buttons[currentIndex]}
                                </button>
                            </div>
                            <div className="w-full sm:w-3/4 h-full">
                                <img 
                                    src={url} 
                                    alt={`Slide ${index}`} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handlePrev} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 focus:outline-none text-gray-900 dark:bg-black dark:text-white">
                    ❮
                </button>
                <button 
                    onClick={handleNext} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 focus:outline-none text-gray-900 dark:bg-black dark:text-white">
                    ❯
                </button>
            </div>
        </div>
    );
};

export default Slider;
