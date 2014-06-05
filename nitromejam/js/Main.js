Dream.Main = function(game) {
	platforms = null;
	canJump = true;
	nextFire = 0;
	fireRate = 100;
	PLAYER_SCALE = 1.0;
	nextCloud = 0;
	cloudRate = 10000;
};

Dream.Main.prototype = {

	create: function() {

		//Add objects
		this.add.sprite(0, 0, 'sky');
		platforms = this.game.add.group();
		clouds = this.game.add.group();

		//Physics setup
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		platforms.enableBody = true;
		clouds.enableBody = true;

		//Set up clouds
		clouds.createMultiple(30, 'cloud', 0, false);
	   	clouds.setAll('outOfBoundsKill', true);
	   	clouds.setAll('checkWorldBounds', true);

		//Build world
		ground = platforms.create(0, this.game.world.height - 50, 'ground');
		ledge1 = platforms.create(0, 400, 'ground');
		ledge2 = platforms.create(450, 250, 'ground');
		ground.scale.setTo(4, 2);
		ground.body.immovable = true;
		ledge1.body.immovable = true;
		ledge2.body.immovable = true;


		//Set up player
		player = this.add.sprite(32, this.game.world.height - 100, 'player');
		this.game.physics.arcade.enable(player);
		player.body.gravity.y = 5000 * PLAYER_SCALE;
		player.body.collideWorldBounds = true;
		player.body.drag.set((3500 * PLAYER_SCALE), (2000 * PLAYER_SCALE));
		player.body.maxVelocity.setTo((750 * PLAYER_SCALE), (2000 * PLAYER_SCALE));

		//Set up bullets
	    bullets = this.game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(30, 'shot', 0, false);
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y', 0.5);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);

		//Controls
		button = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		this.game.physics.arcade.collide(player, platforms);

		if(this.game.time.now > nextCloud)
		{
			this.spawnCloud();
		}


		//Horizontal movement
		if(button.left.isDown)
		{
	    	//Move to the left
	    	if(player.body.velocity <= 0)
	        {
	    		player.body.acceleration.x = -1000 * PLAYER_SCALE;
	    	}
	    	else
	    	{
	    		player.body.acceleration.x = -4500 * PLAYER_SCALE;
	    	}
	    }
	    else if(button.right.isDown)
	    {
	        //Move to the right
	        if(player.body.velocity >= 0)
	        {
	    		player.body.acceleration.x = 1000 * PLAYER_SCALE;
	    	}
	    	else
	    	{
	    		player.body.acceleration.x = 4500 * PLAYER_SCALE;
	    	}
	    }
	    else
	    {
	        //Stop
	    	player.body.acceleration.x = 0;
	    }

	    //Vertical movement
	    if(button.up.justPressed(250) && canJump == true)
	    {
	    	player.body.velocity.y = -1000 * PLAYER_SCALE;
	    	player.body.gravity.y = 500 * PLAYER_SCALE;
	    	canJump = false;
	    }

	    if(button.up.justReleased(250) || (!player.body.touching.down && player.body.velocity.y == 0))
	    {
	    	player.body.gravity.y = 5000 * PLAYER_SCALE;
	    }

	    if(player.body.touching.down && button.up.isUp)
		{
			canJump = true;
		}

		//Mouse click
		this.game.input.onDown.add(this.fire, this);
	},

	fire: function() {
		if (this.game.time.now > nextFire && bullets.countDead() > 0)
	    {
	        nextFire = this.game.time.now + fireRate;
	        bullet = bullets.getFirstExists(false);
	        bullet.reset(player.x + player.body.halfWidth, player.y + player.body.halfHeight);
	        bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1200, this.game.input.activePointer);
	    }
	},

	spawnCloud: function() {
		nextCloud = this.game.time.now + cloudRate;
		cloud = clouds.getFirstExists(false);
		cloud.reset(549, 50 + (Math.random() * 140), 'cloud');
		cloud.body.gravity.x = 0;
		cloud.body.velocity.x = -10 - (Math.random() * 15);
		cloudScale = Math.random() * 2; 
		cloud.scale.setTo(cloudScale, cloudScale);
	},

	render: function() {
		//this.game.debug.text('test', 50,50);
	}


};