Dream.Main = function(game) {
	platforms = null;
	canJump = true;
	nextFire = 0;
	fireRate = 100;
	PLAYER_SCALE = 0.6;
	nextCloud = 0;
	nextMountain = 0;
	cloudRate = 10000;
};

Dream.Main.prototype = {

	create: function() {

		// Make the world larger than the boundaries
		this.game.world.setBounds(0, 0, 2200, 0);

		//Add objects
		this.add.tileSprite(0, 0, 2200, 550, 'sky');
		clouds = this.game.add.group();
		mountains = this.game.add.group();
		platforms = this.game.add.group();


		//Physics setup
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		clouds.enableBody = true;
		mountains.enableBody = true;
		platforms.enableBody = true;


		//Set up clouds
		clouds.createMultiple(30, 'cloud', 0, false);
	   	clouds.setAll('outOfBoundsKill', true);
	   	clouds.setAll('checkWorldBounds', true);

	   	//Set up mountains
	   	mountains.createMultiple(30, 'mountain', 0, false);
	   	mountains.setAll('outOfBoundsKill', true);
	   	mountains.setAll('checkWorldBounds', true);

	   	//3 clouds spawn at once
	   	for (var i = 0; i < 18; i++) 
	    {
	    	// create a star inside of the 'stars' group
			var cloudTemp = clouds.create(i * 225, 50 + (Math.random() * 140), 'cloud');

			// let gravity do its thing
			cloudTemp.body.gravity.x = 0;

			// this gives each star a slightly random bounce value
			cloudTemp.body.velocity.x = -10 - (Math.random() * 15);
	    }

	  	//5 mountains spawn at once
	   	for (var i = 0; i < 30; i++) 
	    {
			var mTemp = mountains.create(((i-1) * 120) + (Math.random() * 2), this.game.world.height - 245 + (Math.random() * 60), 'mountain');

			mTemp.body.gravity.x = 0;

			mTemp.body.velocity.x = -45 - (Math.random() * 8);
	    }	   	

		//Build world
		ground = platforms.create(0, this.game.world.height - 45, 'ground');
		ground.body.immovable = true;

		//Set up player
		player = this.add.sprite(226, this.game.world.height - 100, 'player');
		player.anchor.setTo(0.5, 0.5);
		this.game.physics.arcade.enable(player);
		this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
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

	    //targetting
	    target = this.add.sprite(this.game.input.x, this.game.input.y, 'target');
	    target.fixedToCamera = true;


		//Controls
		button = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		//Collision detection
		this.game.physics.arcade.collide(player, platforms);

		//Use reticule for mouse
		target.cameraOffset.x = this.game.input.x - 22;
		target.cameraOffset.y = this.game.input.y - 12;

		//Spawn clouds
		if(this.game.time.now > nextCloud)
		{
			this.spawnCloud();
		}

		//Spawn mountains
		if(this.game.time.now > nextMountain)
		{
			this.spawnMountain();
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
	        bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer);
	    }
	},

	spawnCloud: function() {
		nextCloud = this.game.time.now + cloudRate;
		cloud = clouds.getFirstExists(false);
		cloud.reset(2199, 30 + (Math.random() * 120), 'cloud');
		cloud.body.gravity.x = 0;
		cloud.body.velocity.x = -15 - (Math.random() * 15);
		cloudScale = Math.random() + .6; 
		cloud.scale.setTo(cloudScale, cloudScale);
	},

	spawnMountain: function() {
		nextMountain = this.game.time.now + (cloudRate-7150);
		mountain = mountains.getFirstExists(false);
		mountain.reset(2199, this.game.world.height-250, 'mountain');
		mountain.body.gravity.x = 0;
		mountain.body.velocity.x = -45 - (Math.random() * 8);
		mountainScale = ((Math.random()/2.75) + 1); 
		mountain.scale.setTo(mountainScale, mountainScale);
	},

	render: function() {
		//this.game.debug.text('test', 50,50);
	}


};