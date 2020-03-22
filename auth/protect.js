function protect(req, res, next){
    if(req.isAuthenticated){
        return next();
    }else{
        res.redirect('/user/badlogin');
    }
};

module.exports = protect;

