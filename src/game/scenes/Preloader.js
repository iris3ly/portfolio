import { Scene } from 'phaser';
import homeRoom from '../assets/tilemaps/home-page-room.json';
import homeTileset from '../assets/tilesets/Room.png';
import spriteSheet from '../assets/sprites/sprite-sheet.png';
import spriteJSON from '../assets/sprites/sprite-sheet.json';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.load.tilemapTiledJSON('tilemap', homeRoom);
        this.load.image('tileset', homeTileset);
        this.load.atlas('sprites', spriteSheet, spriteJSON);
    }

    create ()
    {
        this.anims.create({
        key: 'iris-front-walk',
        frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-front-walk.00', start: 1, end: 4 }),
        frameRate: 7,
        repeat: -1,
        });
        this.anims.create({
            key: 'iris-back-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-back-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: 'iris-right-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-right-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: 'iris-left-walk',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'iris-left-walk.00', start: 1, end: 4 }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: 'loki-bounce',
            frames: this.anims.generateFrameNames('sprites', { prefix: 'loki.00', start: 2, end: 5 }),
            frameRate: 7,
            repeat: -1,
        });

        // const temp = this.add.sprite(0, 0, 'sprites', 'iris-front');
        // temp.setVisible(false);
        // this.textures.get('sprites').getFrameNames().forEach(frame => {
        //     this.textures.get('sprites').get(frame);
        // });
        // temp.destroy();

        this.scene.start('HomeRoom');
    }
}
