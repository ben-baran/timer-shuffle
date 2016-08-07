import React from 'react';
import ReactDOM from 'react-dom';

var Clock = React.createClass
({
	render: function()
	{
		return(
			<div className="ui segment">
				<canvas className="timeChart" width="50px" height="50px" />
				<p>{this.props.text}</p>
			</div>
		);
	},

	componentDidMount: function()
	{
		var ctx = $('#clocks').children().last().children().first();
		var newChart = new Chart(ctx,
		{
			type: 'doughnut',
			data:
			{
				labels: ["Completed", "Not Completed"],
				datasets:
				[
					{
						data: [300, 500],
						backgroundColor:
						[
							"#FF6384",
							"#36A2EB"
						],
						hoverBackgroundColor:
						[
							"#63FF84",
							"#36A2EB"
						]
					}
				]
			},
			options:
			{
				legend:
				{
					display: false 
				},
				tooltips:
				{
					enabled: false
				},
				responsive: false
			}
		});	
	}
});

var Clocks = React.createClass
({
	render: function()
	{
		var createClock = function(item)
		{
			return <Clock text={item.text}/>;
		};

		return(
			<div>
				<div id="clocks">{this.state.clocks.map(createClock)}</div>
				<div id="bottomGroup" className="ui action input">
					<input onChange={this.onInputChange} type="text" placeholder="Add action" />
					<button className="ui olive icon button" id="addClock" onClick={this.handleClick}>
						<i className="plus icon" />
					</button>
				</div>
			</div>
		);
	},

	handleClick: function()
	{
		var nextClocks = this.state.clocks.concat([{text: this.state.text}]);
		var nextText = '';
		this.setState({clocks: nextClocks, text: nextText});
	},

	onInputChange: function(e)
	{
		this.setState({text: e.target.value});
	},

	getInitialState: function()
	{
		return {clocks: [], text: ''};
	}
});

ReactDOM.render(< Clocks / >, document.getElementById('clockApp'));