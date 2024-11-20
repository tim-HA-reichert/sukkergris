
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
import { ChocolateListView } from "./views/chocolate_list_view.js";
import { ShoppingCartView } from "./views/shopping_cart_view.js";
import { DetailedProductView } from "./views/detailed_product_view.js";
import { AddUserView } from "./views/add_user_view.js";
import { LoginView } from "./views/user_login_view.js";

import { NavigationView } from "./views/navigation_view.js";
import { CreateNewThreadView } from "./views/create_thread_view.js";
import { ThreadListView } from "./views/list_thread_view.js";
import { IndividualThreadView } from "./views/individual_forum_thread_view.js"; 

import { OrderModel } from "./models.js";
import { CheckoutView } from "./views/checkout_view.js";
import { OrderConfirmView } from "./views/order_confirmation_view.js";

const viewContainer = document.getElementById('viewContainer');            
const userContainer = document.getElementById("user-container");

const btnShowCategoriesView = document.getElementById('btnShowCategories');

const valueChecker = document.getElementById("value-checker");



const categoryListView = new CategoryListView();
const chocolateListView = new ChocolateListView();
const detailedProductView = new DetailedProductView();
const shoppingCartView = new ShoppingCartView();
const checkoutView = new CheckoutView();
const addUserView = new AddUserView();
const loginView = new LoginView();

//Attach content based on if user is logged in
const navButtons = new NavigationView();

const newThreadView = new CreateNewThreadView();
const allThreadsView = new ThreadListView();
const singleThreadView = new IndividualThreadView();
let threadInfo = null;

const orderConfirmView = new OrderConfirmView();

const orderModel = new OrderModel();
let userModel = null;

//Laster inn shipmenttyper for å forhindre lag i checkout. 
const shipmentTypes = api.listShipmentMethods();

//startup----------------------------------------
startUp();

function startUp () {
    
    const categoryPromise = api.getCategories(); //retrieve the categories from the service layer as a promise
    categoryListView.refresh(categoryPromise); //send the promise to the view. The view will wait for the promise to resolve

    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);

    navButtons.isUserLogged(userModel)
    userContainer.appendChild(navButtons);
}

//-----------------------------------------------
valueChecker.addEventListener("click", e => {   
    console.log(shipmentTypes)
});


//-----------------------------------------------
categoryListView.addEventListener('categoryselect', function (evt) {    
    const chocolateCategoryPromise = api.getChocolatesByCategory(evt.detail.categoryID, userModel);
    chocolateListView.refresh(chocolateCategoryPromise);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(chocolateListView);
});

//---------------------------------------------- AddEventListener for Home knapp
btnShowCategoriesView.addEventListener('click', function (evt) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);
});

//---------------------------------------------- Detailed Sjokolade View
chocolateListView.addEventListener('chocolateselect', function (evt) {    
    viewContainer.innerHTML = "";
    const detailProductPromise = api.getChocolateDetails(evt.detail.chocoID, userModel); //Lager et promise    

    detailProductPromise.then((ChocolateModelClass) => {        //Etter at promiset er ferdig, kjøres koden under
        detailedProductView.refresh(ChocolateModelClass, userModel);
        ChocolateModelClass.showDetailed();
        viewContainer.appendChild(detailedProductView);
    })
});
//---------------------------------------------- Lytter til addItem knapp
detailedProductView.addEventListener('addItem', evt => {    
    orderModel.addItem(evt.detail);
});

//---------------------------------------------- Lytter til add review
detailedProductView.addEventListener('left-review', evt => {    
    const addProductReviewPromise = api.addProductReview(evt.detail, userModel.token)
    addProductReviewPromise.then((response) => {
        detailedProductView.updateLive();
    })
});
//---------------------------------------------- Lytter show reviews
detailedProductView.addEventListener('show-product-reviews', evt => {    
    if(userModel) {
        api.getAllUsers(userModel.token).then(usernames => {
            const showReviewsPromise = api.showReviews(evt.detail, usernames, userModel)
            showReviewsPromise.then((reviewList) => {
                detailedProductView.showReviews(reviewList)
            })
        });
    } else {
        const showReviewsPromise = api.showReviews(evt.detail)
            showReviewsPromise.then((reviewList) => {
                detailedProductView.showReviews(reviewList)
            })
    }

});

//----------------------------------------------

navButtons.addEventListener('go-to-cart', function(evt) {
    shoppingCartView.refresh(orderModel);
    viewContainer.innerHTML = "";
    viewContainer.appendChild(shoppingCartView);
});

//---------------------------------------------- Lytter til Create User knapp

navButtons.addEventListener('add-new-user', () => {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(addUserView);
});

//---------------------------------------------- Lytter til add-user submit

addUserView.addEventListener('add-user', evt => {
    api.addUser(evt.detail);
});

//---------------------------------------------- Lytter til login knapp

navButtons.addEventListener('log-in', () => {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(loginView);
});
//---------------------------------------------- Lytter til login submit

loginView.addEventListener('log-in', evt => {
    const addUserPromise = api.logIn(evt.detail, "user");    
    addUserPromise.then((aUserModel) => {        //Etter at promiset er ferdig, kjøres koden under
        userModel = aUserModel;
        startUp();
        navButtons.isUserLogged(userModel);
        navButtons.activeUser(api.getUserImage(userModel));
    });
});

//----------------------------------------------
navButtons.addEventListener("search-for-products", evt => {
    evt.preventDefault();
    viewContainer.innerHTML = "";
    const searchValue = evt.detail;
    const searchBarPromise = api.getChocolateBySearch(searchValue);
    chocolateListView.refresh(searchBarPromise);
    viewContainer.appendChild(chocolateListView);
});

//----------------------------------------------
//RECIPES
//---------------------------------------------
navButtons.addEventListener("go-to-threads", e => {
    api.getAllUsers(userModel.token).then((usernames) => {
    viewContainer.innerHTML = "";
        const postAll = true;
        const threadListPromise = api.listThreads(userModel.token, postAll, usernames);
            allThreadsView.loadThreads(threadListPromise);
            viewContainer.appendChild(allThreadsView);
    });
});

allThreadsView.addEventListener("wish-to-inspect", e => {
    viewContainer.innerHTML ="";
    api.getAllUsers(userModel.token).then((usernames) => {
        threadInfo = e.detail;
        singleThreadView.refresh(e.detail);

        const commentContent = api.listComments(userModel.token, threadInfo.thread, usernames);
            singleThreadView.comment(commentContent); 
            viewContainer.appendChild(singleThreadView);
    });
});

singleThreadView.addEventListener("submit-comment", e => {

    api.addThreadComment(userModel.token, threadInfo.thread, e.detail);
    const commentContent = api.listComments(userModel.token, threadInfo.thread);

    singleThreadView.comment(commentContent).then((result)=>{
            viewContainer.appendChild(singleThreadView);
        });
});

singleThreadView.addEventListener("delete-thread", e => {
    api.deleteThread(threadInfo.id, userModel.token);
})

//----------------------------------------------
navButtons.addEventListener("create-thread", e => {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(newThreadView);
});

newThreadView.addEventListener("submit-new-thread", e => {
    api.addThreads(userModel.token, e.detail);
});


shoppingCartView.addEventListener("go-to-checkout", e => {
    viewContainer.innerHTML = "";
    
    checkoutView.totalPrice(orderModel).then(() => {

        checkoutView.addShipment(shipmentTypes);
        checkoutView.saveCart(orderModel);

        if(userModel){
            checkoutView.loggedInUserInfo(userModel);
        } 

        //checkoutView.sumTotal(orderModel, shipment);
        viewContainer.appendChild(checkoutView);
    });
    
});


checkoutView.addEventListener("place-order", e => {
    let userInfo; 
        if(userModel){
            //For logged in users. 
            api.placeOrder(userModel.token, e.detail).then((result) => {
                if(result.msg === "insert order ok"){
                    viewContainer.innerHTML = "";
                    userInfo = result.record;
                    orderConfirmView.refresh(userInfo, orderModel, shipmentTypes);
                    viewContainer.appendChild(orderConfirmView);
                }
            });
        } else {
            //For guest users. 
            api.placeOrder(null, e.detail).then((result) => {
                if(result.msg === "insert order ok"){
                    viewContainer.innerHTML = "";
                    userInfo = result.record;
                    orderConfirmView.refresh(userInfo, orderModel, shipmentTypes);
                    viewContainer.appendChild(orderConfirmView);
            }
            });
        };
});




