import React, { useState, Fragment, Component } from "react";
import ReactDOM from "react-dom";
import CanvasJSChart from './canvasjs.react';
import payoff from './payoff'
//var CanvasJSChart = CanvasJSReact.CanvasJSChart;


//import "bootstrap/dist/css/bootstrap.css";

const Optsim = () => {


//class Optsim extends Component {

  const [errors,seterrors] = useState([]);

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

    else if (st_pr !== '' && !Number(st_pr)) {
      temp_errors.push("Start Price must be a number!");
    }

    else if (en_pr === '') {
      temp_errors.push("Enter a valid end price!");
    }

    else if (en_pr !== '' && !Number(en_pr)) {
      temp_errors.push("End Price must be a number!");
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
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
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
        temp_error.push("Enter a valid strike price!")
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
          temp_error.push("Strike Price must be a number!");
        }
      }
    }
    else if(event.target.name === "optionPrice")
    {
      if(event.target.value === '')
      {
        temp_error.push("Enter a valid option price!")
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
        temp_error.push("Option Price must be a number!");
        }
      }
    }
    seterrors(temp_error);
    setInputFields(values);
  };

  const handleInputPricesChange = (event) => {
    if (event.target.name === "startPrice") {
        setstartPrice(event.target.value);
    }
    else{
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
    else if(errors.length > 0)
    {
      return;
    }

    console.log("Error state",errors)
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
              if(inputFields[option].buySell == 'buy')
              {
                ans[price-startPrice]+=(Math.max(price-inputFields[option].strikePrice,0)-inputFields[option].optionPrice)
              }
              else if(inputFields[option].buySell == 'sell')
              {
                ans[price-startPrice]-=(Math.max(price-inputFields[option].strikePrice,0)-inputFields[option].optionPrice)
              }
            }
            if(inputFields[option].optionType == 'put')
            {
              if(inputFields[option].buySell == 'buy')
              {
                ans[price-startPrice]+=(Math.max(inputFields[option].strikePrice-price,0)-inputFields[option].optionPrice)
              }
              else if(inputFields[option].buySell == 'sell')
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
    <>
      <h1>Option Simulator</h1>
      <h3>Enter range of stock prices for simulation:</h3>
      <form onSubmit={handleSubmit}>
      {errors.map(error => (
          <h3 style={{color: "red"}} key={error}>Error: {error}</h3>
        ))}
        <div className="form-row">
            <div className="form-group col-sm-12">
                    <label htmlFor="startPrice">Start Price</label>
                    <input //ref={st_prInput => this._st_prInput}
                    type='text'
                    className="form-control"
                    id="startPrice"
                    name="startPrice"
                    //value={startPrice}
                    onChange={event => handleInputPricesChange(event)}
                    />
              </div>
              <div className="form-group col-sm-10">
                    <label htmlFor="endPrice">End Price</label>
                    <input //ref={en_prInput => this._en_prInput}
                    type='text'
                    className="form-control"
                    id="endPrice"
                    name="endPrice"
                    //value={endPrice}
                    onChange={event => handleInputPricesChange(event)}
                    />
              </div>
              <br></br>
              <h3>Enter option details:</h3>
          {inputFields.map((inputField, index) => (
            <Fragment key={`${inputField}~${index}`}>
              <div className="form-group col-sm-8">
                <label htmlFor="strikePrice">Strike Price</label>
                <input //ref={strike_prInput => this._strike_prInput}
                  type='text'
                  className="form-control"
                  id="strikePrice"
                  name="strikePrice"
                  //value={inputField.firstName}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>

              <div className="form-group col-sm-6" onChange={event => handleInputChange(index, event)}>
                <label htmlFor="optionType">Option Type  </label>
                <label>
                <input type="radio" className="form-control" 
                  id="optionType" value="call" defaultChecked name="optionType" />
                  Call
                </label>
                <label>
                <input type="radio" className="form-control" 
                  id="optionType" value="put" name="optionType" />
                  Put
                </label>
                <p> Selected type: {optype} </p>
              </div>

              <div className="form-group col-sm-4">
                <label htmlFor="optionPrice">Option Price</label>
                <input //ref={opt_prInput => this._opt_prInput}
                  type='text' 
                  className="form-control" 
                  id="optionPrice"
                  name="optionPrice"
                  //value={inputField.lastName}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-2" onChange={event => handleInputChange(index, event)}>
                <label htmlFor="buySell">Buy/Sell </label>
                <label>
                <input type="radio" className="form-control" 
                  id="buySell" value="buy" defaultChecked name="buySell" />
                  Buy
                </label>
                <label>
                <input type="radio" className="form-control" 
                  id="buySell" value="sell" name="buySell" />
                  Sell
                </label>
                <p>Selected type: {bs} </p>
              </div>
              <div className="form-group col-sm-1">
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleRemoveFields(index)}
                >
                  -
                </button>
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleAddFields()}
                >
                  +
                </button>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="submit-button">
          <button
            id = "submit"
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
          >
            Save
          </button>
        </div>
        <br/>
      </form>
      <div id = "chart">
      
      </div>
    </>
  );
    //      }
};

export default Optsim;