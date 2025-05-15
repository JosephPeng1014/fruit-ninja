import * as PIXI from 'pixi.js'
import app from "../app";

const g = 0.01;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

export default class Fruit {
    get sprite() {
        return this._sprite;
    }
    set sprite(sprite) {
        this._sprite = sprite;
    }
    get boundaries() {
        return this._boundaries;
    }
    set boundaries(boundaries) {
        this._boundaries = boundaries;
    }
    constructor() {
        const int = getRandomInt(5)
        if (int === 2) {
            this._sprite = PIXI.Sprite.from('assets/boom.png');
            this._sprite.scale.set(0.1 + Math.random() * 0.1);
            this.type = "boom"
        } else {
            this._sprite = PIXI.Sprite.from('assets/pineapple.png');
            this._sprite.scale.set(0.4 + Math.random() * 0.4);
            this.type = "pineapple"
        }
        this._velocity = 0;

        // set the anchor point so the texture is centered on the sprite
        this._sprite.anchor.set(0.5);
        // set a random scale for the dude - no point them all being the same size!
        
        // finally lets set the dude to be at a random position..
        this._sprite.x = Math.random() * app.screen.width;
        this._sprite.y = app.screen.height;

        // create some extra properties that will control movement :
        // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
        this._sprite.direction = Math.PI;
        this._sprite.rotation = 0;

        // this number will be used to modify the direction of the dude over time
        //dude.turningSpeed = Math.random() - 0.8;
        this._sprite.turningSpeed = this._sprite.x >= app.screen.width / 2 ? Math.random() * 0.2 + 0.2 : Math.random() * 0.2 - 0.2;

        // create a random speed for the dude between 2 - 4
        this._sprite.speed = 3 + Math.random() * 2;

        const rect = PIXI.Sprite.from(PIXI.Texture.WHITE);
        rect.width = this._sprite.width * 0.8;
        rect.height =  this._sprite.height * 0.8;
        rect.tint = 0xFF0000;
        rect.x = this._sprite.x - this._sprite.width / 2;
        rect.y = this._sprite.y - this._sprite.height / 2;
        this.boundaries = rect
    }

    tick() {
        // otherwise first wave boundaries are very small
        this.boundaries.width = this._sprite.width * 0.8;
        this.boundaries.height =  this._sprite.height * 0.8;

        this._velocity += Math.sin(Math.PI * 2 + g) * 2;

        this.sprite.direction += this.sprite.turningSpeed * 0.01;
        this.sprite.x += Math.sin(this.sprite.direction) * this.sprite.speed;
        this.sprite.y += Math.cos(this.sprite.direction) * (this.sprite.speed * 1.3 - this._velocity * 2);
        this.sprite.rotation = -this.sprite.direction - Math.PI / 2;

        this._boundaries.x = this._sprite.x - this._sprite.width / 2;
        this._boundaries.y = this._sprite.y - this._sprite.height / 2;
    }
}
