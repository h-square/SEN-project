import React, { useState, Fragment} from "react";
import ReactDOM from "react-dom";
import payoff from './payoff'
import './option.css'
import Header from '../../Header'
import { Typography, Container, CssBaseline, TextField, Radio, FormControl, RadioGroup, FormControlLabel, Button, Box } from "@material-ui/core";

const Optsim = () => {

  const [errors,seterrors] = useState([]);
  const [errors1,seterrors1] = useState([]);
  const [errors11,seterrors11] = useState([]);
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
    if([...inputFields].length > 1)
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

    
    if(event.target.name === "strikePrice")
    {
      const temp_error = [];
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
      seterrors1(temp_error);
    }
    else if(event.target.name === "optionPrice")
    {
      const temp_error1 = [];
      if(event.target.value === '')
      {
        temp_error1.push("Enter a valid option price for option" + index + "!");
      }
      else if (event.target.value !== '')
      {
        if(!Number(event.target.value)) 
        {
        temp_error1.push("Option Price must be a number for option" + index + "!");
        }
        else if(event.target.value < 0)
        {
          temp_error1.push("Option price must be a positive number for option" + index + "!");
        }
      }
      seterrors11(temp_error1);
    }
    //seterrors1(temp_error);
    //seterrors11(temp_error1);
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
        const v1 = (event.target.value).trim();
        setstartPrice(v1);
    }
    else if (event.target.name === "endPrice")
    {
        const v2 = (event.target.value).trim();
        setendPrice(v2);
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
    seterrors(error0);
    if (error0.length > 0) {
      return;
    }
    else if(errors1.length > 0)
    {
      return;
    }
    else if(errors11.length > 0)
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
    //const v1 = parseFloat(startPrice.trim())
    //const v2 = parseFloat(endPrice.trim())
    //setstartPrice(v1)
    //setendPrice(v2)
    for(let i=0;i<(endPrice-startPrice+1);i++)
    {
        ans[i]=0;
    }
    console.log("New end price",endPrice)
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

  return (
    <div>
      <Header/>
      <Container component='main' maxWidth='xs'>
        <CssBaseline/>
        <Typography align='center' variant='h5'>Option Simulator</Typography>
        <br/>
        <Typography variant = 'h6'>Enter range of stock prices for simulation:</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Start Price"
            name="startPrice"
            id='startPrice'
            autoComplete="sprice"
            autoFocus
            onChange={event => handleInputPricesChange(event)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="End Price"
            name="endPrice"
            id='endPrice'
            autoComplete="eprice"
            autoFocus
            onChange={event => handleInputPricesChange(event)}
          />
          <div className="form-row">
          {/* <div class="stock-detail">
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
                </div> */}
            <Typography variant='h6'>Enter option details:</Typography>
            {inputFields.map((inputField, index) => (
              <Fragment key={`${inputField}~${index}`}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Strike Price"
                  name="strikePrice"
                  id='strikePrice'
                  autoComplete="strikeprice"
                  autoFocus
                  value={inputFields[index].strikePrice}
                  onChange={event => handleInputChange(index, event)}
                />

                <Typography variant='h6'>Option Type:</Typography>
                <FormControl component="fieldset">
                  <RadioGroup onChange={event => handleInputChange(index, event)}>
                    <FormControlLabel id="optionType" name='optionType' value="call" control={<Radio />} label="Call" />
                    <FormControlLabel id="optionType" name='optionType' value="put" control={<Radio />} label="Put" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Option Price"
                  name="optionPrice"
                  id='optionPrice'
                  autoComplete="optionprice"
                  autoFocus
                  value={inputFields[index].optionPrice}
                  onChange={event => handleInputChange(index, event)}
                />

                <Typography variant='h6'>Option Buy/Sell:</Typography>
                <FormControl component="fieldset">
                  <RadioGroup onChange={event => handleInputChange(index, event)}>
                    <FormControlLabel id="buySell" name='buySell' value="buy" control={<Radio />} label="Buy" />
                    <FormControlLabel id="buySell" name='buySell' value="sell" control={<Radio />} label="Sell" />
                  </RadioGroup>
                </FormControl>
                <br/>
                <Box bgcolor="" p={1} my={0.5} align='center'>
                  <Button
                      type="button"
                      variant="contained"
                      style={{textTransform : 'none'}}
                      onClick={() => handleRemoveFields(index)}
                  >
                      Remove
                  </Button>
                  <Button
                      type="button"
                      variant="contained"
                      style={{textTransform : 'none'}}
                      onClick={() => handleAddFields()}
                  >
                      Add
                  </Button>
                </Box>

              {/* <center>
              <div class="option-detail">
                <div className="form-group">
                  <label class="form-label" htmlFor="strikePrice">Strike Price&nbsp;&nbsp;&nbsp;:</label>
                  <input //ref={strike_prInput => this._strike_prInput}
                    type='text'
                    className="form-input"
                    id="strikePrice"
                    name="strikePrice"
                    placeholder="Enter value"
                    value={inputFields[index].strikePrice}
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
                  <p class="h3-text"> Selected type: {inputFields[index].optionType} </p>
                </div>

                <div className="form-group">
                  <label htmlFor="optionPrice" class="form-label">Option Price&nbsp;:</label>
                  <input //ref={opt_prInput => this._opt_prInput}
                    type='text' 
                    className="form-input" 
                    id="optionPrice"
                    name="optionPrice"
                    placeholder="Enter value"
                    value={inputFields[index].optionPrice}
                    onChange={event => handleInputChange(index, event)}
                  />
                </div>
                <div className="form-group" onChange={event => handleInputChange(index, event)}>
                  <label htmlFor="buySell" class="form-label">Buy/Sell &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>
                  <label class="form-label-for-radio">
                  <input type="radio" className="form-input-for-radio" 
                    id="buySell" value="buy" defaultChecked name="buySell" />
                    Buy
                  </label>
                  <label class="form-label-for-radio">
                  <input type="radio" className="form-input-for-radio" 
                    id="buySell" value="sell" name="buySell" />
                    Sell
                  </label>
                  <p class="h3-text"> Selected type: {inputFields[index].buySell} </p>
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
                  </center> */}
              </Fragment>
            ))}
          </div>
          <br/>
          <Button
            type="submit"
            id='submit'
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save
          </Button>
          {/* <br/>
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
          </div> */}
          <br/>
          </form>
          {errors.map(error => (
              <Typography variant='h6' align='center' style={{color: "red"}} key={error}>Error: {error}</Typography>
            ))}
            {errors1.map(error1 => (
              <Typography variant='h6' align='center' style={{color: "red"}} key={error1}>Error: {error1}</Typography>
            ))}
            {errors11.map(error11 => (
              <Typography variant='h6' align='center' style={{color: "red"}} key={error11}>Error: {error11}</Typography>
            ))}
            {errors2.map(error2 => (
              <Typography variant='h6' align='center' style={{color: "red"}} key={error2}>Error: {error2}</Typography>
            ))}
            {errors3.map(error3 => (
              <Typography variant='h6' align='center' style={{color: "red"}} key={error3}>Error: {error3}</Typography>
            ))}

          <Typography style={{color: "green"}} > If saved without correcting the error, output might not be correct/valid. </Typography>
        </Container>
        <div id = "chart" class="chart">
        
        </div>
    </div>
  );
};

export default Optsim;