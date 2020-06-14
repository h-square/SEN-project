const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require('../../../firebase/admin-key.json');
const config = require('../../../config');

const app = express();
const firestore = admin.firestore();
const blogRef = firestore.collection('blogs');
const upvoteRef = firestore.collection('upvote');
const commentRef = firestore.collection('comment');
var blogCount = 40;

const router = express.Router();

function get_date(){
	let date_ob = new Date();
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	let hours = ("0" + date_ob.getHours()).slice(-2);
	let minutes = ("0" + date_ob.getMinutes()).slice(-2);
	let seconds = ("0" + date_ob.getSeconds()).slice(-2);
	return `${date}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
}

router.get('/:blogID', (req, res) =>{
	/*if(!req.user){
        res.json({
            status: config.statusCodes.failed,
            errorType: config.errorCodes.auth,
            errors: [
                {msg: 'Authenticated but user not Found'}
            ]
        });
        return;
    }*/
	
	blogRef.doc( req.params.blogID ).get().then( doc =>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let getBlog = doc.data();
			commentRef.doc( req.params.blogID ).get().then( doc=>{
				let comment = doc.data().comment;
				upvoteRef.doc( req.params.blogID ).get().then( doc=>{
					res.json({
						status: config.statusCodes.ok,
						id : req.params.blogID,
						blog : getBlog,
						upvotes : doc.data().users.length,
						//upvoted : doc.data().users.includes( req.body.user.email ),
						comments : comment
					});
				}).catch( err =>{
					console.log('database upvote failed' + err);
					res.json({
						status: config.statusCodes.failed,
						errorType: config.errorCodes.db,
						errors: [
							{ msg : err }
						]
					});
				});
			}).catch( err=>{
				console.log('database comment failed' + err);
				res.json({
					status: config.statusCodes.failed,
					errorType: config.statusCodes.db,
					errors: [
						{ msg : err }
					]
				});
			});
		}
	}).catch( err=>{
		console.log('database blog failed' + err);
		res.json({
			status : config.statusCodes.failed,
			errorType : config.statusCodes.db,
			errors : [
				{msg : err}
			]
		});
	});
});

module.exports = router;