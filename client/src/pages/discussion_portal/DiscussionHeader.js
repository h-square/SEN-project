import React from 'react';
import { Component } from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';

const colors ={
    BASE_BLUE: '#0078d3',
    LIGHT_GREY: '#EEEEEE',
}

class DiscussionHeader extends Component{
    render(){
        return(
            <React.Fragment>
                <AppBar position='fixed' color='inherit' style={{height:'60px'}}>
                    <Toolbar>
                        <Button style={{textTransform: 'none'}}>
                            <a href="/"><Typography variant="h5" style={{color: colors.BASE_BLUE}}>SMAP</Typography></a>
                        </Button>
                        <Button variant="outlined" style={{marginLeft:'50px', textTransform: 'none'}}>
                            <a href="/discussion/feed"><Typography variant="h5" style={{color: colors.BASE_BLUE}}>Feed</Typography></a>
                        </Button>
                        <Button variant="outlined" style={{marginLeft:'20px', textTransform: 'none'}}>
                            <a href="/discussion/blog"><Typography variant="h5" style={{color: colors.BASE_BLUE}}>Blog</Typography></a>
                        </Button>
                        <Button variant="outlined" style={{marginLeft:'20px', textTransform: 'none'}}>
                            <a href="/discussion/starred"><Typography variant="h5" style={{color: colors.BASE_BLUE}}>Starred</Typography></a>
                        </Button>
                        <Grid
                            justify="space-between"
                            container
                            spacing={4}>
                            <Grid item>
                            </Grid>
                            
                            <Grid item style={{ padding: '0px' ,  marginRight: '15px'}}>
                                <IconButton aria-label="show 17 new notifications" color="inherit">
                                    <Badge color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    color="inherit">
                                    <AccountCircle />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <br/>
                <br/>
                <br/>
            </React.Fragment>
        );
    }
}

export default DiscussionHeader;