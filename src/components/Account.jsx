import React, { useState, useEffect } from 'react';
import "../styles/global.css";
import "../styles/account.css";
import "../styles/popUpContainer.css";
import "../styles/catalog.css";

import avatarIcon1 from "../images/icons/avatar_icon1.svg";
import avatarIcon2 from "../images/icons/avatar_icon2.svg";
import avatarIcon4 from "../images/icons/avatar_icon3.svg";
import editIcon from "../images/icons/editIco.svg";
import closeIcon from "../images/icons/close-icon.svg";
import { cars } from "../data/cars.js";
import ProductCard from "./ProductCard.jsx";
import { accounts } from "../data/accounts";
import SignIn from "./SignIn.jsx";
import { isLogged, account } from "../stores/mainStore.js";
import { getAccounts, updateAccount } from "../services/mockApiService.js";

export default function Account(props) {
    // Destructure props with default values
    const {
        name = '',
        lastName = '',
        dateOfBirth = '',
        email = '',
        phoneNumber = '',
        avatarSrc = null
    } = props || {};


    const [activeSection, setActiveSection] = useState(0);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showSignInPopup, setShowSignInPopup] = useState(false);

    const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: null });
    const [likedCars, setLikedCars] = useState([]);

    const [formData, setFormData] = useState({
        name: name || '',
        lastName: lastName || '',
        dateOfBirth: dateOfBirth || '',
        email: email || '',
        phoneNumber: phoneNumber || ''
    });

    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [currentAvatarSrc, setCurrentAvatarSrc] = useState(avatarSrc || null);

    useEffect(() => {
        const isUserLoggedIn = sessionStorage.getItem("isLogged") === "true";
        if (!isUserLoggedIn) {
            setShowSignInPopup(true);
        } else {
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

                if (accountData.avatarSrc) {
                    setCurrentAvatarSrc(accountData.avatarSrc);
                }
            }
        }
    }, []);


    //TODO: check if this useEffect is redundant

    // Listen for changes in the mainStore account state
    useEffect(() => {
        const unsubscribe = account.subscribe(accountData => {
            if (accountData) {
                setFormData({
                    name: accountData.name || '',
                    lastName: accountData.lastName || '',
                    dateOfBirth: accountData.dateOfBirth || '',
                    email: accountData.email || '',
                    phoneNumber: accountData.phoneNumber || ''
                });

                if (accountData.avatarSrc) {
                    setCurrentAvatarSrc(accountData.avatarSrc);
                }

                // Update liked cars
                if (accountData.likedCars) {
                    setLikedCars(accountData.likedCars);
                }
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSectionChange = (index) => {
        setActiveSection(index);
    };

    const handleEditClick = () => {
        setIsPopupOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAvatarSelect = (src) => {
        setSelectedAvatar(src);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Get current account data from store
        const currentAccount = account.get();

        if (!currentAccount || !currentAccount.id) {
            console.error("Cannot update account: No account data or ID found");
            setUpdateStatus({ loading: false, success: false, error: "No account data found" });
            setIsPopupOpen(false);
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

        // If an avatar was selected, update it
        if (selectedAvatar) {
            updatedAccount.avatarSrc = selectedAvatar;
            setCurrentAvatarSrc(selectedAvatar);
        }

        try {
            // Update account in MockAPI
            const result = await updateAccount(updatedAccount);

            if (result) {
                // Update session storage
                sessionStorage.setItem("account", JSON.stringify(result));

                // Update store
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
                console.log("Account updated successfully");

                // Reset success message after 3 seconds
                setTimeout(() => {
                    setUpdateStatus({ loading: false, success: false, error: null });
                }, 3000);
            }
        } catch (error) {
            console.error("Failed to update account:", error);
            setUpdateStatus({ loading: false, success: false, error: "Failed to update account" });
        }

        // Close the popup
        setIsPopupOpen(false);
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
        setShowSignInPopup(false);

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

            if (accountData.avatarSrc) {
                setCurrentAvatarSrc(accountData.avatarSrc);
            }
        }
    };

    return (
        <div className="account-container">
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
                        <div className="default-avatar-icon">
                            {currentAvatarSrc && (
                                <img
                                    src={typeof currentAvatarSrc === 'object' && currentAvatarSrc.src ? currentAvatarSrc.src : currentAvatarSrc}
                                    alt="avatar"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                />
                            )}
                        </div>
                        <span className="avatar-label-name">{formData.name} {formData.lastName}</span>
                        <span className="avatar-label-email">{formData.email}</span>
                    </div>
                    <button className="sign-out-button" onClick={handleSignOut}>Sign out</button>
                </aside>

                <div className="personal-info-section">
                    <div className={`option-section ${activeSection === 0 ? 'option-section-active' : ''}`}>
                        <div className="personal-info-header">
                            <h3 className="personal-info-title">Personal information</h3>
                            <button className="edit-info-button" onClick={handleEditClick}>
                                <img
                                    src={editIcon.src || editIcon}
                                    alt="edit icon button"
                                    className="edit-icon"
                                />
                                <span className="editTitleBtn">Edit</span>
                            </button>
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

            {isPopupOpen && (
                <div className="pop-up-container active">
                    <div className="pop-up">
                        <div className="close-button-container">
                            <button className="close-button" onClick={() => setIsPopupOpen(false)}>
                                <img src={closeIcon && closeIcon.src ? closeIcon.src : closeIcon} alt="close-button" />
                            </button>
                        </div>
                        <div className="edit-menu edit-menu-active">
                            <div className="avatar-select-menu">
                                <h2 className="form-heading">Edit personal information</h2>
                                <div className="avatar-container">
                                    <div className={`avatarIcon ${selectedAvatar === avatarIcon1 ? 'avatarIcon-selected' : ''}`}
                                         onClick={() => handleAvatarSelect(avatarIcon1)}
                                    >
                                        <img
                                            src={typeof avatarIcon1 === 'object' && avatarIcon1.src ? avatarIcon1.src : avatarIcon1}
                                            alt="avatar1"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    </div>
                                    <div className={`avatarIcon ${selectedAvatar === avatarIcon2 ? 'avatarIcon-selected' : ''}`}
                                         onClick={() => handleAvatarSelect(avatarIcon2)}
                                    >
                                        <img
                                            src={typeof avatarIcon2 === 'object' && avatarIcon2.src ? avatarIcon2.src : avatarIcon2}
                                            alt="avatar2"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    </div>
                                    <div className={`avatarIcon ${selectedAvatar === avatarIcon4 ? 'avatarIcon-selected' : ''}`}
                                         onClick={() => handleAvatarSelect(avatarIcon4)}
                                    >
                                        <img
                                            src={typeof avatarIcon4 === 'object' && avatarIcon4.src ? avatarIcon4.src : avatarIcon4}
                                            alt="avatar3"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    </div>
                                </div>
                            </div>
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
                                            Email
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Enter Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </label>
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
                                    {updateStatus.loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                {updateStatus.success && (
                                    <div className="update-success-message">Account updated successfully!</div>
                                )}
                                {updateStatus.error && (
                                    <div className="update-error-message">{updateStatus.error}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sign In Popup */}
            {showSignInPopup && (
                <div className="pop-up-container active">
                    <div className="pop-up">
                        <SignIn onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            )}

            {/* Login Success Message - Removed */}
        </div>
    );
}
