import React from 'react';

const StyledText = ({ text }) => {

    return <div className='text-black dark:text-white' dangerouslySetInnerHTML={{ __html: text }} />;
};

export default StyledText;