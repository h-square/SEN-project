import React, {Component} from 'react';
import { Link } from 'react-router-dom';

const qs = require('querystring');

class Login extends Component {

    initialState = {
        name: '',
        email: '',
        password: '',
        password2: '',
        formTitle: 'Login',
        loginBtn: true,
        errors: '',
    }

    constructor(props){
        super(props);
        this.state = this.initialState;
    }

    login = e => {
        e.preventDefault();
        let user = {
            email: this.state.email,
            password: this.state.password
        };

        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: qs.stringify(user)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res);
            if(res.status === "OK"){
                console.log("redirection turned on!");
                this.state.redirectionToUserHome = true;
                this.state.errors = false;
            } else {
                this.state.redirectionToUserHome = false;
                this.state.errors = res.status;
            }
            this.forceUpdate();
        })
        .catch(err => {
            console.log(err);
        });
    }

    register = e => {
        e.preventDefault();
        let user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: qs.stringify(user)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res);
            if(res.status === "OK"){
                console.log("redirection turned on!");
                this.state.redirectionToUserHome = true;
                this.state.errors = false;
            } else {
                this.state.redirectionToUserHome = false;
                this.state.errors = res.errors[0].msg;
            }
            this.forceUpdate();
        })
        .catch(err => {
            console.log(err);
        });
    }

    getAction = action => {
        if(action === 'reg'){
            this.setState(this.initialState);
            this.setState({formTitle: 'Register New User', loginBtn: false});
        }else{
            this.setState(this.initialState);
            this.setState({formTitle: 'Login', loginBtn: true});
        }
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    render(){

        let submitBtn = this.state.loginBtn ? 
            (<input className="loginBtn" type="submit" onClick={this.login} value="Enter" />) : 
            (<input className="loginBtn" type="submit" onClick={this.register} value="Register" />);

        let login_register = this.state.loginBtn ?
            (<button className="registerBtn" onClick={() => this.getAction('reg')}>Register</button>) : 
            (<button className="registerBtn" onClick={() => this.getAction('login')}>Login</button>)

        let login_from = this.state.loginBtn ?
            (<><label>E-mail</label><input type="text" 
            value={this.state.email} 
            onChange={this.handleChange} 
            name="email" />

            <label>Password</label><input type="password" 
            value={this.state.password} 
            onChange={this.handleChange} 
            name="password" /></>) : 
            
            (<><label>Name</label><input type="text" 
            value={this.state.name} 
            onChange={this.handleChange} 
            name="name" />

            <label>E-mail</label><input type="text" 
            value={this.state.email} 
            onChange={this.handleChange} 
            name="email" />

            <label>Password</label><input type="password" 
            value={this.state.password} 
            onChange={this.handleChange} 
            name="password" />
            

            <label>Re-enter Password</label><input type="password" 
            value={this.state.password2} 
            onChange={this.handleChange} 
            name="password2" />
            </>);


        let redirectButton = this.state.redirectionToUserHome ?
            (<Link to={"./user/home"}><button variant="raised">Correct credentials, click to go to your home!</button></Link>):null;
        let error_notification = this.state.errors ? 
            (<h2>{this.state.errors}</h2>) : null;

        return(
            <div className="form_block">
                <div id="title">{this.state.formTitle}</div>
                <div className="body">
                    <form>
                        {login_from}

                        {submitBtn}
                    </form>
                    {login_register}
                </div>

                <br>
                </br>
                {redirectButton}
                {error_notification}
            </div>
           
        )
    }
}

export default Login;