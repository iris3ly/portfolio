import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

let iris;
let loki;
let cursors;

export class HomeRoom extends Scene {
    constructor() {
        super('HomeRoom');
        this.aboutInZone = false;
        this.projectsInZone = false;
        this.lastDirection = 'down';
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
        const objectsLayer = homeroomMap.getObjectLayer('Objects');
        console.log('Objects Layer:', objectsLayer);

        worldLayer.setCollisionByProperty({ collides: true });

        aboveLayer.setDepth(10);
        aboveLayerDecor.setDepth(11);

        const spawnPoint = homeroomMap.findObject('Objects', (obj) => obj.name === 'Spawn Point');
        const lokiSpawn = homeroomMap.findObject('Objects', (obj) => obj.name === 'Loki Spawn');

        loki = this.physics.add.sprite(lokiSpawn.x, lokiSpawn.y, 'sprites', 'loki.001')
        iris = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'sprites', 'iris-front');
        
        this.physics.add.collider(iris, worldLayer);
        this.physics.add.collider(iris, aboveLayer);
        this.physics.add.collider(loki, iris);

        const aboutData = homeroomMap.findObject('Objects', obj => obj.name === 'About Collider');
        // console.log('About Collider:', aboutData);
        this.aboutCollider = this.add.zone(aboutData.x, aboutData.y, aboutData.width, aboutData.height).setOrigin(0, 0);
        this.physics.add.existing(this.aboutCollider);
        this.aboutCollider.body.setAllowGravity(false);
        this.aboutCollider.body.setImmovable(true);

        const projectsData = homeroomMap.findObject('Objects', obj => obj.name === 'Projects Collider');
        // console.log('Projects Collider:', projectsData);
        this.projectsCollider = this.add.zone(projectsData.x, projectsData.y, projectsData.width, projectsData.height).setOrigin(0, 0);
        this.physics.add.existing(this.projectsCollider);
        this.projectsCollider.body.setAllowGravity(false);
        this.projectsCollider.body.setImmovable(true);

        objectsLayer.objects.forEach(obj => {
            // console.log('Object details:', obj);
            if (obj.name === 'Decor') {
                const zone = this.add.zone(obj.x, obj.y, obj.width, obj.height).setOrigin(0, 0);
                this.physics.add.existing(zone);
                zone.body.setAllowGravity(false);
                zone.body.setImmovable(true);

                this.physics.add.collider(iris, zone);
                // console.log('Decor added:', obj);
            }
        });

        // collision boxes
        iris.setCollideWorldBounds(true);
        iris.body.setSize(15, 15).setOffset(9, 31);
        loki.body.setSize(17, 10).setOffset(8, 20).setImmovable(true);

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.step(0);
    }

    update(time, delta) {
        iris.body.setVelocity(0);
        const speed = 120;
        let moving = false;

        // Horizontal movement
        if (cursors.left.isDown) {
            iris.body.setVelocityX(-speed);
            iris.anims.play('iris-left-walk', true);
            this.lastDirection = 'left';
            moving = true;
            return;
        }
        else if (cursors.right.isDown) {
            iris.body.setVelocityX(speed);
            iris.anims.play('iris-right-walk', true);
            this.lastDirection = 'right';
            moving = true;
            return;
        }
        // Vertical movement
        if (cursors.up.isDown) {
            iris.body.setVelocityY(-speed);
            iris.anims.play('iris-back-walk', true);
            this.lastDirection = 'up';
            moving = true;
            return;
        }
        else if (cursors.down.isDown) {
            iris.body.setVelocityY(speed);
            iris.anims.play('iris-front-walk', true);
            this.lastDirection = 'down';
            moving = true;
            return;
        }
        // else {
        //     iris.anims.stop();
        // }

        //normalizes diag movement
        iris.body.velocity.normalize().scale(speed);

        //idle states when not moving, currently not working

        if (!moving) {
            iris.anims.stop()
            
            if (this.lastDirection === 'down') {
                // console.log("idle down");
                iris.setTexture('sprites', 'iris-front');
            }
            else if (this.lastDirection === 'up') {
                // console.log("idle up");
                iris.setTexture('sprites', 'iris-back');
            }
            else if (this.lastDirection === 'left') {
                // console.log("idle left");
                iris.setTexture('sprites', 'iris-left');
            }
            else if (this.lastDirection === 'right') {
                // console.log("idle right");
                iris.setTexture('sprites', 'iris-right');
            }
        }


        // }
        // if (prevVelocity.x < 0) {
        //     console.log("idle left");
        //     iris.setTexture('sprites', 'iris-left');
        // }
        // else if (prevVelocity.x > 0) {
        //     console.log("idle right");
        //     iris.setTexture('sprites', 'iris-right');
        // }
        // else if (prevVelocity.y < 0) {
        //     console.log("idle up");
        //     iris.setTexture('sprites', 'iris-back');
        // }
        // else if (prevVelocity.y > 0) {
        //     console.log("idle down");
        //     iris.setTexture('sprites', 'iris-front');
        // }

        if (time > 0) {
            loki.anims.play('loki-bounce', true);
        }

        // about collider event handling

        if (this.physics.overlap(iris, this.aboutCollider)) {
            if (!this.aboutInZone) {
                this.aboutInZone = true;
                console.log('About entered');
                EventBus.emit('navigate', { route: '/about' });
            }
        } else {
            this.aboutInZone = false;
        }

        // projects collider event handling
        if (this.physics.overlap(iris, this.projectsCollider)) {
            if (!this.projectsInZone) {
                this.projectsInZone = true;
                console.log('Projects entered');
                EventBus.emit('navigate', { route: '/projects' });
            }
        } else {
            this.projectsInZone = false;
        }


    }

}
