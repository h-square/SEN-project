import React, {Component} from 'react';
import SearchStock from './SearchStock';

class Indicators extends Component{
	render(){
		return(
			<div>
				<center><h1>SMAP</h1></center>
				<SearchStock />
			</div>
		)
	}
}

export default Indicators;