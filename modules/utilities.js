
// fetch wrapper function -----------------------------------
export async function fetchData(url, config) {

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok && data) {
            throw new Error("Something went wrong. Check the 'error.cause' object", 
                { cause: data });
        }

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

//-----------------------------------------------------------
// more utility-functions here if needed...
