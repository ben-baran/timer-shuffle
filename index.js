require('electron').webFrame.setZoomLevelLimits(1, 1);
require('chart.js')
$ = require('jquery');

$(function()
{
	$('#addClock').on('click', function()
	{
		$.get('section.html', function(data)
		{
			$('#clocks').append(data);

			var ctx = $("#clocks").last().first();
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

		});
	});
});
