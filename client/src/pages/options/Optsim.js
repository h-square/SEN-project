import React, { useState, Fragment, Component } from "react";
import ReactDOM from "react-dom";
import payoff from './payoff'
import './option.css'
import Header from '../../Header'
//var CanvasJSChart = CanvasJSReact.CanvasJSChart;


//import "bootstrap/dist/css/bootstrap.css";

const Optsim = () => {

//class Optsim extends Component {

  const [errors,seterrors] = useState([]);
  const [errors1,seterrors1] = useState([]);
  const [errors2,seterrors2] = useState([]);
  const [errors3,seterrors3] = useState([]);

  const [startPrice,setstartPrice] = useState('');
  const [endPrice,setendPrice] = useState('');
  const [optype,setoptype] = useState('call');
  const [bs,setbs] = useState('buy');

  const [inputFields, setInputFields] = useState([
    { strikePrice:'' , optionType: 'call' , optionPrice: '' ,buySell: 'buy'}
  ]);


  //Validate form inputs
  function validate0(st_pr, en_pr) {
    const temp_errors = [];

    if (st_pr === '') {
      temp_errors.push("Enter a valid start price!");
    }

    else if (en_pr === '') {
        temp_errors.push("Enter a valid end price!");
    }

    else if (Number(st_pr) >= Number(en_pr)){
      temp_errors.push("End price must be greater than start price!");
    }
    return temp_errors;
  }

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ strikePrice: '', optionType: 'call' , optionPrice: '',buySell: 'buy'});
    setInputFields(values);
  };

  const handleRemoveFields = index => {

    if(index > 0)
    {
      const values = [...inputFields];
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "strikePrice") {
      values[index].strikePrice = event.target.value;
    } else if (event.target.name === "optionType"){
      values[index].optionType = event.target.value;
      setoptype(event.target.value)
    }
    else if(event.target.name === "optionPrice"){
        values[index].optionPrice = event.target.value;
    }
    else{
        values[index].buySell = event.target.value;
        setbs(event.target.value)
    }

    const temp_error = [];
    if(event.target.name === "strikePrice")
    {
      if(event.target.value === '')
      {
        temp_error.push("Enter a valid strike price for option" + index + "!");
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
          temp_error.push("Strike Price must be a number for option" + index + "!");
        }
        else if(event.target.value < 0)
        {
          temp_error.push("Strike price must be a positive number for option" + index + "!");
        }
      }
    }
    else if(event.target.name === "optionPrice")
    {
      if(event.target.value === '')
      {
        temp_error.push("Enter a valid option price for option" + index + "!");
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
        temp_error.push("Option Price must be a number for option" + index + "!");
        }
        else if(event.target.value < 0)
        {
          temp_error.push("Option price must be a positive number for option" + index + "!");
        }
      }
    }
    seterrors1(temp_error);
    setInputFields(values);
  };

  const handleInputPricesChange = (event) => {
    const temp_error = [];

    if(event.target.name === "startPrice")
    {
      if (event.target.value === '') 
      {
        temp_error.push("Enter a valid start price!");
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
          temp_error.push("Start Price must be a number!");
        }
        else if(event.target.value < 0)
        {
          temp_error.push("Start price must be a positive number.");
        }
      }
    }

    else if(event.target.name === "endPrice")
    {
      if (event.target.value === '') {
        temp_error.push("Enter a valid end price!");
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
          temp_error.push("End Price must be a number!");
        }
        else if(event.target.value < 0)
        {
          temp_error.push("End price must be a positive number.");
        }
      }
    }

    seterrors2(temp_error);
    if (event.target.name === "startPrice") {
        setstartPrice(event.target.value);
    }
    else if (event.target.name === "endPrice")
    {
        setendPrice(event.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("inputFields", inputFields);
    console.log("startPrice", startPrice);
    console.log("endPrice", endPrice);
    //console.log("Strike Price", e.target.value);
    //console.log("Option Price", e.target.value);

    // Checking input fields
    /*const st_pr = ReactDOM.findDOMNode(this._st_prInput).value;
    const en_pr = ReactDOM.findDOMNode(this._en_prInput).value;
    const strike_pr = ReactDOM.findDOMNode(this._strike_prInput).value;
    const opt_pr = ReactDOM.findDOMNode(this._opt_prInput).value;
    */
    let error0 = validate0(startPrice,endPrice);
    //let error1 = validate1(inputFields.strikePrice,inputFields.optionPrice);
    console.log("Returned error0", error0)
    //console.log("Returned error1", error1)
    if (error0.length > 0) {
      seterrors(error0);
      return;
    }
    else if(errors1.length > 0)
    {
      return;
    }
    else if(errors2.length > 0)
    {
      return;
    }

    const temp_errors_empty = [];
    for(let option=0;option<[...inputFields].length;option++)
    {
      if (inputFields[option].strikePrice === '') {
        temp_errors_empty.push(`Enter a valid strike price for option${option}!`);
        break;
      }
      else if (inputFields[option].optionPrice === '') {
        temp_errors_empty.push(`Enter a valid option price for option${option}!`);
        break;
      }
    }
    console.log("Error temp array",temp_errors_empty);
    seterrors3(temp_errors_empty);
    console.log("Error state3",errors3)
    if(temp_errors_empty > 0)
    {
      return;
    }
    console.log("Error state1",errors1)
    console.log("Error state2",errors2)
    // End of checking input fields
    var ans = []

    for(let i=0;i<(endPrice-startPrice+1);i++)
    {
        ans[i]=0;
    }

    for(let price=startPrice;price<=endPrice;price++)
    {
        for(let option=0;option<[...inputFields].length;option++)
        {
            if(inputFields[option].optionType === "call")
            {
              if(inputFields[option].buySell === 'buy')
              {
                ans[price-startPrice]+=(Math.max(price-inputFields[option].strikePrice,0)-inputFields[option].optionPrice)
              }
              else if(inputFields[option].buySell === 'sell')
              {
                ans[price-startPrice]-=(Math.max(price-inputFields[option].strikePrice,0)-inputFields[option].optionPrice)
              }
            }
            if(inputFields[option].optionType === 'put')
            {
              if(inputFields[option].buySell === 'buy')
              {
                ans[price-startPrice]+=(Math.max(inputFields[option].strikePrice-price,0)-inputFields[option].optionPrice)
              }
              else if(inputFields[option].buySell === 'sell')
              {
                ans[price-startPrice]-=(Math.max(inputFields[option].strikePrice-price,0)-inputFields[option].optionPrice)
              }
            }
            
        }
    }

    var options = {
        exportEnabled: true,
        zoomEnabled: true,
        animationEnabled: true,
        colorSet: "colors",
        title: {
            text: "",
            fontFamily: "calibri"
        },
        axisX: {
            title: "Price",
            yValueFormatString: "$##0.00",
        },
        axisY: {
            title: "Price",
            titleFontFamily: "calibri",
            includeZero: false,
            prefix: "$"
        },
        data: [{
            type: "line",
            name: "",
            showInLegend: true,
            dataPoints: []
        }]
    }
    
    for(let i=0;i<(endPrice-startPrice+1);i++)
    {
        options.data[0].dataPoints.push({x: i+startPrice,y: ans[i]});
    }

    var chart = React.createElement(payoff,[ans,startPrice,endPrice]);
    ReactDOM.render(chart,document.getElementById("chart"))


  };

  //render(){
  return (
    <body class="option">
      <Header/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 class="header">Option Simulator</h1>
      <form onSubmit={handleSubmit}>

        <h3 class="h3-text">Enter range of stock prices for simulation:</h3>
        <div className="form-row">
            <div class="stock-detail">
                <div className="form-group ">
                  <label class="form-label" htmlFor="startPrice">Start Price :</label>
                  <input //ref={st_prInput => this._st_prInput}
                  type='text'
                  className="form-input"
                  id="startPrice"
                  name="startPrice"
                  placeholder="Enter value"
                  //value={startPrice}
                  onChange={event => handleInputPricesChange(event)}
                  />
                </div>
              <div className="form-group">
                    <label class="form-label" htmlFor="endPrice">End Price &nbsp;&nbsp;:</label>
                    <input //ref={en_prInput => this._en_prInput}
                    type='text'
                    className="form-input"
                    id="endPrice"
                    name="endPrice"
                    placeholder="Enter value"
                    //value={endPrice}
                    onChange={event => handleInputPricesChange(event)}
                    />
              </div>
            </div>

            <h3 class="h3-text">Enter Option Details:</h3>
 
          {inputFields.map((inputField, index) => (
            <Fragment key={`${inputField}~${index}`}>
              <div class="option-detail">
              <div className="form-group">
                <label class="form-label" htmlFor="strikePrice">Strike Price&nbsp;&nbsp;&nbsp;:</label>
                <input //ref={strike_prInput => this._strike_prInput}
                  type='text'
                  className="form-input"
                  id="strikePrice"
                  name="strikePrice"
                  placeholder="Enter value"
                  //value={inputField.firstName}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>

              <div className="form-group" onChange={event => handleInputChange(index, event)}>
                <label class="form-label" htmlFor="optionType">Option Type&nbsp;: </label>
                <label class="form-label-for-radio">
                <input type="radio" className="form-input-for-radio" 
                  id="optionType" value="call" defaultChecked name="optionType" />
                  Call
                </label>
                <label class="form-label-for-radio">
                <input type="radio" className="form-input-for-radio" 
                  id="optionType" value="put" name="optionType" />
                  Put
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="optionPrice" class="form-label">Option Price&nbsp;:</label>
                <input //ref={opt_prInput => this._opt_prInput}
                  type='text' 
                  className="form-input" 
                  id="optionPrice"
                  name="optionPrice"
                  placeholder="Enter value"
                  //value={inputField.lastName}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>


              <div className="form-group" onChange={event => handleInputChange(index, event)}>
                <label htmlFor="buySell" class="form-label">Buy/Sell &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>
                <label class="form-label-for-radio">
                <input type="radio" className="form-input-for-radio" 
                  id="buySell" value="buy" defaultChecked name="buySell"  />
                  Buy
                </label>
                <label class="form-label-for-radio">
                <input type="radio" className="form-input-for-radio" 
                  id="buySell" value="sell" name="buySell" />
                  Sell
                </label>
               </div>
               
              <div className="form-group">
                <button
                  className="form-btn"
                  type="button"
                  onClick={() => handleRemoveFields(index)}
                >
                  Remove
                </button>
                <button
                  className="form-btn"
                  type="button"
                  onClick={() => handleAddFields()}
                >
                  Add
                </button>
              </div>
              </div>
            </Fragment>
          ))}
        </div>
        
        <div className="form-group">
          <center>
          <button
            id = "submit"
            className="option-submit"
            type="submit"
            onSubmit={handleSubmit}
          >
            Save
          </button></center>
        </div>
      
        
        {errors.map(error => (
          <div>
          <h3 style={{color: "red"}} key={error}>Error: {error}</h3>
          <h3 style={{color: "green"}} > If saved without correcting the error, output might not be correct/valid. </h3>
          </div>
        ))}
        {errors1.map(error1 => (
          <div>
          <h3 style={{color: "red"}} key={error1}>Error: {error1}</h3>
          <h3 style={{color: "green"}} > If saved without correcting the error, output might not be correct/valid. </h3>
          </div>
        ))}
        {errors2.map(error2 => (
          <div>
          <h3 style={{color: "red"}} key={error2}>Error: {error2}</h3>
          <h3 style={{color: "green"}} > If saved without correcting the error, output might not be correct/valid. </h3>
          </div>
        ))}
        {errors3.map(error3 => (
          <div>
          <h3 style={{color: "red"}} key={error3}>Error: {error3}</h3>
          <h3 style={{color: "green"}} > If saved without correcting the error, output might not be correct/valid. </h3>
          </div>
        ))}
        <br/>
      </form>
      <div id = "chart" class="chart">
      
      </div>
    </body>
  );
    //      }
};

export default Optsim;