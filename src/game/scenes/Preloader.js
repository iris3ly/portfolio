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
        this.scene.start('HomeRoom');
    }

}
