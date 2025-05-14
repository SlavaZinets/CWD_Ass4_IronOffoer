import React, { useState, useEffect } from 'react';
import '../styles/likeButton.css';
import likeIcon from '../images/icons/like.svg';
import { isLogged, account } from "../stores/mainStore.js";
import { updateLikedCars } from "../services/mockApiService.js";

const LikeButton = ({ id }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if this car is in the user's liked cars
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

    }, [id, isLiked]);

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

            // Don't update UI optimistically - wait for API response

            // Convert id to number if it's a string
            const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            console.log(`Attempting to ${addToLikedCars ? 'add' : 'remove'} car ${numericId} ${addToLikedCars ? 'to' : 'from'} liked cars`);

            // Call API to update liked cars
            const updatedAccount = await updateLikedCars(addToLikedCars, numericId, userData.id);

            // Only update UI if API call was successful
            if (updatedAccount) {
                console.log('Successfully updated liked cars, updating UI');
                setIsLiked(addToLikedCars);

                // Update the account store with the new data
                account.set(updatedAccount);
            } else {
                console.error('Failed to update liked cars: No response from API');
            }
        } catch (error) {
            console.error("Error updating liked cars:", error);
            // Don't change UI state since we didn't update it optimistically
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