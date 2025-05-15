import * as PIXI from 'pixi.js'
import app from "../app";

class Interface {

    set score(score) {
        this._score = score;
    }
    get score() {
        return this._score;
    }

    set booms(boom) {
        this._booms = boom;
    }
    get booms() {
        return this._booms;
    }

    get scoreText() {
        return this._scoreText;
    }

    constructor() {
        this._score = 0;
        this._scoreText = new PIXI.Text(this.getScoreTextValue(),{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
        this._scoreText.y = 24
        this._scoreText.x = 10

        this._booms = 0;

        let bg = PIXI.Sprite.from('assets/frame.png');
        bg.scale.set(0.08);
        app.stage.addChild(bg);
        this.bg = bg

        let heart1 = PIXI.Sprite.from('assets/heart.png');
        heart1.scale.set(0.08);
        heart1.x = 500
        heart1.y = 10
        app.stage.addChild(heart1);
        this.heart1 = heart1

        let heart2 = PIXI.Sprite.from('assets/heart.png');
        heart2.scale.set(0.08);
        heart2.x = 544
        heart2.y = 10
        app.stage.addChild(heart2);
        this.heart2 = heart2

        let heart3 = PIXI.Sprite.from('assets/heart.png');
        heart3.scale.set(0.08);
        heart3.x = 588
        heart3.y = 10
        app.stage.addChild(heart3);
        this.heart3 = heart3

        let noheart1 = PIXI.Sprite.from('assets/noheart.png');
        noheart1.scale.set(0.08);
        noheart1.x = 500
        noheart1.y = 16
        noheart1.visible = false
        app.stage.addChild(noheart1);
        this.noheart1 = noheart1

        let noheart2 = PIXI.Sprite.from('assets/noheart.png');
        noheart2.scale.set(0.08);
        noheart2.x = 544
        noheart2.y = 16
        noheart2.visible = false
        app.stage.addChild(noheart2);
        this.noheart2 = noheart2

        let noheart3 = PIXI.Sprite.from('assets/noheart.png');
        noheart3.scale.set(0.08);
        noheart3.x = 588
        noheart3.y = 16
        noheart3.visible = false
        app.stage.addChild(noheart3);
        this.noheart3 = noheart3
    }

    getScoreTextValue() {
        return 'Score: ' + this.score;
    }

    tick() {
        this._scoreText.text = this.getScoreTextValue();
        if (this._booms === 1) {
            this.noheart1.visible = true
        } else if (this._booms === 2) {
            this.noheart1.visible = true
            this.noheart2.visible = true
        } else if (this._booms > 2) {
            this.noheart1.visible = true
            this.noheart2.visible = true
            this.noheart3.visible = true
        }
    }
}

export default function initInterface() {
    let userInterface = new Interface();
    app.stage.addChild(userInterface.scoreText);

    userInterface.scoreText.visible = false
    userInterface.bg.visible = false
    userInterface.heart1.visible = false
    userInterface.heart2.visible = false
    userInterface.heart3.visible = false
    userInterface.noheart1.visible = false
    userInterface.noheart2.visible = false
    userInterface.noheart3.visible = false
    userInterface.score = 0
    userInterface.booms = 0

    return userInterface;
}
