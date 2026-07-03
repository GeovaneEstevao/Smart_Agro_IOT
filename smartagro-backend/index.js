const express = require('express')
const app = express()

const db = require('./config/db.js')
const consign = require('consign')

const serverip = 'localhost'
const port = 3000

/*app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))*/

consign()
    .include('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

app.get('/teste/:id', (req, res) => {
    console.log('OK '+ req.query)
    res.status(200).send("Meu servidor HTTP")
})

app.listen(port, serverip, () => {
    console.log('Servidor executando ...')
})