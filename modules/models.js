import { shortenDate } from "./utilities.js";

//=====================================================
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
}

//=====================================================
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
        this.number_of_ratings = obj.number_of_ratings
    }

    showDetailed() {        
        if (this.stock == 0) {
            this.stock = "Out of stock"
            this.expected_shipped = "Expected shipping date: " + shortenDate(this.expected_shipped)
        }
        else {
            this.stock = "In stock: " + this.stock
            this.expected_shipped = ""
        }
    }

}

export class OrderModel {

    //----------------------------------------
    constructor() {
        this.cartArray = [];
    }

    //----------------------------------------
    update() {
        //check for valid values, santizing etc. can happen here.

    }

    addItem(item) {
        this.cartArray.push(item);
    }

    emptyCart () {
        this.cartArray = [];
    }
}

// The model could also take care of converting between
// API-data and model-data and visa versa.
// In our example, the service layer converts from API-data to model data and
// we have no conversion the other way (We are sending formdata
// from the view with no conversion).

// Add more model classes here, e.g.:
// OrderModel, UserModel, LoginDataModel, CommentsModel...

export class LoginDataModel {

    constructor(loginData){
        this.update(loginData);
    }

    update(data){
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

}


export class NewProductModel{

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
}


//===========================================
//New recipe model
//===========================================

export class NewRecipeModel{

    constructor(newRecipeObject){
        this.update(newRecipeObject);
    }

    update(newRecipe){
        this.title = newRecipe.title;
        this.recipeText = newRecipe.recipeText
    }
}
