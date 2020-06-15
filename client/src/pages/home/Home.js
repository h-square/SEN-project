import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import Loading from '../../Images/Loading.gif'

import {Paper,Box} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Image from '../../Images/Home_Background.jpg'

const useStyles = makeStyles((theme) => ({
  home :{
    backgroundImage : `url(${Image})`,
    position : "relative",
    height: '900px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <div className = {classes.home}>
    <Header/>
    <Box width="50%" bgcolor="" p={1} my={0.5} style={{marginLeft:'25%', marginRight:'25%',marginTop: '10%'}}>
      <Paper>
        <List className={classes.root}>
          <Link to='/reports'>
            <ListItem alignItems="flex-start">
              <ListItemText
                style = {{color : '#0078d3'}}
                primary="Annual Report"
                secondary={
                  <React.Fragment>
                    {" — Access the annual reports of companies"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
          <Divider variant="fullWidth" component="li" />
          <Link to='/indicators'>
            <ListItem alignItems="flex-start">
              <ListItemText
                style = {{color : '#0078d3'}}
                primary="Technical Indicators"
                secondary={
                  <React.Fragment>
                    {" — Technical indicators of companies"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
          <Divider variant="fullWidth" component="li" />
          <Link to='/optsim'>
            <ListItem alignItems="flex-start">
              <ListItemText
                style = {{color : '#0078d3'}}
                primary="Option Simulator"
                secondary={
                  <React.Fragment>
                    {" — Simulate different options"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
          <Divider variant="fullWidth" component="li" />

          <Link to='/peercomp'>
            <ListItem alignItems="flex-start">
              <ListItemText
                style = {{color : '#0078d3'}}
                primary="Peer Comparison"
                secondary={
                  <React.Fragment>
                    {" — Compare peers"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
          <Divider variant="fullWidth" component="li" />

          <Link to='/dcf'>
            <ListItem alignItems="flex-start">
              <ListItemText
                style = {{color : '#0078d3'}}
                primary="DCF and Stock Prediction"
                secondary={
                  <React.Fragment>
                    {" — Stock Prediction!"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
        </List>
      </Paper>
    </Box>
    </div>
  );
}

export default Home;
// class Home extends Component {
//   constructor() {
//     super();
//     this.state = {
//       login : false,
//       loading : true
//     }
//     this.sleep=this.sleep.bind(this);
//     this.wait=this.wait.bind(this);
//   }
//   sleep = milliseconds => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds));
//   };
//   wait = async (milliseconds = 1000) => {
//       await this.sleep(milliseconds);
//       this.setState({
//           loading: false
//       });
//   };
//   componentDidMount(){
//     this.wait(500);
//   }
//   render() {
//     return (
//       <div>
//         {this.state.loading?(
//           <center>
//           <img className='loading' src={Loading}/>
//           </center>
//         ) : (
//           <div className="App">
//             <div className="home">
//               <Header/>
//               <div className="wrapper">
//                 <div className="sidebar">
//                   <ul>
//                     <li><Link to='./reports'>Annual Reports</Link></li>
//                     <br/>
//                     <li><Link to='./indicators'>Technical Indicators</Link></li>
//                     <br/>
//                     <li><Link to='./optsim'>Option Simulator</Link></li>
//                     <br/>
//                     <li><Link to='./peercomp'>Peer Comparison</Link></li>
//                     <br/>
//                     <li><Link to='./dcf'>DCF and Stock Prediction</Link></li>
//                     {/* <br/>
//                     {watchlist} */}
//                   </ul> 
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }


// export default Home;