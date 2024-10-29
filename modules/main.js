
//This is the controller part of your administration application

//Implement code so that you:
// 1. can retrieve data from the service layer and update views
// 2. retrieve data from views, e.g., clicking on a product in a list, and then retrieve data about that product via the service layer
// 3. retrieve data from views (forms) and update the server API via the service layer, e.g. adding/update a product or user etc.

//All the views should send data by dispatching events

//If necessary, you can delegate code to several controller-modules (files)

//the following code is just for testing. You have to create your own implementation for
//retrieving data from the service layer, updating and switching views etc.

import * as api from "./api_service.js";
import { CategoryListView } from "./views/category_list_view.js";
import { ChocolateListView } from "./views/dummy_list_view.js";
import { AddDummyFormView } from "./views/add_dummy_form_view.js";
import { ShoppingCartView } from "./views/shopping_cart_view.js";

const viewContainer = document.getElementById('viewContainer');
const btnShowCategoriesView = document.getElementById('btnShowCategories');
const btnShowCreateDummyView = document.getElementById('btnShowCreateDummy');

const btnGoToCart = document.getElementById('btnGoToCart');

const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");

const categoryListView = new CategoryListView();
const chocolateListView = new ChocolateListView();
const addDummyFormView = new AddDummyFormView();
const shoppingCartView = new ShoppingCartView();


//startup----------------------------------------
const categoryPromise = api.getCategories(); //retrieve the categories from the service layer as a promise
categoryListView.refresh(categoryPromise); //send the promise to the view. The view will wait for the promise to resolve
viewContainer.innerHTML = "";
viewContainer.appendChild(categoryListView);

//-----------------------------------------------
categoryListView.addEventListener('categoryselect', function (evt) {    
    const chocolateProductPromise = api.getChocolateByCategory(evt.detail.categoryID);
    chocolateListView.refresh(chocolateProductPromise);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(chocolateListView);
});

//----------------------------------------------
btnShowCategoriesView.addEventListener('click', function (evt) {

    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);

});

//----------------------------------------------
btnShowCreateDummyView.addEventListener('click', function(evt) {

    viewContainer.innerHTML = "";
    viewContainer.appendChild(addDummyFormView);

});

//----------------------------------------------
btnGoToCart.addEventListener('click', function(evt) {
    const chocolateProductPromise = api.getChocolateByCategory(evt.detail.categoryID);
    shoppingCartView.refresh(chocolateProductPromise);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(shoppingCartView);
});

//----------------------------------------------
addDummyFormView.addEventListener("add-dummy", function(evt) {    
    
    api.addDummy(evt.detail)
});


//----------------------------------------------
searchBtn.addEventListener("click", function(evt){
    evt.preventDefault();
    const searchValue = searchBar.value;
});
