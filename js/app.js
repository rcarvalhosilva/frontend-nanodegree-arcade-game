// it sets the Y relative positioning of the sprites.
var spritesBaseY = - 41.5;
var validBlockHeight = 83;
var spriteWidth = 101;

// Enemies our player must avoid
var Enemy = function(lane) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // puts the enemy outside the screen
    this.x = - spriteWidth;
    this.y = spritesBaseY + validBlockHeight * lane;

    var speed = Math.floor(Math.random() * 300) + 80;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = "images/char-boy.png";
    // places the original x position on the middle of the center
    // colunm (in this case we have 5)
    this.originalX = 2 * spriteWidth;
    // set the original Y position in the middle of the top light area in the
    // ground sprite of the last row (6 total).
    this.originalY = spritesBaseY + 5 * 83;
    this.x = this.originalX;
    this.y = this.originalY;
};

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
        if (this.y - 83 >= 0) {
            this.y -= 83;
        } else {
            // otherwise he won and we need to reset the players
            // position to the original one
            this.reset();
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
        if (this.y + 83 <= this.originalY) {
            this.y += 83;
        }
    }
};
Player.prototype.update = function() {}

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var player = new Player();

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
