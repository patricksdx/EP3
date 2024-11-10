const express = require('express')
const conectarDB = require('./config/db')
const config = require('./config/global')
const cors = require('cors')
const path = require('path')
const usuario = require('./routes/usuario')

const app = express()

conectarDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api', usuario)

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


app.listen(config.port, () => {
    console.log('El servidor corriendo por el puerto 3000')
})