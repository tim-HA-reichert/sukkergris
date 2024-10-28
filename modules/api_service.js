
//this module contains the functions in the service layer
//----------------------------------------------------------

import { fetchData } from "./utilities.js";
import { CategoryModel, DummyModel } from "./models.js";
import { errorHandler } from "./error_handler.js";
import { messageHandler } from "./messageHandler.js";

const groupKey = "LDDFEU28"; //Dette er vår gruppekode
const imgKey = "GFTPOE21";


const urlMap = {
    categoryURL: "https://sukkergris.onrender.com/webshop/categories",
    chosenCategoryURL: "https://sukkergris.onrender.com/webshop/products",
    chosenProductURL: "https://sukkergris.onrender.com/webshop/products"
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
                rating: chocoDet.rating 
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

export function manageOrderModel (aOrderModel){ //klasse som parameter
    const classOrderModel = aOrderModel; //Refererer til klassen som er definert i main.js

    // classOrderModel.addItem("test") //eksempel på hvordan man kan kjøre en funksjon fra klassen
    

}

//----------------------------------------------------------
//Add more service functions here...

