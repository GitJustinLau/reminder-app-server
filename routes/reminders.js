const fs = require('fs');
const express = require('express');
const { v4: uuid } = require('uuid');
const { timeStamp } = require('console');
const router = express.Router();


const remindersFilePath = './data/reminders.json';

const getReminders = () => {
    return JSON.parse(fs.readFileSync(remindersFilePath));
}

const saveReminders = (remindersData) => {
    fs.writeFileSync(remindersFilePath, JSON.stringify(remindersData));
}

const validateCreateReminder = (req, res, next) => {
    if (!req.body.memo || !req.body.dateReminder || !req.body.time) {
        
        return res.status(400).json({ error: 'Please include memo and date of the new reminder' })
    } else {
        next();
    }
}

router
    .route('/')
    .get((req, res) => {
        const remindersData = getReminders().map((reminder) => {
            return {
                "id": reminder.id,
                "memo": reminder.memo,
                "time": reminder.time,
                "dateReminder": reminder.dateReminder,
                "dateCreated": reminder.dateCreated
            }
        })
        res.status(200).json(remindersData);
    })
    .post(validateCreateReminder, (req, res) => {
        const remindersData = getReminders();
        const newReminder = {
            "id": uuid(),
            ...req.body,
            "dateCreated": Date.now()
        };

        remindersData.push(newReminder);
        saveReminders(remindersData);
        res.status(201).json(newReminder);
    });

router
    .route('/:reminderId')
    .get((req, res) => {
        const remindersData = getReminders();
        const currReminderId = req.params.reminderId;
        const reminder = remindersData.find(reminder => reminder.id === currReminderId);

        if (!reminder) {
            return res.status(404).json({ error: 'reminder not found' });
        }

        res.status(200).json(reminder);
    })
    .delete((req, res) => {
        const remindersData = getReminders();
        const currReminderId = req.params.reminderId;
        const reminderIndex = remindersData.findIndex(reminder => reminder.id === currReminderId);

        if (reminderIndex === -1) {
            return res.status(404).json({ error: 'reminder not found' });
        }
        remindersData.splice(reminderIndex, 1);
        saveReminders(remindersData)
        res.status(204).send();
    })

module.exports = router;