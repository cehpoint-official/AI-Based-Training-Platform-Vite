import React from 'react';

const TruncatedText = ({ text, len }) => {
    const words = text.split(' ');

    const isTruncated = words.length > len;

    const truncatedText = isTruncated ? words.slice(0, len).join(' ') + '...' : text;

    return (
        <span className='self-center whitespace-normal text-xl font-black dark:text-white'>
            {truncatedText}
        </span>
    );
};

export default TruncatedText;
