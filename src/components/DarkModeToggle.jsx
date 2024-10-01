import React, { useState, useEffect } from 'react';
import { HiSun, HiMoon } from "react-icons/hi";


const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = sessionStorage.getItem('darkMode');
        if (storedTheme !== null) {
            return storedTheme === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        window.location.reload();
    };

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
        sessionStorage.setItem('darkMode', isDarkMode);
    });

    return (
        <button
            className="p-2 rounded-full dark:text-white text-black"
            onClick={toggleDarkMode}
        >
            {isDarkMode ? <HiMoon size={20} /> : <HiSun size={20} />}
        </button>
    );
};

export default DarkModeToggle;
