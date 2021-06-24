const getDb = require("../util/db").getDb;
const mongoDb = require("mongodb");

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  save() {
    const db = getDb();
    db.collection("users").insertOne(this);
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
