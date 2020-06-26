import React from 'react'
import DiscussionHeader from './DiscussionHeader'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

import { Box, Paper, Typography, IconButton, TextField, TextareaAutosize, Button } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';

import Loading from '../../Images/Loading.gif'

const qs = require('querystring');

const UserBlogs = () => {

    const [email,setEmail] = useState('');
    const [posts,setPosts] = useState([]);
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');

    useEffect(()=>{
        axios.get('/user')
            .then(res=>{
                setEmail(res.data.user.email)
            })
        axios.get('/user/blog/')
            .then(res=>{
                setPosts(res.data.blogs)
            })
    })

    const postList=posts.length ? (
        posts.map(post=>{
            if(post.author === email){
                return(
                    <div className="blogs" key={post.id}>
                        <Box width="50%" bgcolor="" p={1} my={0.5} style={{marginLeft:'20%'}}>
                            <Paper variant="outlined" style={{ marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
                                <a href={'/discussion/post/'+post.id}>
                                    <Typography variant="h5" style={{color: '#3399FF'}}>{post.title}</Typography>
                                </a>
                                <Typography variant="caption">By: {post.authorName}, Published At: {post.publishDate}</Typography>
                                
                                <Typography style={{marginTop:'5px'}}>{post.article}&nbsp;<a href={'/discussion/post/'+post.id}>read more...</a></Typography>
                                <div className="like-share-comment-bookmark">
                                    <a href={'/discussion/post/' + post.id}>
                                        <IconButton>
                                            <ThumbUpAltOutlinedIcon/>
                                        </IconButton>
                                        </a>
                                    <p style={{marginTop: '2%', marginRight: '5%'}}>{post.upvoteList.length} Likes</p>

                                    <a href={'/discussion/post/' + post.id}>
                                        <IconButton>
                                            <CommentIcon/>
                                        </IconButton>
                                    </a>
                                    <p style={{marginTop: '2%', marginRight: '5%'}}>{post.commentList.length} Comments</p>
                                    <IconButton>
                                        <StarBorderOutlinedIcon/>
                                    </IconButton>
                                </div>
                            </Paper>
                        </Box>
                    </div>
                )
            }
        })
    ) : (
        <div>
            <center>
                <img src={Loading} alt="loading..." />
            </center>
        </div>
    )

    function handleTitle(e){
        setTitle(e.target.value)
    }

    function handleContent(e){
        setContent(e.target.value)
    }

    function handleNewPost(e){
        e.preventDefault();
        console.log(title)
        console.log(content)
        let temp={
            title : title,
            article : content
        }
        fetch('/user/blog/create', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            credentials : 'include',
            body : JSON.stringify({
                "title" : title,
                "article" : content
            })
        })
        .then(res=>{
            console.log(res);
            setContent('');
            setTitle('');
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const newPost = (
        <div>
            <Box width="50%" bgcolor="" p={1} my={0.5} style={{marginLeft:'20%'}}>
                <Paper>
                    <TextField
                        placeholder = 'Title'
                        margin = 'normal'
                        autoFocus
                        fullWidth
                        multiline
                        style={{width : '96%', marginRight:'2%', marginLeft: '2%'}}
                        value={title}
                        onChange={handleTitle}
                    />
                    <TextareaAutosize
                        aria-label='minimum height'
                        rowsMin={5}
                        style={{width : '96%', marginRight:'2%', marginLeft: '2%', marginTop: '10px'}}
                        placeholder = 'Content'
                        value={content}
                        onChange={handleContent}
                    /> 
                    <Button onClick={handleNewPost} variant='contained' color='primary' style={{textTransform: 'none', marginLeft:'2%', marginBottom:'2%'}}>Post</Button>
                </Paper>
            </Box>
        </div>
    )
    return(
        <div>
            <DiscussionHeader/>
            {newPost}
            {postList}
        </div>
    );
}

export default UserBlogs;