import React from 'react';
import ReactDOM from 'react-dom';

var classNames = require('classnames');

$('.ui.accordion')
  .accordion()
;

var Clock = React.createClass
({
	render: function()
	{
		var divClasses = classNames({
			'ui segment': true,
			'inverted': this.props.active
		});
		
		var buttonClasses = classNames({
			'ui icon button': true,
			'inverted': this.props.active
		});

		var settingsButtonClasses = classNames({
			'ui icon button clockSettings': true,
			'inverted': this.props.active
		});

		var settingsInputClasses = classNames({
			'ui input clockSettings': true,
			'inverted': this.props.active
		});
		
		var twoDigits = (i) => ('0' + i).slice(-2);
		var spent = this.props.secondsSpent;
		var spentStr = '' + twoDigits(spent % 60);
		spent = Math.trunc(spent / 60);
		spentStr = twoDigits(Math.trunc(spent / 60)) + ':' + twoDigits(spent % 60) + ':' + spentStr; 

		return(
			<div className={divClasses} onClick={this.props.makeActive}>
				<canvas className="timeChart" width="70px" height="70px"/>
				<p className="clockText">{spentStr}/00:30:00 <br /> {this.props.text}</p>
				<button className={buttonClasses} onClick={this.props.toggleSettings}>
  					<i className="settings icon"></i>
				</button>
				<button className={buttonClasses} onClick={this.props.removeClock}>
  					<i className="delete icon"></i>
				</button>
				
				<div className={settingsInputClasses}>
					<input type="number" placeholder="hrs" />
				</div>
				<div className={settingsInputClasses}>
					<input type="number" placeholder="min" />
				</div>
				<div className={settingsInputClasses}>
					<input type="number" placeholder="sec" />
				</div>
				<button className={settingsButtonClasses} onClick={this.props.toggleSettings}>
  					<i className="hourglass half icon"></i>
				</button>
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
							"#000000"
						],
						hoverBackgroundColor:
						[
							"#52EE84",
							"#000000"
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
		var clockRender = function(item)
		{
			return <Clock
						key={item.key}
						active={this.state.currentActive == item.key}
						text={item.text}
						makeActive={this.makeClockActive.bind(null, item)}
						removeClock={this.deleteClock.bind(null, item)}
						toggleSettings={this.toggleClockSettings.bind(null, item)}
						secondsSpent={Math.round(item.secondsSpent)}
					/>;
		};

		return(
			<div>
				<div className="ui segment fixed sticky topBox">
					<h1 className="ui header">Timer Shuffle</h1>
				</div>
				<div id="clocks">{this.state.clocks.map(clockRender.bind(this))}</div>
				<div id="bottomGroup" className="ui action input">
					<input onKeyPress={this.checkEnterButton} onChange={this.onInputChange} type="text" placeholder="Add action" value={this.state.text}/>
					<button className="ui olive icon button" id="addClock" onClick={this.createClock}>
						<i className="plus icon" />
					</button>
				</div>
			</div>
		);
	},

	clockWithKey: function(key)
	{
		//better than indexOf because it doesn't rely on the time not being changed by tick and
		//is more efficient because it doesn't check array equality
		for(var i = 0; i < this.state.clocks.length; i++) if(this.state.clocks[i].key == key) return i;
		return -1;
	},

	makeClockActive: function(clockData, e)
	{
		if(!e.isPropagationStopped()) this.setState({currentActive: clockData.key});
	},

	deleteClock: function(clockData, e)
	{
		var clockList = this.state.clocks;
		if(clockList.length > 1)
		{
			var clockIndex = this.clockWithKey(clockData.key)
			$('#clocks > div:nth-child(' + (clockIndex + 1) + ')').slideUp(200, () =>
				{
					clockList.splice(clockIndex, 1);
					if(clockData.key == this.state.currentActive) this.state.currentActive = clockList[0].key;
					this.setState({clocks: clockList});
				});
		}

		e.stopPropagation();
	},

	toggleClockSettings: function(clockData, e)
	{
		var clockIndex = this.clockWithKey(clockData.key) + 1;
		var clockString = '#clocks > div:nth-child(' + clockIndex + ')';

		if($(clockString + ' .clockSettings').first().is(':visible'))
		{
			$(clockString + ' *:not(.clockSettings, .clockSettings *)').delay(200).fadeToggle(100);
			$(clockString + ' .clockSettings').fadeToggle(100);
		}
		else
		{
			$(clockString + ' *:not(.clockSettings, .clockSettings *)').fadeToggle(100);
			$(clockString + ' .clockSettings').delay(200).fadeToggle(100);
		}

		e.stopPropagation();
	},

	createClock: function()
	{
		var nextClocks = this.state.clocks.concat([{text: this.state.text, key: Date.now(), secondsSpent: 0}]);
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
		var d = new Date();
		var currentSeconds = d.getMilliseconds() / 1000.0 + d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600;
		return {clocks: [{text: 'Wasting Time', key: d, secondsSpent: 0.0}], text: '', secondsToday: currentSeconds, currentActive: d};
	},

	componentDidMount: function()
	{
		this.masterInterval = setInterval(this.tick, 1000);
	},

	tick: function()
	{
		var d = new Date();
		var currentSeconds = d.getMilliseconds() / 1000.0 + d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600;
		this.state.clocks[this.clockWithKey(this.state.currentActive)].secondsSpent += currentSeconds - this.state.secondsToday;
		this.setState({clocks: this.state.clocks, secondsToday: currentSeconds});
	},
	
	componentWillUnmount: function()
	{
		clearInterval(this.masterInterval);
	}
});

ReactDOM.render(< Clocks / >, document.getElementById('clockApp'));
