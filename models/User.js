const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: false
  },
  resetToken: String,
  resetTokenExpiration: String,
 
})

module.exports = mongoose.model('User', userSchema)









// USING MONGODB DRIVER
/*class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    
  }
  static resetToken;
  static resetTokenExpiration;
  save() {
    const db = getDb();
    db.collection("users").insertOne(this);
  }
  saveToken() {
    const db = getDb();
    db.collection("users").insertOne(this.resetToken, this.resetTokenExpiration);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.collection("users")
      .find({ email: email })
      .next()
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
*/