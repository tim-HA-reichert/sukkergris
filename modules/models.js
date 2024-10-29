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
        this.chocoName = obj.chocoName;
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