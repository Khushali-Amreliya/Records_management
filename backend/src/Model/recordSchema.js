const { default: mongoose } = require("mongoose");

const record_Schema = mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        address: {
            type: String,
        },
        state: {
            type: String,
        },
        district: {
            type: String,
        },
        city: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)
const Record = mongoose.model("Record", record_Schema)
module.exports = Record