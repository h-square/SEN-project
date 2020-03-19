import React from 'react'
import { Component } from 'react';
import axios from 'axios';

class Reports extends Component {

  constructor() {
    super();
    this.state = {
      symbol: '',
      year: '',
      showData: false,
      data: null,
      error: false
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
    axios.get(`/api/report/${this.state.symbol}-${this.state.year}`)
      .then(res => {
        //console.log(res.data);
        if(res.data.status==='OK'){
          this.setState({
            data: res.data,
            showData: true
          })
        }
        else{
          this.setState({
            error:true
          })
        }
      })
      .catch(err => {
        this.setState({
          error:true
        })
      });
  }
  render() {

    // let dataMarkUp = this.state.data ? (
    //   this.state.data.map(dataitem => <div> {dataitem}</div>))
    //   : (<p> loading.. </p>)

    const dataDisplay=this.state.showData? (
      console.log(this.state.data),
      <div>
        <h1>Profit and loss(in Rs. Crores)</h1>
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sales</td>
              <td>{this.state.data.income_statement['Revenue']/10000000}</td>
            </tr>
            <tr>
              <td>Sales Growth%</td>
              <td>{Math.round((this.state.data.income_statement['Revenue Growth']+Number.EPSILON)*10000)/10000}%</td>
            </tr>
            <tr>
              <td>Net Expenses</td>
              <td>{(this.state.data.income_statement['R&D Expenses']/10000000)+(this.state.data.income_statement['SG&A Expense']/10000000)+(this.state.data.income_statement['Operating Expenses']/10000000)+(this.state.data.income_statement['Interest Expense']/10000000)+(this.state.data.income_statement['Income Tax Expense']/10000000)}</td>
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


        <h1>Balance Sheet(in Rs. Crores)</h1>
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th>Year</th>
            </tr>
          </thead>
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


        <h1>Cash Flows(in Rs. Crores)</h1>
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th>Year</th>
            </tr>
          </thead>
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


        <h1>Ratios</h1>
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th>Year</th>
            </tr>
          </thead>
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
    )
     : (
      this.state.error?(
        <div>
          <h1>Enter valid input!</h1>
          <h3>Check following details:</h3>
          <ul>
            <li>Check whether the company you have entered is valid</li>
            <li>Check whether the year you have entered is between 2017 to 2019 </li>
          </ul>
        </div>
      ):(
        <div>
          <center>Welcome! Access the Annual report by just one click!  </center>
        </div>
      )
    )
    /*let dataMarkUp = this.state.data ? (
      //console.log(this.state.data),
    <h3>{this.state.data.symbol} and {this.state.data.year}</h3>
    ) : <p>loading...</p>*/

    return (
      <div>
        <center><h1>SMAP</h1></center>
        <form>
          <center>
            <label htmlFor='symbol'>Ticker Symbol</label>
            <input type='text' name='symbol' onChange={this.handleChange} value={this.state.symbol} />
            <label htmlFor='year'>Year</label>
            <input type='text' name='year' onChange={this.handleChange} value={this.state.year} />
            <button onClick={this.handleSubmit}>Submit</button>
          </center>
        </form>

        {dataDisplay}
      </div>
    )
  }
}

export default Reports;