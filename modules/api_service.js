//this module contains the functions in the service layer
//----------------------------------------------------------

import { fetchData } from "./utilities.js";
import { createBasicAuthString } from "./utilities.js";
import { CategoryModel, ChocolateModel, LoginDataModel } from "./models.js";
import { errorHandler } from "./error_handler.js";
import { messageHandler } from "./messageHandler.js";

const groupKey = "LDDFEU28"; //Dette er vår gruppekode
const imgKey = "GFTPOE21";


const urlMap = {
    categoryURL: "https://sukkergris.onrender.com/webshop/categories",
    chosenCategoryURL: "https://sukkergris.onrender.com/webshop/products",
    chosenProductURL: "https://sukkergris.onrender.com/webshop/products",
    searchProductURL: "https://sukkergris.onrender.com/webshop/products",
    //Admin URL's
    adminLoginURL: "https://sukkergris.onrender.com/users/adminlogin",
    adminProductsURL: "https://sukkergris.onrender.com/webshop/products",
    deleteProductURL: "https://sukkergris.onrender.com/webshop/products",
    changeProductURL: "https://sukkergris.onrender.com/webshop/products",
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
export async function getChocolatesByCategory(category, aUser) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;
    //Category er et tall, som er lik categoryID til eventListener i category_list_view.js



    try {
        let data = null
        
        const chosenCat = [];
        
        if (aUser) {
            const cfg = {
                method: "GET",
                headers: {
                    "authorization": aUser.token
                }
            }
            data = await fetchData(url, cfg);
        }
        else if (!aUser) {
            data = await fetchData(url);
            //data er en liste med sjokolade. Ufiltrert liste. 
        }

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
                chosenCat.push(new ChocolateModel(chocoObj));
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

export async function adjustableChocolateList(category) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;
    //Category er et tall, som er lik categoryID til eventListener i category_list_view.js


    try {
        const data = await fetchData(url);
        //data er en liste med sjokolade. Ufiltrert liste. 

        const chocoDeleteList = [];

        for (let chocoCat of data) {
            if (chocoCat.static === false) {
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
                chocoDeleteList.push(new ChocolateModel(chocoObj));
            };
        };

        return chocoDeleteList;

    } catch (error) {
        errorHandler(error);
    }
}




//----------------------------------------------------------
// return details about chosen chocolate
//----------------------------------------------------------
export async function getChocolateDetails(chosenChocolateID, aUser) {
    const url = urlMap.chosenProductURL + "?id=" + chosenChocolateID + "&key=" + groupKey;
    let data = null

    try {

        if (aUser) {
            const cfg = {
                method: "GET",
                headers: {
                    "authorization": aUser.token
                }
            }
            data = await fetchData(url, cfg);
        }
        else if (!aUser) {
            data = await fetchData(url);
        }

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
            return new ChocolateModel(chocoObj);
        };
        //     return chosenCat;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// return all dummy-products
//----------------------------------------------------------

export async function getAllDummies() {

    const url = urlMap.chosenCategoryURL + "?key=" + groupKey;

    //more code here...
}

//----------------------------------------------------------
// Manages OrderModel
//----------------------------------------------------------

export function manageOrderModel(aOrderModel) { //klasse som parameter
    const classOrderModel = aOrderModel; //Refererer til klassen som er definert i main.js

    // classOrderModel.addItem("test") //eksempel på hvordan man kan kjøre en funksjon fra klassen


}

//----------------------------------------------------------
// Search function
//----------------------------------------------------------

export async function getChocolateBySearch(searchValue) {
    //Use value from searchbar to filter chocolates. 
    //Add a onclick to searchBtn to trigger this function. 

    const url = urlMap.chosenCategoryURL + "?search=" + searchValue + "&key=" + groupKey;
    try {
        const data = await fetchData(url);

        const chosenCat = [];

        //"i" for removing case-sensitivty. 
        //new RegExp is a javaScript function that creates a regular expression from parameter. 
        //Allows us to use .test, which tests searchValue against a chosen object. 
        const regexSearchTest = new RegExp(searchValue, "i");


        for (let chocoCat of data) {
            regexSearchTest.test(chocoCat.name)
            {
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: chocoCat.thumb,
                    price: chocoCat.price
                };
                chosenCat.push(new ChocolateModel(chocoObj));
            };
        };

        if (chosenCat.length === 0) {
            messageHandler("Nothing matches your search, please try again.");
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

export async function adminProducts(aToken, aNewProductForm) {

    const url = urlMap.adminProductsURL + "?key=" + groupKey;

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

export async function deleteProduct(adminToken, productID) {

    const url = urlMap.deleteProductURL + "?id=" + productID + "&key=" + groupKey;

    try {

        const cfg = {
            method: "DELETE",
            headers: {
                "authorization": adminToken
            },
        }

        const result = await fetchData(url, cfg);

        messageHandler(result);
        return result;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// Change a product
//----------------------------------------------------------

export async function changeProduct(adminToken, aForm) {

    const url = urlMap.changeProductURL + "?id=" + adminToken + "&key=" + groupKey;

    let formData = aForm;


    try {

        const cfg = {
            method: "PUT",
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


export async function addUser(aForm) {

    const url = urlMap.AddUserURL + "?key=" + groupKey;

    const formData = aForm;

    try {

        const cfg = {
            method: "POST",
            body: formData
        }

        const result = await fetchData(url, cfg);
        console.log(result);

        messageHandler(result);
        return result;

    } catch (error) {
        errorHandler(error);
    }

}