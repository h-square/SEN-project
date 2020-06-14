import React, { Component } from 'react'
import axios from 'axios'
import DiscussionHeader from './DiscussionHeader'
import './Discussion'
import {Link} from 'react-router-dom'

import { Paper, Grid, Typography, Box, IconButton } from '@material-ui/core'
import { sizing } from '@material-ui/system';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';


class Post extends Component{
    state= {
        post: null
    }
    componentDidMount(){
        //console.log(this.props)
        let id = this.props.match.params.post_id
        console.log(id);
        // axios.get('https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/posts/' + id)
        //     .then(res=>{
        //         console.log(res);
        //         this.setState({
        //             post: res.data
        //         })
        //         console.log(res)
        //     })
        axios.get('/api/discussion/find/' + id)
            .then(res=>{
                console.log(res);
            })
    }
    render(){
        const post = this.state.post ? (
            <div className="post">
                <DiscussionHeader/>
                <Box width="65%" bgcolor="" p={1} my={0.5} style={{marginLeft:'10%'}}>
                    <Paper variant="outlined" style={{ marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
                        <Typography variant="h5" style={{color: '#3399FF'}}>Title : {this.state.post.title}</Typography>
                        <Typography variant="caption">By: user, Time:</Typography>
                        <br/>
                        <Typography align='justify'>{this.state.post.body}</Typography>
                        <div className="like-share-comment-bookmark">
                            <IconButton>
                                <ThumbUpAltOutlinedIcon/>
                            </IconButton>
                            <p style={{marginTop: '1.5%'}}>Likes</p>
                            <IconButton style={{marginLeft : '5%'}}>
                                <StarBorderOutlinedIcon/>
                            </IconButton>
                        </div>
                    </Paper>
                    <div className='same-row'>
                        <Typography align='left' style={{paddingLeft:'2px',marginTop:'2%',textTransform: 'none'}}>Comments</Typography>
                        <Typography align='right' style={{paddingLeft:'2px',marginTop:'2%',textTransform: 'none'}}><a href=''>Write a comment?</a></Typography>
                    </div>
                    <Box width="100%" bgcolor="" p={1} my={0.5} style={{marginTop:'1%'}}>
                    </Box>
                </Box>
            </div>
        ) : (
            <div className="center">Loading Post...</div>
        )
        return(
            <div className="container">
                <h4>{post}</h4>
            </div>
        )
    }
}

export default Post