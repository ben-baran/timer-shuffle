import React from 'react';
import ReactDOM from 'react-dom';

var classNames = require('classnames');

var Clock = React.createClass
({
	render: function()
	{
		if('timeChart' in this.state)
		{
			var dataset = this.state.timeChart.data.datasets[0];
			if(this.props.secondsLimit >= this.props.secondsSpent)
			{
				dataset.data[0] = this.props.secondsSpent;
				dataset.data[1] = this.props.secondsLimit - this.props.secondsSpent;
				dataset.backgroundColor[0] = '#AEFF6E'
				dataset.backgroundColor[1] = '#FFFFFF'

			}
			else
			{
				dataset.data[0] = this.props.secondsSpent - this.props.secondsLimit;
				dataset.data[1] = this.props.secondsLimit;
				dataset.backgroundColor[0] = '#994136'
				dataset.backgroundColor[1] = '#AEFF6E'
			}
			this.state.timeChart.update();
		}

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
		var timeString = (t) => {
			var ret = '' + twoDigits(t % 60);
			t = Math.trunc(t / 60);
			ret = twoDigits(Math.trunc(t / 60)) + ':' + twoDigits(t % 60) + ':' + ret;
			return ret;
		};
		var spentStr = timeString(this.props.secondsSpent);
		var limitStr = timeString(this.props.secondsLimit);

		return(
			<div className={divClasses} onClick={this.props.makeActive}>
				<canvas className="timeChart" width="70px" height="70px"/>
				<p className="clockText">{spentStr}/{limitStr} <br /> {this.props.text}</p>
				<button className={buttonClasses} onClick={this.props.toggleSettings}>
  					<i className="settings icon"></i>
				</button>
				<button className={buttonClasses} onClick={this.props.removeClock}>
  					<i className="delete icon"></i>
				</button>
				
				<div className={settingsInputClasses}>
					<input type="number" placeholder="hrs" value={parseInt(limitStr.substring(0, 2))} onChange={this.props.onClockHoursChange}/>
				</div>
				<div className={settingsInputClasses}>
					<input type="number" placeholder="min" value={parseInt(limitStr.substring(3, 5))} onChange={this.props.onClockMinutesChange}/>
				</div>
				<div className={settingsInputClasses}>
					<input type="number" placeholder="sec" value={parseInt(limitStr.substring(6, 8))} onChange={this.props.onClockSecondsChange}/>
				</div>
				<button className={settingsButtonClasses} onClick={this.props.toggleSettings}>
  					<i className="hourglass half icon"></i>
				</button>
			</div>
		);
	},

	getInitialState: function()
	{
		return {};
	},

	componentDidMount: function()
	{
		var ctx = $('#clocks').children().last().children().first();
		var createdChart = new Chart(ctx,
		{
			type: 'doughnut',
			data:
			{
				labels: ["Completed", "Not Completed"],
				datasets:
				[
					{
						data: [this.props.secondsSpent, this.props.secondsLimit],
						backgroundColor: ["#AEFF6E", "#FFFFFF"],
						borderColor: ['#000000', '#000000'],
						borderWidth: ['10px', '10px'],
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

		this.setState({timeChart: createdChart});
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
						onClockHoursChange={this.onClockHoursChange.bind(null, item)}
						onClockMinutesChange={this.onClockMinutesChange.bind(null, item)}
						onClockSecondsChange={this.onClockSecondsChange.bind(null, item)}
						secondsSpent={Math.round(item.secondsSpent)}
						secondsLimit={Math.round(item.secondsLimit)}
					/>;
		};

		return(
			<div>
				<div className="ui segment fixed sticky topBox">
					<h1 className="ui header">Timer Shuffle</h1>
				</div>
				<div id="clocks">{this.state.clocks.map(clockRender.bind(this))}</div>
				<div id="bottomGroup" className="ui action input">
					<div className="ui input">
						<input type="number" min="0" max="23" placeholder="hrs" onChange={this.onInputHoursChange} value={this.state.hoursInput}/>
					</div>
					<div className="ui input">
						<input type="number" min="0" max="59" placeholder="min" onChange={this.onInputMinutesChange} value={this.state.minutesInput}/>
					</div>
					<div className="ui input">
						<input type="number" min="0" max="59" placeholder="sec" onChange={this.onInputSecondsChange} value={this.state.secondsInput}/>
					</div>
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
		if(!e.isPropagationStopped() && !this.state.clocks[this.clockWithKey(clockData.key)].settingsOpen) this.setState({currentActive: clockData.key});
	},

	deleteClock: function(clockData, e)
	{
		var clockList = this.state.clocks;
		if(clockList.length > 1)
		{
			var clockIndex = this.clockWithKey(clockData.key);
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
		var clockIndex = this.clockWithKey(clockData.key) ;
		var clockString = '#clocks > div:nth-child(' + (clockIndex + 1) + ')';

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
		
		var clockList = this.state.clocks;
		clockList[clockIndex].settingsOpen = !clockList[clockIndex].settingsOpen;
		this.setState({clocks: clockList});

		e.stopPropagation();
	},

	createClock: function()
	{
		var nextClocks = this.state.clocks.concat([{text: this.state.text,
													key: Date.now(),
													secondsSpent: 0,
													secondsLimit: this.state.hoursInput * 3600 + this.state.minutesInput * 60 + this.state.secondsInput,
													settingsOpen: false}]);
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

	onInputHoursChange: function(e)
	{
		var hours = Math.max(Math.min(e.target.value, 23), 0);
		if(hours == 0) this.setState({hoursInput: ''});
		else this.setState({hoursInput: hours});
	},

	onInputMinutesChange: function(e)
	{
		var minutes = Math.max(Math.min(e.target.value, 59), 0);
		if(minutes == 0) this.setState({minutesInput: ''});
		else this.setState({minutesInput: minutes});
	},

	onInputSecondsChange: function(e)
	{
		var seconds = Math.max(Math.min(e.target.value, 59), 0);
		if(seconds == 0) this.setState({secondsInput: ''});
		else this.setState({secondsInput: seconds});
	},

	onClockHoursChange: function(clockData, e)
	{
		var clockIndex = this.clockWithKey(clockData.key);
		var hours = Math.max(Math.min(e.target.value, 23), 0);
		var clockList = this.state.clocks;
		var previousLimit = clockList[clockIndex].secondsLimit;
		clockList[clockIndex].secondsLimit = hours * 3600 + previousLimit % 3600;
		this.setState({clocks: clockList});
	},

	onClockHoursChange: function(clockData, e)
	{
		var clockIndex = this.clockWithKey(clockData.key);
		var hours = Math.max(Math.min(e.target.value, 23), 0);
		var clockList = this.state.clocks;
		var previousLimit = clockList[clockIndex].secondsLimit;
		clockList[clockIndex].secondsLimit = hours * 3600 + previousLimit % 3600;
		this.setState({clocks: clockList});
	},

	onClockMinutesChange: function(clockData, e)
	{
		var clockIndex = this.clockWithKey(clockData.key);
		var minutes = Math.max(Math.min(e.target.value, 59), 0);
		var clockList = this.state.clocks;
		var previousLimit = clockList[clockIndex].secondsLimit;
		clockList[clockIndex].secondsLimit = Math.trunc(previousLimit / 3600) * 3600 + minutes * 60 + previousLimit % 60;
		this.setState({clocks: clockList});
	},

	onClockSecondsChange: function(clockData, e)
	{
		var clockIndex = this.clockWithKey(clockData.key);
		var seconds = Math.max(Math.min(e.target.value, 59), 0);
		var clockList = this.state.clocks;
		var previousLimit = clockList[clockIndex].secondsLimit;
		clockList[clockIndex].secondsLimit = Math.trunc(previousLimit / 60) * 60 + seconds; 
		this.setState({clocks: clockList});
	},

	getInitialState: function()
	{
		var d = new Date();
		var currentSeconds = d.getMilliseconds() / 1000.0 + d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600;
		return {clocks: [{text: 'Wasting Time', key: d, secondsSpent: 0.0, secondsLimit: 86400, settingsOpen: false}], text: '',
				secondsInput: '', minutesInput: 30, hoursInput: '', secondsToday: currentSeconds, currentActive: d};
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
