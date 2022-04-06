const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/usersController");

let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./public/images/users");
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}_img_${path.extname(file.originalname)}`)
    }
})
let upload = multer({ storage })

//middleware
const validation = require("../middlewares/validator");

router.get("/", userController.index)

//creación
router.get("/create",userController.create);
router.post("/create",upload.single("img"),userController.createPost);

router.get("/login", userController.login)
router.post("/login", validation , userController.loginProcess)
module.exports = router

