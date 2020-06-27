import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DiscussionHeader from './DiscussionHeader'
import './Discussion'
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Box, IconButton, TextField, Button, Modal } from '@material-ui/core'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const qs = require('querystring');

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
}));

const Post = (props) => {
    const classes = useStyles();

    const [modalStyle] = useState(getModalStyle);

    const [editComment, setEditComment] = useState();
    const [commentid,setCommentId] = useState();

    const [post,fetchPost] = useState(null);
    const [userComment,setUserComment] = useState('');
    const [email,setEmail]  = useState('');
    const [upvote,setUpvote] = useState(false);
    const [open,setOpen] = useState(false);
    
    const id = props.match.params.post_id
    const history = useHistory();

    useEffect(()=>{
        //console.log(this.props)
        let id = props.match.params.post_id
        //console.log(id);
        // axios.get('https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/posts/' + id)
        //     .then(res=>{
        //         console.log(res);
        //         this.setState({
        //             post: res.data
        //         })
        //         console.log(res)
        //     })
        axios.get('/user')
            .then(res=>{
                //console.log(res)
                setEmail(res.data.user.email)
                axios.get('/user/blog/find/' + id)
                .then(res=>{
                    //console.log(res);
                    fetchPost(res.data)
                    if(res.data.upvoteList)
                        setUpvote(res.data.upvoteList.includes(email))
                })
            })
    })
    
    function handleNewComment(){
        //console.log(userComment)
        let id = props.match.params.post_id
        let temp={
            comment : userComment
        }
        fetch('/user/blog/addComment/' + id, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                credentials : 'include',
                body : qs.stringify(temp)
            })
            .then(res=>{
                //console.log(res);
                setUserComment('')
            })
            .catch(err=>{
                console.log(err);
            })
    }

    function handleUserComment(e){
        setUserComment(e.target.value)
    }

    function handleEditComment(e){
        setEditComment(e.target.value)
    }

    function changeComment(){
        let temp={
            comment : editComment
        }
        fetch('/user/blog/updateComment/' + id + '/' + commentid, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                credentials : 'include',
                body : qs.stringify(temp)
            })
            .then(res=>{
                console.log(res);
                setOpen(false)
            })
            .catch(err=>{
                console.log(err);
            })
    }

    function deleteComment(){
        console.log(commentid)
        fetch('/user/blog/deleteComment/' + id + '/' + commentid, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                credentials : 'include'
            })
            .then(res=>{
                //console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    function handleUpvote(){
        let id = props.match.params.post_id
        if(!upvote){
            fetch('/user/blog/addUpvote/' + id, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                credentials : 'include'
            })
            .then(res=>{
                //console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
            setUpvote(true)
        }
        else{
            fetch('/user/blog/removeUpvote/' + id, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                credentials : 'include'
            })
            .then(res=>{
                //console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
            setUpvote(false)
        }
    }

    function handleDeletePost(e){
        e.preventDefault();
        let id = props.match.params.post_id
        //console.log(id)
        fetch('/user/blog/delete/' + id, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            credentials : 'include'
        })
        .then(res=>{
            console.log(res);
            history.push('/discussion/feed')
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const displayPost = post ? (
        <div className="post">
            <DiscussionHeader/>
            <Box width="65%" bgcolor="" p={1} my={0.5} style={{marginLeft:'10%'}}>
                <Paper variant="outlined" style={{ marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
                    <div className='same-row'>
                        <Typography variant="h5" style={{color: '#3399FF'}}>{post.title}</Typography>
                        {(post.author === email)? (
                            <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <MoreVertIcon align='right' {...bindTrigger(popupState)} style={{marginTop:'4px'}}/>
                                    <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={handleDeletePost}>Delete Blog</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                            </PopupState>
                        ) : (
                            null
                        )}
                    </div>
                    <Typography variant="caption">By: {post.authorName}, Published At: {post.publishDate}</Typography>
                    <Typography align='justify' style={{marginTop : '20px'}}>{post.article}</Typography>
                    <div className="like-share-comment-bookmark">
                        <IconButton onClick={handleUpvote}>
                            {upvote?(
                                <ThumbUpAltIcon/>
                            ) : (
                                <ThumbUpAltOutlinedIcon/>
                            )}
                        </IconButton>
                        <p style={{marginTop: '15px'}}>{post.upvoteList.length} Upvote</p>
                        {/* <IconButton style={{marginLeft : '5%'}}>
                            <StarBorderOutlinedIcon/>
                        </IconButton> */}
                    </div>
                </Paper>
                {/* <div className='same-row'>
                    <Typography style={{textTransform: 'none', marginLeft: '5px'}}>Comments ({post.commentList.length})</Typography>
                    <Typography style={{marginLeft:'72%',textTransform: 'none'}}><a href=''>Write comment?</a></Typography>
                </div> */}
            </Box>
        </div>
    ) : (
        <div>
            <DiscussionHeader/>
            <Typography align='center' style={{marginTop : '5%'}}> Fetching Post...</Typography>
        </div>
    )

    const modal_body = (
        <div style={modalStyle} className={classes.paper}>
            <TextField
                margin = 'normal'
                autoFocus
                fullWidth
                multiline
                value = {editComment}
                onChange = {handleEditComment}
            />
            <br/>
            <Grid
            spacing={4}
            container
            justify = 'space-between'
            >
                <Grid item></Grid>
                <Grid item style={{ padding: '0px' , marginTop: '2%',marginRight: '15px'}}>
                    <button style={{marginTop: '4px', textTransform:'none'}} onClick={changeComment}>Change</button>
                    <button style={{marginTop : '4px',marginLeft : '8px', textTransform : 'none'}} onClick={()=>{deleteComment();setOpen(false)}}>Delete</button>
                    <button style={{marginTop : '4px',marginLeft : '8px', textTransform : 'none'}} onClick={()=>{setOpen(false)}}>Cancel</button>
                </Grid>
            </Grid>
        </div>
    );

    const displayComments = post? (
        <div>
            <Box width="65%" bgcolor="" p={1} my={0.5} style={{marginLeft:'10%'}}>
                <TextField
                    margin = 'normal'
                    autoFocus
                    fullWidth
                    placeholder = 'Add a comment...'
                    value = {userComment}
                    onChange = {handleUserComment}
                />
                <br/>
                <Grid
                spacing={4}
                container
                justify = 'space-between'
                >
                    <Grid item></Grid>
                    <Grid item style={{ padding: '0px' , marginTop: '2%',marginRight: '15px'}}>
                        <Button color='primary' variant='contained' style={{textTransform:'none'}} onClick={handleNewComment}>Comment</Button>
                        <Button style={{textTransform : 'none'}} onClick={()=>{setUserComment('')}}>Cancel</Button>
                    </Grid>
                </Grid>
                <br/>
                <Typography style={{textTransform: 'none'}}>Comments ({post.commentList.length})</Typography>
                {
                    post.commentList.length? (
                        post.commentList.map((comment,index)=>{
                            //console.log(index)
                            //console.log(comment)
                            return(
                                <div key={index}>
                                    <div className='same-row'>
                                        <Typography variant='subtitle2' style={{fontWeight: 'bold', color : 'blue'}}> {comment.authorName} </Typography>
                                        <Typography variant='caption' style={{marginLeft : '10px', marginTop : '2px'}}> Last Modified : {comment.lastModified}</Typography>
                                        {(comment.author===email)?(
                                            <div>
                                                <Typography variant='caption' style={{marginLeft : '10px', marginTop : '2px'}}></Typography>
                                                <button onClick={()=>{setCommentId(index); setEditComment(comment.comment); setOpen(true)}}>Edit</button>
                                                {/* <Typography variant='caption' style={{marginLeft : '10px', marginTop : '2px'}}></Typography>
                                                <button onClick={()=>{setCommentId(index); deleteComment()}}>Delete</button> */}
                                                <Modal
                                                    open={open}
                                                    onClose={()=>{setOpen(false)}}
                                                    aria-labelledby="simple-modal-title"
                                                    aria-describedby="simple-modal-description"
                                                >
                                                    {modal_body}
                                                </Modal>
                                            </div>
                                        ) : (
                                            null
                                        )}
                                    </div>
                                    <Typography variant='body2' style={{marginLeft:'4px'}}>{comment.comment}</Typography>
                                    <br/>
                                </div>
                            )
                        })
                    ) : (null)
                }
            </Box>
        </div>
    ) : (
        <div>
            <Typography align='center' style={{marginTop : '5%'}}> Fetching Comments...</Typography>
        </div>
    )
    return(
        <div className="container">
            {displayPost}
            {displayComments}
        </div>
    )
}

export default Post