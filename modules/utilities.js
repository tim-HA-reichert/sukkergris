
// fetch wrapper function -----------------------------------
export async function fetchData(url, config) {

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok && data) {
            throw new Error("Something went wrong. Check the 'error.cause' object", 
                { cause: data });
        };

        return Promise.resolve(data); //returns a resolved promise with data

    } catch (error) {

        return Promise.reject(error); //returns a rejected promise with error-info

    }
}


// basic authentication -------------------------------------
export function createBasicAuthString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);
    return "basic " + b64Str; 
}

//Shorten date function -------------------------------------
export function shortenDate (dateInp) {
    const dateData = dateInp;
    const dateShortened = dateData.split("T")[0];
    const dateModified = dateShortened.replace(/-/g, ".");
    return dateModified
}

//Add a function to match user_id and id, so we can assign username to posters on forums. 

export function matchID(aUserId, IDtoMatch){
    let username = (aUserId.user_id === IDtoMatch.id) ? IDtoMatch.username : null;
    return username;
};

//-----------------------------------------------------------
// more utility-functions here if needed...
