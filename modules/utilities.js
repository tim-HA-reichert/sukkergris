
//-----------------------------------
export async function fetchData(url, config) {

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok && data) {
            throw new Error("Something went wrong. Check the 'error.cause' object", 
                { cause: data });
        };

        return Promise.resolve(data); //returner et løst promise med data

    } catch (error) {

        return Promise.reject(error); //returnerer et avvist promise med feil-info

    }
}

// basic authentication -------------------------------------
export function createBasicAuthString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);
    return "basic " + b64Str; 
}

//Shorten date funksjon -------------------------------------
export function shortenDate (dateInp) {
    const dateData = new Date(dateInp);
    const dateLocalized = dateData.toLocaleDateString();
    return dateLocalized
}