import * as PIXI from 'pixi.js'
export const shouldUseCamera = true;
export const extraDebug = false;

const container = document.querySelector('.container');

export const APP_WIDTH = container.clientWidth;
export const APP_HEIGHT = container.clientHeight;

export const app = new PIXI.Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    transparent: true,
    view: document.querySelector('#scene')
});
export default app;