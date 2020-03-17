const config = require('../../config');
const MongoClient = require('mongodb').MongoClient;

const isValidUser = user => new Promise((resolve, reject) => {
    let dburi = `mongodb+srv://`+
        `${config.atlas_user}:${config.atlas_pass}`+
        `@smap-pmi7t.mongodb.net/test?retryWrites=true&w=majority`;

    MongoClient.connect(dburi, {useUnifiedTopology: true}, (err, client) => {
        if(err){
            reject(err);
        }else{
            const collection = client.db("data").collection("auth");

            let matches = [];
            collection.find(user)
            .forEach(doc => matches.push(doc))
            .then(() => {
                client.close();
                if(matches.length === 0){
                    resolve(false);
                }else if(matches.length === 1){
                    resolve(true);
                }else{
                    reject(new Error('multiple duplicates'));
                }
            }).catch(err => {
                client.close();
                reject(err);
            });
        }
    });
});

module.exports = isValidUser;