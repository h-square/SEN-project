function protect(req, res, next){
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }else{
        res.status(401).json({status: "AUTHENTICATION FAILED"});
    }
};

module.exports = protect;

