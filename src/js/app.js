import * as PIXI from 'pixi.js'
export const shouldUseCamera = true;
export const extraDebug = false;

export const APP_WIDTH = 640;
export const APP_HEIGHT = 480;

export const app = new PIXI.Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    transparent: true,
    view: document.querySelector('#scene')
});
export default app;