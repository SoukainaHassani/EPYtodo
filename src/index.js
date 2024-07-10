require('dotenv').config();

const express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');
const auth = require('./routes/auth/auth');
const database = require('./database/db');

const { validateEmail } = require('../src/other/regex');

const { registerUser, loginUser } =  require('./routes/auth/auth');
const { viewUser, viewUserTodos, viewUserbyID, viewUserbyEmail, updateUserInfos, deleteUser } = require('./routes/user/user_todos');

const { badParameters, verifyToken, notFound, internalServerError } = require('./middleware/mw');
const { createTodo, viewAllTodos } = require('./routes/todos/todos_user');

const app = express();
app.use(bodyParser.json());

let users = [];

const secreyKey = process.env.SECRET;

app.get("/", (req, res) => {
    res.send('Welcome to your new Todo App!');
});

app.post("/register", (req, res) => {
    const { name, firstname, email, password } = req.body;

    if (!name || !firstname || !validateEmail(email) || !password) {
        return (badParameters(res));
    }

    return registerUser(name, firstname, email, password, res)
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email) || !password) {
        return res.status(401).json({ "msg": "Invalid Credentials"});
    }

    return loginUser(email, password, res);
});

app.get("/user", verifyToken, (req, res) => {
    const { id } = req.user;
    return viewUser(id, res);
});

app.get("/user/todos", verifyToken, (req, res) => {
    const user_id = req.user.id;
    return viewUserTodos(user_id, res);
    // voir les taches de l'user connecté à l'instant meme (si ya pas de todos cv pas marcher!!)
});

app.get("/users/:id", verifyToken, (req, res) => { // voir les infos de l'user par ID ou email
    const { id } = req.params;

        // FONCTIONNE PAS POUR EMAIL --> Not found
    if (id) {
        return viewUserbyID(id, res) // tout fonctionne ici 
    } else {
        return notFound(res);
    }
});

app.get("/users/:email", verifyToken, (req, res) => {
    const { email } = req.params;

    if (!email) {
        return notFound(res);
    } else {
        return viewUserbyEmail(email, res);
    }
})

app.put("/users/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { email, password, firstname, name } = req.body;
    const parsedID = parseInt(id, 10);

    if (id) {
        if (!validateEmail(email) || !password || !firstname || !name || id != parsedID) {
            return badParameters(res);
        }
        return updateUserInfos(req, res, email, password, firstname, name);
    } else {
        return notFound(res);
    }


    // update user info
});

app.put("/todos/:id", verifyToken, (req, res) => {
    const todoID = req.params.id;
    // const userID = req.user.id;
    const parsedID = parseInt(todoID, 10);
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !parsedID) {
        return badParameters(res);
    }
    return 

    
})

app.delete("/users/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const parsedID = parseInt(id, 10);

    if (id != parsedID) {
        return badParameters(res);
    }
    if (!id) {
        return notFound(res);
    } else {
        const deletingUser = 'DELETE FROM user WHERE id = ?';

        database.execute(deletingUser, [parsedID], (error, result) => {
            if (error) {
                return internalServerError(res);
            }
            if (result.affectedRows == 0) {
                return notFound(res);
            }
            return res.status(200).json({ "msg": `Successfully deleted record number: ${req.user.id}` });
        })
    }
})

app.delete("/todos/:id", verifyToken, (req, res) => {
    const todoID = req.params.id;
    const userID = req.user.id;

    if (!todoID || !userID) {
        return badParameters(res);
    }

    const deleteAtodo = 'DELETE FROM todo WHERE user_id = ? AND id = ?';

    database.execute(deleteAtodo, [userID, todoID], (error, result) => {
        if (error) {
            return internalServerError(res);
        }
        if (result.affectedRows == 0) {
            return notFound(res);
        }
        return res.status(200).json({ "msg": `Successfully deleted record number: ${todoID}` });
    })
})

app.get("/todos", verifyToken, (req, res) => {
    const { id } = req.user;
    return viewAllTodos(id, res)
})

app.post("/todos", verifyToken, (req, res) => {
    const { title, description, due_time, status, user_id } = req.body;

    return createTodo(req, res, title, description, due_time, user_id, status);

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
