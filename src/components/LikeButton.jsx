import React, { useState } from 'react';
import '../styles/likeButton.css';
import likeIcon from '../images/icons/like.svg';


const LikeButton = ({ isLiked: initialIsLiked }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent navigation when clicking the like button
        setIsLiked(!isLiked);
    };

    return (
        <button
            className={`like_button absolute_position${isLiked ? " liked" : ""}`}
            onClick={handleClick}
        >
            <img className="like_icon" src={likeIcon.src} alt="like" />
        </button>
    );
};

export default LikeButton;