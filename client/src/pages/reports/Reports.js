import React, {useState} from 'react';
import axios from 'axios';
import Loading from '../../Images/Loading.gif';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Header from '../../Header'
import './Reports.css'

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ListItem, List } from '@material-ui/core';
//import Image from '../../Images/graph-background.jpg'

const useStyles = makeStyles((theme) => ({
  home : {
    // backgroundImage : `url(${Image})`,
    // position : "relative",
    // minHeight:'900px',
    // backgroundPosition: 'center',
    // backgroundSize: 'cover'
  },
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

function Reports(){
  const classes = useStyles();
  const [symbol,setSymbol] = useState('')
  const [year,setYear] = useState('')
  const [showData,setShowData] = useState(false)
  const [data,setData] = useState(null)
  const [error,setError] = useState(false)
  const [print,setPrint] = useState(false)

  function handleChangeSymbol(e){
    setSymbol(e.target.value)
  }

  function handleChangeYear(e){
    setYear(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault();
    setShowData(false)
    setError(false)
    setData(null)
    setPrint(true)
    var sym=symbol.toUpperCase().trim()
    axios.get(`/api/report/${sym}-${year}`)
      .then(res => {
        //console.log(res.data);
        if(res.data.status==='OK'){
          setSymbol('')
          setYear('')
          setData(res.data)
          setShowData(true)
          setError(false)
          setPrint(false)
        }
        else{
          setSymbol('')
          setYear('')
          setShowData(false)
          setError(true)
          setPrint(false)
        }
      })
      .catch(err => {
        setSymbol('')
        setYear('')
        setShowData(false)
        setError(true)
        setPrint(false)
      });
  }

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

  const dataDisplay=showData? (
    //console.log(this.state.data),
    <Box width="70%" bgcolor="" p={1} my={0.5} style={{marginLeft:'15%', marginRight:'15%'}}>
      <br/>
      <center><Typography variant ='h4' className='red lighten-2' color='error'>
        {data.symbol} {data.year}
      </Typography></center>
      <section id="profit-loss">
        <div className="flex-row">
          <Typography variant='h5' color='primary'>
            Profit and Loss
            <Typography variant='body2' color='textSecondary'>&nbsp;&nbsp;Figures in Rs. Crores</Typography>
          </Typography>
        </div>
        <div className="flex-filler"></div>
        <TableContainer component={Paper} className="responsive holder" data-result-table>
          <Table className='striped responsive-text-nowrap' aria-label='simple table'>
            <TableBody>
              <StyledTableRow className='stripe highlight'>
                <StyledTableCell>Sales</StyledTableCell>
                <StyledTableCell>{data.income_statement['Revenue']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell >Sales Growth%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                <StyledTableCell align='left'>{Math.round((data.income_statement['Revenue Growth']+Number.EPSILON)*10000)/10000}%</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell >Net Expenses</StyledTableCell>
                <StyledTableCell align='left'>{(data.income_statement['R&D Expenses']+data.income_statement['SG&A Expense']+data.income_statement['Operating Expenses']+data.income_statement['Interest Expense']+data.income_statement['Income Tax Expense'])/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>R&D Expenses</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['R&D Expenses']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>SG&A Expenses</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['SG&A Expense']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Operating Expenses</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Operating Expenses']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Interest Expenses</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Interest Expense']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell >Income Tax Expenses</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Income Tax Expense']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell >Operating Profit</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Operating Income']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell >Profit before Tax</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Earnings before Tax']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Net Profit</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['Net Income']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Profit Margin</StyledTableCell>
                <StyledTableCell align='left'>{Math.round((data.income_statement['Profit Margin']+Number.EPSILON)*10000)/10000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>EPS in Rs.</StyledTableCell>
                <StyledTableCell align='left'>{data.income_statement['EPS']}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      <br/>
      <br/>
      <section id='balance-sheet'>
        <div className="flex-row">
        <Typography variant='h5' color='primary'>
            Balance Sheet
            <Typography variant='body2' color='textSecondary'>&nbsp;&nbsp;Figures in Rs. Crores</Typography>
          </Typography>
        </div>
        <TableContainer component={Paper} className="responsive holder" data-result-table>
          <Table className='striped'>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell>Total Shareholders Equity</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Total shareholders equity']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Receivables</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Receivables']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Inventories</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Inventories']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Tax Liabilities</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Tax Liabilities']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Total Liabilities</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Total liabilities']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Short-Term Investments</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Short-term investments']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Long-Term Investments</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Long-term investments']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Investments</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Investments']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Cash Equivalants</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Cash and cash equivalents']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Goodwill and Intangible Assets</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Goodwill and Intangible Assets']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Total Assets</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Total assets']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Short Term Debt</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Short-term debt']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Long Term Debt</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Long-term debt']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Net Debt</StyledTableCell>
                <StyledTableCell align='left'>{data.balance_statement['Net Debt']/10000000}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      <br/>
      <br/>
      <section id='cash-flows'>
        <div className="flex-row">
          <Typography variant='h5' color='primary'>
            Cash Flows
            <Typography variant='body2' color='textSecondary'>&nbsp;&nbsp;Figures in Rs. Crores</Typography>
          </Typography>
        </div>
        <TableContainer component={Paper} className="responsive holder" data-result-table>
          <Table className='striped'>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell>Cash from Operating Activity&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                <StyledTableCell align='left'>{data.cash_statement['Operating Cash Flow']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Cash from Investing Activity</StyledTableCell>
                <StyledTableCell align='left'>{data.cash_statement['Investing Cash flow']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Cash from Financial Activity</StyledTableCell>
                <StyledTableCell align='left'>{data.cash_statement['Financing Cash Flow']/10000000}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Net Cash Flow</StyledTableCell>
                <StyledTableCell align='left'>{data.cash_statement['Net cash flow / Change in cash']/10000000}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      <br/>
      <br/>
      <section id='ratios'>
        <div className="flex-row">
          <Typography variant='h5' color='primary'>
            Ratios
            <Typography variant='body2' color='textSecondary'>&nbsp;&nbsp;Figures in Rs. Crores</Typography>
          </Typography>
        </div>
        <TableContainer component={Paper} className="responsive holder" data-result-table>
          <Table className='striped'>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell>ROCE%</StyledTableCell>
                <StyledTableCell align='left'>{Math.round((data.income_statement['EBIT']/(data.balance_statement['Total assets']-data.balance_statement['Total current liabilities']))*10000)/100}%</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Debter Days&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                <StyledTableCell align='left'>{Math.round((data.balance_statement['Receivables']/data.income_statement['Revenue'])*365*10000)/100}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>ROE%</StyledTableCell>
                <StyledTableCell align='left'>{Math.round((data.income_statement['Net Income']/(data.balance_statement['Total shareholders equity']))*10000)/100}%</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </Box>
  ):(
    print?(
    //console.log(this.state),
      <div>
        <center>
          <img src={Loading} alt="loading..." />
        </center>
      </div>
    ):(
        error?(
          <Box width="70%" bgcolor="" p={1} my={0.5} style={{marginLeft:'15%', marginRight:'15%'}}>
            <Typography color='error' variant='h4' align='center'>Enter valid input!</Typography>
            <Typography variant='h5'>Check following details:</Typography>
            <List className='collection'>
              <ListItem className='collection-item'><Typography variant='h6'>Check whether the ticker symbol you have entered is valid or not!</Typography></ListItem>
              <ListItem className='collection-item'><Typography variant='h6'>Check whether the year you have entered is valid or not!</Typography></ListItem>
            </List>
            <Typography variant='h6'>If you think this is a mistake then email us at <Typography color='primary' variant='caption' className='blue-text'>smap.help@gmail.com</Typography></Typography>
          </Box>
        ):(
        
          <div>
            <br/>
            <Typography align='center' variant='h6'>Access the Annual reports by just one click!</Typography>
          </div>
        )
    )
  
  )
  return(
    <div className={classes.home}>
      <Header/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography align = 'center' component="h1" variant="h5">
            Annual Report
          </Typography>
          <form className={classes.form} noValidate> 
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="symbol"
                label="Ticker Symbol"
                name="symbol"
                autoComplete="symbol"
                autoFocus
                value={symbol} 
                onChange={handleChangeSymbol}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="year"
                label="Year"
                id="year"
                autoComplete="year"
                value={year} 
                onChange={handleChangeYear}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
            >
                Submit
            </Button>
          </form>
        </div>
      </Container>
      {dataDisplay}
    </div>
  );
}

export default Reports;