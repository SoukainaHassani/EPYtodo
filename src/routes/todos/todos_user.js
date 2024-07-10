const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const database = require('../../database/db');
const { formatDate } = require('../user/user_todos');

const { validateTime, validateStatus } = require('../../other/regex');
const { internalServerError, notFound, badParameters } = require('../../middleware/mw');

const app = express();

const displayTodos = (todos, res) => {

    res.status(200).json(todos)

    /* res.status(200).json({
        "id":           todos.id.toString(),
        "title":        todos.title,
        "description":  todos.description,
        "created_at":   formatDate(todos.created_at),
        "due_time":     formatDate(todos.due_time),
        "user_id":      todos.user_id.toString(),
        "status":       todos.status
    }) */
} // -> pas sure de cque j'ai fait


const createTodo = (req, res, title, description, due_time, user_id, status) => {
    requestedId = parseInt(req.user.id, 10); // pas sure de req.user.id
    user_id = parseInt(user_id, 10);

    if (!title || !description || (!validateTime(due_time)) || !status ||
    (!validateStatus(status)) || !user_id || requestedId != user_id) {
        return notFound(res);
    }

    const createAtodo = 'INSERT INTO `todo` (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)';
    database.execute(createAtodo, [title, description, due_time, status, user_id], (error, results) => {
        if (error) {
            return internalServerError(res);
        }
        if (results.affectedRows === 0) {
            return notFound(res);
        }
        const newTodoID = results.insertId;
    
        const selectTodo = 'SELECT * FROM `todo` WHERE id = ?';
        database.execute(selectTodo, [newTodoID], (error, result) => {
            if (error) {
                return internalServerError(res);
            }
            if (result.length > 0) {
                return res.status(201).json(result[0]);
            } else {
                return notFound(res);
            }
        })
    })   
}

const viewAllTodos = (id, res) => {
    if (!id) {
        return badParameters(res);
    }
    const viewTodos = 'SELECT * FROM todo WHERE id = ?';
    database.execute(viewTodos, [id], (error, result) => {
        if (error) {
            return (internalServerError(res));
        }
        if (result.length === 0) {
            return notFound(res);
        }
        
        displayTodos(result, res);
    })
}

// const displayTodosbyID = (id) // PROBLEME GET TODOS (aussi faut que ya les crochets)
// probleme id (verifie pas si lid existe ou pas) (post todo verifie par exemple sinspirer)

const updateAtodo = (req, res, title, description, due_time, user_id, parsedID, status) => {
    const userID = parseInt(req.user.id, 10);
    const reqID = parseInt(user_id, 10);

    if (!title || !description || !due_time || !validateTime(due_time) || !status || !validateStatus(status)
    || !parsedID || !userID || !user_id || userID != reqID) {
        return badParameters(res);
    }
    const updateTodo = 'UPDATE todo SET title = ?, description = ?, created_at = ?, due_time = ?, status = ?, user_id = ? WHERE user_id = ? AND id = ?';
    database.execute(updateAtodo, [title, description, created_at, due_time, status, user_id, userID, parsedID], (error, result) => {
        if (error) {
            return internalServerError(res)
        }
        if (result.affectedRows == 0) {
            return notFound(res);
        }
        
    })
}

module.exports = { displayTodos, createTodo, viewAllTodos };