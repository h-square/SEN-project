import React from 'react';
import { Component } from 'react';
import DiscussionHeader from './DiscussionHeader'
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Discussion.css'

import { Paper, Grid, Typography, Box, IconButton } from '@material-ui/core'
import { sizing } from '@material-ui/system';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';

class Discussion extends Component{
    state={
        posts:[ ]
    }
    componentDidMount() {
        // axios.get("https://jsonplaceholder.typicode.com/posts")
        //     .then(res => {
        //         //console.log(res)
        //         this.setState({
        //             posts: res.data
        //         })
        //     })
        axios.get("/api/discussion/")
            .then(res=>{
                //console.log(res);
                this.setState({
                    posts:res.data.blogs
                })
            })
    }
    render(){
        const {posts} = this.state
        const postList=posts.length ? (
            posts.map(post=>{
                console.log(post)
                return(
                    <div className="blogs" key={post.id}>
                        <Box width="50%" bgcolor="" p={1} my={0.5} style={{marginLeft:'20%'}}>
                            <Paper variant="outlined" style={{ marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
                                <a href={'/discussion/post/'+post.id}>
                                    <Typography variant="h5" style={{color: '#3399FF'}}>{post.blog.title}</Typography>
                                </a>
                                <Typography variant="caption">By: {post.blog.user}, Published at: {post.blog.publishDate}</Typography>
                                <br/>
                                <Typography>{post.blog.article}&nbsp;<a href={'/discussion/find/'+post.id}>read more...</a></Typography>
                                <div className="like-share-comment-bookmark">
                                    <IconButton>
                                        <ThumbUpAltOutlinedIcon/>
                                    </IconButton>
                                    <p style={{marginTop: '2%'}}>Likes</p>
                                    <IconButton>
                                        <CommentIcon/>
                                    </IconButton>
                                    <p style={{marginTop: '2%'}}>Comments</p>
                                    <IconButton>
                                        <StarBorderOutlinedIcon/>
                                    </IconButton>
                                </div>
                            </Paper>
                        </Box>
                    </div>
                )
            })
        ) : (
            <div className="center">No posts yet!</div>
        )
        return(
            <div className='container'>
                <DiscussionHeader/>
                {postList}
            </div>
        )
    }
}

export default Discussion;