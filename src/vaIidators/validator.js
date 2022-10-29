const mongoose = require('mongoose');

let isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const valid = function (value) {

    if (typeof (value) === 'undefined' || value === null) return false
      if(typeof (value) !== "string") return false 
    if (typeof (value) === "string" && value.trim().length == 0) return false

    return true
}
let isValid = function (attribute) {
    return (/^[a-zA-Z]{2,20}$/.test(attribute.trim()))
}

const isvalidEmail = function (gmail) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   //.test(gmail);
    return regex.test(gmail)
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);   // to validate a MongoDB ObjectId we are use .isValid() method on ObjectId
};
module.exports = {isValid, valid, isvalidEmail, isValidTitle, isValidObjectId};