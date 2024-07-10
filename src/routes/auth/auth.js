const express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../../database/db');

const { validateEmail } = require('../../other/regex');
const { verifyPassword } = require('../../middleware/mw');

const { notLoggedIn, invalidToken, notFound, badParameters, internalServerError } = require('../../middleware/mw');
const app = express();
app.use(bodyParser.json());

let users = [];

exports.registerUser = (name, firstname, email, password, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const checkEmail = 'INSERT INTO `user` (name, firstname, email, password) VALUES (?, ?, ?, ?)';
    database.execute(checkEmail, [name, firstname, email, hashed], (error, result) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY')
                return res.status(409).json({ "msg": "Account already exists"});
            return (internalServerError(res));
        }
        const token = jwt.sign({ id: result.insertId }, process.env.SECRET, {expiresIn: '12h' })
        return res.status(201).json({ "token": "Token of the newly registered user", token});
    })
}

exports.loginUser = (email, password, res) => {
    const logEmail = 'SELECT * FROM `user` WHERE email = ?';
    database.execute(logEmail, [email], (error, result) => {
        if (error)
            return (internalServerError(res));
        if (result.length != 1)
            return (notFound(res));

        const user = result[0];

        return verifyPassword(res, password, user.password, { email: user.email, id: user.id});

    })
}
// get users/:email qui fonctionne pas, del todos/:id aussi del users/:id, get todos (mauvais messages d'erreur)