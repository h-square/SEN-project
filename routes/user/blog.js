const express = require("express");
const fs = require("fs-extra");
const firestore = require('../../firebase/firebase').firestore();
const config = require('../../config');
var blogCount = require('./blog-count'); 

const router = express.Router();

const blogRef = firestore.collection('blogs');

const get_date = () => {
	let date_ob = new Date();
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	let hours = ("0" + date_ob.getHours()).slice(-2);
	let minutes = ("0" + date_ob.getMinutes()).slice(-2);
	let seconds = ("0" + date_ob.getSeconds()).slice(-2);
	return `${date}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
};

const getBlogID = () => {
	blogCount.count = blogCount.count+1;
	fs.writeFileSync('./routes/user/blog-count.js', `const blogCount = \{ \n count : ${blogCount.count} \n \}\; \n module.exports = blogCount\;\n`);
	return `${blogCount.count}`;
};

const retrieveBlog = async (blogID) => {
	let retBlog = await blogRef.doc( blogID ).get().then( doc=> {
		if(!doc.exists){
			return {
				status : config.statusCodes.notfound,
				msg : 'Requested blog does not exists',
			};
		}
		else{
			return {
				status : config.statusCodes.ok, 
				id : blogID,
				...doc.data(),
			}
		}
	}).catch( err => {
		return {
			status : config.statusCodes.failed,
			errorType : config.statusCodes.db, 
		}
	});
	return retBlog;
};

const updateBlog = (blogID, blog) => {
	//console.log(blogID);
	blogRef.doc(blogID).set(blog);
};

const deleteBlog = (blogID) => {
	blogRef.doc(blogID).delete();
};

router.get('/', (req, res) =>{
	blogRef.get().then( snapshot => {
		let output = [];
		if( snapshot.empty ){
			console.log('No one has created any Blog');
		}
		else{
			snapshot.forEach( doc=>{
				let item = {
					id : doc.id,
					...doc.data(),
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
	res.json({
		status : config.statusCodes.ok
	});
});

router.get('/find/:blogID', (req, res) =>{
	retrieveBlog(req.params.blogID).then( retBlog => {
		res.json(retBlog);
	});
});

router.post('/create', (req, res) =>{
	let curDate = get_date();
	let newBlog = {
		author: req.user.email,
		authorName: req.user.name,
		title: req.body.title,
		article: req.body.article,
		publishDate: curDate,
		lastModified: curDate,
		commentList: [],
		upvoteList: [],
	};
	const blogID = getBlogID();
	updateBlog( blogID, newBlog);
	res.json({
		...newBlog,
		status: config.statusCodes.ok,
		id: blogID,
		upvoted: newBlog.upvoteList.includes(req.user.email),
	});
});

router.post('/update/:blogID', (req, res) =>{
	let curDate = get_date();
	retrieveBlog(req.params.blogID).then( blog => {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			let {status, id, ...restBlog} = blog;
			if( blog.author === req.user.email ){
				let updatedBlog = {
					...restBlog,
					title: req.body.title,
					article: req.body.article,
					lastModified: curDate,
				};
				updateBlog(req.params.blogID, updatedBlog);
				res.json({
					status: config.statusCodes.ok,
					id: req.params.blogID,
					...updatedBlog,
					upvoted: updateBlog.upvoteList.includes(req.user.email),
				});
			}
			else{
				res.json({
					status: config.statusCodes.unauthorised,
					msg: 'index is out of bound or not authorised', 
				});
			}
		}
	});
});

router.post('/addUpvote/:blogID', (req, res) => {
	retrieveBlog(req.params.blogID).then( blog=> {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			let {status, id, ...restBlog} = blog;
			if( !restBlog.upvoteList.includes( req.user.email )){
				restBlog.upvoteList.push(req.user.email);
			}
			updateBlog(req.params.blogID, restBlog);
			res.json({
				...restBlog,
				status: config.statusCodes.ok,
				id: req.params.blogID,
				upvoted: restBlog.upvoteList.includes(req.user.email),
			});
		}
	});
});

router.post('/removeUpvote/:blogID', (req, res) => {
	retrieveBlog(req.params.blogID).then( blog=> {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			let {status, id, ...restBlog} = blog;
			if( restBlog.upvoteList.includes( req.user.email )){
				restBlog.upvoteList.splice( restBlog.upvoteList.indexOf(req.user.email));
			}
			updateBlog(req.params.blogID, restBlog);
			res.json({
				...restBlog,
				status: config.statusCodes.ok,
				id: req.params.blogID,
				upvoted: restBlog.upvoteList.includes(req.user.email),
			});
		}
	});
});

router.post('/addComment/:blogID', (req,res) =>{
	let curDate = get_date();
	let newComment = {
		author: req.user.email,
		authorName: req.user.name,
		comment: req.body.comment,
		publishDate: curDate,
		lastModified: curDate,
	};
	retrieveBlog( req.params.blogID ).then( blog => {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			let {status, id, ...restBlog} = blog;
			restBlog.commentList.push(newComment);
			updateBlog(req.params.blogID, restBlog);
			res.json({
				...restBlog,
				status: config.statusCodes.ok,
				id: req.params.blogID,
				upvoted: restBlog.upvoteList.includes(req.user.email),
			});
		}
	});
});

router.post('/updateComment/:blogID/:commentID', (req, res) =>{
	let curDate = get_date();
	retrieveBlog(req.params.blogID).then( blog => {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			let {status, id, ...restBlog} = blog;
			commentID = parseInt(req.params.commentID);
			if( commentID >= 0 && commentID < restBlog.commentList.length && restBlog.commentList[commentID].author === req.user.email ){
				restBlog.commentList[commentID] = {
					...restBlog.commentList[commentID],
					comment: req.body.comment,
					lastModified: curDate,
				}
				updateBlog(req.params.blogID, restBlog);
				res.json({
					...restBlog,
					status: config.statusCodes.ok,
					id: req.params.blogID,
					upvoted: restBlog.upvoteList.includes(req.user.email),
				});
			}
			else{
				res.json({
					status: config.statusCodes.unauthorised,
					msg: 'index is out of bound or not authorised', 
				});
			}
		}
	});
});

router.post('/deleteComment/:blogID/:commentID', (req, res) =>{
	retrieveBlog(req.params.blogID).then( blog => {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		} 
		else{
			let {status, id, ...restBlog} = blog;
			commentID = parseInt(req.params.commentID);
			if( commentID >= 0 && commentID < restBlog.commentList.length && restBlog.commentList[commentID].author === req.user.email ){
				restBlog.commentList.splice(commentID,1);
				updateBlog(req.params.blogID, restBlog);
				res.json({
					...restBlog,
					status: config.statusCodes.ok,
					id: req.params.blogID,
					upvoted: restBlog.upvoteList.includes(req.user.email),
				});
			}
			else{
				res.json({
					status: config.statusCodes.unauthorised,
					msg: 'index is out of bound or not authorised', 
				});
			}
		}
	});
});

router.post('/delete/:blogID', (req,res) => {
	retrieveBlog(req.params.blogID).then( blog => {
		if( blog.status !== config.statusCodes.ok ){
			res.json(blog);
		}
		else{
			if( blog.author === req.user.email ){
				deleteBlog(req.params.blogID);
				res.json({
					status: config.statusCodes.ok,
					msg: 'successfully deleted',
				});
			}
			else{
				res.json({
					status: config.statusCodes.unauthorised,
					msg: 'requested blog is not authorised', 
				});
			}
		}
	});
});

module.exports = router;