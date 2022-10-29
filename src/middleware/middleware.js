let jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const blogModel = require("../models/blogModel")
const isValidObjectId = require("../vaIidators/validator");

let decodedToken;


/****************************************(Authentication)*****************************************************/
const authenticate = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
    if (!token)
      return res.status(401).send({ status: false, msg: "token must be present" });


    decodedToken = jwt.verify(token, "Project1_Group10")
    // if(decodedToken) {
    //   req.decodedToken = decodedToken
    //     next()
    //    }

    //  if(!decodedToken) return res.status(500).send({status:false ,data:"Internal server error...!"});   // ye error handle nhi hoga 


    next()
  }
  catch (err) {
    return res.status(403).send({ status: false, msg: "You are Not authorised...!" })
  }

}

/*********************************************(Authorization)***************************************************** */
const authorise = async function (req, res, next) {
  try {

    let loginAuthor = decodedToken.authorId;

    let userLogging;



    /**validation for path params */
    if (req.params.hasOwnProperty('blogId')) {
      if (!isValidObjectId(req.params.blogId))                //checking the boolean value
        return res.status(400).send({ status: false, msg: "Enter a valid blog Id" })

      let blogData = await blogModel.findById(req.params.blogId);

      if (!blogData)                                          //you entering the author id here of any othor author
        return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });

      userLogging = blogData.authorId.toString();
    }




    
    /**validation for query params */
    if (req.query.hasOwnProperty('authorId')) {                //if authorId is present in request query

      if (!isValidObjectId(req.query.authorId))                //checking the boolean value
        return res.status(400).send({ status: false, msg: "Enter a valid author Id" })

      let blogData = await blogModel.findOne({ authorId: req.query.authorId });
      if (!blogData)                                             //this error shows by entering blogId
        return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });

      userLogging = blogData.authorId.toString();
      //getting authorId from blog data using authorId,converting it to string
    }
    if (!userLogging)                                                                //query needs this authorId
      return res.status(400).send({ status: false, msg: "AuthorId is required" });  //it valids specially for query params




    if (loginAuthor !== userLogging)
      return res.status(403).send({ status: false, msg: "Error, authorization failed" });

    next()

  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.msg })
  }

}

module.exports = { authorise, authenticate}


