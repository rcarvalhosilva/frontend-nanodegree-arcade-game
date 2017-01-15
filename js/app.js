// it sets the Y relative positioning of the sprites.
var spritesBaseY = - 41.5;
var validBlockHeight = 83;
var spriteWidth = 101;

// --------- Sprite Class ------------
// this class is used to implement the hitbox and collision system
var Sprite = function () {
    this.height = 50;
    this.width = 80;
    this.y = 0;
    this.x = 0;
};
Sprite.prototype.top = function () {
    return this.y + 50;
}
Sprite.prototype.bottom = function () {
    return this.y + this.height;
}
Sprite.prototype.left = function () {
    return this.x + 10;
}
Sprite.prototype.right = function () {
    return this.x + this.width;
}
Sprite.prototype.intersect = function(sprite) {
    return !(sprite.left() > this.right() ||
            sprite.right() < this.left() ||
            sprite.top() > this.bottom() ||
            sprite.bottom() < this.top());
}

// --------- Enemy Class ------------
var Enemy = function(lane) {
    Sprite.call(this);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = - spriteWidth; // puts the enemy outside the screen
    this.y = spritesBaseY + validBlockHeight * lane;

    var speed = Math.floor(Math.random() * 300) + 80;
    this.speed = speed;
};
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.intersect(player)) {
        console.log("colisão");
        player.reset();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// --------- Player Class ------------
var Player = function () {
    Sprite.call(this);
    this.sprite = "images/char-boy.png";
    // places the original x position on the middle of the center
    // colunm (in this case we have 5)
    this.originalX = 2 * spriteWidth;
    // set the original Y position in the middle of the top light area in the
    // ground sprite of the last row (6 total).
    this.originalY = spritesBaseY + 5 * validBlockHeight;
    this.x = this.originalX;
    this.y = this.originalY;
};

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.reset = function() {
    this.x = this.originalX;
    this.y = this.originalY;
};
Player.prototype.handleInput = function(key) {
    if (key == "up") {
        // as the spritesBaseY reference value is negative
        // while the Y position of the player is positive
        // it means that he's not in the water yet
        if (this.y - validBlockHeight >= 0) {
            this.y -= validBlockHeight;
        } else {
            // otherwise he won and we need to reset the players
            // position to the original one
            shouldRenderText = true;
            this.reset();
            setTimeout(function () {
                shouldRenderText = false;
            }, 1000);
        }
    } if (key == "left") {
        // if my next step to the left left me in a position still inside
        // the canvas keep going, otherwise stay still.
        if (this.x - spriteWidth >= 0) {
            this.x -= spriteWidth;
        }
    } if (key == "right") {
        // same logic as for the left. The x is the left of the sprite.
        if (this.x < ctx.canvas.width - spriteWidth) {
            this.x += spriteWidth;
        }
    } if (key == "down") {
        // the originalY position is in the bottom of the valid move region
        if (this.y + validBlockHeight <= this.originalY) {
            this.y += validBlockHeight;
        }
    }
};

Player.prototype.update = function() {}

// ----- Global Variables ----

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var player = new Player();

// --------- Enemy Generator Class ------------
var EnemyGenerator = function () {
    this.enemyCount = 7;
    // every sec it deploys a new enemy
    var timer = setInterval(this.deployEnemy, 1000);
};
EnemyGenerator.prototype.deployEnemy = function() {
    // selects in wich lane the enemy will be placed randomly
    var lane = Math.floor(Math.random() * 3) + 1;
    var enemy = new Enemy(lane);
    allEnemies.push(enemy);
};

// initiates enemy generator
var generator = new EnemyGenerator();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
