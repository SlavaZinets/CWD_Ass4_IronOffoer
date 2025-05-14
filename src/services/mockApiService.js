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


export const updateLikedCars = async (isLiked, carId, accountId) => {

    try {
        const account = await fetch(`${url}/${accountId}`, {
            method: "GET",
        }).then((response) => response.json());

        if (isLiked) {
            account.likedCars.push(carId);
        } else {
            account.likedCars = account.likedCars.filter((id) => id !== carId);
        }

        await updateAccount(account);



    } catch (error) {
        console.log(error);
    }
}




export const deleteAccount = async (id) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete account");
        }
        const deletedAccount = await response.json();
        console.log(deletedAccount);
        return deletedAccount;
    } catch (error) {
        console.log(error);
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



