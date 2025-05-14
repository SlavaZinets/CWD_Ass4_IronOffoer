const url = "https://6824774465ba0580339a69ea.mockapi.io/accounts"

export const addAccount = async (account) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account),
        });
        if (!response.ok) {

        }
        const newAccount = await response.json();
        console.log(newAccount);
        return newAccount;
    } catch (error) {
        console.log(error);
    }
}

export const updateAccount = async (account) => {
    try {
        const response = await fetch(`${url}/${account.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account),
        });
        if (!response.ok) {
            throw new Error("Failed to update account");
        }
        const updatedAccount = await response.json();
        console.log(updatedAccount);
        return updatedAccount;

    } catch (error) {
        console.log(error);
    }
}


// addToLikedCars: if true, adds the car to liked cars; if false, removes it
export const updateLikedCars = async (addToLikedCars, carId, accountId) => {
    if (!accountId) {
        console.error('Cannot update liked cars: No account ID provided');
        return;
    }

    try {
        // Get the current account data
        const response = await fetch(`${url}/${accountId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch account: ${response.status}`);
        }

        const account = await response.json();
        console.log('Current account data:', account);

        // Initialize likedCars array if it doesn't exist
        if (!account.likedCars) {
            account.likedCars = [];
        }

        // Convert carId to number if it's a string
        const numericCarId = typeof carId === 'string' ? parseInt(carId, 10) : carId;
        console.log(`Action: ${addToLikedCars ? 'Adding' : 'Removing'} car ${numericCarId} ${addToLikedCars ? 'to' : 'from'} liked cars`);

        if (addToLikedCars) {
            // Add car ID to liked cars if not already present
            if (!account.likedCars.includes(numericCarId)) {
                account.likedCars.push(numericCarId);
                console.log(`Added car ${numericCarId} to liked cars`);
            } else {
                console.log(`Car ${numericCarId} already in liked cars, no action needed`);
            }
        } else {
            // Remove car ID from liked cars
            const initialLength = account.likedCars.length;
            account.likedCars = account.likedCars.filter(id => id !== numericCarId);
            if (account.likedCars.length < initialLength) {
                console.log(`Removed car ${numericCarId} from liked cars`);
            } else {
                console.log(`Car ${numericCarId} not found in liked cars, no action needed`);
            }
        }

        console.log('Updated likedCars:', account.likedCars);

        // Update account in API
        const updatedAccount = await updateAccount(account);
        console.log('Account updated successfully:', updatedAccount);

        // Update session storage
        if (updatedAccount) {
            sessionStorage.setItem("account", JSON.stringify(updatedAccount));
        }

        return updatedAccount;
    } catch (error) {
        throw error;
    }
}

export const getAccounts = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch accounts");
        }
        const accounts = await response.json();
        console.log(accounts);
        return accounts;
    } catch (error) {
        console.log(error);
    }
}



