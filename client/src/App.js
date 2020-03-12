import React, {Component} from 'react';
import SearchStock from './SearchStock';

class App extends Component{


	render(){
		return(
			<div>
				<center><h1>SMAP</h1></center>
				<SearchStock />
				
			</div>
		)
	}
}

export default App