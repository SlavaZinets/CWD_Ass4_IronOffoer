import React, { useState } from "react";
import "../styles/global.css";
import "../styles/signIn-signUp.css";
import loginSideImage from "../images/icons/registerPagePhoto.webp";
import { addAccount, getAccounts } from "../services/mockApiService.js";
import { account, isLogged } from "../stores/mainStore.js";

export default function SignUp() {
  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // State for error messages
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    emailExists: false,
    passwordEmpty: false,
    passwordLength: false,
    passwordUppercase: false,
    passwordNumber: false,
    passwordMatch: false,
    phoneNumber: false,
    birthDate: false
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      email: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
      emailExists: false, // Will check this after basic validation
      passwordEmpty: password.trim() === "",
      passwordLength: password.length < 8,
      passwordUppercase: !/[A-Z]/.test(password),
      passwordNumber: !/[0-9]/.test(password),
      passwordMatch: password !== repeatPassword,
      phoneNumber: phoneNumber.trim() === "",
      birthDate: birthDate.trim() === ""
    };

    // Update the errors state
    setErrors(newErrors);

    // Check if there are any basic validation errors
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    // Set submitting state
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if email already exists
      const existingAccounts = await getAccounts();
      const emailExists = existingAccounts.some(account => account.email === email);

      if (emailExists) {
        // Email already exists, show error
        setErrors(prev => ({ ...prev, emailExists: true }));
        setIsSubmitting(false);
        return;
      }

    // Continue with account creation
      // Create new account object
      const newAccount = {
        name: firstName,
        lastName: lastName,
        dateOfBirth: birthDate,
        email: email,
        password: password, // Important: Include password for login
        phoneNumber: phoneNumber,
        likedCars: [] // Initialize empty liked cars array
      };

      // Call API to create account
      const createdAccount = await addAccount(newAccount);

      if (createdAccount) {
        console.log("Account created successfully:", createdAccount);

        // Update session storage
        sessionStorage.setItem("account", JSON.stringify(createdAccount));
        sessionStorage.setItem("isLogged", "true");

        // Update store
        account.set(createdAccount);
        isLogged.set(true);

        // Redirect to account page
        window.location.href = "/account";
      }
    } catch (error) {
      setSubmitError("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="sign-up-section">
        <div className="sign-up-container">
          <h4 className="company-name">Iron offer</h4>
          <div className="sign-up-header">
            <h2 className="sign-up-title">Create a new account</h2>
          </div>
          <form className="sign-in-form">
            <div className="first-last-name-wrapper">
              <label>
                First name
                <input
                  className="first-name"
                  type="text"
                  placeholder="Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label>
                Last name
                <input
                  className="last-name"
                  type="text"
                  placeholder="Surname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <div className={`error-message ${errors.firstName ? 'visible' : ''}`}>
              First name is required.
            </div>
            <div className={`error-message ${errors.lastName ? 'visible' : ''}`}>
              Last name is required.
            </div>
            <label>
              Email
              <input
                className="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <div className={`error-message ${errors.email ? 'visible' : ''}`}>
              Please enter a valid email address.
            </div>
            <div className={`error-message ${errors.emailExists ? 'visible' : ''}`}>
              This email is already registered. Please use a different email or sign in.
            </div>
            <label>
              Password
              <input
                className="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div className={`error-message ${errors.passwordEmpty ? 'visible' : ''}`}>
              Password field cannot be empty.
            </div>
            <div className={`error-message ${errors.passwordLength ? 'visible' : ''}`}>
              Password must be at least 8 characters long.
            </div>
            <div className={`error-message ${errors.passwordUppercase ? 'visible' : ''}`}>
              Password must contain at least one uppercase letter.
            </div>
            <div className={`error-message ${errors.passwordNumber ? 'visible' : ''}`}>
              Password must include at least one number.
            </div>

            <label>
              Repeat password
              <input
                className="repeat-password"
                type="password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </label>
            <div className={`error-message ${errors.passwordMatch ? 'visible' : ''}`}>
              Passwords do not match.
            </div>
            <label>
              Phone number
              <input
                type="tel"
                className="phone-input"
                placeholder="+012345678901"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <div className={`error-message ${errors.phoneNumber ? 'visible' : ''}`}>
              Phone number is required.
            </div>
            <label>
              Birth Date
              <input
                type="date"
                className="date-input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </label>
            <div className={`error-message ${errors.birthDate ? 'visible' : ''}`}>
              Birth Date is required.
            </div>

            {submitError && (
              <div className="update-error-message">{submitError}</div>
            )}

            <button
              className="sign-up-button"
              onClick={handleRegister}
              disabled={isSubmitting}
            >
              Register
            </button>
          </form>
          <span>
            Already have an account? <a href="/signIn" className="sign-in">Sign in</a>
          </span>
        </div>
        <img
          src={loginSideImage.src || loginSideImage}
          alt="Login side img"
          className="login-side-image-sign-up"
        />
      </div>
    </div>
  );
}
