import React from 'react';
import ChartDrawer from './ChartDrawer';
import ReactDOM from 'react-dom';
import CanvasJSReact from './canvasjs.react';

var dataPoints =[];
var Component = React.Component;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let name, chart_exists=false, element,chart;

class SearchStock extends React.Component{

    state = {
        element : null,
        click : false
    }

    handleClickIndicators = (e) =>{
        
        console.log(e.target.checked)
        if(e.target.checked)
        {
            console.log(e.target.id);
            chart = this.chart;
            var name = document.getElementById("stock_input").value;
            name = name.trim().toUpperCase();
            console.log(name);
            var indicator = e.target.id.split(" ");

            fetch(`/api/indicators/${indicator[0]}/${name}-${indicator[1]}`)
            .then(function(response) {
                console.log(response.status);
                return response.json();
            })
            .then(function(data2) {
                console.log(data2);
                chart.options.title.text = name; 
                let properties = {
                    type: "line",
                    name: indicator[0]+" "+indicator[1],
                    showInLegend: true,
                    yValueFormatString: "$##0.00",
                    xValueType: "dateTime",
                    dataPoints: []
                }
                let api_res = data2['timestamp'].map((ele, index) => {
                    let date_nums = ele.split('-');
                    return [new Date(date_nums[0], date_nums[1], date_nums[2]), data2['analysis_data'][index]];
                });
    
                api_res.sort((a, b) => a[0]-b[0]);
                console.log(api_res);

                for(let i=0; i<api_res.length; i++)
                {
                    properties.dataPoints.push({
                        
                        x: api_res[i][0],
                        y: api_res[i][1]
                    });
                }
                chart.addTo("data",properties);
                chart.render(); 
            });
        }
        else
        {
            chart = this.chart;
            var idx=0;
            for(let i in chart.options.data)
            {
                console.log(i)  
                if(chart.options.data[idx].name===e.target.id)
                {
                    chart.options.data.splice(idx,1);
                    break;
                }
                idx++;
            }
            chart.render();
        }
            
    }

    handleSubmit = (e) =>{

        if(this.state.click === false)
        {
            this.setState({
                click:true
            })
        }
        
        name = document.getElementById("stock_input").value;
        console.log(name);
        name = name.trim().toUpperCase();
        var letters = /^[A-Za-z0-9]+$/
        if(!name.match(letters))
        {
            chart_exists=false;
            this.setState({element : null})
            alert("Please enter valid stock symbol");
            return;
        }
        

        
        dataPoints = [];
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
				intervalType: "month",
				valueFormatString: "YYYY-MM-DD"
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
				yValueFormatString: "$##0.00",
				xValueType: "dateTime",
				dataPoints: dataPoints
			}]
        }

        if(!name)
        {
            chart_exists=false;
            this.setState({element : null})
            alert("Please enter valid stock symbol");
        }
        else
        {
            let self=this;
            fetch(`/api/prices/${name}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if(data.status=="FAILED")
                {
                    chart_exists=false;
                    self.setState({element : null})
                    alert("Please enter valid stock symbol");
                }
                else
                {
                    self.setState({element : null})
                    options.title.text = name;
                    options.data[0].name = "price";

                    let api_res = data['timestamp'].map((ele, index) => {
                        let date_nums = ele.split('-');
                        return [new Date(date_nums[0], date_nums[1], date_nums[2]), data['prices'][index]];
                    });

                    api_res.sort((a, b) => a[0]-b[0]);
                    console.log(api_res);

                    for(let i=0; i<api_res.length; i++)
                    {
                        options.data[0].dataPoints.push({     
                            x: api_res[i][0],
                            y: api_res[i][1]
                        });
                    }

                    
                    options.data[0].dataPoints.reverse();

                    Promise.all([options]).then(function(data){
                    self.setState({element : (
                    <div>
                        <CanvasJSChart options = {data[0]}  onRef={ref => self.chart = ref}/>
                        <form>
                        <label class="container">
                            <input type="checkbox" onChange={self.handleClickIndicators} id="SMA 100" />SMA 100
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <input type="checkbox" onChange={self.handleClickIndicators} id="SMA 50"/>SMA 50
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <input type="checkbox" onChange={self.handleClickIndicators} id="EMA 100"/>EMA 100
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <input type="checkbox" onChange={self.handleClickIndicators} id="EMA 50"/>EMA 50
                            <span class="checkmark"></span>
                        </label>
                        </form>
                    </div>
                    )})
                    })
                }
            })
            .catch(err => {console.log(err);chart_exists=false;
            self.setState({element : null})
            alert("Please enter valid stock symbol");});
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
                        {this.state.element}
                    </center>
            </div>
        )
    }
}

export default SearchStock;