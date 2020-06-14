import React, {useState,Component} from 'react';
import Header from '../../Header';
import { useHistory } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        SMAP
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const qs = require('querystring');

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function Login() {
    const classes = useStyles();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');
    const [loginBtn,setLoginBtn] = useState(true);
    const [errors,setErrors] = useState('');
    const [redirectionTologin,setRedirectionToLogin] = useState(false);
    const [redirectionToUserHome,setRedirectionToUserHome] = useState(false);
    const [PrivacyPolicy,setPrivacyPolicy] = useState(false);

    const history = useHistory();

    function login(e){
        e.preventDefault();
        let user = {
            email: email,
            password: password
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
            //console.log(res);
            if(res.status === "OK"){
                setRedirectionToLogin(false)
                setRedirectionToUserHome(true)
                setErrors(false)
                
                history.push('/')
            } else {
                setRedirectionToLogin(false)
                setRedirectionToUserHome(false)
                setErrors(res.status)
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    function register(e) {
        e.preventDefault();
        let user = {
            name: name,
            email: email,
            password: password,
            password2: password2
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
                setRedirectionToLogin(true);
                setRedirectionToUserHome(false)
                setErrors(false)
                setLoginBtn(true)
                setName('')
                setEmail('')
                setPassword('')
                setPassword2('')
                
                history.push('/login')
            } else {
                setRedirectionToLogin(false)
                setRedirectionToUserHome(false)
                setErrors(res.errors[0].msg)
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    function handleChangeEmail(e){
        setEmail(e.target.value)
    }
    
    function handleChangePassword(e){
        setPassword(e.target.value)
    }

    function handleChangeName(e){
        setName(e.target.value)
    }

    function handleChangePassword2(e){
        setPassword2(e.target.value)
    }

    function handleChangeCheckbox(e){
        if(PrivacyPolicy)
            setPrivacyPolicy(false)
        else
            setPrivacyPolicy(true)
    }

    function handleNewUser(e){
        setName('')
        setEmail('')
        setPassword('')
        setPassword2('')
        setErrors('')
        setRedirectionToLogin(false)
        setRedirectionToUserHome(false)
        setLoginBtn(false)
    }
    let redirectButton = redirectionTologin ?
        (<Typography align='center' variant='h6'>Registered successfully! Login to continue...</Typography>):null;
    let error_notification = errors ? 
        (<Typography align='center' variant='h6' style={{color: 'red'}}>{errors}</Typography>) : null;

    return (
        <div>
            <Header/>
            {redirectButton}
            { loginBtn?(
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                        Sign in
                        </Typography>
                        <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email} 
                            onChange={handleChangeEmail}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password} 
                            onChange={handleChangePassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={login}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item onClick={handleNewUser}>
                            <Link variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                            </Grid>
                        </Grid>
                        </form>
                    </div>
                </Container>
            ) : (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={handleChangeName}
                            />
                            </Grid>
                            
                            <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={handleChangeEmail}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handleChangePassword}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password2"
                                label="Re-Password"
                                type="password"
                                id="password2"
                                autoComplete="current-password"
                                value={password2}
                                onChange={handleChangePassword2}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value={PrivacyPolicy} color="primary" onChange={handleChangeCheckbox}/>}
                                label="Accept SMAP's privacy policy"
                            />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={!PrivacyPolicy}
                            className={classes.submit}
                            onClick={register}
                        >
                        Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <a href='/login' variant="body2">
                                    Already have an account? Sign in
                                </a>
                            </Grid>
                        </Grid>
                        </form>
                    </div>
                    
                </Container>
            )}
            {error_notification}
            <Box mt={5}>
                <Copyright />
            </Box>
        </div>
    );
}