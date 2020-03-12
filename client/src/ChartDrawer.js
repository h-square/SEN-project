import CanvasJSReact from './canvasjs.react';

var React = require('react');
var Component = React.Component;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints = [];
class ChartDrawer extends Component {
    
    handleChange = (e) =>{
            console.log(e.target.checked)
            if(e.target.checked)
            {
                console.log(e.target.value);
                var chart = this.chart;
                var name = this.props[0];
                console.log(this.props[0]);
                fetch('https://www.alphavantage.co/query?function=SMA&symbol='+this.props[0]+'&interval=daily&time_period=100&series_type=open&apikey=UJY4LTGINDIZ9R3S')
                .then(function(response) {
                
                    return response.json();
                })
                .then(function(data2) {
                    chart.options.title.text = name; 
                    let properties = {
                        type: "line",
                        color: "red",
                        name: "SMA",
                        showInLegend: true,
                        yValueFormatString: "$##0.00",
                        xValueType: "dateTime",
                        dataPoints: []
                    }
                    for(let i in data2["Technical Analysis: SMA"]){  
                        let xx = [];
                        xx.push(i.split(' ')[0].split('-'))
                    
                        properties.dataPoints.push({
                            
                            x: new Date(xx[0][0],xx[0][1],xx[0][2]),
                            y: parseFloat(data2['Technical Analysis: SMA'][i]['SMA'])
                        })
                    }
                    chart.addTo("data",properties);
                    chart.render(); 
                });
            }
            else
            {
                var chart = this.chart;
                var idx=0;
                for(let i in chart.options.data)
                {
                    console.log(i)  
                    if(chart.options.data[idx].name=="SMA")
                    {
                        chart.options.data.splice(idx,1);
                        break;
                    }
                    idx++;
                }
                chart.render();
            }
        }

	render() {
		    var options = {
			exportEnabled: true,
			zoomEnabled: true,
			animationEnabled: true,
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
                color: "blue",
				name: "",
				showInLegend: true,
				yValueFormatString: "$##0.00",
				xValueType: "dateTime",
				dataPoints: dataPoints
			}]
		}

       

		return (
		<div>
			<CanvasJSChart options = {options}
				 onRef={ref => this.chart = ref}
			/>
            <form>
                <label>
                    <input type="checkbox" onChange={this.handleChange} id="SMA 10"/>SMA 10
                </label>
            </form>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
    }
    

	componentDidMount(){
        var chart = this.chart;
        var name = this.props[0];
        console.log(this.props[0]);
		fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+this.props[0]+'&outputsize=full&apikey=UJY4LTGINDIZ9R3S')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            chart.options.title.text = name;
            chart.options.data[0].name = "price";   
			for(let i in data['Time Series (Daily)']){  
				let xx = [];
				xx.push(i.split('-'))
				chart.options.data[0].dataPoints.push({
					x: new Date(xx[0][0],xx[0][1],xx[0][2]),
					y: parseFloat(data['Time Series (Daily)'][i]['1. open'])
				})
			}
			chart.options.data[0].dataPoints.reverse();
			chart.render(); 
		});
    }


    componentDidUpdate(prevProp){
        if(prevProp[0]!=this.props[0]   )
        {
            document.getElementById("SMA 10").checked = false;
            this.chart.options.data = [];
            this.chart.options.data.name = this.props[0];
            this.chart.options.title.text = this.props[0];
            console.log(this.chart.options.data)
            var chart = this.chart;
            let properties = {
                type: "line",
                color: "blue",
                name: this.props[0],
                showInLegend: true,
                yValueFormatString: "$##0.00",
                xValueType: "dateTime",
                dataPoints: []
            }
            fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+this.props[0]+'&outputsize=full&apikey=UJY4LTGINDIZ9R3S')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                for(let i in data['Time Series (Daily)']){  
                    let xx = [];
                    xx.push(i.split('-'))
                    properties.dataPoints.push({
                        x: new Date(xx[0][0],xx[0][1],xx[0][2]),
                        y: parseFloat(data['Time Series (Daily)'][i]['1. open'])
                    })
                }
                dataPoints.reverse();
                chart.addTo("data",properties);
                chart.render();
            });
        }
        
	}
}
export default ChartDrawer;