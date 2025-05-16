// Get the texture for rope.
import * as PIXI from 'pixi.js'
import { APP_WIDTH, APP_HEIGHT, app } from './app';

const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const trailTexture = PIXI.Texture.from('/assets/trail.png');

// historySize determines how long the trail will be.
const historySize = 10;
// ropeSize determines how smooth the trail will be.
const ropeSize = 100;

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

// 創建離屏渲染紋理
const offscreenTexture = PIXI.RenderTexture.create({
    width: APP_WIDTH,
    height: APP_HEIGHT
});

// 創建離屏容器
const offscreenContainer = new PIXI.Container();

// 創建精靈來顯示離屏內容
const offscreenSprite = new PIXI.Sprite(offscreenTexture);
app.stage.addChild(offscreenSprite);

// 保存手部繪製的圖形
let rightConnectors = new PIXI.Graphics();
let leftConnectors = new PIXI.Graphics();
let rightLandmarks = new PIXI.Graphics();
let leftLandmarks = new PIXI.Graphics();

// 初始化時添加到容器
offscreenContainer.addChild(rightConnectors);
offscreenContainer.addChild(leftConnectors);
offscreenContainer.addChild(rightLandmarks);
offscreenContainer.addChild(leftLandmarks);

// 保存 rope 對象
let rightRope;
let leftRope;

export function initRope() {
    // Create the rope
    rightRope = new PIXI.SimpleRope(trailTexture, rightPoints);
    rightRope.blendmode = PIXI.BLEND_MODES.ADD;
    offscreenContainer.addChild(rightRope);

    leftRope = new PIXI.SimpleRope(trailTexture, leftPoints);
    leftRope.blendmode = PIXI.BLEND_MODES.ADD;
    offscreenContainer.addChild(leftRope);
}

export function mouseTick(mousePosition, side='right') {
    const historyX = side === 'right' ? rightHistoryX : leftHistoryX;
    const historyY = side === 'right' ? rightHistoryY : leftHistoryY;
    const points = side === 'right' ? rightPoints : leftPoints;

    const positionX = mousePosition.x / app.screen.width * APP_WIDTH;
    const positionY = mousePosition.y / app.screen.height * APP_HEIGHT;

    // Update the mouse values to history
    historyX.pop();
    historyX.unshift(positionX);
    historyY.pop();
    historyY.unshift(positionY);

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
    const video = document.getElementsByClassName('input_video')[0];
    const videoRect = video.getBoundingClientRect();
    
    // 設置輸出 canvas 的尺寸與視頻的實際顯示尺寸相同
    app.renderer.resize(videoRect.width, videoRect.height);
    
    // 只清除手部繪製的內容
    rightConnectors.clear();
    leftConnectors.clear();
    rightLandmarks.clear();
    leftLandmarks.clear();
    
    // 繪製右手連接線
    rightConnectors.lineStyle(1, 0x00FF00);
    if (handPositions.right && handPositions.right.length > 0) {
        for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
            const [start, end] = HAND_CONNECTIONS[i];
            const startPoint = handPositions.right[start];
            const endPoint = handPositions.right[end];
            
            if (startPoint && endPoint) {
                rightConnectors.moveTo(startPoint.x * APP_WIDTH, startPoint.y * APP_HEIGHT);
                rightConnectors.lineTo(endPoint.x * APP_WIDTH, endPoint.y * APP_HEIGHT);
            }
        }
    }
    
    // 繪製左手連接線
    leftConnectors.lineStyle(1, 0x00FF00);
    if (handPositions.left && handPositions.left.length > 0) {
        for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
            const [start, end] = HAND_CONNECTIONS[i];
            const startPoint = handPositions.left[start];
            const endPoint = handPositions.left[end];
            
            if (startPoint && endPoint) {
                leftConnectors.moveTo(startPoint.x * APP_WIDTH, startPoint.y * APP_HEIGHT);
                leftConnectors.lineTo(endPoint.x * APP_WIDTH, endPoint.y * APP_HEIGHT);
            }
        }
    }
    
    // 繪製右手關鍵點
    rightLandmarks.beginFill(0x0000FF);
    if (handPositions.right && handPositions.right.length > 0) {
        handPositions.right.forEach(point => {
            if (point) {
                rightLandmarks.drawCircle(
                    point.x * APP_WIDTH,
                    point.y * APP_HEIGHT,
                    2
                );
            }
        });
    }
    rightLandmarks.endFill();
    
    // 繪製左手關鍵點
    leftLandmarks.beginFill(0x0000FF);
    if (handPositions.left && handPositions.left.length > 0) {
        handPositions.left.forEach(point => {
            if (point) {
                leftLandmarks.drawCircle(
                    point.x * APP_WIDTH,
                    point.y * APP_HEIGHT,
                    2
                );
            }
        });
    }
    leftLandmarks.endFill();
    
    // 渲染離屏容器到紋理
    app.renderer.render(offscreenContainer, offscreenTexture);
    
    // 計算縮放比例
    const scaleX = videoRect.width / APP_WIDTH;
    const scaleY = videoRect.height / APP_HEIGHT;
    const scale = Math.max(scaleX, scaleY);
    
    // 計算裁剪區域
    const scaledWidth = APP_WIDTH * scale;
    const scaledHeight = APP_HEIGHT * scale;
    const offsetX = (videoRect.width - scaledWidth) / 2;
    const offsetY = (videoRect.height - scaledHeight) / 2;
    
    // 設置精靈的位置和縮放
    offscreenSprite.x = offsetX;
    offscreenSprite.y = offsetY;
    offscreenSprite.width = scaledWidth;
    offscreenSprite.height = scaledHeight;
}

function resetCanvasSize() {
    const video = document.getElementsByClassName('input_video')[0];
    const videoRect = video.getBoundingClientRect();
    
    // 設置畫布尺寸與視頻的實際顯示尺寸相同
    canvasElement.width = videoRect.width;
    canvasElement.height = videoRect.height;
}

// 初始化
resetCanvasSize();