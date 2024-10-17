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

        this.dummyID = obj.dummyID;
        this.categoryID = obj.categoryID;
        this.dummyName = obj.dummyName;
        this.details = obj.details;        
        this.description = obj.description;        
        this.thumb = obj.thumb;
        this.price = obj.price;        
    }
}

// The model could also take care of converting between
// API-data and model-data and visa versa. In our example,
// the service layer converts from API-data to model data and
// we have no conversion the other way (We are sending formdata
// from the view with no conversion).

// Add more model classes here, e.g.:
// OrderModel, UserModel, LoginDataModel, CommentsModel...

