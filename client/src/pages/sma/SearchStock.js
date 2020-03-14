import React from 'react';
import ChartDrawer from './ChartDrawer';
import ReactDOM from 'react-dom';

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
                    <center>
                        <input type="text" id="stock_input"/>
                        <button onClick={this.handleSubmit}>Submit</button>
                        <br/>
                        <br/>
                        <div id="chart"></div>
                    </center>
            </div>
        )
    }
}

export default SearchStock;