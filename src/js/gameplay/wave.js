import Fruit from "./fruit";
import app, {extraDebug} from "../app";
import {hitTestRectangle} from "./collision_detecror";

export default class Wave {

    constructor() {
        console.log("wawwe cones")
        this._waveSize = Math.random() * 5 + 4;
        this._active = this._waveSize;
        this._fruits = [];

        for (let i = 0; i < this._waveSize; i++) {
            const fruit = new Fruit();
            this._fruits.push(fruit);
            app.stage.addChild(fruit.sprite);
            if(extraDebug) {
                app.stage.addChild(fruit.boundaries);
            }
        }
    }

    tick() {
        for (let i = 0; i < this._fruits.length; i++) {
            let fruit = this._fruits[i];
            fruit.tick(app);
            if (fruit.sprite.y > app.screen.height) {
                fruit.visible = false;
                fruit.boundaries.visible = false;
                this._active--;
            }

        }
    }


    checkCollisions(collider) {
        let collisions = [];
        for (let i = 0; i < this._fruits.length; i++) {
            let fruit = this._fruits[i];
            const isColliding = hitTestRectangle(collider, fruit.boundaries);
            if (isColliding && fruit.sprite.visible) {
                fruit.sprite.visible = false;
                this._active--;
                collisions.push(fruit.type);
            }
        }
        return collisions;
    }

    clean() {
        for (let i = 0; i < this._fruits.length; i++) {
            app.stage.removeChild(this._fruits[i].sprite); //is .sprite.visible = false is more efficient?
            app.stage.removeChild(this._fruits[i].boundaries); //is .sprite.visible = false is more efficient?
        }
    }

    get fruits() {
        return this._fruits;
    }

    get isActive() {
        return this._active > 0
    }
}