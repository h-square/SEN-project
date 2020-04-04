import React,{Fragment,Component} from 'react';
const qs = require('querystring');

class Watchlist extends Component{

    constructor(props){
        super(props);
        this.state = {
            searched_stock: null,
            stock_list : null,
            quotes: null
        };
    }

    
    componentDidMount(){
        let self=this;
        fetch('/user/watchlist',{
            method : 'GET',
            credentials : 'include'
        })
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data['stocks'])
            self.setState({stock_list : data['stocks']})
            console.log(self.state)
        })
        
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleAdd = (e) => {
        let self=this;
        e.preventDefault();
        console.log(typeof(this.state.searched_stock))
        let temp = {
            stocks : [this.state.searched_stock,'.']
        }
        console.log(qs.stringify(temp))
        fetch('/user/watchlist/add',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            credentials : 'include',
            body: qs.stringify(temp)
        })
        .then(res => {
            fetch('/user/watchlist',{
                method : 'GET',
                credentials : 'include'
            })
            .then(function(response){
                console.log(response.status)
                return response.json()
            })
            .then(function(data){
                console.log(data['stocks'])
                self.setState({stock_list : data['stocks']})
            })
        })
    }

    handleRemove = (e) => {
        let self=this;
        e.preventDefault();
        let temp = {
            stocks : [e.target.name,'.']
        }
        console.log(qs.stringify(temp))
        fetch('/user/watchlist/remove',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            credentials : 'include',
            body: qs.stringify(temp)
        })
        .then(res => {
            fetch('/user/watchlist',{
                method : 'GET',
                credentials : 'include'
            })
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                console.log(data['stocks'])
                self.setState({stock_list : data['stocks']})
                console.log(self.state)
            })
        })
    }

    render(){
        let element = this.state.stock_list? (
            <div>
                <br />
                <h1>Your Watchlist</h1>
                <br/>
            {this.state.stock_list.map((inputField, index)=>(
                <Fragment key={`${inputField}~${index}`}>
                  <div className="form-group col-sm-8">
                    <label>{inputField}</label>
                    <button name={inputField} onClick={this.handleRemove}>-</button>
                  </div>
                </Fragment>
            )
            )}
            </div>
            ):(<h1>no</h1>);
        return (
            <div>
                <input type="text"  onChange={this.handleChange} name="searched_stock" id="stock_input"/>
                <button onClick={this.handleAdd}>Add to watchlist</button>
                {element}
          
            </div>
        )
    }
}

export default Watchlist;