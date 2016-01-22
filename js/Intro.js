var Dream = {
	score: 0
};

Dream.Intro = function(game) {};

Dream.Intro.prototype = {

	preload: function() {
		this.load.image('menu', 'assets/menu.png');
		this.load.image('sky', 'assets/background.png');
		this.load.image('ground', 'assets/train.png');
		this.load.spritesheet('player', 'assets/player.png', 32, 48);
		this.load.image('shot', 'assets/shot.png');
		this.load.image('cloud', 'assets/cloud1.png');
		this.load.image('target', 'assets/reticule.png');
		this.load.image('mountain', 'assets/mountain.png');
		this.load.image('gameover', 'assets/gameover.png');
		this.load.image('enemy1', 'assets/enemy1.png');
		this.load.image('enemy2', 'assets/enemy2.png');
		this.load.image('enemy3', 'assets/enemy3.png');
		this.load.image('enemy3v2', 'assets/enemy3v2.png');
		this.load.image('enemy3v3', 'assets/enemy3v3.png');
		this.load.image('eshot', 'assets/eshot.png');
		this.load.image('health', 'assets/health.png');
		this.load.image('fade', 'assets/fade.png');
		this.load.image('intro', 'assets/intro.png');
		this.load.image('w1', 'assets/w1.png');
		this.load.image('w2', 'assets/w2.png');
		this.load.image('w3', 'assets/w3.png');
		this.load.image('w4', 'assets/w4.png');
		this.load.image('w5', 'assets/w5.png');	
		this.load.image('w6', 'assets/w6.png');
		this.load.image('w7', 'assets/w7.png');
		this.load.image('w8', 'assets/w8.png');
		this.load.image('w9', 'assets/w9.png');
		this.load.image('w10', 'assets/w10.png');
		this.load.image('wI', 'assets/wI.png');
		this.load.image('wake', 'assets/wake.png');

	},

	create: function() {
		this.add.sprite(0, 0, 'sky');

		//Set up clouds
		clouds = this.game.add.group();
		clouds.enableBody = true;
		clouds.createMultiple(30, 'cloud', 0, false);
	   	clouds.setAll('outOfBoundsKill', true);
	   	clouds.setAll('checkWorldBounds', true);

	    for (var i = 0; i < 50; i++) 
	    {
	    	// create a star inside of the 'stars' group
			var cloudTemp = clouds.create(i * 150, 50 + (Math.random() * 420), 'cloud');

			// let gravity do its thing
			cloudTemp.body.gravity.x = 0;

			// this gives each star a slightly random bounce value
			cloudTemp.body.velocity.x = -10 - (Math.random() * 15);
	    }

	    this.add.sprite(0, 0, 'intro');

	},

	update: function() {
		this.game.input.onDown.add(this.startGame, this);
	},

	startGame: function() {
		this.game.state.start('Menu');
	}
};