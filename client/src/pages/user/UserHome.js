import React,{Component} from 'react';
import {Link} from 'react-router-dom';
const qs = require('querystring');

class UserHome extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        fetch('/user', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            return res.json().user;
        })
        .then(user => {
            this.setState({user});
            this.forceUpdate();
        });
    };

    logout=(e)=>{
        fetch('/user', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if(res.json().status === "OK"){
                this.loggedout = true;
            } else {
                this.loggedout = false;
            }
            this.forceUpdate();
        })
        .catch(err => {
            console.log(err);
        });
    }

    render(){
        if(this.user){
            return(
                <div className="col-md-6">
                <h1>You are home, {this.user.name}</h1>
                <button onClick={this.logout}>Logout</button>
                </div>
            )
        } else if (this.loggedout){
            return(
                <div className="col-md-6">
                <h1>You logged out successfully!</h1>
                <Link to={"/login"}><button variant="raised">Return to login page</button></Link>
                </div>
            )
        } else {
            return(
                <div className="col-md-6">
                <h1>You are not logged in!</h1>
                <Link to={"/login"}><button variant="raised">Return to login page</button></Link>
                </div>
            )
        }
    }
}

export default UserHome;