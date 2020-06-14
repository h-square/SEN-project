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

router.get('/', (req, res) =>{
	
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
	
	blogRef.get().then( snapshot => {
		let output = [];
		if( snapshot.empty ){
			console.log('No one has created any Blog');
		}
		else{
			snapshot.forEach( doc=>{
				let item = {
					id : doc.id,
					blog : doc.data()
				};
				output.push( item );
			});
		}
		return output;
	}).then( output => {
		res.json({
			status : config.statusCodes.ok,
			blogs : output
		});
	}).catch( err =>{
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

router.get('/create', (req, res) =>{
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
	
	res.json({
		status : config.statusCodes.ok
	});
});


router.post('/create', (req, res) =>{
	
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
	
	let cur_date = get_date();
	let newBlog = {
		user : req.body.user.email,
		title : req.body.title,
		article : req.body.article,
		publishDate : cur_date,
		lastModified : cur_date
	};
	let newUpvote = {
		users : []
	};
	let newComment = {
		comment : []
	};
	let setdoc = blogRef.doc(`${blogCount}`).set(newBlog);
	let setdoc2 = upvoteRef.doc(`${blogCount}`).set(newUpvote);
	let setdoc3 = commentRef.doc(`${blogCount}`).set(newComment);
	blogCount = blogCount + 1;
	res.json({
		status: config.statusCodes.ok,
		id : `${blogCount-1}`,
		blog : newBlog,
		upvotes : newUpvote.users.length,
		upvoted : newUpvote.users.includes( req.body.user.email ),
		comments : newComment.comment
	});
});

router.post('/update/:blogID', (req, res) =>{
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
	
	let cur_date = get_date();
	blogRef.doc( req.params.blogID ).get().then( doc=>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			if( doc.data().user != req.body.user.email ){
				res.json({
					status: config.statusCodes.unauthorised,
					msg : 'You are not allowed to do this'
				});
			}
			else{
				let updateBlog = {
					user : req.body.user.email,
					title : req.body.title,
					article : req.body.article,
					publishDate : doc.data().publishDate,
					lastModified : cur_date
				};
				let updatedoc = blogRef.doc( req.params.blogID ).set( updateBlog );
				commentRef.doc( req.params.blogID ).get().then( doc=>{
					let comment = doc.data().comment;
					upvoteRef.doc( req.params.blogID ).get().then( doc=>{
						res.json({
							status: config.statusCodes.ok,
							id : req.params.blogID,
							blog : updateBlog,
							comments : comment,
							upvotes : doc.data().users.length(),
							upvoted : doc.data().users.includes( req.body.user.email )
						});
					}).catch( err=>{
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

router.post('/addUpvote/:blogID', (req, res) => {
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
	
	let addUpvote = upvoteRef.doc( req.params.blogID ).get().then( doc => {
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let newUsers = doc.data().users;
			if( !newUsers.includes( req.body.user.email ) ){
				newUsers.push( req.body.user.email );
			}
			let newUpvote = {
				users : newUsers
			};
			upvoteRef.doc( req.params.blogID ).set( newUpvote );
			blogRef.doc( req.params.blogID ).get().then( doc => {
				let blog = doc.data();
				commentRef.doc( req.params.blogID ).get().then( doc=>{
					res.json({
						status: config.statusCodes.ok,
						id : req.params.blogID,
						blog : blog,
						comments : doc.data().comment,
						upvotes : newUsers.length,
						upvoted : newUsers.includes( req.body.user.email )
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
		}
	}).catch( err=>{
		console.log('database upvote failed' + err);
		res.json({
			status: config.statusCodes.failed,
			errorType: config.errorCodes.db,
			errors: [
				{ msg : err }
			]
		});
	});
});

router.post('/removeUpvote/:blogID', (req, res) => {
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
	
	let removeUpvote = upvoteRef.doc( req.params.blogID ).get().then( doc => {
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let newUsers = doc.data().users;
			let index = newUsers.indexOf( req.body.user.email );
			if( index > -1 ){
				newUsers.splice( index, 1);
			}
			upvoteRef.doc( req.params.blogID ).set({users : newUsers});
			blogRef.doc( req.params.blogID ).get().then( doc => {
				let blog = doc.data();
				commentRef.doc( req.params.blogID ).get().then( doc=>{
					res.json({
						status: config.statusCodes.ok,
						id: req.params.blogID,
						blog: blog,
						comments: doc.data().comment,
						upvotes: newUsers.length,
						upvoted: newUsers.includes( req.body.user.email )
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
		}
	}).catch( err=>{
		console.log('database upvote failed' + err);
		res.json({
			status: config.statusCodes.failed,
			errorType: config.errorCodes.db,
			errors: [
				{ msg : err }
			]
		});
	});
});

router.post('/addComment/:blogID', (req,res) =>{
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
	
	let cur_date = get_date();
	let newComment = {
		user : req.body.user.email,
		comment : req.body.comment,
		publishDate : cur_date,
		lastModified : cur_date
	};
	commentRef.doc( req.params.blogID ).get().then( doc =>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let comment = doc.data().comment;
			comment.push( newComment );
			let updateComment = commentRef.doc( req.params.blogID ).set( {comment : comment} );
			blogRef.doc( req.params.blogID ).get().then( doc =>{
				let blog = doc.data();
				upvoteRef.doc( req.params.blogID ).get().then( doc =>{
					res.json({
						status: config.statusCodes.ok,
						id : req.params.blogID,
						blog : blog,
						upvotes : doc.data().users.length,
						upvoted: doc.data().users.includes( req.body.user.email ),
						comments : comment
					});
				}).catch( err=>{
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
				console.log('database blog failed' + err);
				res.json({
					status : config.statusCodes.failed,
					errorType : config.statusCodes.db,
					errors : [
						{msg : err}
					]
				});
			});
		}
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
});

router.post('/updateComment/:blogID/:commentID', (req, res) =>{
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
	
	let cur_date = get_date();
	
	let newComment = {
		user : req.body.user.email,
		comment : req.body.comment,
		publishDate : req.body.publishDate,
		lastModified : cur_date
	};
	commentRef.doc( req.params.blogID ).get().then( doc =>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let comment = doc.data().comment;
			let commentID = parseInt( req.params.commentID );
			if( commentID < comment.length && commentID >= 0 ){
				if( comment[commentID].user != req.body.user.email ){
					res.json({
						status: config.statusCodes.unauthorised,
						msg : 'You are not allowed to do this'
					});
				}
				else{
					newComment.publishDate = comment[ commentID ].publishDate;
					comment[ commentID ] = newComment;
					let updateComment = commentRef.doc( req.params.blogID ).set( {comment : comment} );
					blogRef.doc( req.params.blogID ).get().then( doc => {
						let blog = doc.data();
						upvoteRef.doc( req.params.blogID ).get().then( doc =>{
							res.json({
								status: config.statusCodes.ok,
								id : req.params.blogID,
								blog : blog,
								upvotes : doc.data().users.length,
								upvoted: doc.data().users.includes( req.body.user.email ),
								comments : comment
							});
						}).catch( err=>{
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
						console.log('database blog failed' + err);
						res.json({
							status : config.statusCodes.failed,
							errorType : config.statusCodes.db,
							errors : [
								{msg : err}
							]
						});
					});
				}
			}
			else{
				res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Comment doesnot exist'
			});
			}
		}
	}).catch( err=>{
		console.log('database comment failed' + err);
		res.json({
			status: config.statusCodes.db,
			errorType: config.statusCodes.db,
			errors: [
				{ msg : err }
			]
		});
	});
});

router.post('/deleteComment/:blogID/:commentID', (req, res) =>{
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
	
	commentRef.doc( req.params.blogID ).get().then( doc=>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			let commentID = parseInt( req.params.commentID );
			let comment = doc.data().comment;
			if( commentID < comment.length && commentID >= 0 ){
				if( comment[ commentID ].user != req.body.user.email ){
					res.json({
						status: config.statusCodes.unauthorised,
						msg : 'You are not allowed to do this'
					});
				}
				else{
					comment.splice( commentID, 1 );
					commentRef.doc( req.params.blogID ).set( {comment : comment} );
					blogRef.doc( req.params.blogID ).get().then( doc => {
						let blog = doc.data();
						upvoteRef.doc( req.params.blogID ).get().then( doc =>{
							res.json({
								status: config.statusCodes.ok,
								id : req.params.blogID,
								blog : blog,
								upvotes : doc.data().users.length,
								upvoted : doc.data().users.includes( req.body.user.email ),
								comments : comment
							});
						}).catch( err=>{
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
						console.log('database blog failed' + err);
						res.json({
							status : config.statusCodes.failed,
							errorType : config.statusCodes.db,
							errors : [
								{msg : err}
							]
						});
					});
				}
			}
			else{
				res.json({
					status : config.statusCodes.notfound,
					msg : 'Requested Comment doesnot exist'
				});
			}
		}
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
});

router.delete('/delete/:blogID', (req,res) => {
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
	
	blogRef.doc( req.params.blogID ).get().then( doc=>{
		if( !doc.exists ){
			res.json({
				status : config.statusCodes.notfound,
				msg : 'Requested Blog doesnot exist'
			});
		}
		else{
			if( doc.data().user != req.body.user.email ){
				res.json({
					status: config.statusCodes.unauthorised,
					msg : 'You are not allowed to do this'
				});
			}
			else{
				let deletedoc = blogRef.doc( req.params.blogID ).delete();
				let deletedoc2 = upvoteRef.doc( req.params.blogID ).delete();
				let deletedoc3 = commentRef.doc( req.params.blogID ).delete();
				res.json({
					status: config.statusCodes.ok
				});
			}
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