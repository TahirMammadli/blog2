const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const postRoutes = require('./routes/post')
const mongoConnect = require('./util/db').mongoConnect
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const store = new MongoDBStore({
    uri: 'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2pcwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    collection: 'sessions'
})

const csrfProtection = csrf()

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))
app.use(csrfProtection)



app.set('view engine', 'ejs')
app.set('views', 'views')




app.use(postRoutes)

mongoConnect(() => {
    app.listen(3000)
})

