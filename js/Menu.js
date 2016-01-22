Dream.Menu = function(game) {};

Dream.Menu.prototype = {

	create: function() {
		this.add.sprite(0, 0, 'menu');
	},

	update: function() {
		this.game.input.onDown.add(this.startGame, this);
	},

	startGame: function() {
		this.game.state.start('Main');
	}
};