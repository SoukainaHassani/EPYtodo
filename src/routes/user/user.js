const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const database = require('../../database/db');
const { displayInfos, viewUsers } = require('./user_todos');

const app = express();

const { notLoggedIn, invalidToken, notFound, badParameters, internalServerError } = require('../../middleware/mw');


app.get('/user/todos', (req, res) => {
    // afficher les taches de tous les users
});

app.delete('/users/:id', (req, res) => {
    // supprimer un user
});

// faire trois routes séparées pour les trois dernieres ou les fusionner ensemble???
