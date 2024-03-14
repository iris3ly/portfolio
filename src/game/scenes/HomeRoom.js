import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

let iris;
let loki;
let cursors;

export class HomeRoom extends Scene {


    constructor() {
        super('HomeRoom');
    }

    create() {

        EventBus.emit('current-scene-ready', this);
        const homeroomMap = this.make.tilemap({ key: 'tilemap' });
        const homeroomTileset = homeroomMap.addTilesetImage('Room', 'tileset');

        const camera = this.cameras.main;
        this.cameras.main.setBackgroundColor(0x000000);

        const belowLayer = homeroomMap.createLayer('Below Player', homeroomTileset, 0, 0);
        const belowLayerDecor = homeroomMap.createLayer('Below Player Decor', homeroomTileset, 0, 0);
        const worldLayer = homeroomMap.createLayer('World', homeroomTileset, 0, 0);
        const worldLayerDecor = homeroomMap.createLayer('World Decor', homeroomTileset, 0, 0);
        const aboveLayer = homeroomMap.createLayer('Above Player', homeroomTileset, 0, 0);
        const aboveLayerDecor = homeroomMap.createLayer('Above Player Decor', homeroomTileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });
        worldLayerDecor.setCollisionByProperty({ collides: true });
        aboveLayer.setCollisionByProperty({ collides: true });

        aboveLayer.setDepth(10);
        aboveLayerDecor.setDepth(11);

        const spawnPoint = homeroomMap.findObject('Objects', (obj) => obj.name === 'Spawn Point');
        const lokiSpawn = homeroomMap.findObject('Objects', (obj) => obj.name === 'Loki Spawn');

        loki = this.physics.add.sprite(lokiSpawn.x, lokiSpawn.y, 'sprites', 'loki.001')
        iris = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'sprites', 'iris-front');
        this.physics.add.collider(iris, worldLayer);
        this.physics.add.collider(iris, worldLayerDecor);
        this.physics.add.collider(iris, aboveLayer);
        this.physics.add.collider(loki, iris);

        // collision boxes
        loki.body.setSize(17, 10);
        loki.body.setOffset(8, 20);
        loki.body.immovable = true;
        iris.body.setSize(15, 14);
        iris.body.setOffset(9, 30);

        iris.setCollideWorldBounds(true);
        

        const anims = this.anims;
        anims.create({
            key: 'iris-front-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-front-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        anims.create({
            key: 'iris-back-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-back-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        anims.create({
            key: 'iris-right-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-right-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        anims.create({
            key: 'iris-left-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-left-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        anims.create({
            key: 'loki-bounce',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'loki.00', start: 2, end: 5 }),
            frameRate: 7,
            repeat: -1,
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        iris.body.setVelocity(0);
        const speed = 80;
        const prevVelocity = iris.body.velocity.clone();

        // Horizontal movement
        if (cursors.left.isDown) {
            iris.body.setVelocityX(-speed);
            iris.anims.play('iris-left-walk', true);
            return;
        }
        else if (cursors.right.isDown) {
            iris.body.setVelocityX(speed);
            iris.anims.play('iris-right-walk', true);
            return;
        }
        // Vertical movement
        if (cursors.up.isDown) {
            iris.body.setVelocityY(-speed);
            iris.anims.play('iris-back-walk', true);
            return;
        }
        else if (cursors.down.isDown) {
            iris.body.setVelocityY(speed);
            iris.anims.play('iris-front-walk', true);
            return;
        }
        else {
            iris.anims.stop();
        }

        //normalizes diag movement
        iris.body.velocity.normalize().scale(speed);

        //idle states when not moving, currently not working
        if (prevVelocity.x < 0) {
            iris.setTexture('sprites', 'iris-left');
        }
        else if (prevVelocity.x > 0) {
            iris.setTexture('sprites', 'iris-right');
        }
        else if (prevVelocity.y < 0) {
            iris.setTexture('sprites', 'iris-back');
        }
        else if (prevVelocity.y > 0) {
            iris.setTexture('sprites', 'iris-front');
        }

        if (time > 0) {
            loki.anims.play('loki-bounce', true);
        }

    }

}
