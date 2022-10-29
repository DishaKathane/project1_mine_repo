const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const {isValid, valid, isvalidEmail, isValidTitle} = require("../vaIidators/validator")

/*******************************### Author APIs /authors****************************************/



const createAuthor = async function (req, res) {

    try {

        let { fname, lname, title, email, password } = req.body
        let body = req.body;
        if (Object.keys(body).length == 0)
            return res.status(400).send({ status: false, msg: "Data in request body is required...!" })

        if (!fname || !isValid(fname) || !valid(fname))
            return res.status(400).send({ status: false, msg: "fname is required in a valid format ...!" })
       

        if (!lname || !isValid(lname) || !valid(lname) )
            return res.status(400).send({ status: false, msg: "lname is required in a valid format...!" })
        

        if (!title)
            return res.status(400).send({ status: false, msg: "title is required...!" })
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, msg: "Invalid request parameters in the title, It should be Mr, Mrs, Miss" })
        }


        if (!email || !isvalidEmail(body.email))
            return res.status(400).send({ status: false, msg: "email is required in a valid format...!" })

       
        let check = await authorModel.findOne({ email: body.email })
        // console.log(check)
        if (check)
            return res.status(400).send({ status: false, msg: "email is already present, enter new email...!" })

        if (!password  || ! valid(password))
            return res.status(400).send({ status: false, msg: "password is required...!" })
        
        if (password.length < 8) {
            return res.status(400).send({ status: false, msg: "enter password with Minimum length 8" })
        }

        const createData = await authorModel.create(body);

       return res.status(201).send({ status: true, data: createData });

    } catch (err) {
       return res.status(500).send({ status: false, data: err.message });
    }
}

module.exports.createAuthor = createAuthor