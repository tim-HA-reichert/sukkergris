
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
import { DetailedProductView } from "./views/detailed_product_view.js";
import { AddUserView } from "./views/add_user_view.js";
import { LoginView } from "./views/user_login_view.js";

import { OrderModel } from "./models.js";

const viewContainer = document.getElementById('viewContainer');

export const dialog = document.getElementById("dialog");            

const btnShowCategoriesView = document.getElementById('btnShowCategories');
const btnShowCreateDummyView = document.getElementById('btnShowCreateDummy');
const btnGoToCart = document.getElementById('btnGoToCart');
const btnAddUser = document.getElementById('btnAddUser');
const btnLogin = document.getElementById("btnLogin")
const userPicture = document.getElementById("userPicture")

const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");

const categoryListView = new CategoryListView();
const chocolateListView = new ChocolateListView();
const detailedProductView = new DetailedProductView();
const addDummyFormView = new AddDummyFormView();
const shoppingCartView = new ShoppingCartView();
const addUserView = new AddUserView();
const loginView = new LoginView();

const orderModel = new OrderModel();
let userModel = null;


//startup----------------------------------------
startUp();

function startUp () {
    userPicture.style.visibility = "hidden"
    const categoryPromise = api.getCategories(); //retrieve the categories from the service layer as a promise
    categoryListView.refresh(categoryPromise); //send the promise to the view. The view will wait for the promise to resolve
    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);
    
    // userPicture.src = userModel.thumb || (userPicture.style.visibility = "hidden")
}


//-----------------------------------------------
categoryListView.addEventListener('categoryselect', function (evt) {    
    const chocolateCategoryPromise = api.getChocolateByCategory(evt.detail.categoryID);
    chocolateListView.refresh(chocolateCategoryPromise);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(chocolateListView);
});

//---------------------------------------------- AddEventListener for Home knapp
btnShowCategoriesView.addEventListener('click', function (evt) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);
});

//---------------------------------------------- AddEventListener for trykking av spesefikk sjokolade
chocolateListView.addEventListener('chocolateselect', function (evt) {    
    viewContainer.innerHTML = "";
    const detailProductPromise = api.getChocolateDetails(evt.detail.chocoID); //Lager et promise

    detailProductPromise.then((dummyModelClass) => {        //Etter at promiset er ferdig, kjøres koden under
        detailedProductView.refresh(dummyModelClass);
        dummyModelClass.showDetailed();
        viewContainer.appendChild(detailedProductView);
    })
});
//---------------------------------------------- Lytter til addItem knapp
detailedProductView.addEventListener('addItem', function (evt) {    
    orderModel.addItem(evt.detail);
    api.manageOrderModel(orderModel)

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
//---------------------------------------------- Lytter til Create User knapp

btnAddUser.addEventListener('click', function(evt) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(addUserView);
});

//---------------------------------------------- Lytter til add-user submit

addUserView.addEventListener('add-user', function(evt) {
    const addUserPromise = api.addUser(evt.detail);
});

//---------------------------------------------- Lytter til login knapp

btnLogin.addEventListener('click', function(evt) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(loginView);
});
//---------------------------------------------- Lytter til login submit

loginView.addEventListener('log-in', function(evt) {
    const addUserPromise = api.logIn(evt.detail, "user");
    
    addUserPromise.then((aUserModel) => {        //Etter at promiset er ferdig, kjøres koden under
        userModel = aUserModel;
        userPicture.src = api.getUserImage(userModel);
        startUp();
        userPicture.style.visibility = "visible";
    });
});

//----------------------------------------------
addDummyFormView.addEventListener("add-dummy", function(evt) {    

    api.addDummy(evt.detail)
});


//----------------------------------------------
searchBtn.addEventListener("click", function(evt){
    evt.preventDefault();
    const searchValue = searchBar.value;
    const searchBarPromise = api.getChocolateBySearch(searchValue);
    chocolateListView.refresh(searchBarPromise);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(chocolateListView);
});









