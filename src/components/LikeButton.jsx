import React, { useState, useEffect } from 'react';
import '../styles/likeButton.css';
import likeIcon from '../images/icons/like.svg';
import { isLogged, account } from "../stores/mainStore.js";
import { updateLikedCars } from "../services/mockApiService.js";

const LikeButton = ({ id }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if this car is in the user's liked cars when component mounts or account changes
    useEffect(() => {
        // Function to check if the car is liked
        const checkIfLiked = () => {
            // Get user data from session storage for most up-to-date info
            const userDataStr = sessionStorage.getItem("account");
            if (!userDataStr) return;

            try {
                const userData = JSON.parse(userDataStr);
                if (userData && userData.likedCars) {
                    // Convert id to number if it's a string
                    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
                    const isCarLiked = userData.likedCars.includes(numericId);
                    setIsLiked(isCarLiked);
                }
            } catch (error) {
                console.error("Error parsing account data:", error);
            }
        };

        // Check initially
        checkIfLiked();

        // Set up subscription to account changes
        const unsubscribe = account.subscribe(() => {
            checkIfLiked();
        });

        // Clean up subscription
        return () => unsubscribe();
    }, [id]);

    const handleClick = async (e) => {
        e.preventDefault(); // Prevent navigation when clicking the like button

        // Prevent multiple clicks while processing
        if (isProcessing) return;

        // Check if user is logged in
        const userLoggedIn = sessionStorage.getItem("isLogged") === "true";

        if (!userLoggedIn) {
            // Redirect to account page for sign in
            window.location.href = '/account';
            return;
        }

        // Get user data from session storage
        const userDataStr = sessionStorage.getItem("account");
        if (!userDataStr) {
            console.error("No account data found in session storage");
            return;
        }

        try {
            const userData = JSON.parse(userDataStr);
            if (!userData || !userData.id) {
                console.error("Invalid account data");
                return;
            }

            // Set processing state
            setIsProcessing(true);

            // If currently liked, we want to remove it (addToLikedCars=false)
            // If currently not liked, we want to add it (addToLikedCars=true)
            const addToLikedCars = !isLiked;

            // Update UI optimistically
            setIsLiked(addToLikedCars);

            // Call API to update liked cars
            await updateLikedCars(addToLikedCars, id, userData.id);

            // Update the account store with the new data from session storage
            const updatedUserDataStr = sessionStorage.getItem("account");
            if (updatedUserDataStr) {
                const updatedUserData = JSON.parse(updatedUserDataStr);
                account.set(updatedUserData);
            }
        } catch (error) {
            console.error("Error updating liked cars:", error);
            // Revert UI state if API call fails
            setIsLiked(!isLiked);
        } finally {
            // Clear processing state
            setIsProcessing(false);
        }
    };

    return (
        <button
            className={`like_button${isLiked ? " liked" : ""}${isProcessing ? " processing" : ""}`}
            onClick={handleClick}
            disabled={isProcessing}
        >
            <img className="like_icon" src={likeIcon.src || likeIcon} alt="like" />
        </button>
    );
};

export default LikeButton;