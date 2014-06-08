var Dream = {
	score: 0
};
Dream.Menu = function(game) {};

Dream.Menu.prototype = {

	preload: function() {
		this.load.image('menu', 'assets/menu.png');
		this.load.image('sky', 'assets/background.png');
		this.load.image('ground', 'assets/train.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('shot', 'assets/shot.png');
		this.load.image('cloud', 'assets/cloud1.png');
		this.load.image('target', 'assets/reticule.png');
		this.load.image('mountain', 'assets/mountain.png');
		this.load.image('gameover', 'assets/gameover.png');
		this.load.image('enemy1', 'assets/enemy1.png');
		this.load.image('enemy2', 'assets/enemy2.png');
		this.load.image('enemy3', 'assets/enemy3.png');
		this.load.image('eshot', 'assets/eshot.png');
		this.load.image('health', 'assets/health.png');
	},

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