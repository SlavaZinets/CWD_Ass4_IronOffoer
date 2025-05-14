import React, { useState, useEffect } from 'react';
import "../styles/global.css";
import "../styles/account.css";
import "../styles/popUpContainer.css";
import "../styles/catalog.css";
import defaultAvatarIcon from "../images/icons/accountIcon.svg";

import { cars } from "../data/cars.js";
import ProductCard from "./ProductCard.jsx";

import SignIn from "./SignIn.jsx";
import { isLogged, account } from "../stores/mainStore.js";
import { updateAccount } from "../services/mockApiService.js";
import PopUpContainer from "./PopUpContainer.jsx";

export default function Account() {


    const [activeSection, setActiveSection] = useState(0);

    const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: null });
    const [likedCars, setLikedCars] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: ''
    });


    useEffect(() => {
        const isUserLoggedIn = sessionStorage.getItem("isLogged") === "true";
        if (isUserLoggedIn) {
            const accountData = JSON.parse(sessionStorage.getItem("account"));
            if (accountData) {
                account.set(accountData);
                isLogged.set(true);

                setFormData({
                    name: accountData.name || '',
                    lastName: accountData.lastName || '',
                    dateOfBirth: accountData.dateOfBirth || '',
                    email: accountData.email || '',
                    phoneNumber: accountData.phoneNumber || ''
                });

                setLikedCars(accountData.likedCars || []);

            }
        }
    }, []);


    const handleSectionChange = (index) => {
        setActiveSection(index);
    };

    // Edit functionality now handled by PopUpContainer

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Get current account data from store
        const currentAccount = account.get();

        if (!currentAccount || !currentAccount.id) {
            console.error("Cannot update account: No account data or ID found");
            setUpdateStatus({ loading: false, success: false, error: "No account data found" });
            return;
        }

        // Set loading state
        setUpdateStatus({ loading: true, success: false, error: null });

        // Create updated account object
        const updatedAccount = {
            ...currentAccount,
            name: formData.name,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            email: formData.email,
            phoneNumber: formData.phoneNumber
        };

        try {
            const result = await updateAccount(updatedAccount);

            if (result) {
                sessionStorage.setItem("account", JSON.stringify(result));

                account.set(result);

                // Update local state
                setFormData({
                    name: result.name,
                    lastName: result.lastName,
                    dateOfBirth: result.dateOfBirth,
                    email: result.email,
                    phoneNumber: result.phoneNumber
                });

                // Set success state
                setUpdateStatus({ loading: false, success: true, error: null });

                // Reset success message after 3 seconds
                setTimeout(() => {
                    setUpdateStatus({ loading: false, success: false, error: null });
                }, 3000);
            }
        } catch (error) {
            setUpdateStatus({ loading: false, success: false, error: "Failed to update account" });
        }
    };

    // Handle sign out
    const handleSignOut = () => {
        // Clear session storage
        sessionStorage.removeItem("account");
        sessionStorage.removeItem("isLogged");

        // Update mainStore
        isLogged.set(false);
        account.set(null);

        // Redirect to home page
        window.location.href = "/";
    };

    // Handle successful login
    const handleLoginSuccess = () => {
        // Get account data from session storage
        const accountData = JSON.parse(sessionStorage.getItem("account"));
        if (accountData) {
            // Update mainStore with account data
            account.set(accountData);
            isLogged.set(true);

            // Update form data with account data
            setFormData({
                name: accountData.name || '',
                lastName: accountData.lastName || '',
                dateOfBirth: accountData.dateOfBirth || '',
                email: accountData.email || '',
                phoneNumber: accountData.phoneNumber || ''
            });
        }
    };

    return (
        <div className="account-container">
            {!isLogged.get() ? (
                <div className="not-logged-in">
                    <h2>Please sign in to view your account</h2>
                    <PopUpContainer buttonText="Sign In" buttonStyle="sign-in-button">
                        <SignIn onLoginSuccess={handleLoginSuccess} />
                    </PopUpContainer>
                </div>
            ) : (
                <>
                    <div className="sub-header">
                        <h2 className="welcome-text">Hello, {formData.name}</h2>
                        <div className="nav-options">
                            <button
                                className={`option-button ${activeSection === 0 ? 'clicked-option-button' : ''}`}
                                onClick={() => handleSectionChange(0)}
                            >
                                Personal information
                            </button>
                            <button
                                className={`option-button ${activeSection === 1 ? 'clicked-option-button' : ''}`}
                                onClick={() => handleSectionChange(1)}
                            >
                                Wish list
                            </button>
                        </div>
                    </div>

                    <div className="account">
                        <aside className="profile-sidebar">
                            <div className="avatar-section">
                                        <img
                                            className="default-avatar-icon"
                                            src={defaultAvatarIcon.src}
                                            alt="avatar"
                                        />

                                <span className="avatar-label-name">{formData.name} {formData.lastName}</span>
                                <span className="avatar-label-email">{formData.email}</span>
                            </div>
                            <button className="sign-out-button" onClick={handleSignOut}>Sign out</button>
                        </aside>

                        <div className="personal-info-section">
                            <div className={`option-section ${activeSection === 0 ? 'option-section-active' : ''}`}>
                                <div className="personal-info-header">
                                    <h3 className="personal-info-title">Personal information</h3>
                                    <PopUpContainer buttonText="Edit" buttonStyle="edit-info-button">
                                        <div className="edit-menu edit-menu-active">
                                                <h2 className="form-heading">Edit personal information</h2>
                                            <div className="edit-info-form">
                                                <div className="form-items">
                                                    <div className="form-item-name-fields">
                                                        <label className="item-label" htmlFor="name">
                                                            First Name
                                                        </label>
                                                        <label className="item-label" htmlFor="lastName">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            placeholder="Enter Name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                        />
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            placeholder="Enter Last name"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="form-item">
                                                        <label className="item-label">
                                                            Phone Number
                                                            <input
                                                                className="form-input"
                                                                type="text"
                                                                placeholder="Enter Phone Number"
                                                                name="phoneNumber"
                                                                value={formData.phoneNumber}
                                                                onChange={handleInputChange}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="form-item">
                                                        <label className="item-label">
                                                            Date of Birth
                                                            <input
                                                                className="form-input"
                                                                type="text"
                                                                placeholder="Enter date of birth"
                                                                name="dateOfBirth"
                                                                value={formData.dateOfBirth}
                                                                onChange={handleInputChange}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <button
                                                    className="submit-button"
                                                    onClick={handleSubmit}
                                                    disabled={updateStatus.loading}
                                                >
                                                    Save changes
                                                </button>
                                                {updateStatus.success && (
                                                    <div className="update-success-message">Account updated successfully!</div>
                                                )}
                                                {updateStatus.error && (
                                                    <div className="update-error-message">{updateStatus.error}</div>
                                                )}
                                            </div>
                                        </div>
                                    </PopUpContainer>
                                </div>
                        <div className="personal-info-container">
                            <div className="personal-info">
                                <h4>Name</h4>
                                <span className="info-cell">{formData.name}</span>
                            </div>
                            <div className="personal-info">
                                <h4>Last Name</h4>
                                <span className="info-cell">{formData.lastName}</span>
                            </div>
                            <div className="personal-info">
                                <h4>Email address</h4>
                                <span className="info-cell">{formData.email}</span>
                            </div>
                            <div className="personal-info">
                                <h4>Phone number</h4>
                                <span className="info-cell">{formData.phoneNumber}</span>
                            </div>
                            <div className="personal-info">
                                <h4>Date of birth</h4>
                                <span className="info-cell">{formData.dateOfBirth}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`option-section ${activeSection === 1 ? 'option-section-active' : ''}`}>
                        <h3 className="wishlist-title">My Wishlist</h3>
                        {likedCars.length === 0 ? (
                            <div className="empty-wishlist">
                                <p>Your wishlist is empty. Like some cars to add them here!</p>
                            </div>
                        ) : (
                            <div className="catalog">
                                {cars
                                    .filter(car => likedCars.includes(car.id))
                                    .map((car) => (
                                        <ProductCard key={car.id} car={car} />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
                </>
            )}
        </div>
    );
}
