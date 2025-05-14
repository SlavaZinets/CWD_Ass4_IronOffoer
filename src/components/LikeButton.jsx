import React, { useState } from 'react';
import '../styles/likeButton.css';
import likeIcon from '../images/icons/like.svg';
import {isLogged} from '../stores/mainStore.js';
import { account} from "../stores/mainStore.js";
import {updateLikedCars} from "../services/mockApiService.js";


const LikeButton = ({ isLiked: initialIsLiked, id }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent navigation when clicking the like button
        setIsLiked(!isLiked);

        updateLikedCars(isLiked, id, account.get().id);
    };

    return (
        isLogged.get() ? (
            <button
                className={`like_button${isLiked ? " liked" : ""}`}
                onClick={handleClick}
            >
                <img className="like_icon" src={likeIcon.src} alt="like" />
            </button>
        ) : (
            <a className="like_button" href="/signIn">
                <img className="like_icon" src={likeIcon.src} alt="like" />
            </a>
        )
    );
};

export default LikeButton;