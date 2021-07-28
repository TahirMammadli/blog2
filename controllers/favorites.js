const Favorite = require('../models/Favorite')
const Book = require('../models/Book')

exports.get_favorites = (req, res, next) => {
  Favorite.find().then(favorites => {
    res.render('favorites', {
      favorites: favorites
    })
  })
}

exports.add_to_favorites = (req, res, next) => {
    const book_id = req.params.book_id;
  
    Book.findById(book_id)
      .then((book) => {
        const favorite = new Favorite({
          title: book.title,
          content: book.content,
          user_id: req.user
        });
        favorite
          .save()
          .then((result) => {
            res.redirect('/')
            console.log("Added to Favorites")
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  
  
  exports.delete_from_favorites = (req,res,next) => {
    const book_id = req.params.book_id
    Favorite.findByIdAndRemove(book_id).then(result => {
      console.log(result)
      res.redirect('/favorites')
    })
    .catch(err => console.log(err))
  }
  

  