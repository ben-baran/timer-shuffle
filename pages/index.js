require('electron').webFrame.setZoomLevelLimits(1, 1);
require('chart.js');
global.jQuery = require('jquery');
$ = global.jQuery

var fs = require('electron').remote.require('fs');
