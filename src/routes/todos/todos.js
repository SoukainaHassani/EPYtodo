const express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const secreyKey = process.env.SECRET;

const isAuthorized = require("./middleware/mw");

app.get('/todos', isAuthorized, (req, res) => {
    // voir tous les todos
});

app.get('/todos/:id', isAuthorized, (req, res) => {
    // voir les todos d'un user avec son id
});

app.post('/todos', isAuthorized, (req, res) => {
    // créer un todo
});

app.put('/todos/:id', isAuthorized, (req, res) => {
    // update un todo
});

app.delete('/todos/:id', isAuthorized, (req, res) => {
    // delete un todo
});