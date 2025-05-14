import React, { useState } from "react";
import "../styles/global.css";
import "../styles/signIn-signUp.css";
import loginSideImage from "../images/icons/loginPagePhoto2.webp";
import {account, isLogged} from "../stores/mainStore.js";
import {getAccounts} from "../services/mockApiService.js";

export default function SignIn ({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please enter a valid email address.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address.");
        setShowError(true);
        return;
    }

    // Validate password is not empty
    if (!password.trim()) {
        setErrorMessage("Please enter your password.");
        setShowError(true);
        return;
    }

    // Set submitting state
    setIsSubmitting(true);
    setShowError(false);

    try {
        const accounts = await getAccounts();
        const accountData = accounts.find((acc) => acc.email === email && acc.password === password);

        if (accountData) {
            // Update session storage
            sessionStorage.setItem("account", JSON.stringify(accountData));
            sessionStorage.setItem("isLogged", "true");

            // Update mainStore
            account.set(accountData);
            isLogged.set(true);

            // Call onLoginSuccess callback if provided
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                // Default behavior if no callback provided
                window.location.href = "/";
            }
        } else {
            // Invalid credentials
            isLogged.set(false);
            setErrorMessage("Invalid email or password.");
            setShowError(true);
        }
    } catch (error) {
        console.error("Error during sign in:", error);
        setErrorMessage("An error occurred. Please try again.");
        setShowError(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-in-section">
      <div className="sign-in-container">
        <h4 className="company-name-sign-in">Iron offer</h4>
        <div className="sign-in-header">
          <h2 className="sign-in-title">Hello again!</h2>
          <p className="sign-in-sub-title">
            Log in to continue bidding on the best car deals.
          </p>
        </div>
        <form className="sign-in-form">
          <label>
            Email
            <input
              className="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <div className={`error-message ${showError ? 'visible' : ''}`}>
            {errorMessage}
          </div>
          <label>
            Password
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="password"
              type="password"
              placeholder="Enter your password"
            />
          </label>

          <button
            className="sign-in-button"
            onClick={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

        </form>
        <span>
          Don't have an account?{" "}
          <a href="/signUp" className="sign-in">
            Sign Up
          </a>
        </span>
      </div>
      <img
        src={loginSideImage.src || loginSideImage}
        alt="Login side img"
        className="login-side-image-sign-in"
      />
    </div>
  );
};
