Dream.Fail = function(game) {};

Dream.Fail.prototype = {

	create: function() {
		this.add.sprite(150, 130, 'gameover');
	},

	update: function() {
		this.game.input.onDown.add(this.restartGame, this);
	},

	restartGame: function() {
		this.game.state.start('Menu');
	}
};