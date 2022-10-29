const blogModel = require( '../models/blogModel' );
const authorModels = require( '../models/authorModel' )
const { isValidObjectId, isValid, valid } = require( "../vaIidators/validator" )

//*******************************  ### POST /blogs ************************************/


const createBlog = async function( req, res ) {
    try {

        let { title, body, category, isPublished, publishedAt, authorId } = req.body

    if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, msg: "Data in request body is required" })

        if ( !title || !valid(title) )
            return res.status(400).send({ status: false, msg: "title required...!" })


        checkTitle = await blogModel.findOne({ title: title })

        if (checkTitle)
            return res.status(400).send({ status: false, msg: "title is already present...!" });

        if (!body || !valid(body))
            return res.status(400).send({ status: false, msg: "body is required...!" })


        if (!category || !valid(category))
            return res.status(400).send({ status: false, msg: "category is required...!" });

        // console.log(checkTitle)
        if (!authorId || !valid(authorId))
            return res.status(400).send({ status: false, msg: "authorId is required!...!" });

        if (req.body.hasOwnProperty('authorId')) {                //if authorId is present in request body

            if (!isValidObjectId(req.body.authorId))                //checking the boolean value
                return res.status(400).send({ status: false, msg: "Enter a valid author Id" })
        }

        const author = await authorModels.findById(authorId)
        if (!author) {
            return res.status(404).send({ status: false, msg: "Please enter valid AuthorId!...!" })

        }

        if (isPublished === false) {
            let createBlog1 = await blogModel.create(req.body);
          return  res.status(201).send({ status: true, data: createBlog1 });
        } else {

            req.body.publishedAt = new Date()
            let createBlog1 = await blogModel.create(req.body);

          return  res.status(201).send({ status: true, data: createBlog1 });
        }

    } catch (err) {
       return  res.status(500).send({ status: false, msg: err.message });
    }

};


// *****************************### GET /blogs  ##*********************************************//
const getBlogs = async function (req, res) {
    try {

        let data = req.query;
        if (req.query.hasOwnProperty('authorId')) {                //if authorId is present in request query

            if (!isValidObjectId(req.query.authorId))                //checking the boolean value
                return res.status(400).send({ status: false, msg: "Enter a valid author Id" })
        }
        let getData = await blogModel.find({ isPublished: true, isDeleted: false, ...data })  //.count()

        if (getData.length == 0)
            return res.status(404).send({ status: false, msg: " no such data found...!" })
        if (!getData)
            return res.status(404).send({ status: false, msg: "no such documents found...!" })

        return res.status(200).send({ status: true, data: getData })
        // console.log(getData)

    } catch (err) {
      return res.status(500).send({ status: false, msg: err.msg })
    }

}


//************************* */ ### PUT /blogs/:blogId  ###/************************************** */
const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId;
        const requestBody = req.body;

        let blog = await blogModel.findById(blogId)

        if (blog.isPublished=== true)
            return res.status(404).send({ status: false, msg:" blog is already updated...!" });

        // if (blog.isPublished === false && blog.isDeleted === false) {   //condtion here we wants to perform

            const updateBlog = await blogModel.findOneAndUpdate(
                { _id: blogId },
                {
                    $set: {
                        title: requestBody.title,
                        body: requestBody.body,
                        category: requestBody.category,
                        isPublished: true,
                        publishedAt: new Date()
                    },
                    $push: {
                        tags: req.body.tags,
                        subcategory: req.body.subcategory,
                    }
                },
                { new: true, upsert: true })

           return res.status(200).send({ Status: true, Data: updateBlog })

        // }

    }

    catch (err) {
       return res.status(500).send({ status: false, msg: err.message })
    }
}


//***************************** */ ### DELETE /blogs/:blogId  //************************************* */
const deleteByParams = async function (req, res) {
    try {

        let userId = req.params.blogId;
        let checkBlog = await blogModel.findById(userId)


        if (checkBlog.isDeleted == true)
            return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

        if (checkBlog.isPublished == true && checkBlog.isDeleted == false) {   //condition wants to excecute

            let deleteBlog = await blogModel.findOneAndUpdate(
                { _id: userId },
                { $set: { isDeleted: true, deletedAt: new Date() } },
                { new: true }
            );

           return res.status(201).send({ status: true, data: deleteBlog })

        }

    } catch (err) {
       return res.status(500).send({ status: false, msg: err.message })
    }

}


//***************************** */ ### DELETE /blogs?queryParams  ###//******************************** */
const deleteByQuery = async function (req, res) {
    try {

        let data = req.query
        let filter = { ...data }   //stores the query params in the object obj-destructure-object literals
        let checkBlog = await blogModel.findOne(filter)

        if (!checkBlog)
            return res.status(404).send({ status: false, msg: "no such blog exist...! " })

        if (checkBlog.isDeleted === true)
            return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

        let blogId = checkBlog._id
        // console.log(blogId )
        let deleteBlog = await blogModel.findOneAndUpdate(
            filter,
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true, upsert: true }
        )
       return res.status(201).send({ status: true, data: deleteBlog })

    } catch (err) {
       return res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports = { createBlog, getBlogs, updateBlog, deleteByParams, deleteByQuery }

