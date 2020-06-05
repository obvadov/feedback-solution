const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: [true, `The field Name can't be blank`],
        },
        email: {
            type: String,
            index: true,
            unique: true,
            required: [true, `The field E-mail can't be blank`],
            trim: true,
            validate: [
                validator.isEmail,
                'The field must contain correct email',
            ],
        },
        password: {
            type: String,
            required: `The field Password can't be blank`,
            select: false,
            minlength: 8,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true, versionKey: false },
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.changePassword = function (newPassword) {
    this.password = newPassword;
};

userSchema.methods.changeName = function (newName) {
    this.name = newName;
};

userSchema.methods.comparePassword = async (candidatPassword, userPassword) => {
    return await bcrypt.compare(candidatPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

User.ensureIndexes();
User.on('index', function (err) {
    //console.log(err);
});

module.exports = User;
