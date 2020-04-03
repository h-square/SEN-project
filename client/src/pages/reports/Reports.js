import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import Loading from '../../images/Loading.gif';

class Reports extends Component {

  constructor() {
    super();
    this.state = {
      symbol: '',
      year: '',
      showData: false,
      data: null,
      error: false,
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
      showData:false,
      error:false,
      data: null,
      print: true
    })
    var sym=this.state.symbol.toUpperCase()
    axios.get(`/api/report/${sym}-${this.state.year}`)
      .then(res => {
        //console.log(res.data);
        if(res.data.status==='OK'){
          this.setState({
            symbol:'',
            year:'',
            data: res.data,
            showData: true,
            error: false,
            print: false
          })
        }
        else{
          this.setState({
            symbol:'',
            year:'',
            showData: false,
            error: true,
            print:false
          })
        }
      })
      .catch(err => {
        this.setState({
          symbol:'',
          year:'',
          showData: false,
          error: true,
          print:false
        })
      });
  }
  render() {
    
    // let dataMarkUp = this.state.data ? (
    //   this.state.data.map(dataitem => <div> {dataitem}</div>))
    //   : (<p> loading.. </p>)
    const dataDisplay=this.state.showData? (
      //console.log(this.state.data),
      <div className='container' id='content-area'>
        <center><h2 className='red lighten-2'>
          {this.state.data.symbol} {this.state.data.year}
        </h2></center>
        <section id="profit-loss">
          <div className="flex-row">
            <h4>
              Profit and Loss
              <small className='light-blue-text text-lighten-3'>  Figures in Rs. Crores</small>
            </h4>
          </div>
          <div className="flex-filler"></div>
          <div className="responsive holder" data-result-table>
            <table className='striped responsive-text-nowrap'>
              
              <tbody>
                <tr className='stripe highlight'>
                  <td>Sales</td>
                  <td>{this.state.data.income_statement['Revenue']/10000000}</td>
                </tr>
                <tr>
                  <td>Sales Growth%</td>
                  <td>{Math.round((this.state.data.income_statement['Revenue Growth']+Number.EPSILON)*10000)/10000}%</td>
                </tr>
                <tr>
                  <td>Net Expenses</td>
                  <td>{(this.state.data.income_statement['R&D Expenses']+this.state.data.income_statement['SG&A Expense']+this.state.data.income_statement['Operating Expenses']+this.state.data.income_statement['Interest Expense']+this.state.data.income_statement['Income Tax Expense'])/10000000}</td>
                </tr>
                <tr>
                  <td>R&D Expenses</td>
                  <td>{this.state.data.income_statement['R&D Expenses']/10000000}</td>
                </tr>
                <tr>
                  <td>SG&A Expenses</td>
                  <td>{this.state.data.income_statement['SG&A Expense']/10000000}</td>
                </tr>
                <tr>
                  <td>Operating Expenses</td>
                  <td>{this.state.data.income_statement['Operating Expenses']/10000000}</td>
                </tr>
                <tr>
                  <td>Interest Expenses</td>
                  <td>{this.state.data.income_statement['Interest Expense']/10000000}</td>
                </tr>
                <tr>
                  <td>Income Tax Expenses</td>
                  <td>{this.state.data.income_statement['Income Tax Expense']/10000000}</td>
                </tr>
                <tr>
                  <td>Operating Profit</td>
                  <td>{this.state.data.income_statement['Operating Income']/10000000}</td>
                </tr>
                <tr>
                  <td>Profit before Tax</td>
                  <td>{this.state.data.income_statement['Earnings before Tax']/10000000}</td>
                </tr>
                <tr>
                  <td>Net Profit</td>
                  <td>{this.state.data.income_statement['Net Income']/10000000}</td>
                </tr>
                <tr>
                  <td>Profit Margin</td>
                  <td>{Math.round((this.state.data.income_statement['Profit Margin']+Number.EPSILON)*10000)/10000}</td>
                </tr>
                <tr>
                  <td>EPS in Rs.</td>
                  <td>{this.state.data.income_statement['EPS']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <br/>
        <br/>
        <section id='balance-sheet'>
          <div className="flex-row">
            <h4>
              Balance Sheet
              <small className='light-blue-text text-lighten-3'>  Figures in Rs. Crores</small>
            </h4>
          </div>
          <div className="responsive holder" data-result-table>
            <table className='striped'>
              <tbody>
                <tr>
                  <td>Total Shareholders Equity</td>
                  <td>{this.state.data.balance_statement['Total shareholders equity']/10000000}</td>
                </tr>
                <tr>
                  <td>Receivables</td>
                  <td>{this.state.data.balance_statement['Receivables']/10000000}</td>
                </tr>
                <tr>
                  <td>Inventories</td>
                  <td>{this.state.data.balance_statement['Inventories']/10000000}</td>
                </tr>
                <tr>
                  <td>Tax Liabilities</td>
                  <td>{this.state.data.balance_statement['Tax Liabilities']/10000000}</td>
                </tr>
                <tr>
                  <td>Total Liabilities</td>
                  <td>{this.state.data.balance_statement['Total liabilities']/10000000}</td>
                </tr>
                <tr>
                  <td>Short-Term Investments</td>
                  <td>{this.state.data.balance_statement['Short-term investments']/10000000}</td>
                </tr>
                <tr>
                  <td>Long-Term Investments</td>
                  <td>{this.state.data.balance_statement['Long-term investments']/10000000}</td>
                </tr>
                <tr>
                  <td>Investments</td>
                  <td>{this.state.data.balance_statement['Investments']/10000000}</td>
                </tr>
                <tr>
                  <td>Cash Equivalants</td>
                  <td>{this.state.data.balance_statement['Cash and cash equivalents']/10000000}</td>
                </tr>
                <tr>
                  <td>Goodwill and Intangible Assets</td>
                  <td>{this.state.data.balance_statement['Goodwill and Intangible Assets']/10000000}</td>
                </tr>
                <tr>
                  <td>Total Assets</td>
                  <td>{this.state.data.balance_statement['Total assets']/10000000}</td>
                </tr>
                <tr>
                  <td>Short Term Debt</td>
                  <td>{this.state.data.balance_statement['Short-term debt']/10000000}</td>
                </tr>
                <tr>
                  <td>Long Term Debt</td>
                  <td>{this.state.data.balance_statement['Long-term debt']/10000000}</td>
                </tr>
                <tr>
                  <td>Net Debt</td>
                  <td>{this.state.data.balance_statement['Net Debt']/10000000}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <br/>
        <br/>
        <section id='cash-flows'>
          <div className="flex-row">
            <h4>
              Cash Flows
              <small className='light-blue-text text-lighten-3'>  Figures in Rs. Crores</small>
            </h4>
          </div>
          <div className="responsive holder" data-result-table>
            <table className='striped'>
              <tbody>
                <tr>
                  <td>Cash from Operating Activity</td>
                  <td>{this.state.data.cash_statement['Operating Cash Flow']/10000000}</td>
                </tr>
                <tr>
                  <td>Cash from Investing Activity</td>
                  <td>{this.state.data.cash_statement['Investing Cash flow']/10000000}</td>
                </tr>
                <tr>
                  <td>Cash from Financial Activity</td>
                  <td>{this.state.data.cash_statement['Financing Cash Flow']/10000000}</td>
                </tr>
                <tr>
                  <td>Net Cash Flow</td>
                  <td>{this.state.data.cash_statement['Net cash flow / Change in cash']/10000000}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <br/>
        <br/>
        <section id='ratios'>
          <div className="flex-row">
            <h4>
              Ratios
              <small className='light-blue-text text-lighten-3'>  Figures in Rs. Crores</small>
            </h4>
          </div>
          <div className="responsive holder" data-result-table>
            <table className='striped'>
              <tbody>
                <tr>
                  <td>ROCE%</td>
                  <td>{Math.round((this.state.data.income_statement['EBIT']/(this.state.data.balance_statement['Total assets']-this.state.data.balance_statement['Total current liabilities']))*10000)/100}%</td>
                </tr>
                <tr>
                  <td>Debter Days</td>
                  <td>{Math.round((this.state.data.balance_statement['Receivables']/this.state.data.income_statement['Revenue'])*365*10000)/100}</td>
                </tr>
                <tr>
                  <td>ROE%</td>
                  <td>{Math.round((this.state.data.income_statement['Net Income']/(this.state.data.balance_statement['Total shareholders equity']))*10000)/100}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    ):(
      this.state.print?(
      //console.log(this.state),
        <div>
          <center>
            <img src={Loading} alt="loading..." />
          </center>
        </div>
      ):(
          this.state.error?(
            <div>
              <center><h5 className='red-text'>Enter valid input!</h5></center>
              <h5>Check following details:</h5>
              <ul className='collection'>
                <li className='collection-item'>Check whether the ticker symbol you have entered is valid or not</li>
                <li className='collection-item'>Check whether the year you have entered is valid or not!</li>
              </ul>
              <h5>If you think this is a mistake then email us at <small className='blue-text'>smap.help@gmail.com</small></h5>
            </div>
          ):(
          
            <div>
              <h5><center className=''>Access the Annual reports by just one click!  </center></h5>
            </div>
          )
      )
      
    )
    
    /*let dataMarkUp = this.state.data ? (
      //console.log(this.state.data),
    <h3>{this.state.data.symbol} and {this.state.data.year}</h3>
    ) : <p>loading...</p>*/
    return (
      <div>
        <center><h3>Annual Report</h3></center>
        <div className='row'>
          <form className='col s12'>
            <div className='row'>
              <div className='input-field col s6'>              
                <h5 className="blue-text">Ticker Symbol</h5>
                <input id='input_text' type='text' name='symbol' onChange={this.handleChange} value={this.state.symbol} />
              </div>
              <div className='input-field col s6'>   
                <h5 className="blue-text">Year</h5>
                <input type='text' name='year' onChange={this.handleChange} value={this.state.year} maxLength='4'/>
              </div>
            </div>
            <center><button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleSubmit}>
                Submit
            </button></center>
          </form>
        </div>
        {dataDisplay}
      </div>
    )
  }
}

export default Reports;