import * as api from "./api_service.js";
import { AdminLoginView } from "./views/admin_views/admin_login_view.js";
import { AdminPanelView } from "./views/admin_views/admin_panel_view.js";
import { adminProductsView } from "./views/admin_views/admin_product_view.js";
import { changeProductView } from "./views/admin_views/admin_product_change_view.js";
import { UserListView } from "./views/admin_views/admin_users_view.js";
import { OrderListView } from "./views/admin_views/admin_orders_view.js";
import { ReviewsView } from "./views/admin_views/admin_review_view.js";


const viewContainer = document.getElementById("viewContainer");
const navContainer = document.getElementById("admin-navigation");

const adminLoginView = new AdminLoginView();
const adminPanelView = new AdminPanelView();
const adminProducts = new adminProductsView();
const allUserView = new UserListView();
const orderListView = new OrderListView();
const reviewsView = new ReviewsView();

const changeProductInfo = new changeProductView();
let adminToken = null;

startup();
//startup-------------------------------------------
function startup(){
viewContainer.innerHTML = "";
viewContainer.appendChild(adminLoginView);
}


//log in as admin-----------------------------------
adminLoginView.addEventListener("log-in", function(evt){
    const logInPromise = api.logIn(evt.detail, "admin");
    logInPromise.then((result) => {
        adminToken = result.token; //Spar adminToken til variabel

            viewContainer.innerHTML ="";
            navContainer.appendChild(adminPanelView)
            adminPanelView.refresh();  
    });
});

//---------------------------------------------------------------
//User administration
//----------------------------------------------------------------

adminPanelView.addEventListener("admin-users", e => {
    viewContainer.innerHTML = "";
    api.getAllUsers(adminToken).then((userList) => {
        allUserView.listUsers(userList);
        viewContainer.appendChild(allUserView);
    });
});

allUserView.addEventListener("delete-user", e => {
    viewContainer.innerHTML = "";

    api.deleteUser("admin", adminToken, e.detail).then((result) => {
        const refreshUserList = api.getAllUsers(adminToken);
        allUserView.listUsers(refreshUserList);
        viewContainer.appendChild(allUserView);
    });
});

//---------------------------------------------------------------
//Product administration
//----------------------------------------------------------------
adminPanelView.addEventListener("admin-products", function(evt){
    viewContainer.innerHTML = "";

    adminProducts.chocoDeletionList(api.adjustableChocolateList(adminToken));

    viewContainer.appendChild(adminProducts);
});

//----------------------------------------------
adminProducts.addEventListener("add-product", function(evt){
    api.adminProducts(adminToken, evt.detail).then(response => {

        adminProducts.chocoDeletionList(api.adjustableChocolateList(adminToken));
        viewContainer.appendChild(adminProducts);

        this.form.reset();  
    });
});

//----------------------------------------------
adminProducts.addEventListener("delete-product", function(evt){
    api.deleteProduct(adminToken, evt.detail).then(response =>{
        const adjustableChocolateList = api.adjustableChocolateList(adminToken);

        adminProducts.chocoDeletionList(adjustableChocolateList);
        viewContainer.appendChild(adminProducts);
    });
});

//----------------------------------------------
adminProducts.addEventListener("change-product-form", function(evt){
    viewContainer.innerHTML = "";
    const adjustableChocolateList = api.adjustableChocolateList(adminToken);

    changeProductInfo.changeableChoco(adjustableChocolateList);
    viewContainer.appendChild(changeProductInfo);
});

//----------------------------------------------
changeProductInfo.addEventListener("back-to-add", (e) => {
    viewContainer.innerHTML = "";

    adminProducts.chocoDeletionList(api.adjustableChocolateList(adminToken));
    viewContainer.appendChild(adminProducts);
});

//----------------------------------------------
changeProductInfo.addEventListener("change-product", function(evt){
    api.changeProduct(adminToken, evt.detail).then(response=>{
        adjustableChocolateList = api.adjustableChocolateList(adminToken);

        changeProductInfo.changeableChoco(adjustableChocolateList);
        viewContainer.appendChild(changeProductInfo);
        this.form.reset();
    });
});


//---------------------------------------------------------------
//Order administration
//----------------------------------------------------------------

adminPanelView.addEventListener("admin-orders", e => {
    viewContainer.innerHTML ="";
    api.listOrders(adminToken).then((result) => {
            orderListView.getOrders(result);
            viewContainer.appendChild(orderListView);
    });
});

//----------------------------------------------
orderListView.addEventListener("delete-order", e => {
    api.deleteOrder(adminToken, e.detail).then((result) => {
        const refreshList = api.listOrders(adminToken);
        orderListView.getOrders(refreshList);

        viewContainer.appendChild(orderListView);
    })
})

//---------------------------------------------------------------
//Review administration
//----------------------------------------------------------------

//---------------------------------------------- Lager admin-review
adminPanelView.addEventListener("admin-reviews", e => {
        api.getAllUsers(adminToken).then(usernames => {
            viewContainer.innerHTML="";            
            api.adminShowReviews(adminToken, usernames).then((reviewList) => {                
                reviewsView.showReviews(reviewList);
                viewContainer.appendChild(reviewsView);
            });
        });


    
});

//---------------------------------------------- Sletter Review
reviewsView.addEventListener("deleteReview", evt => {
    api.deleteReview(adminToken, evt.detail).then((result) => {
        if(result) {            
            api.adminShowReviews(adminToken).then((reviewList) => {
                viewContainer.innerHTML="";
                reviewsView.showReviews(reviewList);
                viewContainer.appendChild(reviewsView);
            });
        }
    });
});
