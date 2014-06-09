Dream.Fail = function(game) {};

Dream.Fail.prototype = {

	create: function() {
		this.add.sprite(150, 130, 'gameover');
		style = { font: "50px Arial", align: "center", fill: "#ffffff"};
		text = this.game.add.text(155, 150, 'SCORE: ' + this.game.score, style);
	},

	update: function() {
		this.game.input.onDown.add(this.restartGame, this);
	},

	restartGame: function() {
		this.game.state.start('Menu');
	}
};