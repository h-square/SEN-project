import React from 'react';
import { Component } from 'react';
import Loading from '../../images/Loading.gif'

class Display extends Component {

  constructor() {
    super();
    this.state = {
      symbol: '',
      showData: false,
      error: false,   
      dcf: null,
      data: null,
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
      dcf: null,
      data: null,
      print: true
    })

const axios = require('axios');
var sym=this.state.symbol.toUpperCase()
var d = new Date();
var year = d.getFullYear();
var y1= year-2;
var y2= year-3;
var y3= year-4;
var fcf1;
var fcf2;
var fcf3;
var netdebt;
var url='https://cors-anywhere.herokuapp.com/http://ancient-woodland-72246.herokuapp.com/api/report/'+sym+'-'+y1;
axios.get(url)
    .then(res=>{
        var symb = res.data.symbol;
        fcf1=res.data.cash_statement['Free Cash Flow'];
        //console.log(fcf1);
        netdebt=res.data.balance_statement['Net Debt'];
        var url='https://cors-anywhere.herokuapp.com/http://ancient-woodland-72246.herokuapp.com/api/report/'+sym+'-'+y2;
        axios.get(url)
            .then(res=>{
                //console.log('Done');
                fcf2=res.data.cash_statement['Free Cash Flow'];
                //console.log(fcf2);
                var url='https://cors-anywhere.herokuapp.com/http://ancient-woodland-72246.herokuapp.com/api/report/'+sym+'-'+y3;
                axios.get(url)
                    .then(res=>{
                        //console.log('Done');
                        fcf3=res.data.cash_statement['Free Cash Flow'];
                        ///console.log(fcf3);
                        var fcf=(fcf1+fcf2+fcf3)/3;
                        //console.log(fcf)
                        var tmp=fcf,Growthrate1=0.18,Growthrate2=0.1;
                        var futurecashflow=new Array(10);
                        var i=1;
                        while(i<=10)
                        {
                            if(i<=5)
                            {
                                futurecashflow[i-1]=tmp*(1+Growthrate1);
                                tmp=futurecashflow[i-1];
                            }
                            else
                            {
                                futurecashflow[i-1]=tmp*(1+Growthrate2);
                                tmp=futurecashflow[i-1];
                            }
                            i++;
                        }
                        //console.log(futurecashflow)
                        var tgr=0.035,discountrate=0.09;
                        var terminalvalue=futurecashflow[9]*(1+tgr)/(discountrate-tgr);

                        //console.log(terminalvalue)

                        var presentvalue=new Array(10);
                        var sum=0;
                        i=1;
                        while(i<=10)
                        {
                            presentvalue[i-1]=futurecashflow[i-1]/Math.pow((1+discountrate),i);
                            sum+=presentvalue[i-1];
                            i++;
                        }
                        //console.log(presentvalue)
                        var prtr=terminalvalue/Math.pow((1+discountrate),10);
                        //console.log(sum,prtr,netdebt)
                        var totalpresentvalue=sum+prtr-netdebt;
                        //console.log(totalpresentvalue)
                        var url='https://financialmodelingprep.com/api/v3/enterprise-value/'+sym;
                        axios.get(url)
                            .then(res=>{
                                //console.log(res.data);
                                var totalshares=res.data.enterpriseValues[0]['Number of Shares'];
                                var num=parseFloat(totalshares);
                                //console.log(num);
                                //console.log(totalpresentvalue,totalshares);
                                var dcf=totalpresentvalue/num;
                                axios.get(`https://cors-anywhere.herokuapp.com/http://still-brushlands-16837.herokuapp.com/todo/${sym}`)
                                  .then(res => {
                                    console.log(res.data);
                                    if(res.data){
                                      this.setState({
                                        symbol: '',
                                        data: res.data[sym],
                                        symb: symb,
                                        dcf: dcf,
                                        showData: true,
                                        error: false,
                                        print: false
                                      })
                                    }
                                    else{
                                      this.setState({
                                        symbol: '',
                                        data: "DATA NOT AVAILABLE",
                                        symb: symb,
                                        dcf: dcf,
                                        showData: true,
                                        error: true,
                                        print:false
                                      })
                                    }
                                  })
                                  .catch(err => {
                                    this.setState({
                                      symbol: '',
                                      dcf: dcf,
                                      symb: symb,
                                      data: "DATA NOT AVAILABLE",
                                      showData: true,
                                      error: true,
                                      print:false
                                    })
                                  });
                                console.log("DCF is   "+dcf);
                            })
                            .catch(err=>{
                                console.log('Error !!!');
                            })
                    })
                    .catch(err=>{
                        console.log('Error !!!');
                    })
            })
        if(res.data.status==='OK'){
          this.setState({
            symbol: '',
            showData: true,
            dcf:'',
            error: false,
            print: false
          })
        }
        else{
          this.setState({
            symbol:'',
            showData: false,
            dcf: null,
            error: true,
            print:false
          })
        }

            })
    .catch(err=>{
        this.setState({
          symbol:'',
          showData: false,
          dcf: null,
          error: true,
          print:false
        })

    });

  }
  render() {
    console.log(this.state);
    const dataDisplay=this.state.showData? (
      <div className='container' id='content-area'>
        <center><h2 className='blue lighten-4'>
          {this.state.symb}
        </h2></center>
        <section>
          <div className="flex-row">
            <h4>  
              <small className='red-text text-lighten-1'>  Figures in Rs.</small>
            </h4>
          </div>
          <div className="flex-filler"></div>
          <div className="responsive holder" data-result-table>
            <table className='striped responsive-text-nowrap'>
              
              <tbody>   
                <tr>
                  <td>DCF stock valuation</td>
                  <td>{this.state.dcf}</td>
                </tr>
                <tr>
                  <td>Stock Price Prediction </td>
                  <td>{this.state.data}</td>

                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <br/>
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
              </ul>
              <h5>If you think this is a mistake then email us at <small className='blue-text'>smap.help@gmail.com</small></h5>
            </div>
          ):(
          
            <div>
              <h5><center className=''>Get DCF stock valuation in just one click!  </center></h5>
            </div>
          )
      )
      
    )
    
    return (
      <div>
        <center><h3>Discounted Cash Flow</h3></center>
        <div className='row'>
          <form className='col s12'>
            <div className='row'>
              <h5 className="blue-text center">Ticker Symbol</h5>
              <div className=" input-field col offset-s4 s4">              
                <input id='input_text' type='text' name='symbol' onChange={this.handleChange} value={this.state.symbol} />
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

export default Display;