
//-------------------------------------------------------------
export function errorHandler(error) {

    switch(error.cause.http_code){
        case 400: 
        console.log("Please check your input.");
        break
        case 403: 
        console.log("Wrong username or password, please try again.");
        break
        case 500: 
        console.log("Wrong groupkey")
        break
    }

    // handle errors here, e.g. show a dialog with an easy-to-understand explanation
    // based on the error type/code.

    console.log(error.cause);

}