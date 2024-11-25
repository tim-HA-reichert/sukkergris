
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
import { UserSettingsView } from "./views/user_settings_view.js";

import { messageHandler } from "./messageHandler.js";


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


const categoryListView = new CategoryListView();
const chocolateListView = new ChocolateListView();
const detailedProductView = new DetailedProductView();
const shoppingCartView = new ShoppingCartView();
const checkoutView = new CheckoutView();
const addUserView = new AddUserView();
const loginView = new LoginView();
const userSettingsView = new UserSettingsView();

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

function startUp() {
    const categoryPromise = api.getCategories(); //retrieve the categories from the service layer as a promise
    categoryListView.refresh(categoryPromise); //send the promise to the view. The view will wait for the promise to resolve

    viewContainer.innerHTML = "";
    viewContainer.appendChild(categoryListView);

    if (sessionStorage.getItem("authString")) {
        const loginUserPromise = api.activeUser(sessionStorage.getItem("authString"));

        loginUserPromise.then((aUserModel) => {
            userModel = aUserModel;
            navButtons.isUserLogged(userModel);
            navButtons.activeUser(api.getUserImage(userModel));
        });
    }

    navButtons.isUserLogged(userModel)
    userContainer.appendChild(navButtons);

}

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

    detailProductPromise.then((ChocolateModelClass) => {
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
    if (userModel) {
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

navButtons.addEventListener('go-to-cart', function (evt) {
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
    addUserPromise.then((aUserModel) => {
        if (aUserModel) {
            userModel = aUserModel;
            startUp();
            navButtons.isUserLogged(userModel);
            navButtons.activeUser(api.getUserImage(userModel));
        }
    });
});

//---------------------------------------------- Lytter til Settings

navButtons.addEventListener('go-to-settings', evt => {
    viewContainer.innerHTML = "";
    userSettingsView.refresh(userModel);
    userSettingsView.listUserComments(api.getUserComments(userModel.token));
    viewContainer.appendChild(userSettingsView);
});

//---------------------------------------------- Logout

navButtons.addEventListener('logout-user', evt => {
    viewContainer.innerHTML = "";
    sessionStorage.removeItem("authString");
    userModel = null;
    messageHandler("See you soon!", "You have been logged out.")
    startUp();
});

//----------------------------------------------
userSettingsView.addEventListener('logout-user', evt => {
    viewContainer.innerHTML = "";
    sessionStorage.removeItem("authString");
    userModel = null;
    messageHandler("See you soon!", "You have been logged out.")
    startUp();
});

//---------------------------------------------- Change user information

userSettingsView.addEventListener('changed-user-information', informationForm => {
    const changeUserInformationPromise = api.changeUserInformation(informationForm.detail, userModel.token)
    changeUserInformationPromise.then(() => {
        const updateUserPromise = api.activeUser(sessionStorage.getItem("authString"));
        updateUserPromise.then((aUserModel) => {
            userModel = aUserModel;
            navButtons.isUserLogged(userModel);
            navButtons.activeUser(api.getUserImage(userModel));
            userSettingsView.refresh(userModel)
        });
    })
});

//-------------------------------------------- Delete user comments

userSettingsView.addEventListener("delete-comment", e => {
    const commentToDelete = e.detail;
    api.deleteReview(userModel.token, commentToDelete).then(() => {
        userSettingsView.listUserComments(api.getUserComments(userModel.token));
        userSettingsView.refresh(userModel);
        viewContainer.appendChild(userSettingsView);
    });

})


//---------------------------------------------- Lytter til Delete User

userSettingsView.addEventListener('delete-user', evt => {
    // viewContainer.innerHTML = "";

    const deleteUserPromise = api.deleteUser("user", userModel.token);
    deleteUserPromise.then((userGotDeleted) => {
        if (userGotDeleted) {
            sessionStorage.removeItem("authString");
            userModel = null;
            startUp();
        }
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

//----------------------------------------------
allThreadsView.addEventListener("wish-to-inspect", e => {
    viewContainer.innerHTML = "";

    api.getAllUsers(userModel.token).then((usernames) => {
        threadInfo = e.detail;
        singleThreadView.refresh(threadInfo);
        singleThreadView.currentRating(usernames, threadInfo);

        singleThreadView.rateTheAuthor();

        const commentContent = api.listComments(userModel.token, threadInfo.thread, usernames);
        singleThreadView.comment(commentContent);
    });

    viewContainer.appendChild(singleThreadView);
});

//----------------------------------------------

singleThreadView.addEventListener("submit-comment", e => {

    api.addThreadComment(userModel.token, threadInfo.thread, e.detail);
    const commentContent = api.listComments(userModel.token, threadInfo.thread);

    singleThreadView.comment(commentContent).then((result) => {
        viewContainer.appendChild(singleThreadView);
    });
});

//----------------------------------------------

singleThreadView.addEventListener("rate-author", e => {
    let meowRating = e.detail.meowRating;
    let ratedUser = e.detail.user;

    api.rateUser(userModel.token, ratedUser, meowRating).then(() => {
        messageHandler("User rated", "Thanks for rating this topic!")
    });
})

//----------------------------------------------

singleThreadView.addEventListener("delete-thread", e => {
    api.deleteThread(threadInfo.id, userModel.token);
})

//----------------------------------------------
navButtons.addEventListener("create-thread", e => {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(newThreadView);
});

//----------------------------------------------
newThreadView.addEventListener("submit-new-thread", e => {
    api.addThreads(userModel.token, e.detail);
});

//----------------------------------------------
shoppingCartView.addEventListener("go-to-checkout", e => {
    viewContainer.innerHTML = "";

    checkoutView.totalPrice(orderModel).then(() => {

        checkoutView.addShipment(shipmentTypes);
        checkoutView.saveCart(orderModel);

        if (userModel) {
            checkoutView.loggedInUserInfo(userModel);
        }
        viewContainer.appendChild(checkoutView);
    });

});

//----------------------------------------------
checkoutView.addEventListener("place-order", e => {
    let userInfo; 
    let cartItems;
        if(userModel){
            //For logged in users. 
            api.placeOrder(userModel.token, e.detail).then((result) => {
                console.log(result);
                if(result.msg === "insert order ok"){
                    viewContainer.innerHTML = "";
                    userInfo = result.record;
                    cartItems = result.record.content;
                    console.log(result);
                    orderConfirmView.refresh(userInfo, cartItems, shipmentTypes);
                    viewContainer.appendChild(orderConfirmView);
                }
            });
        } else {
            //For guest users. 
            api.placeOrder(null, e.detail).then((result) => {
                console.log(result);
                if(result.msg === "insert order ok"){
                    viewContainer.innerHTML = "";
                    userInfo = result.record;
                    cartItems = result.record.content;
                    orderConfirmView.refresh(userInfo, cartItems, shipmentTypes);
                    viewContainer.appendChild(orderConfirmView);
            }
        });
    }
    console.log(orderModel);
    orderModel.emptyCart();
    console.log(orderModel);
});




