const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: `The field Name can't be blank` },
    url: { type: String, required: `The field URL can't be blank` },
    questions: [
        {
            name: String,
        },
    ],
})

const Survey = mongoose.model('Survey', surveySchema)

module.exports = Survey
