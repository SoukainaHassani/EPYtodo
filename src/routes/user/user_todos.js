const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
const database = require('../../database/db');
const { internalServerError, notFound, badParameters } = require('../../middleware/mw');

const app = express();

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const displayInfos = (users, res) => {

    res.status(200).json({
        "id":               users.id.toString(),
        "email":            users.email,
        "password":         users.password,
        "created_at":       formatDate(users.created_at),
        "firstname":        users.firstname,
        "name":             users.name  
    }) // --> ca fonctionne !
}

const displayUserTodos = (todos, res) => {
    res.status(200).json(todos)
}

const viewUser = (id, res) => {

    if (!id) {
        return badParameters(res);
    }
    const viewInfos = 'SELECT * FROM `user` WHERE id = ?';
    database.execute(viewInfos, [id], (error, results) => {
        if (error) {
            return (internalServerError(res));
        }
        if (results.length === 0) {
            return (notFound(res));
        }

        displayInfos(results[0], res)
    })
}

// /user, /user/:id et /user/:email sont pareils???

const viewUserbyID = (id, res) => {
    const viewInfosID = 'SELECT * FROM `user` WHERE id = ?';
    database.execute(viewInfosID, [id], (error, results) => {
    if (error) {
            return (internalServerError(res));
        }
        if (results.length === 0) {
            return (notFound(res));
        }

        displayInfos(results[0], res)
    })
}

const displayInfosbyID = (id, res) => {
    if (!id)
        return badParameters(res);

    const dispInfos = 'SELECT * FROM `user` WHERE id = ?'; 
    database.execute(dispInfos, [id], (error, result) => {
        if (error)
            return internalServerError(res);
        if (result.length != 1)
            return (notFound(res));
        displayInfos(result[0], res);
    })
}

const viewUserbyEmail = (email, res) => {
    const viewInfosEmail = 'SELECT * FROM `user` WHERE email = ?';
    database.execute(viewInfosEmail, [email], (error, results) => {
        if (error) {
                return (internalServerError(res));
            }
            if (results.length === 0) {
                return (notFound(res));
            }
    
            displayInfos(results[0], res)
        })
}

const viewUserTodos = (user_id, res) => {
     // voir les todos, supprimer les todos, supprimer l'user
    if (!user_id) {
        return badParameters(res);
    }
    const viewTodos = 'SELECT * FROM `todo` WHERE user_id = ?';
    database.execute(viewTodos, [user_id], (error, results) => {
        if (error) {
            return (internalServerError(res));
        }
        if (results.length === 0) { // 0 car pas de todos !!???
            return (notFound(res));
        }

        displayUserTodos(results, res)
    })
}

const updateUserInfos = (req, res, email, password, firstname, name) => {
    bcrypt.hash(password, 10, (error, hashed) => {
        if (error) {
            return internalServerError(res);
        }
        const updateInfos = 'UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?';
        database.execute(updateInfos, [email, hashed, firstname, name, req.user.id], (error) => {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY') {
                    return res.status(409).json({ "msg": "Account already exists"});
                }
                return internalServerError(res);
            }
            return displayInfosbyID(req.user.id, res);
        })
    })
}

module.exports = {formatDate, viewUser, viewUserbyID, viewUserbyEmail, displayInfos, displayUserTodos, viewUserTodos, updateUserInfos};
