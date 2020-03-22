const LocalStrategy = require('passport-local').Strategy;
const config = require('../config.js');
const MongoClient = require('mongodb').MongoClient;

module.exports = passport => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            let dburi = `mongodb+srv://`+
            `${config.atlas_user}:${config.atlas_pass}`+
            `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;
            
            MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
                if(err){
                    throw err;
                }else{
                    const collection = client.db("data").collection("auth");
                    
                    let matches = [];
                    collection.find({email})
                    .forEach(doc => matches.push(doc))
                    .then(() => {
                        client.close();
                        if(matches.length === 0){
                            return done(null, false, {message: 'Unregistered Email'});
                        }else if(matches.length === 1){
                            let userData = matches[0];

                            if(password === userData.password){
                                return done(null, userData);
                            }else{
                                return done(null, false, {message: 'Wrong Password'});
                            }

                        }else{
                            throw 'multiple duplicates';
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
                }
            });
        })
    );

    passport.serializeUser((user, done) => {
        //console.log(user._id);
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        let dburi = `mongodb+srv://`+
            `${config.atlas_user}:${config.atlas_pass}`+
            `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;
            
        MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
            if(err){
                throw err;
            }else{
                const collection = client.db("data").collection("reports");

                collection.findOne({id})
                .then((user, err) => {
                    done(err, user);
                })
                .then(() => client.close());
            }
        });
    });
};