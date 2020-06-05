const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: `The field Survey can't be blank`,
    },
    data: { type: Array, required: `Answer can't be blank` },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
