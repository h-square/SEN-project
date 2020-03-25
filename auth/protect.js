function protect(req, res, next){
    console.log('protect function is authenticated? =>', req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }else{
        res.status(401).json({status: "AUTHENTICATION FAILED"});
    }
};

module.exports = protect;

