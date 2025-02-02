import { fetchData, shortenDate, createBasicAuthString } from "./utilities.js";
import {
    CategoryModel, ChocolateModel, LoginDataModel,
    UserThreadModel, UserCommentModel, userModel, ReviewModel
} from "./models.js";
import { errorHandler } from "./error_handler.js";
import { messageHandler } from "./messageHandler.js";

const groupKey = "LDDFEU28"; //Dette er vår gruppekode
const imgKey = "GFTPOE21";


const urlMap = {
    imgURL: "https://sukkergris.onrender.com/images/",
    categoryURL: "https://sukkergris.onrender.com/webshop/categories",
    chosenCategoryURL: "https://sukkergris.onrender.com/webshop/products",
    chosenProductURL: "https://sukkergris.onrender.com/webshop/products",
    searchProductURL: "https://sukkergris.onrender.com/webshop/products",
    //Admin URL's
    adminLoginURL: "https://sukkergris.onrender.com/users/adminlogin",
    adminProductsURL: "https://sukkergris.onrender.com/webshop/products",
    deleteProductURL: "https://sukkergris.onrender.com/webshop/products",
    changeProductURL: "https://sukkergris.onrender.com/webshop/products",
    //User URL's
    AddUserURL: "https://sukkergris.onrender.com/users",
    listAllUsersURL: "https://sukkergris.onrender.com/users",
    deleteUserURL: "https://sukkergris.onrender.com/users",
    userLoginURL: "https://sukkergris.onrender.com/users/login",
    userImageURL: "https://sukkergris.onrender.com/images/",
    productReviewsURL: "https://sukkergris.onrender.com/webshop/comments",
    //Message URL's
    messageURL: "https://sukkergris.onrender.com/msgboard/messages",
    //Shipment & Order URL's
    orderURL: "https://sukkergris.onrender.com/webshop/orders",
    shipmentURL: "https://sukkergris.onrender.com/logistics/shippingtypes",
    //Meow meow beenz
    meowURL: "https://sukkergris.onrender.com/users/beenz",

}

//----------------------------------------------------------
// Liste av kategorier
//----------------------------------------------------------
export async function getCategories() {

    const url = urlMap.categoryURL + "?key=" + groupKey;

    try {

        const data = await fetchData(url);

        const categoryList = [];
        for (const value of data) {
            const categoryObj = {
                categoryID: value.id,
                categoryName: value.category_name,
                description: value.description
            };
            categoryList.push(new CategoryModel(categoryObj));
        }

        return categoryList;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// Lista av sjokolade ifra en kategory
//----------------------------------------------------------
export async function getChocolatesByCategory(category, aUser) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey + "&category_id=" + category;
    //Category er et tall, som er lik categoryID til eventListener i category_list_view.js

    try {
        let data = null

        const chosenCat = [];

        if (aUser) {
            const cfg = {
                method: "GET",
                headers: {
                    "authorization": aUser.token
                }
            }
            data = await fetchData(url, cfg);
        }
        else if (!aUser) {
            data = await fetchData(url);
            //data er en liste med sjokolade. Ufiltrert liste. 
        }

        for (let chocoCat of data) {
            if (chocoCat.category_id === category) {
                const imgKeyToUse = chocoCat.static ? imgKey : groupKey;
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: urlMap.imgURL + imgKeyToUse + "/small/" + chocoCat.thumb,
                    price: chocoCat.price
                };
                chosenCat.push(new ChocolateModel(chocoObj));
            };
        };

        return chosenCat;

    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Liste over sjokolader vi kan forandre
//----------------------------------------------------------

export async function adjustableChocolateList(aToken) {
    const url = urlMap.chosenCategoryURL + "?key=" + groupKey;
    
    const cfg = {
        method: "GET",
        headers: {
            "authorization": aToken,
        }
    }

    try {

        const data = await fetchData(url, cfg);
        const chocoDeleteList = [];

        for (let chocoCat of data) {
            if (chocoCat.static === false) {
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: urlMap.imgURL + groupKey + "/small/" + chocoCat.thumb,
                    reserved_members: chocoCat.reserved_members,
                    price: chocoCat.price
                };
                chocoDeleteList.push(new ChocolateModel(chocoObj));
            };
        };

        return chocoDeleteList;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// Anmeldelser på produkt
//----------------------------------------------------------
export async function addProductReview(aData, aToken) {
    const url = urlMap.productReviewsURL + "?key=" + groupKey;
    const form = aData.formData

    try {
        const cfg = {
            method: "POST",
            headers: {
                "authorization": aToken,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                comment_text: form.get("review-text"), //OPTIONAL
                product_id: aData.chocoID, //REQUIRED
                rating: form.get("inpStars") //OPTIONAL
            })
        }
        const data = await fetchData(url, cfg);

        if (data.msg == "Insert/update comment ok") {
            messageHandler("Review", "Review added successfully");
        } else {
            messageHandler("Review", "Failed to add review, try again");
        }
        return data;
    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Vis anmeldelser
//----------------------------------------------------------
export async function showReviews(productID, usernames, userModel) {
    const url = urlMap.productReviewsURL + "?key=" + groupKey + "&product_id=" + productID;

    try {
        const data = await fetchData(url);


        if (data.length == 0) {
            return false
        } else {

            const threadList = [];

            for (let element of data) {
                const reviewObject = {
                    comment_text: element.comment_text,
                    date: element.date,
                    id: element.id,
                    product_id: element.product_id,
                    rating: element.rating,
                    user_id: element.user_id
                }

                if (userModel) {
                    // Matcher user_id med brukerlisten for å generere username object key.
                    const userInList = usernames.find((user) => user.id === element.user_id);
                    if (userInList) {
                        const threadItem = new ReviewModel(reviewObject);
                        threadItem.setUsername(userInList);
                        threadList.push(threadItem);
                    }
                } else {
                    const threadItem = new ReviewModel(reviewObject);
                    threadItem.setAnonymous();
                    threadList.push(threadItem)
                }
            }

            return threadList
        }
    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Delete product review
//----------------------------------------------------------
export async function deleteReview(aToken, reviewID) {
    const url = urlMap.productReviewsURL + "?key=" + groupKey + "&comment_id=" + reviewID;
    const cfg = {
        method: "DELETE",
        headers: {
            "authorization": aToken,
        }
    }

    try {
        const result = await fetchData(url, cfg);
        if (result.msg === "delete comment ok") {
            messageHandler("Review Deleted", "Review ID: " + result.record.id);
            return true
        }

    } catch (error) {
        errorHandler(error);
        return false
    }
}

//----------------------------------------------------------
// Get user comment function
//----------------------------------------------------------
//For at brukere skal kunne se hva de har kommentert. 

export async function getUserComments(aUserID) {
    const url = urlMap.productReviewsURL + "?key=" + groupKey;

    const cfg = {
        method: "GET",
        headers: {
            "authorization": aUserID
        }
    }

    try {
        const result = await fetchData(url, cfg);
        return result;
    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Admin show product reviews
//----------------------------------------------------------
export async function adminShowReviews(aAdminToken, usernames) {
    const url = urlMap.productReviewsURL + "?key=" + groupKey

    const cfg = {
        method: "GET",
        headers: {
            "authorization": aAdminToken,
        }
    }

    try {
        const data = await fetchData(url, cfg);

        if (data.length == 0) {
            return false
        } else {

            const threadList = [];

            for (let value of data) {

                const reviewObject = {
                    comment_text: value.comment_text,
                    date: shortenDate(value.date),
                    id: value.id,
                    product_id: value.product_id,
                    rating: value.rating,
                    user_id: value.user_id
                }

                // Matcher user_id med brukerlisten for å generere username object key.
                const userInList = usernames.find((user) => user.id === value.user_id);

                if (userInList) {
                    const threadItem = new ReviewModel(reviewObject);
                    threadItem.setUsername(userInList);
                    threadList.push(threadItem)
                }
            }

            return threadList
        }
    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Return details about chosen chocolate
//----------------------------------------------------------
export async function getChocolateDetails(chosenChocolateID, aUser) {
    const url = urlMap.chosenProductURL + "?id=" + chosenChocolateID + "&key=" + groupKey;
    let data = null

    try {

        if (aUser) {
            const cfg = {
                method: "GET",
                headers: {
                    "authorization": aUser.token
                }
            }
            data = await fetchData(url, cfg);
        }
        else if (!aUser) {
            data = await fetchData(url);
        }

        for (let chocoDet of data) {
            let chocoObj = {
                chocoID: chocoDet.id,
                categoryID: chocoDet.category_id,
                chocoName: chocoDet.name,
                categoryName: chocoDet.category_name,
                description: chocoDet.description,
                image: "https://sukkergris.onrender.com/images/" + imgKey + "/large/" + chocoDet.image,
                thumb: chocoDet.thumb,
                price: chocoDet.price,
                heading: chocoDet.heading,
                discount: chocoDet.discount,
                stock: chocoDet.stock,
                expected_shipped: chocoDet.expected_shipped,
                rating: chocoDet.rating,
                number_of_ratings: chocoDet.number_of_ratings
            };

            return new ChocolateModel(chocoObj);
        };

    } catch (error) {
        errorHandler(error);
    }
}


//----------------------------------------------------------
// Search function
//----------------------------------------------------------

export async function getChocolateBySearch(searchValue) {
    //Bruker verdi fra søkefelt. 
    let searchFor = searchValue.get("searchBar");

    if (searchFor.length <= 2) {
        messageHandler("Please give us more letters to work with.");
        return [];
    }

    const url = urlMap.chosenCategoryURL + "?search=" + searchFor + "&key=" + groupKey;
    try {
        const data = await fetchData(url);

        const chosenCat = [];

        //"i" for at den ikke skal bry seg om store eller små bokstaver..
        //new RegExp er en javaScript funksjon som lager regex utifra parameter.
        //Tillater oss å bruke .test, som tester regex mot et objekt.
        const regexSearchTest = new RegExp(searchFor, "i");


        for (let chocoCat of data) {
            if (regexSearchTest.test(chocoCat.name) && searchFor.length > 2) {
                const chocoObj = {
                    chocoID: chocoCat.id,
                    chocoName: chocoCat.name,
                    categoryID: chocoCat.category_id,
                    description: chocoCat.description,
                    details: chocoCat.details,
                    thumb: urlMap.imgURL + imgKey + "/small/" + chocoCat.thumb,
                    price: chocoCat.price
                };
                chosenCat.push(new ChocolateModel(chocoObj));
            };
        };

        if (chosenCat.length === 0) {
            messageHandler("Nothing matches your search, please try again.");
        };
        return chosenCat;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// admin and user log-in
//----------------------------------------------------------

export async function logIn(aForm, accountType) {

    const url = urlMap[`${accountType}LoginURL`] + "?key=" + groupKey; //Får tilgang til URLMapping, bruker brackets ([]) for å få tilgang til objekt element.

    const loginCred = {
        username: aForm.get("username"),
        password: aForm.get("password"),
    };

    const authString = createBasicAuthString(loginCred.username, loginCred.password);

    const cfg = {
        method: "POST",
        headers: {
            "authorization": authString
        }
    };

    try {


        const result = await fetchData(url, cfg);
        

        if (result.msg === "login OK" || result.msg === 'administrator login OK') {
            const loginDataObj = {
                superuser: result.logindata.superuser,
                thumb: result.logindata.thumb,
                token: result.logindata.token,
                userid: result.logindata.userid,
                username: result.logindata.username,
                city: result.logindata.city,
                country: result.logindata.country,
                full_name: result.logindata.full_name,
                street: result.logindata.street,
                zipcode: result.logindata.zipcode,
            };
            const loginData = new LoginDataModel(loginDataObj);

            sessionStorage.setItem("authString", `${authString}`);

            if (loginData.superuser != true) {
                messageHandler("Welcome back!", "Sweetness for your tastebuds await, " + result.logindata.username);
            };
            
            return loginData;
        } else {
            return false
        }



    } catch (error) {
        errorHandler(error);
    };
};

//----------------------------------------------------------
// active user login
//----------------------------------------------------------

export async function activeUser(aAuthString) {

    const url = urlMap.userLoginURL + "?key=" + groupKey;

    const cfg = {
        method: "POST",
        headers: {
            "authorization": aAuthString
        }
    }

    try {
        const result = await fetchData(url, cfg);

        const loginDataObj = {
            superuser: result.logindata.superuser,
            thumb: result.logindata.thumb,
            token: result.logindata.token,
            userid: result.logindata.userid,
            username: result.logindata.username,
            city: result.logindata.city,
            country: result.logindata.country,
            full_name: result.logindata.full_name,
            street: result.logindata.street,
            zipcode: result.logindata.zipcode,
        };

        const loginData = new LoginDataModel(loginDataObj);

        return loginData;

    } catch (error) {
        errorHandler(error);
    };
};

//----------------------------------------------------------
// Change User Information
//----------------------------------------------------------
export async function changeUserInformation(aInformationForm, aToken) {

    const url = urlMap.AddUserURL + "?key=" + groupKey;

    const formData = aInformationForm;

    try {

        const cfg = {
            method: "PUT",
            headers: {
                "authorization": aToken,
            },
            body: formData
        }

        const result = await fetchData(url, cfg);
        if (result.msg == "update user ok") {
            messageHandler("User Info updated", "Log in again to see changes");
            return result;
        }



    } catch (error) {
        errorHandler(error);
    };
};

//----------------------------------------------------------
// Gets user profile image
//----------------------------------------------------------
export function getUserImage(userModel) {
    const imageUrl = urlMap.userImageURL + groupKey + "/users/" + userModel.thumb
    return imageUrl;
}

//----------------------------------------------------------
// Add a new product
//----------------------------------------------------------

export async function adminProducts(aToken, aNewProductForm) {

    const url = urlMap.adminProductsURL + "?key=" + groupKey;

    const adminToken = aToken;
    const formData = aNewProductForm;


    try {

        const cfg = {
            method: "POST",
            headers: {
                "authorization": adminToken
            },
            body: formData
        }

        const result = await fetchData(url, cfg);
        messageHandler(`New product: ${result.record.name} added!`);
        return result;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
// Delete a product made by admin 
//----------------------------------------------------------

export async function deleteProduct(adminToken, productID) {

    const url = urlMap.deleteProductURL + "?id=" + productID + "&key=" + groupKey;

    try {

        const cfg = {
            method: "DELETE",
            headers: {
                "authorization": adminToken
            },
        }

        const result = await fetchData(url, cfg);

        messageHandler(`Product deleted.`, `Product with name: ${result.record.name} has been deleted`);
        return result;

    } catch (error) {
        errorHandler(error);
    }

}

//----------------------------------------------------------
// User functions
//----------------------------------------------------------

export async function addUser(aForm) {

    const url = urlMap.AddUserURL + "?key=" + groupKey;

    const formData = aForm;

    try {

        const cfg = {
            method: "POST",
            body: formData
        }

        const result = await fetchData(url, cfg);

        if (result.msg === "insert user ok") {
            messageHandler("Thank you for joining Sukkergris!", "Your username is: " + result.record.username);
            return result;
        } else {
            throw new Error("Error adding user", "Try again later");
        }

    } catch (error) {
        errorHandler(error);
    }
}

//-------------------------------------------------------------------

export async function getAllUsers(aToken, aUserID){
    let url;

    if (aUserID) {
        url = urlMap.listAllUsersURL + "?key=" + groupKey + "&userid=" + aUserID;
    } else {
        url = urlMap.listAllUsersURL + "?key=" + groupKey + "&userid=";
    }

    try {
        const cfg = {
            method: "GET",
            headers: {
                "authorization": aToken
            }
        }

        const result = await fetchData(url, cfg);

        const userList = [];

        for (let value of result) {
            const userObj = {
                beenz: value.beenz,
                city: value.city,
                heading: value.country,
                full_name: value.full_name,
                id: value.id,
                street: value.street,
                superuser: value.superuser,
                thumb: value.thumb,
                username: value.username,
                zipcode: value.zipcode
            }
            userList.push(new userModel(userObj));
        }

        return userList;

    } catch (error) {
        errorHandler(error);
    }
}


export async function deleteUser(aUser, aToken, aUserId) {
    if (aUser === "admin") {
        const url = urlMap.deleteUserURL + "?key=" + groupKey + "&id=" + aUserId;

        const cfg = {
            method: "DELETE",
            headers: {
                "authorization": aToken
            }
        }

        try {
            const result = await fetchData(url, cfg);

            messageHandler("User Deleted", "Deleted user " + result.record.username);
            return result;

        } catch (error) {
            errorHandler(error);
        }
    }

    else if (aUser === "user") {
        const url = urlMap.deleteUserURL + "?key=" + groupKey;

        const cfg = {
            method: "DELETE",
            headers: {
                "authorization": aToken
            }
        }

        try {
            const result = await fetchData(url, cfg);

            if (result.msg === "delete user ok") {
                messageHandler("User Deleted", "Deleted user " + result.record.username)
            }

            return result;

        } catch (error) {
            errorHandler(error);
        }
    }
}

//----------------------------------------------------------
// Product functions
//----------------------------------------------------------
export async function changeProduct(adminToken, aForm) {

    const url = urlMap.changeProductURL + "?id=" + adminToken + "&key=" + groupKey;

    let formData = aForm;

    try {

        const cfg = {
            method: "PUT",
            headers: {
                "authorization": adminToken
            },
            body: formData
        }

        const result = await fetchData(url, cfg);

        messageHandler(result);
        return result;

    } catch (error) {
        errorHandler(error);
    }
}

//-----------------------------------------------
// Forum functions
//-----------------------------------------------
export async function listThreads(aToken, postAll, usernames) {

    const url = urlMap.messageURL + "?key=" + groupKey + "&all=" + postAll + "&asc=" + true;


    const cfg = {
        method: "GET",
        headers: {
            "authorization": aToken
        }
    }

    try {
        const result = await fetchData(url, cfg);

        const threadList = [];

        for (let value of result) {
            if (value.start_of_thread === true) {
                const threadObj = {
                    date: value.date,
                    heading: value.heading,
                    id: value.id,
                    message: value.message,
                    thread: value.thread,
                    user_id: value.user_id
                }

                // Matcher user_id med brukerlisten for å generere username object key.
                const userInList = usernames.find((user) => user.id === value.user_id);
                if (userInList) {
                    const threadItem = new UserThreadModel(threadObj);
                    threadItem.setUsername(userInList);
                    threadList.push(threadItem);
                } else {
                    console.log("could not match user id.")
                }

            }
        }
        return threadList;

    } catch (error) {
        errorHandler(error);
    }
}

//-----------------------------------------------
// Add a message
//-----------------------------------------------

export async function addThreads(aToken, threadForm) {

    const url = urlMap.messageURL + "?key=" + groupKey + "&thread=";

    const data = {
        threadHeading: threadForm.get("thread-title"),
        messageText: threadForm.get("thread-text"),
    }

    const cfg = {
        method: "POST",
        headers: {
            "authorization": aToken,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            heading: data.threadHeading,
            message_text: data.messageText
        })
    }

    try {

        const result = await fetchData(url, cfg);
        result.start_of_thread = true;

        messageHandler("Forum", "Added new topic of discussion!");

        return result;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function addThreadComment(aToken, aThreadID, aCommentForm) {

    const url = urlMap.messageURL + "?key=" + groupKey + "&thread=" + aThreadID;

    const data = {
        commentHeading: `A user comment in thread${aThreadID}`,
        commentText: aCommentForm.get("comment-text"),
    }

    const cfg = {
        method: "POST",
        headers: {
            "authorization": aToken,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            heading: data.commentHeading,
            message_text: data.commentText
        })
    }

    try {

        const result = await fetchData(url, cfg);

        messageHandler("Forum", "Thanks for furthering discussions about candy.");

        return result;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function listComments(aToken, aThreadID, usernames) {
    const url = urlMap.messageURL + "?key=" + groupKey + "&thread=" + aThreadID;

    const cfg = {
        method: "GET",
        headers: {
            "authorization": aToken
        }
    }

    try {
        const result = await fetchData(url, cfg);

        const listOfComments = [];

        for (let value of result) {
            if (value.start_of_thread === false && value.thread === aThreadID) {
                const commentObj = {
                    message: value.message,
                    thread: value.thread,
                    user_id: value.user_id,

                }

                // Matcher user_id med brukerlisten for å generere username object key.
                const userInList = usernames.find((user) => user.id === value.user_id);
                if (userInList) {
                    const userComments = new UserCommentModel(commentObj);
                    userComments.setUsername(userInList);
                    listOfComments.push(userComments);
                } else {
                    console.log("Could not match userID.");
                }
            }

        }

        return listOfComments;

    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function deleteThread(aMessageID, aToken) {
    const url = urlMap.messageURL + "?key=" + groupKey + "&message_id=" + aMessageID;

    const cfg = {
        method: "DELETE",
        headers: {
            "authorization": aToken
        }
    }

    try {
        const result = await fetchData(url, cfg);

        return result;
    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function placeOrder(aToken, aOrderForm) {
    const url = urlMap.orderURL + "?key=" + groupKey;

    let formObject = Object.fromEntries(aOrderForm);


    const headers = {
        "content-type": "application/json",
    };

    if (aToken) {
        headers.authorization = aToken;
    }

    const cfg = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formObject),
    }

    try {
        const result = await fetchData(url, cfg);

        return result;
    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function listOrders(aToken) {
    const url = urlMap.orderURL + "?key=" + groupKey;

    //Hvis adminToken blir brukt, blir alle ordrene listet
    const cfg = {
        method: "GET",
        headers: {
            "authorization": aToken
        }
    }

    try {
        const result = await fetchData(url, cfg);

        return result;
    } catch (error) {
        errorHandler(error);
    }
}

//----------------------------------------------------------
export async function deleteOrder(aToken, aOrderID) {
    const url = urlMap.orderURL + "?key=" + groupKey + "&id=" + aOrderID;

    const cfg = {
        method: "DELETE",
        headers: {
            "authorization": aToken
        }
    }

    try {
        const result = await fetchData(url, cfg);

        messageHandler(`Deleted order`, `Deleted order with ID: ${result.record.id}`);
        return result;
    } catch (error) {
        errorHandler(error);
    }
}

//-----------------------------------------------------------
// Returnerer alle frakt alternativer
//-----------------------------------------------------------
export async function listShipmentMethods() {
    const url = urlMap.shipmentURL + "?key=" + groupKey;

    try {
        const result = await fetchData(url);
        return result;
    } catch (error) {
        errorHandler(error);
    }
}

//------------------------------------------------------
//Meow meow beenz API 
//------------------------------------------------------
export async function rateUser(aToken, userToRate, amountOfBeenz) {
    const url = urlMap.meowURL + "?key=" + groupKey;

    const cfg = {
        method: "PUT",
        headers: {
            "authorization": aToken,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            userid: userToRate,
            beenz: amountOfBeenz
        })
    }

    try {
        const result = await fetchData(url, cfg);
        messageHandler("Rated user!", "Thanks for contributing.")
        return result;
    } catch (error) {
        errorHandler(false, "You can't rate yourself");
    }
}