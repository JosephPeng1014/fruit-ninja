import app, {APP_HEIGHT, APP_WIDTH, extraDebug} from "./app";

const mpHands = window;
const drawingUtils = window;
const controls = window;
const camera = window;

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');
const config = {
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
  }
};

export const fpsControl = new controls.FPS();
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';

    // $("#start-modal").show()
};

function onResults(results) {
  // Hide the spinner.
  document.body.classList.add('loaded');

  setPosition(results);

  // Update the frame rate.
  fpsControl.tick();
}
const hands = new mpHands.Hands(config);
hands.onResults(onResults);

const POINTING_FINGER_TIP = 8;
let position = {x: 0, y: 0};
let handPositions = []

export const getLastFingerPosition = () => {
    return position;
}

export const getHandPositions = () => {
  return handPositions;
}

const setPosition = (results) => {
    if(results && results.multiHandLandmarks && results.multiHandedness) {
        const rightHandIndex = results.multiHandedness.findIndex(item => item.label === 'Right')
        if (rightHandIndex !== -1) {
          if (results.multiHandLandmarks[rightHandIndex][POINTING_FINGER_TIP]) {
            let finger = results.multiHandLandmarks[rightHandIndex][POINTING_FINGER_TIP];
            position = {x: finger.x * app.screen.width, y: finger.y * app.screen.height};
          }

          // 把右手的全部節點加入handPositions
          handPositions = results.multiHandLandmarks[rightHandIndex]

        } else if (results.multiHandLandmarks.length) {
          // // æ¾ä¸å°å³æ
          // if (results.multiHandLandmarks[0][POINTING_FINGER_TIP]) {
          //   let finger = results.multiHandLandmarks[0][POINTING_FINGER_TIP];
          //   position = {x: finger.x * app.screen.width, y: finger.y * app.screen.height};
          // }

          handPositions = []
        }
    }
}
/**
 * Instantiate a camera. We'll feed each frame we receive into the solution.
 */
const c = new camera.Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: APP_WIDTH,
  height: APP_HEIGHT
});
c.start();

// Present a control panel through which the user can manipulate the solution
// options.
new controls.ControlPanel(controlsElement, {
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
})
    .add([
      fpsControl
    ])
    .on(options => {
      videoElement.classList.toggle('selfie', options.selfieMode);
      hands.setOptions(options);
    })