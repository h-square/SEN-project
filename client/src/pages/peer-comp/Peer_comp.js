import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../Header'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Loading from '../../Images/Loading.gif';
import { withStyles } from '@material-ui/core/styles';
import './Peer_comp.css'
import { Container, CssBaseline, TextField, Box, List, ListItem } from '@material-ui/core';

class Peer_comp extends Component{
    constructor() {
        super();
        this.state = {
          symbol1: '',
          symbol2: '',
          year: '',
          showData1: false,
          showData2: false,
          data1: null,
          data2: null,
          error1: false,
          error2: false,
          same: false,
          print: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        this.setState({
          showData1:false,
          showData2:false,
          error1:false,
          error2:false,
          data1: null,
          data2: null,
          print: true
        })
        //console.log(this.state)
        var sym1=this.state.symbol1.trim().toUpperCase()
        var sym2=this.state.symbol2.trim().toUpperCase()
        axios.get(`/api/report/${sym1}-${this.state.year}`)
            .then(res => {
                console.log(res.data);
                if(res.data.status==='OK'){
                    this.setState({
                        symbol1:'',
                        year:'',
                        data1: res.data,
                        showData1: true,
                        error1: false,
                        print: false,
                        same:false
                    })
                }
                else{
                    this.setState({
                        symbol1:'',
                        year:'',
                        showData1: false,
                        error1: true,
                        print:false,
                        same:false
                    })
                }
            })
            .catch(err => {
                this.setState({
                    symbol1:'',
                    year:'',
                    showData1: false,
                    error1: true,
                    print:false,
                    same:false
                })
            });
        axios.get(`/api/report/${sym2}-${this.state.year}`)
            .then(res => {
                console.log(res.data);
                if(res.data.status==='OK'){
                    this.setState({
                        symbol2:'',
                        year:'',
                        data2: res.data,
                        showData2: true,
                        error2: false,
                        print: false,
                        same:false
                    })
                }
                else{
                    this.setState({
                        symbol2:'',
                        year:'',
                        showData2: false,
                        error2: true,
                        print:false,
                        same:false
                    })
                }
                if(sym1[0]<'A' || sym1[0]>'Z' || sym2[0]<'A' || sym2[0]>'Z'){
                    this.setState({
                        showData1:false,
                        showData2:false,
                        error1:true,
                        error2:true,
                        data1: null,
                        data2: null,
                        print: false,
                        same: false
                    })
                }
                if(sym1===sym2 && !this.state.error1 && !this.state.error)
                {
                    this.setState({
                        showData1:false,
                        showData2:false,
                        error1:false,
                        error2:false,
                        data1: null,
                        data2: null,
                        print: false,
                        same: true
                    })
                }
            })
            .catch(err => {
                this.setState({
                symbol2:'',
                year:'',
                showData2: false,
                error2: true,
                print:false,
                same:false
                })
            });
    }
    render(){

        const StyledTableCell = withStyles((theme) => ({
            head: {
              backgroundColor: theme.palette.common.black,
              color: theme.palette.common.white,
              fontSize: 18
            },
            body: {
              fontSize: 15,
            },
        }))(TableCell);
          
        const StyledTableRow = withStyles((theme) => ({
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
              },
            },
        }))(TableRow);
      
        const dataDisplay=this.state.showData1 && this.state.showData2? (
          <Box width="70%" bgcolor="" p={1} my={0.5} style={{marginLeft:'15%', marginRight:'15%'}}>
            <center><Typography variant ='h5' className='red lighten-2' color='error'>
            {this.state.data1.symbol} - {this.state.data2.symbol} {this.state.data1.year}
            </Typography></center>
            <div className='container' id='content-area'>
              <br/>
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
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>--</StyledTableCell>
                        <StyledTableCell>{this.state.data1.symbol}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.symbol}</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow className='stripe highlight'>
                        <StyledTableCell >Sales</StyledTableCell>
                        <StyledTableCell >{this.state.data1.income_statement['Revenue']/10000000}</StyledTableCell>
                        <StyledTableCell >{this.state.data2.income_statement['Revenue']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell >Sales Growth%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                        <StyledTableCell >{Math.round((this.state.data1.income_statement['Revenue Growth']+Number.EPSILON)*10000)/10000}%</StyledTableCell>
                        <StyledTableCell >{Math.round((this.state.data2.income_statement['Revenue Growth']+Number.EPSILON)*10000)/10000}%</StyledTableCell>
                      
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell >Net Expenses</StyledTableCell>
                        <StyledTableCell >{(this.state.data1.income_statement['R&D Expenses']+this.state.data1.income_statement['SG&A Expense']+this.state.data1.income_statement['Operating Expenses']+this.state.data1.income_statement['Interest Expense']+this.state.data1.income_statement['Income Tax Expense'])/10000000}</StyledTableCell>
                        <StyledTableCell >{(this.state.data2.income_statement['R&D Expenses']+this.state.data2.income_statement['SG&A Expense']+this.state.data2.income_statement['Operating Expenses']+this.state.data2.income_statement['Interest Expense']+this.state.data2.income_statement['Income Tax Expense'])/10000000}</StyledTableCell>
                      
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>R&D Expenses</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['R&D Expenses']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['R&D Expenses']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>SG&A Expenses</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['SG&A Expense']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['SG&A Expense']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Operating Expenses</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Operating Expenses']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Operating Expenses']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Interest Expenses</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Interest Expense']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Interest Expense']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Income Tax Expenses</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Income Tax Expense']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Income Tax Expense']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Operating Profit</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Operating Income']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Operating Income']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Profit before Tax</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Earnings before Tax']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Earnings before Tax']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Net Profit</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['Net Income']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['Earnings before Tax']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Profit Margin</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data1.income_statement['Profit Margin']+Number.EPSILON)*10000)/10000}</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data2.income_statement['Profit Margin']+Number.EPSILON)*10000)/10000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>EPS in Rs.</StyledTableCell>
                        <StyledTableCell>{this.state.data1.income_statement['EPS']}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.income_statement['EPS']}</StyledTableCell>
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
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>--</StyledTableCell>
                        <StyledTableCell>{this.state.data1.symbol}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.symbol}</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell>Total Shareholders Equity</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Total shareholders equity']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Total shareholders equity']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Receivables</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Receivables']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Receivables']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Inventories</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Inventories']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Inventories']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Tax Liabilities</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Tax Liabilities']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Tax Liabilities']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Total Liabilities</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Total liabilities']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Total liabilities']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Short-Term Investments</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Short-term investments']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Short-term investments']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Long-Term Investments</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Long-term investments']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Long-term investments']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Investments</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Investments']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Investments']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Cash Equivalants</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Cash and cash equivalents']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Cash and cash equivalents']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Goodwill and Intangible Assets</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Goodwill and Intangible Assets']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Goodwill and Intangible Assets']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Total Assets</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Total assets']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Total assets']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Short Term Debt</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Short-term debt']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Short-term debt']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Long Term Debt</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Long-term debt']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Long-term debt']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Net Debt</StyledTableCell>
                        <StyledTableCell>{this.state.data1.balance_statement['Net Debt']/10000000}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.balance_statement['Net Debt']/10000000}</StyledTableCell>
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
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>--</StyledTableCell>
                        <StyledTableCell>{this.state.data1.symbol}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.symbol}</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell>Cash from Operating Activity&nbsp;&nbsp;&nbsp;</StyledTableCell>
                        <StyledTableCell>{this.state.data1.cash_statement['Operating Cash Flow']/10000000}</StyledTableCell>

                        <StyledTableCell>{this.state.data2.cash_statement['Operating Cash Flow']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Cash from Investing Activity</StyledTableCell>
                        <StyledTableCell>{this.state.data1.cash_statement['Investing Cash flow']/10000000}</StyledTableCell>

                        <StyledTableCell>{this.state.data2.cash_statement['Investing Cash flow']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Cash from Financial Activity</StyledTableCell>
                        <StyledTableCell>{this.state.data1.cash_statement['Financing Cash Flow']/10000000}</StyledTableCell>

                        <StyledTableCell>{this.state.data2.cash_statement['Financing Cash Flow']/10000000}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Net Cash Flow</StyledTableCell>
                        <StyledTableCell>{this.state.data1.cash_statement['Net cash flow / Change in cash']/10000000}</StyledTableCell>

                        <StyledTableCell>{this.state.data2.cash_statement['Net cash flow / Change in cash']/10000000}</StyledTableCell>
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
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>--</StyledTableCell>
                        <StyledTableCell>{this.state.data1.symbol}</StyledTableCell>
                        <StyledTableCell>{this.state.data2.symbol}</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell>ROCE%</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data1.income_statement['EBIT']/(this.state.data1.balance_statement['Total assets']-this.state.data1.balance_statement['Total current liabilities']))*10000)/100}%</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data2.income_statement['EBIT']/(this.state.data2.balance_statement['Total assets']-this.state.data2.balance_statement['Total current liabilities']))*10000)/100}%</StyledTableCell>
                      
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>Debter Days&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data1.balance_statement['Receivables']/this.state.data1.income_statement['Revenue'])*365*10000)/100}</StyledTableCell>

                        <StyledTableCell>{Math.round((this.state.data2.balance_statement['Receivables']/this.state.data2.income_statement['Revenue'])*365*10000)/100}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>ROE%</StyledTableCell>
                        <StyledTableCell>{Math.round((this.state.data1.income_statement['Net Income']/(this.state.data1.balance_statement['Total shareholders equity']))*10000)/100}%</StyledTableCell>

                        <StyledTableCell>{Math.round((this.state.data2.income_statement['Net Income']/(this.state.data2.balance_statement['Total shareholders equity']))*10000)/100}%</StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </section>
            </div>
          </Box>
        ):(
          this.state.print?(
          //console.log(this.state),
            <div>
              <center>
                <img src={Loading} alt="loading..." />
              </center>
            </div>
          ):(
              (this.state.error1 || this.state.error2)?(
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
                this.state.same?(
                  <div>
                      <br/>
                      <Typography variant='h5' color='error' align='center'>Enter different symbols to compare different companies!</Typography>
                  </div>
                ):(
                  <div>
                      <br/>
                      <Typography align='center' variant='h5'>Access the Annual reports by just one click!</Typography>
                  </div>
                )
              )
          )    
        )

        return(
          <div className="peer-comp">
            <Header/>
            <Container component='main' maxWidth='xs'>
              <CssBaseline/>
              <Typography align='center' component='h1' variant='h5'>
                  Peer Stock Comparison
              </Typography>
              <form noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="symbol1"
                  label="Ticker Symbol 1"
                  name="symbol1"
                  autoComplete="symbol1"
                  autoFocus
                  value={this.state.symbol1} 
                  onChange={this.handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="symbol2"
                  label="Ticker Symbol 2"
                  name="symbol2"
                  autoComplete="symbol2"
                  autoFocus
                  value={this.state.symbol2} 
                  onChange={this.handleChange}
                />
                <TextField
                  variant='outlined'
                  margin = 'normal'
                  required
                  fullWidth
                  id='year'
                  label = 'Year'
                  name = 'year'
                  autoComplete = 'year'
                  autoFocus
                  type='number'
                  value={this.state.year}
                  onChange = {this.handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  name='action'
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </form>
            </Container>
            {dataDisplay}
          </div>
        );
    }
}

export default Peer_comp;