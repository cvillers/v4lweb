$(document).ready(function () {
	flowplayer("player_live",
	"/static/flowplayer-3.2.7.swf",
	{
		"plugins": {
			pseudo: { "url": "/static/flowplayer.pseudostreaming-3.2.7.swf" }
		},
		"clip": {
			"provider": "pseudo",
			"url": "/stream/data/stream1"
		}
	}
	)
});
