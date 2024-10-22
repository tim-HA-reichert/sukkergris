
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
export async function getChocolateByCategory(category) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;    
        //Category er et tall, som er lik categoryID til eventListener i category_list_view.js
        
    
    try {
        const data = await fetchData(url);
        //data er en liste med sjokolade. Ufiltrert liste. 
        
        const chosenCat = [];

        for(let chocoCat of data){
            if(chocoCat.category_id === category){
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
//Add more service functions here...

export async function getChocolateBySearch(searchValue){
    //Use value from searchbar to filter chocolates. 
    //Add a onclick to searchBtn to trigger this function. 
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + searchValue;   
        try {
            const data = await fetchData(url);
        
            const chosenCat = [];

            /*
            Chatgpt hjalp oss med denne. Den returnerer en tom array, siden funksjonen forventer en 
            array med innhold. Dette sier tydelig ifra når det ikke er noen treff eller match.  
            */
            if (searchValue.length <= 2) {
                messageHandler("Please enter more than 2 characters for the search.");
                return [];
            };

            //"i" er for case-insenstive
            const regexSearchTest = new RegExp(searchValue, "i"); 

            for(let chocoCat of data){
                if(chocoCat.category_name.toLowerCase() === searchValue.toLowerCase() ||
                regexSearchTest.test(chocoCat.name)        
                ){               
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

                if(chosenCat.length === 0){
                    messageHandler("Nothing matches your search");
                };
                return chosenCat;
                
        } catch(error) {
            errorHandler(error);
        }
        
    }