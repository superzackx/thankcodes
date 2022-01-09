const mongoose = require('mongoose')

const gratitudeSchema = new mongoose.Schema({
    content: {
        type: "String",
        required: [false, "Contentbl"]  
    },
    author: {
        type: "String",
        required: [false, "Author can be blank"]
    }
})

module.exports  = mongoose.model('Gratitude', gratitudeSchema)

