const express = require('express');
const app = express();

app.use(express.json());

const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const validateEmail = (email) => {
    return (regex.test(String(email).toLowerCase()));
};

const validateTime = (time) => {
    return (dateRegex.test(time));
};

const validateStatus = (status) => {
    const validStatus = ['not started', 'todo', 'in progress', 'done'];

    return validStatus.includes(status);
}

module.exports = { validateEmail, validateTime, validateStatus }