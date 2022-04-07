const fs = require("fs")
const path = require("path")
const bcrypt = require("bcryptjs")
const usersFilePath = path.join(__dirname, '../data/usersData.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const { validationResult } = require("express-validator");

const userController = {
    index:(req, res) =>{
        res.render("users/user", {
            user: req.session.userLogged
        })
    },
    create:(req,res)=>{
        res.cookie("userLogged", "hola", {maxAge: 1000 * 30})
        res.render("users/formularioCrearUsuario")
    },
    createPost:(req,res)=>{
        //info
        let newUser = {
            id: Date.now(),
            userName: req.body.userName,
            email: req.body.email,
            password: bcrypt.hashSync (req.body.password, 10),
            img: req.file.filename
        };
        users.push(newUser)

        let userJSON=JSON.stringify(users);

		fs.writeFileSync(usersFilePath, userJSON);
		
        //redirigir
        res.redirect("/")
    },
    login: (req, res) => {
        res.render("login")
        console.log(req.cookies.userLogged)
    },
    loginProcess: (req, res) => {
        const results = validationResult(req);
        if (results.errors.length > 0) {
            res.render("login", {
                errors: results.mapped()
            });
        }else {
            let userToLog = users.find(email => email.email === req.body.email);
            if (userToLog) {
                let samePassword = bcrypt.compareSync(req.body.password, userToLog.password);
                if (samePassword) {
                    //delete userToLog.password; 
                    req.session.userLogged = userToLog;
                    res.redirect("/user");
                } else {
                    res.render("login", {
                        errors: {
                            password: {
                                msg: "Contraseña incorrecta"
                            }
                        }
                    });
                }
            }else{
                res.render("login", {
                    errors: {
                        email: {
                            msg: "No se encuentra el email"
                        }
                    }
                });
            }
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = userController