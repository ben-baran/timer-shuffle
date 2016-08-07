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
		
		$('#clocks').stop().animate({scrollTop: $('#clocks')[0].scrollHeight}, 500);
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
				<div className="ui segment fixed sticky topBox">
					<h1 className="ui header">Timer Shuffle {this.state.secondsToday}</h1>
				</div>
				<div id="clocks">{this.state.clocks.map(createClock)}</div>
				<div id="bottomGroup" className="ui action input">
					<input onKeyPress={this.checkEnterButton} onChange={this.onInputChange} type="text" placeholder="Add action" value={this.state.text}/>
					<button className="ui olive icon button" id="addClock" onClick={this.createClock}>
						<i className="plus icon" />
					</button>
				</div>
			</div>
		);
	},

	createClock: function()
	{
		var nextClocks = this.state.clocks.concat([{text: this.state.text}]);
		var nextText = '';
		this.setState({clocks: nextClocks, text: nextText});
	},
	
	checkEnterButton: function(e)
	{
		if(e.key == 'Enter')
		{
			this.createClock();
		}
	},

	onInputChange: function(e)
	{
		this.setState({text: e.target.value});
	},

	getInitialState: function()
	{
		return {clocks: [{text: 'Wasting Time'}], text: '', secondsToday: 0};
	},

	componentDidMount: function()
	{
		this.masterInterval = setInterval(this.tick, 10);
	},

	tick: function()
	{
		var d = new Date();
		var currentSeconds = Math.round(d.getMilliseconds() / 1000.0 + d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600);
		this.setState({secondsToday: currentSeconds});
	},
	
	componentWillUnmount: function()
	{
		clearInterval(this.masterInterval);
	}
});

ReactDOM.render(< Clocks / >, document.getElementById('clockApp'));
