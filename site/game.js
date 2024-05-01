var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    // Load dice images and sound
    for (let i = 1; i <= 6; i++) {
        this.load.image('dice' + i, `dice/dice${i}.jpg`);
    }
    this.load.audio('celebration', 'sound/laser.mp3');
    this.load.audio('sad', 'sound/sad.mp3');  // Ensure you have a sad sound file
}


var slots = [];
var dice;
var cursors;

function setDiceImage(dice, value) {
    dice.setTexture('dice' + value); // Set the texture based on the dice value
    dice.value = value;
}

function create () {
    // Create slots
    for (let i = 0; i < 4; i++) {
        let slot = this.add.rectangle(700, 50 + i * 110, 100, 100, 0xff0000);
        slot.sum = 0;
        slot.text = this.add.text(680, 30 + i * 110, 'Sum: 0', { fontSize: '16px', fill: '#ffffff' });
        slots.push(slot);
    }

    // Initialize the first dice
    let diceValue = Phaser.Math.Between(1, 6); // Generate a random dice value between 1 and 6
    dice = this.physics.add.sprite(50, 300, 'dice' + diceValue);
    dice.setInteractive();
    dice.setScale(0.5);
    dice.body.velocity.x = 0;
    dice.value = diceValue; // Store the value to use later if needed
     
    cursors = this.input.keyboard.createCursorKeys();

    this.celebrationSound = this.sound.add('celebration');
    this.sadSound = this.sound.add('sad');

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });    
}

function update() {
    // Check for input to move the dice
    if (cursors.left.isDown) {
        dice.x -= 5;
    } else if (cursors.right.isDown && dice.x < 640) {
        dice.x += 5;
    }

    if (cursors.up.isDown) {
        dice.y -= 5;
    } else if (cursors.down.isDown) {
        dice.y += 5;
    }

    // Example key check for rolling a new dice (use a specific key, e.g., 'R' for roll)
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        let newDiceValue = Phaser.Math.Between(1, 6); // Randomly determine dice value
        setDiceImage(dice, newDiceValue); // Set the new dice image
    }

    // Check if dice reaches the slots
    slots.forEach(slot => {
        if (Phaser.Geom.Rectangle.Overlaps(slot.getBounds(), dice.getBounds())) {
            slot.sum += dice.value;  // Assume dice.value is set when the dice sprite is initialized
            if (slot.sum === 10) {
                // Play celebration sound, update score, and reset slot
                this.celebrationSound.play();
                this.score += 10;  // Increment score
                this.scoreText.setText('Score: ' + this.score);
                slot.sum = 0;  // Reset slot sum
                slot.text.setText('Sum: 0');
                resetDice();
            } else if (slot.sum > 10) {
                // Play sad sound, reset score, and reset slot
                this.sadSound.play();
                this.score = 0;  // Reset score
                this.scoreText.setText('Score: 0');
                slot.sum = 0;  // Reset slot sum
                slot.text.setText('Sum: 0');
                resetDice();
            } else {
                // Update slot sum display
                slot.text.setText('Sum: ' + slot.sum);
                resetDice();
            }
        }
    });
}

function resetDice() {
    // Optionally roll a new dice on reset
    let newDiceValue = Phaser.Math.Between(1, 6);
    setDiceImage(dice, newDiceValue);
    dice.x = 50;  // Reset position for demonstration purposes
    dice.y = 300;
}