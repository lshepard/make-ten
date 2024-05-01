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
    // Load each dice image
    for (let i = 1; i <= 6; i++) {
        this.load.image('dice' + i, `dice/dice${i}.jpg`); // Make sure the path matches where you've stored the images
    }
}


var slots = [];
var dice;
var cursors;

function setDiceImage(dice, value) {
    dice.setTexture('dice' + value); // Set the texture based on the dice value
    dice.value = value; // Update the dice value property
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
            slot.sum += dice.value; // Use the stored dice value
            slot.text.setText(`Sum: ${slot.sum}`);
            dice.x = 50; // Reset position for demonstration purposes
            dice.y = 300;
            // Optionally roll a new dice on overlap
            let newDiceValue = Phaser.Math.Between(1, 6);
            setDiceImage(dice, newDiceValue);
        }
    });
}

