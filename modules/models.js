import { shortenDate } from "./utilities.js";

//===========================================
//Category model
//===========================================

export class CategoryModel {

    //----------------------------------------
    constructor(categoryObject) {
        this.update(categoryObject);
    }

    //----------------------------------------
    update(obj) {
        this.categoryID = obj.categoryID;
        this.categoryName = obj.categoryName;
        this.description = obj.description;
    }
} //End of class


//===========================================
//Chocolate model
//===========================================

export class ChocolateModel {

    //----------------------------------------
    constructor(dummyObject) {
        this.update(dummyObject);
    }

    //----------------------------------------
    update(obj) {

        //check for valid values, santizing etc. can happen here.

        this.chocoID = obj.chocoID;
        this.categoryID = obj.categoryID;
        this.categoryName = obj.categoryName;
        this.chocoName = obj.chocoName;
        this.description = obj.description;
        this.image = obj.image;
        this.thumb = obj.thumb;
        this.price = obj.price;
        this.heading = obj.heading;
        this.discount = obj.discount;
        this.stock = obj.stock;
        this.expected_shipped = obj.expected_shipped;
        this.rating = obj.rating;
        this.reserved_members = obj.reserved_members;
        this.number_of_ratings = obj.number_of_ratings;
        this.quantity = 0;
    }

    //----------------------------------------
    showDetailed() {
        if (this.stock == 0) {
            this.stock = "Out of stock";
            this.expected_shipped = "Expected shipping date: " + shortenDate(this.expected_shipped);
        }
        else {
            this.stock = "In stock: " + this.stock;
            this.expected_shipped = "";
        }
    }

} //End of class


//===========================================
//Order model
//===========================================

export class OrderModel {

    //----------------------------------------
    constructor() {
        const savedCart = localStorage.getItem('orderModel');
        //Sjekker om det er data å hente fra localstorage
        this.cartArray = savedCart ? JSON.parse(savedCart) : [];
    }

    //----------------------------------------
    _saveToLocalStorage() {
        //Fått hjelp av Claude.ai for dette. 
        localStorage.setItem('orderModel', JSON.stringify(this.cartArray));
    }

    //----------------------------------------
    addItem(item) {
        if (this.cartArray.length == 0) {
            this.cartArray.push(item);
        }

        const existingItem = this.cartArray.find(cartElement => cartElement.chocoID === item.chocoID);

        if (existingItem) {
            // If existingItem exists, increase quantity
            existingItem.quantity += 1;
        } else {
            // If existingItem doesn't exist, push new item
            this.cartArray.push(item);
            //Prevent quantity to start at 0 when adding new item.
            item.quantity++;
        }

        //Kaller på denne for at det skal lagres i localstorage.
        this._saveToLocalStorage();
    }

    //----------------------------------------
    updateQuantity(index, newQuantity) {
        const item = this.cartArray[index];
        if (item) {
            item.quantity = newQuantity; //Updates the quantity
            item.totalPrice = item.price * newQuantity; //Updates the total price
        }
        this._saveToLocalStorage();
    }

    //----------------------------------------
    deleteItem(index) {
        if (index >= 0 && index < this.cartArray.length) {
            this.cartArray.splice(index, 1);
        }
        this._saveToLocalStorage();
    }

    //----------------------------------------
    emptyCart() {
        this.cartArray = [];
        this._saveToLocalStorage();
    }
}  //End of class

//===========================================
//LoginData model
//===========================================

export class LoginDataModel {

    //----------------------------------------
    constructor(loginData) {
        this.update(loginData);
    }

    //----------------------------------------
    update(data) {
        this.superuser = data.superuser;
        this.thumb = data.thumb;
        this.token = data.token;
        this.userid = data.userid;
        this.username = data.username;
        this.city = data.city;
        this.country = data.country;
        this.full_name = data.full_name;
        this.street = data.street;
        this.zipcode = data.zipcode;
    }
} //End of class


//===========================================
//New Product model
//===========================================

export class NewProductModel {

    //----------------------------------------
    constructor(newProductObject) {
        this.update(newProductObject);
    }

    //----------------------------------------
    update(newProduct) {

        //Apply form values here
        this.chocoID = newProduct.chocoID;
        this.categoryID = newProduct.categoryID;
        this.chocoName = newProduct.chocoName;
        this.details = newProduct.details;
        this.description = newProduct.description;
        this.thumb = newProduct.thumb;
        this.price = newProduct.price;
    }
} //End of class


//===========================================
//Forum models
//===========================================

export class UserThreadModel {

    //----------------------------------------
    constructor(newthreadObject) {
        this.update(newthreadObject);
    }

    //----------------------------------------
    update(newThread) {
        this.date = shortenDate(newThread.date);
        this.heading = newThread.heading;
        this.id = newThread.id;
        this.message = newThread.message;
        this.start_of_thread = true;
        this.thread = newThread.thread;
        this.user_id = newThread.user_id;
        //Waiting to be filled by userModel.username.
        this.username = null;
    }

    //----------------------------------------
    setUsername(user) {
        if (user) {
            this.username = user.username;
        } else {
            this.username = 'No username found. Model.js';
        }
    }
}   //End of class


//===========================================
//Forum Comment Model
//===========================================

export class UserCommentModel {

    //----------------------------------------
    constructor(newUserCommentObject) {
        this.update(newUserCommentObject)
    }

    //----------------------------------------
    update(newComment) {
        this.message = newComment.message;
        this.start_of_thread = false;
        this.thread = newComment.thread;
        this.user_id = newComment.user_id;
        //Waiting to be filled by userModel.username.
        this.username = null;
    }

    //----------------------------------------
    setUsername(user) {
        if (user) {
            this.username = user.username;
        } else {
            this.username = 'No username found. Model.js';
        }
    }
}   //End of class


//===========================================
//User models
//===========================================

export class userModel {

    //----------------------------------------
    constructor(newUserObject) {
        this.update(newUserObject);
    }

    //----------------------------------------
    update(newUser) {
        this.beenz = newUser.beenz;
        this.city = newUser.city;
        this.country = newUser.country;
        this.full_name = newUser.full_name;
        this.id = newUser.id;
        this.street = newUser.street;
        this.superuser = newUser.superuser;
        this.thumb = newUser.thumb;
        this.username = newUser.username;
        this.zipcode = newUser.zipcode;
    }
}   //End of class


//===========================================
//Review Model
//===========================================

export class ReviewModel {

    //----------------------------------------
    constructor(newReviewObject) {
        this.update(newReviewObject)
    }

    //----------------------------------------
    update(reviewObject) {
        this.comment_text = reviewObject.comment_text;
        this.date = reviewObject.date;
        this.id = reviewObject.id;
        this.product_id = reviewObject.product_id;
        this.rating = reviewObject.rating //Waiting to be filled by userModel.username.

        this.user_id = reviewObject.user_id;

        this.username = null;
    }

    //----------------------------------------
    setUsername(user) {
        if (user) {
            this.username = user.username;
        } else {
            this.username = 'No username found. Model.js';
        }
    }

    //----------------------------------------
    setAnonymous() {
        this.username = "Anonymous"
    }
} //End of class
