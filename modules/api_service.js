
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
    chosenCategoryURL: "https://sukkergris.onrender.com/webshop/products"
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
        const categoryList = data.map(function(value) {            
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
export async function getDummiesByCategory(category) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;    
        //Category er et tall, som er lik categoryID til eventListener i category_list_view.js
        
    
    try {
        const data = await fetchData(url);
        //data er en liste med sjokolade. Ufiltrert liste. 
        
        const chosenCat = [];

        for(let chocoCat of data){
            if(chocoCat.category_id === category){
                console.log(chocoCat);
            //Printer ut riktig sjokolade basert på id. 
            //neste steg: filtrer hva som printer til HTML

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
/*          
        //convert from server API-data to app model-data
        const dummyList = data.map(function(value) {        
   
            const dummyObj = {
                dummyID: value.id,
                dummyName: value.name,
                categoryID: value.category_id,
                description: value.description,
                details: value.details,
                thumb: value.thumb,
                price: value.price

            };
            //return new DummyModel(dummyObj);
        });
        
        return  dummyList; //return the promise    
*/
    } catch (error) {
        errorHandler(error);
    }    
}

//----------------------------------------------------------
// return a dummy-product based on ID
//----------------------------------------------------------
export async function getDummyById(id) {

    const url = urlMap.dummyURL + "?key=" + groupKey + "&id=" + id;
    
    //more code here...
}

//----------------------------------------------------------
// return all dummy-products
//----------------------------------------------------------
export async function getAllDummies() {

    const url = urlMap.dummyURL + "?key=" + groupKey;
    
    //more code here...
}

//----------------------------------------------------------
// add a dummy-product, returns the result
//----------------------------------------------------------
export async function addDummy(formDataObj) {

    const url = urlMap.dummyURL + "?key=" + groupKey;

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
//Add more service functions here...

