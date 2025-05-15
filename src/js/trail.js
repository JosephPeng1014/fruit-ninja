// Get the texture for rope.
import * as PIXI from 'pixi.js'

const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const trailTexture = PIXI.Texture.from('/assets/trail.png');

// historySize determines how long the trail will be.
const historySize = 10;
// ropeSize determines how smooth the trail will be.
const ropeSize = 5;

const rightHistoryX = new Array(historySize).fill(0);
const rightHistoryY = new Array(historySize).fill(0);
const leftHistoryX = new Array(historySize).fill(0);
const leftHistoryY = new Array(historySize).fill(0);

const rightPoints = [];
const leftPoints = [];

// Create rope points.
for (let i = 0; i < ropeSize; i++) {
    rightPoints.push(new PIXI.Point(0, 0));
    leftPoints.push(new PIXI.Point(0, 0));
}

export function initRope(app) {
    // Create the rope
    let rightRope = new PIXI.SimpleRope(trailTexture, rightPoints);
    // Set the blendmode
    rightRope.blendmode = PIXI.BLEND_MODES.ADD;
    app.stage.addChild(rightRope);

    let leftRope = new PIXI.SimpleRope(trailTexture, leftPoints);
    leftRope.blendmode = PIXI.BLEND_MODES.ADD;
    app.stage.addChild(leftRope);
}

export function mouseTick(app, mousePosition, side='right') {
    const historyX = side === 'right' ? rightHistoryX : leftHistoryX;
    const historyY = side === 'right' ? rightHistoryY : leftHistoryY;
    const points = side === 'right' ? rightPoints : leftPoints;

    // Update the mouse values to history
    historyX.pop();
    historyX.unshift(mousePosition.x);
    historyY.pop();
    historyY.unshift(mousePosition.y);

    // Update the points to correspond with history.
    for (let i = 0; i < ropeSize; i++) {
        const p = points[i];

        // Smooth the curve with cubic interpolation to prevent sharp edges.
        const ix = cubicInterpolation(historyX, i / ropeSize * historySize);
        const iy = cubicInterpolation(historyY, i / ropeSize * historySize);

        p.x = ix;
        p.y = iy;
    }
}


/**
 * Cubic interpolation based on https://github.com/osuushi/Smooth.js
 */
function clipInput(k, arr) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
}

function getTangent(k, factor, array) {
    return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor) {
    if (tangentFactor == null) tangentFactor = 1;

    const k = Math.floor(t);
    const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}


export function drawHandPoints(handPositions) {
    const {right, left} = handPositions

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    drawConnectors(
        canvasCtx,
        handPositions.right,
        HAND_CONNECTIONS,
        {color:'#00FF00', lineWidth: 1}
    )

    drawConnectors(
        canvasCtx,
        handPositions.left,
        HAND_CONNECTIONS,
        {color:'#00FF00', lineWidth: 1}
    )

    drawLandmarks(
        canvasCtx,
        handPositions.right,
        {color:'#FF0000', fillColor:'#FF0000', radius: 0.1}
    )
    drawLandmarks(
        canvasCtx,
        handPositions.left,
        {color:'#FF0000', fillColor:'#FF0000', radius: 0.1}
    )
}