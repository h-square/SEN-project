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
import Header from '../../Header';

class Discussion extends Component{
    state={
        loggedin : false,
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
        axios.get('/user')
            .then(res => {
                if(res.data.status==='OK'){
                    this.setState({
                        loggedin : true
                    })
                }
                else{
                    this.setState({
                        loggedin : false
                    })
                }
            })
        axios.get("/user/blog/")
            .then(res=>{
                console.log(res);
                this.setState({
                    posts:res.data.blogs
                })
            })
    }

    render(){
        if(!this.state.loggedin){
            return(
                <Header/>
            )
        }
        const {posts} = this.state
        const postList=posts.length ? (
            posts.map(post=>{
                //console.log(post)
                return(
                    <div className="blogs" key={post.id}>
                        <Box width="50%" bgcolor="" p={1} my={0.5} style={{marginLeft:'20%'}}>
                            <Paper variant="outlined" style={{ marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
                                <a href={'/discussion/post/'+post.id}>
                                    <Typography variant="h5" style={{color: '#3399FF'}}>{post.title}</Typography>
                                </a>
                                <Typography variant="caption">By: {post.authorName}, Published At: {post.publishDate}</Typography>
                                <br/>
                                <Typography>{post.article}&nbsp;<a href={'/discussion/post/'+post.id}>read more...</a></Typography>
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