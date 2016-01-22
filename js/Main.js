Dream.Main = function(game) {
	platforms = null;
	canJump = true;
	nextFire = 0;
	fireRate = 100;
	PLAYER_SCALE = 0.6;
	nextCloud = 0;
	nextMountain = 0;
	cloudRate = 10000;
	fall = 0;
	enemies = null;
	enemyRate = 4000;
	nextEnemy = 0;
	enemyType = 0;
	enemyFireRate = 1000;
	test = null;
	kills = 0;
	wave = 0;
};

Dream.Main.prototype = {

	preload: function() {
		nextEnemy = this.game.time.now + 5000;
		kills = 0;
	},

	create: function() {

		// Make the world larger than the boundaries
		this.game.world.setBounds(0, 0, 2200, 0);

		//Add objects
		sky = this.add.tileSprite(0, 0, 2200, 550, 'sky');
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
		ground = platforms.create(75, this.game.world.height - 45, 'ground');
		ground.body.immovable = true;

		//Add enemies
		enemies = this.game.add.group();
		enemies.enableBody = true;
    	enemies.physicsBodyType = Phaser.Physics.ARCADE;
    	enemies.setAll('nextShot', null);

    	//Set up enemy bullets
    	enemyBullets = this.game.add.group();
	    enemyBullets.enableBody = true;
	    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets.createMultiple(100, 'eshot', 0, false);
	    enemyBullets.setAll('anchor.x', 0.5);
	    enemyBullets.setAll('anchor.y' + 23, 0.5);
	    enemyBullets.setAll('outOfBoundsKill', true);
	    enemyBullets.setAll('checkWorldBounds', true);

		//Set up player
		player = this.add.sprite(226, this.game.world.height - 75, 'player');
		player.anchor.setTo(0.5, 0.5);
		this.game.physics.arcade.enable(player);
		this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
		this.game.camera.deadzone = new Phaser.Rectangle(150, 0, 250, 0);
   		this.game.camera.focusOnXY(0, 0);
		player.body.gravity.y = 5000 * PLAYER_SCALE;
		player.body.collideWorldBounds = true;
		player.body.drag.set((3500 * PLAYER_SCALE), (2000 * PLAYER_SCALE));
		player.body.maxVelocity.setTo((750 * PLAYER_SCALE), (2000 * PLAYER_SCALE));
		player.body.collideWorldBounds = false;
		player.health = 100;
		player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('turn', [4], 20, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);

		//Set up player bullets
	    bullets = this.game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(30, 'shot', 0, false);
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y', 0.5);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);

	    //Set up health
	    hp = this.game.add.group();
	    hp.enableBody = true;
	    hp.physicsBodyType = Phaser.Physics.ARCADE;
	    hp.createMultiple(10, 'health', 0, false);
	    hp.setAll('anchor.x', 0.5);
	    hp.setAll('anchor.y', 0.5);
	    hp.setAll('body.gravity.y', 5000);
	    hp.setAll('body.drag.y', 2000);
	    hp.setAll('body.maxVelocity.y', 2000);

	    //targetting
	    target = this.add.sprite(this.game.input.x, this.game.input.y, 'target');
	    target.anchor.setTo(0.5, 0.5);


		//Controls
		button = this.game.input.keyboard.createCursorKeys();

		//Score
		style = { font: "20px Arial" };
		info = this.game.add.text(25, 25, 'HEALTH: ' + player.health + '\nSCORE: ' + kills, style)
		info.fixedToCamera = true;

		//Setup wave info
		w = this.game.add.sprite(395, 10, 'w1');
		w.fixedToCamera = true;
	},

	update: function() {
		//Collision detection
		this.game.physics.arcade.collide(player, platforms);
		this.game.physics.arcade.collide(hp, platforms);
		this.game.physics.arcade.overlap(player, hp, this.healthPickup, null, this);
		this.game.physics.arcade.overlap(player, enemies, this.enemyHitPlayer, null, this);
		this.game.physics.arcade.overlap(player, enemyBullets, this.bulletHitPlayer,  null, this);
		this.game.physics.arcade.overlap(bullets, enemies, this.playerHitEnemy, null, this);

		//Use reticule for mouse
		target.fixedToCamera = true;
		target.cameraOffset.x = this.game.input.x;
		target.cameraOffset.y = this.game.input.y;

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

		//Spawn enemies
		if(this.game.time.now > nextEnemy)
		{
			this.spawnEnemy();
		}

		//Check for fall
		if(player.y > this.game.world.height && fall === 0) 
		{
			fall = 1;
			this.gameOver();
		}

		//Check for 0 health
		if(player.health <= 0)
		{
			this.gameOver();
		}

		//Horizontal movement
		if(button.left.isDown)
		{

	    	player.animations.play('left');

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

	    	player.animations.play('right');

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
	    	player.frame = 4;
	    }

	    //Vertical movement
	    if((button.up.justPressed(250)) && canJump == true)
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
		else
		{
			canJump = false;
		}

		//Airborn sideways movement affected
		if(!player.body.touching.down)
		{
			player.body.drag.x = 1000 * PLAYER_SCALE;
		}
		else
		{
			player.body.drag.x = 3500 * PLAYER_SCALE;
		}

		//Mouse click
		this.game.input.onDown.add(this.fire, this);

		//enemy movement
		enemies.forEachAlive(this.flyingUpdate, this, player);

		if(wave === 0) 
		{
			wave = 1;
		}
		//Wave control
		if(kills >= 5 && wave === 1)
		{
			wave = 2;
			w.loadTexture('w2', 0);
			enemyRate = 3500;
		}
		if(kills >= 10 && wave === 2)
		{
			wave = 3;
			w.loadTexture('w3', 0);
			enemyRate = 2500;
		}
		if(kills >= 20 && wave === 3)
		{
			wave = 4;
			w.loadTexture('w4', 0);
			enemyRate = 1500;
		}
		if(kills >= 30 && wave === 4)
		{
			wave = 5;
			w.loadTexture('w5', 0);
			enemyRate = 1000;
		}
		if(kills >= 50 && wave === 5)
		{
			wave = 6;
			w.loadTexture('w6', 0);
			enemyRate = 900;
		}
		if(kills >= 65 && wave === 6)
		{
			wave = 7;
			w.loadTexture('w7', 0);
			enemyRate = 800;
		}
		if(kills >= 75 && wave === 7)
		{
			wave = 8;
			w.loadTexture('w8', 0);
			enemyRate = 700;
		}
		if(kills >= 85 && wave === 8)
		{
			wave = 9;
			w.loadTexture('w9', 0);
			enemyRate = 600;
		}
		if(kills >= 90 && wave === 9)
		{
			wave = 10;
			w.loadTexture('w10', 0);
			enemyRate = 500;
		}
		if(kills === 100 && wave === 10)
		{
			wave = 11;
			w.loadTexture('wI', 0);
			enemyRate = 250;
		}

		//Score display
		info.setText("HEALTH: " + player.health + "\nSCORE: " + kills);
	},

	fire: function() {
		if (this.game.time.now > nextFire && bullets.countDead() > 0)
	    {
	        nextFire = this.game.time.now + fireRate;
	        bullet = bullets.getFirstExists(false);
	        bullet.reset(player.x - 10, player.y - 16);
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
		nextMountain = this.game.time.now + (cloudRate-7000);
		mountain = mountains.getFirstExists(false);
		mountain.reset(2199, this.game.world.height-250, 'mountain');
		mountain.body.gravity.x = 0;
		mountain.body.velocity.x = -45 - (Math.random() * 8);
		mountainScale = ((Math.random()/2.75) + 1); 
		mountain.scale.setTo(mountainScale, mountainScale);
	},

	spawnEnemy: function() {
		nextEnemy = this.game.time.now + enemyRate;
		enemyType = Math.random();
		if(enemyType < 0.33)
		{
			straightLeft = enemies.create(player.body.x + 550, player.body.y + player.body.halfHeight - 20, 'enemy1');
			straightLeft.body.velocity.x = -260;
		}
		else if(enemyType > 0.66)
		{
			straightRight = enemies.create(player.body.x - 550, player.body.y + player.body.halfHeight - 20, 'enemy2');
			straightRight.body.velocity.x = 260;
		}
		else
		{
			if (enemyType < .44 ) {
				flying = enemies.create(player.body.x + 550, 125 + (Math.random() * 25), 'enemy3');
				flying.anchor.setTo(0.5, 0.5);
				flying.body.acceleration.x = -1000;
				flying.body.maxVelocity.x = 600;
				flying.body.drag.x = 2000;
				flying.nextShot = this.game.time.now + 3700;
			}
			if (enemyType > .55) {
				flying = enemies.create(player.body.x + 550, 125 + (Math.random() * 25), 'enemy3v2');
				flying.anchor.setTo(0.5, 0.5);
				flying.body.acceleration.x = -1000;
				flying.body.maxVelocity.x = 600;
				flying.body.drag.x = 2000;
				flying.nextShot = this.game.time.now + 3700;
			}
			else {
				flying = enemies.create(player.body.x + 550, 125 + (Math.random() * 25), 'enemy3v3');
				flying.anchor.setTo(0.5, 0.05);
				flying.body.acceleration.x = -1000;
				flying.body.maxVelocity.x = 600;
				flying.body.drag.x = 2000;
				flying.nextShot = this.game.time.now + 3700;
			}

		}
	},

	enemyHitPlayer: function(player, enemy) {
		player.body.velocity.y = -1000 * PLAYER_SCALE;
		if(enemy.body.velocity.x < 0)
		{
			player.body.velocity.x = -1000 * PLAYER_SCALE;
		}
		if(enemy.body.velocity.x > 0)
		{
			player.body.velocity.x = 1000 * PLAYER_SCALE;
		}
		enemy.kill();
		player.health -= 5;
	},

	bulletHitPlayer: function(player, bullet) {
		if(bullet.body.velocity.x < 0)
		{
			player.body.velocity.x = -1000 * PLAYER_SCALE;
		}
		if(bullet.body.velocity.x > 0)
		{
			player.body.velocity.x = 1000 * PLAYER_SCALE;
		}
		if(bullet.body.velocity.y < 0)
		{
			player.body.velocity.y = -1000 * PLAYER_SCALE;
		}
		if(bullet.body.velocity.y > 0)
		{
			player.body.velocity.y = 1000 * PLAYER_SCALE;
		}
		bullet.kill();
		player.health -= 5;
	},

	playerHitEnemy: function(bullet, enemy) {
		//25% chance to drop health
		if(Math.random() > .74)
		{
			this.spawnHealth(enemy);
		}
		enemy.kill();
		bullet.kill();
		kills += 1;
	},

	spawnHealth: function(enemy) {
		health = hp.getFirstExists(false);
		health.reset(enemy.x, enemy.y);
		health.body.velocity.y = -500;
	},

	healthPickup: function(player, health) {
		player.health += 20;
		if(player.health > 100)
		{
			player.health = 100;
		}
		health.kill();
	},

	flyingUpdate: function(enemy, player){
		if(enemy.body.y < 250)
		{
			//Change directions
			if(enemy.body.x > player.body.x)
			{
				enemy.body.acceleration.x = -1000;
			}
			else
			{
				enemy.body.acceleration.x = 1000;
			}

			//Shoot
			if(this.game.time.now > enemy.nextShot && enemyBullets.countDead() > 0)
			{
				enemy.nextShot = this.game.time.now + enemyFireRate;
		        bullet = enemyBullets.getFirstExists(false);
		        bullet.reset(enemy.x, enemy.y+21);
		        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, player, 300);
			}
		}
	},

	gameOver: function() {
		var fader = this.game.add.sprite(0, 0, 'fade');
		fader.alpha = 0;
		this.game.add.tween(fader).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		this.game.score = kills;
		kills = 0;
		fall = 0;
		this.game.state.start('Fail');
		//gameover = this.game.add.sprite(150, 130, 'gameover');
		//gameover.fixedToCamera = true;
		//this.game.input.onDown.add(this.restartGame, this);
	},

	render: function() {
		//this.game.debug.text('Score: ' + this.game.score, 100,100);
	}
};