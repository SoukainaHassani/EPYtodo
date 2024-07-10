const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

require('dotenv').config();

exports.notLoggedIn = (res) => {
    res.status(401).json({ "msg": "No token, authorization denied" });
}

exports.invalidToken = (res) => {
    res.status(401).json({ "msg": "Token is not valid" });
}

exports.notFound = (res) => {
    res.status(404).json({ "msg": "Not found" });
}

exports.badParameters = (res) => {
    res.status(400).json({ "msg": "Bad parameter" });
}

exports.internalServerError = (res) => {
    res.status(500).json({ "msg": "Internal server error" });
}

exports.verifyPassword = (res, password, hashed, result) => {
    // hash le password et le compare avec password non-hashé
    bcrypt.compare(password, hashed, (error, isCorrectPassword) => { // --> verifie si le password est correct + return le TOKEN
        if (error)
            return (this.internalServerError(res));
        if (!isCorrectPassword)
            return res.status(401).json({ "msg": "Invalid Credentials"});
        const token = jwt.sign({ id: result.id }, process.env.SECRET, {expiresIn: '12h' })
        return res.status(201).json({ "token": "Token of the newly logged user", token});
    })
}

// TOUJOURS RENVOYER LE TOKEN !!!!!!!

exports.verifyToken = (req, res, next) => {
    const header = req.headers['authorization'] // ca marche pas prcq jdois pas verifier le token dans login et register, je dois le generer PUIS le verifier dans les routes protegées
    const token = header && header.split(" ")[1];

    if (!token) {
        return this.notLoggedIn(res);
    }
    jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
            return this.invalidToken(res);
        }
        req.user = user;
        next();
    });
};

// --> ensuite decrypter avec jwt et le process.env.secret
