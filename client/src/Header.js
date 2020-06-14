import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';

class Header extends Component{
  constructor() {
    super();
    this.state = {
      username : '',
      login : '-1'
    }
  }

  componentDidMount(){
    axios.get('/user')
      .then(res=>{
        console.log(res);
        if(res.data.status==='OK'){
          this.setState({
            username : res.data.user.name,
            login : '1'
          })
        }
        else{
          this.setState({
            username : '',
            login : '0'
          })
        }
      })
      .catch(err=>{
        this.setState({
          username : '',
          login : '0'
        })
      })
  }
  //console.log(this.props)
  render(){
    const colors ={
      BASE_BLUE: '#0078d3',
      LIGHT_GREY: '#EEEEEE',
    }
    return(
      <React.Fragment>
        <AppBar position='fixed' color='inherit' style={{height:'60px'}}>
            <Toolbar>
                <Button style={{textTransform: 'none'}}>
                    <a href="/"><Typography variant="h5" style={{color: colors.BASE_BLUE}}>SMAP</Typography></a>
                </Button>
                <Grid
                    justify="space-between"
                    container
                    spacing={4}>
                    <Grid item>
                    </Grid>
                    
                    <Grid item style={{ padding: '0px' ,  marginRight: '15px'}}>
                        {this.state.login==='0'? (
                            <Button variant="outlined" style={{marginLeft:'50px', textTransform: 'none'}}>
                              <a href='/login'><Typography variant='h5' style={{color: colors.BASE_BLUE}}>Sign In / Up</Typography></a>
                            </Button>
                          ) : (
                            this.state.login==='-1'?(null):(
                              <div>
                                <Button style={{marginLeft:'50px', textTransform: 'none'}}>
                                  <a><Typography variant='h5' style={{color: colors.BASE_BLUE}}>{this.state.username}</Typography></a>
                                </Button>
                                <Button variant="outlined" style={{marginLeft:'15px', textTransform: 'none'}}>
                                  <a href='/discussion/feed'><Typography variant='h5' style={{color: colors.BASE_BLUE}}>Discussion</Typography></a>
                                </Button>
                                <Button variant="outlined" style={{marginLeft:'15px', textTransform: 'none'}}>
                                  <a href='/watchlist'><Typography variant='h5' style={{color: colors.BASE_BLUE}}>Watchlist</Typography></a>
                                </Button>
                                <Button variant="outlined" style={{marginLeft:'15px', textTransform: 'none'}}>
                                  <a href='/logout'><Typography variant='h5' style={{color: colors.BASE_BLUE}}>Logout</Typography></a>
                                </Button>
                              </div>
                            )
                        )}
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

export default Header;