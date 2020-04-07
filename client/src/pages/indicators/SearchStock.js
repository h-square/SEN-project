import React from 'react';
import ChartDrawer from './ChartDrawer';
import ReactDOM from 'react-dom';
import './SearchStock.css'
import Button from '@material-ui/core/Button'
let name, chart;

class SearchStock extends React.Component{

    state = {
        click : false
    }

    handleSubmit = (e) =>{

        if(this.state.click === false)
        {
            name = document.getElementById("stock_input").value;
            console.log(name);
            chart = React.createElement(ChartDrawer,[name]);
            ReactDOM.render(chart,document.getElementById("chart"))
            this.setState({
                click:true
            })
        }
        else
        {
            name = document.getElementById("stock_input").value;
            console.log(name);
            chart = React.createElement(ChartDrawer,[name]);
            ReactDOM.render(chart,document.getElementById("chart"))
        }
        
    }

    render(){
        return(
            <div>
                <form>
                    <div class='ind-detail'>
                        <label class='ind-label'>Ticker Symbol:</label>
                        <input class='ind-input' type="text" placeholder='Enter Value' id="stock_input"/>
                    </div>
                    <br/>
                    <center><Button align='center' variant='contained' color='primary' onClick={this.handleSubmit}>Submit</Button></center>
                </form>
                <br/>
                <br/>
                <div id="chart"></div>
                
            </div>
        )
    }
}

export default SearchStock;