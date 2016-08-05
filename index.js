require('electron').webFrame.setZoomLevelLimits(1, 1);
$ = require('jquery');

$(function()
{
	var ctx = $("#myChart");
	require('chart.js');
	
	var myChart = new Chart(ctx,
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

	$('#addClock').on('click', function()
	{
		$('#clocks').append('<p style="color:#fff">Clicked the button</p>');
	});
});
