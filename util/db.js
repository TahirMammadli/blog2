const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2pcwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(res => {
        console.log("Connected!")
        _db = res.db()
        callback()
    }).catch(err => {
        console.log(err)
        throw err
    })
}
const getDb = () => {
    if(_db){
        return _db
    }
    throw 'No database found'
}

exports.getDb = getDb
exports.mongoConnect = mongoConnect