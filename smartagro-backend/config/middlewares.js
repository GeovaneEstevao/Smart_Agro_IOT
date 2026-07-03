const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {

    app.use(bodyParser.json())
    app.use(bodyParser.text())
    app.use(bodyParser.urlencoded({extended: true}))
    console.log('OK')
    app.use(cors({
        origin: '*'
    }))
}