import React from 'react';

function HighlightText({ text }) {
    return (
        <span className='bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text font-bold'>
            {" "}
            {text}
        </span>
    );
}

export default HighlightText;