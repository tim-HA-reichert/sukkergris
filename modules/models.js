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
export class DummyModel {

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


    }

    showDetailed() {
        console.log("test");
        
        if (this.stock == 0) {
            this.stock = "Out of stock"
            this.expected_shipped = "Expected shipping date: " + this.expected_shipped
        }
        else {
            this.stock = "Stock: " + this.stock
            // shortenDate(this.expected_shipped)
            console.log(shortenDate(this.expected_shipped));

            // this.expected_shipped = ""
        }
    }

}

export class OrderModel {

    //----------------------------------------
    constructor() {
        this.cart = [];
    }

    //----------------------------------------
    update() {
        //check for valid values, santizing etc. can happen here.

    }

    addItem(item) {
        this.cart.push(item)
        console.log(this.cart);

    }
}

// The model could also take care of converting between
// API-data and model-data and visa versa.
// In our example, the service layer converts from API-data to model data and
// we have no conversion the other way (We are sending formdata
// from the view with no conversion).

// Add more model classes here, e.g.:
// OrderModel, UserModel, LoginDataModel, CommentsModel...

