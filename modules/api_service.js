
//this module contains the functions in the service layer
//----------------------------------------------------------

import { fetchData } from "./utilities.js";
import { createBasicAuthString } from "./utilities.js";
import { CategoryModel, DummyModel, LoginDataModel } from "./models.js";
import { errorHandler } from "./error_handler.js";
import { messageHandler } from "./messageHandler.js";

const groupKey = "LDDFEU28"; //Dette er vår gruppekode
const imgKey = "GFTPOE21";


const urlMap = {
    categoryURL: "https://sukkergris.onrender.com/webshop/categories",
    chosenCategoryURL: "https://sukkergris.onrender.com/webshop/products",
    chosenProductURL: "https://sukkergris.onrender.com/webshop/products",
    //Admin URL's
    adminLoginURL: "https://sukkergris.onrender.com/users/adminlogin",
    addProductURL: "https://sukkergris.onrender.com/webshop/products",
    deleteProductURL: "https://sukkergris.onrender.com/webshop/products",
    //
    AddUserURL: "https://sukkergris.onrender.com/users",
    userLoginURL: "https://sukkergris.onrender.com/users/login",
    userImageURL: "https://sukkergris.onrender.com/images/"
    // add more URL' here...
}

//----------------------------------------------------------
// return a list (array) of categories
//----------------------------------------------------------
export async function getCategories() {

    const url = urlMap.categoryURL + "?key=" + groupKey;

    try {

        const data = await fetchData(url);

        //convert from server API-data to app model-data
        const categoryList = data.map(function (value) {
            const catergoryObj = {
                categoryID: value.id,
                categoryName: value.category_name,
                description: value.description
            };
            return new CategoryModel(catergoryObj);
        });

        return categoryList; //return the promise       

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// return a list (array) of dummy-products based on category
//----------------------------------------------------------
export async function getChocolateByCategory(category) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;
    //Category er et tall, som er lik categoryID til eventListener i category_list_view.js


    try {
        const data = await fetchData(url);
        //data er en liste med sjokolade. Ufiltrert liste. 

        const chosenCat = [];

        for (let chocoCat of data) {
            if (chocoCat.category_id === category) {
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: chocoCat.thumb,
                    price: chocoCat.price
                };
                //fikk hjelp av chatGPT for .push og chosenCat array. 
                chosenCat.push(new DummyModel(chocoObj));
            };
        };

        return chosenCat;

    } catch (error) {
        errorHandler(error);
    }
}
//----------------------------------------------------------
// return details about chosen chocolate
//----------------------------------------------------------
export async function getChocolateDetails(chosenChocolateID) {
    const url = urlMap.chosenProductURL + "?id=" + chosenChocolateID + "&key=" + groupKey;

    try {
        const data = await fetchData(url);

        for (let chocoDet of data) {
            let chocoObj = {
                chocoID: chocoDet.id,
                categoryID: chocoDet.category_id,
                chocoName: chocoDet.name,
                categoryName: chocoDet.category_name,
                description: chocoDet.description,
                image: "https://sukkergris.onrender.com/images/" + imgKey + "/large/" + chocoDet.image,
                thumb: chocoDet.thumb,
                price: chocoDet.price,
                heading: chocoDet.heading,
                discount: chocoDet.discount,
                stock: chocoDet.stock,
                expected_shipped: chocoDet.expected_shipped,
                rating: chocoDet.rating,
                number_of_ratings: chocoDet.number_of_ratings
                //fikk hjelp av chatGPT for .push og chosenCat array.
            };

            return new DummyModel(chocoObj);
        };
        //     return chosenCat;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// return a dummy-product based on ID
//----------------------------------------------------------
export async function getDummyById(id) {

    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&id=" + id;

    //more code here...
}

//----------------------------------------------------------
// return all dummy-products
//----------------------------------------------------------
export async function getAllDummies() {

    const url = urlMap.chosenCategoryURL + "?key=" + groupKey;

    //more code here...
}

//----------------------------------------------------------
// add a dummy-product, returns the result
//----------------------------------------------------------
export async function addDummy(formDataObj) {

    const url = urlMap.chosenCategoryURL + "?key=" + groupKey;

    console.log(formDataObj.get("name"));

    try {

        const cfg = {
            method: "POST",
            body: formDataObj
        }

        const result = await fetchData(url, cfg);
        messageHandler(result);

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// Manages OrderModel
//----------------------------------------------------------

export function manageOrderModel(aOrderModel) { //klasse som parameter
    const classOrderModel = aOrderModel; //Refererer til klassen som er definert i main.js

    // classOrderModel.addItem("test") //eksempel på hvordan man kan kjøre en funksjon fra klassen


}

//----------------------------------------------------------
// return chocolates based on search-bar 
//----------------------------------------------------------

export async function getChocolateBySearch(searchValue) {
    //Use value from searchbar to filter chocolates. 
    //Add a onclick to searchBtn to trigger this function. 
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + searchValue;
    try {
        const data = await fetchData(url);

        const chosenCat = [];

        /*
        Chatgpt hjalp oss med denne. Den returnerer en tom array, funksjonen forventer en 
        array med innhold. Dette sier tydelig ifra til programmet når det ikke er noen treff eller match.  
        */
        if (searchValue.length <= 2) {
            messageHandler("Please enter more than 2 characters for the search.");
            return [];
        };

        //"i" er for case-insenstive
        const regexSearchTest = new RegExp(searchValue, "i");

        for (let chocoCat of data) {
            if (chocoCat.category_name.toLowerCase() === searchValue.toLowerCase() ||
                regexSearchTest.test(chocoCat.name)
            ) {
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: chocoCat.thumb,
                    price: chocoCat.price
                };
                chosenCat.push(new DummyModel(chocoObj));
            };
        };

        if (chosenCat.length === 0) {
            messageHandler("Nothing matches your search");
        };
        return chosenCat;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// admin and user log-in
//----------------------------------------------------------

export async function logIn(aForm, accountType) {

    const url = urlMap[`${accountType}LoginURL`] + "?key=" + groupKey; //Får tilgang til URLMapping, bruker brackets ([]) for å få tilgang til objekt element.

    //See if you can use loginModel here. Or if loginModel is for new users?
    //OR rather: store login data in LoginDataModel, such as admintoken. 
    const loginCred = {
        username: aForm.get("username"),
        password: aForm.get("password"),
    }

    const authString = createBasicAuthString(loginCred.username, loginCred.password);

    const cfg = {
        method: "POST",
        headers: {
            "authorization": authString
        }
    }

    try {
        const result = await fetchData(url, cfg);
        messageHandler("Login", "User logged in successfully");

        const loginDataObj = {
            superuser: result.logindata.superuser,
            thumb: result.logindata.thumb,
            token: result.logindata.token,
            userid: result.logindata.userid,
            username: result.logindata.username,
            city: result.logindata.city,
            country: result.logindata.country,
            full_name: result.logindata.full_name,
            street: result.logindata.street,
            zipcode: result.logindata.zipcode,
        };
        const loginData = new LoginDataModel(loginDataObj);
        return loginData;


    } catch (error) {
        errorHandler(error);
    };
};

//----------------------------------------------------------
// Gets user profile image
//----------------------------------------------------------
export function getUserImage(userModel) {
    const imageUrl = urlMap.userImageURL + groupKey + "/users/" + userModel.thumb
    return imageUrl;
}

//----------------------------------------------------------
// Add a new product
//----------------------------------------------------------

export async function addProduct(aToken, aNewProductForm) {

    const url = urlMap.addProductURL + "?key=" + groupKey;

    const adminToken = aToken;
    const formData = aNewProductForm;

    try {

        const cfg = {
            method: "POST",
            headers: {
                "authorization": adminToken
            },
            body: formData
        }

        const result = await fetchData(url, cfg);

        messageHandler(result);
        return result;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// Delete a product made by admin 
//----------------------------------------------------------

export async function deleteProduct(aToken, aProductID) {

    const url = urlMap.deleteProductURL + "?id=" + aProductID + "key=" + groupKey;

    let adminToken = aToken;

    try {
        const cfg = {
            method: "DELETE",
            headers: {
                "authorization": adminToken
            }
        }

        const result = await fetchData(url, cfg);

        messageHandler(result);
        return result;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// Adds user
//----------------------------------------------------------


export async function addUser(aForm) {
    const url = urlMap.AddUserURL + "?key=" + groupKey;
    const formData = aForm;
    // for (let [key, value] of aForm.entries()) {
    //     console.log(`${key}: ${value}`); //logger input som er sendt til server
    // }

    try {

        const cfg = {
            method: "POST",
            body: formData
        }

        const result = await fetchData(url, cfg);
        if (result.msg !== "insert user ok") {
            messageHandler("Something went wrong", "Could not create user")
            throw new Error(result);
        };
        messageHandler("Created new user", "User created successfully");
        return result;

    } catch (error) {
        errorHandler(error);
    }
}
