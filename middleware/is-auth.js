exports.isAuth = (req,res,next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/login')
    }
    next()
}   

exports.isAdmin = (req,res,next) => {
    if(req.session.isAdmin !== "admin"){
        console.log('youre not an admin')
        res.redirect('/login')
    }
    next()
}