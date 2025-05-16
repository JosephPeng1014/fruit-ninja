import {app, shouldUseCamera} from "./app";
import {initRope, mouseTick, drawHandPoints} from "./trail";
import {getLastFingerPosition, getHandPositions} from "./camera_input";
import getFruitWave from "./gameplay/fruits";
import initInterface from "./gameplay/interface";
import { bg, win, click4, click5 } from "./sound"

bg.once("load", function() {
  bg.play()
});

const userInterface = initInterface();

initRope();

function getMousePosition() {
  const mouse = shouldUseCamera ? getLastFingerPosition() : app.renderer.plugins.interaction.mouse.global;
  return {
    right: {x: mouse.right.x, y: mouse.right.y},
    left: {x: mouse.left.x, y: mouse.left.y}
  }
}

function getDrawHandPositions() {
  return shouldUseCamera ? getHandPositions() : {right: [], left: []};
}

let gameover = true
let isWin = false
let soundPlayed = false // sound played
let startShowed = true

app.ticker.add((delta) => {
  // main game loop
  const handPositions = getDrawHandPositions();
  drawHandPoints(handPositions)

  const mousePosition = getMousePosition();
  mouseTick(mousePosition.right, 'right');
  mouseTick(mousePosition.left, 'left');
  
  const fruitWave = getFruitWave();
  fruitWave.tick();
  let collisions = [
    ...fruitWave.checkCollisions({...mousePosition.right, height: 1, width: 1}),
    ...fruitWave.checkCollisions({...mousePosition.left, height: 1, width: 1})
  ];

  const plusScore = collisions.filter(type => type === "pineapple").length
  const plusBooms = collisions.filter(type => type === "boom").length ? 1 : 0
  if (plusScore) {
    click4.play()
  }

  if (plusBooms) {
    click5.play()
  }

  if (!gameover) {
    userInterface.score += plusScore;
    userInterface.booms += plusBooms;

    userInterface.tick();
    if (userInterface.score >= 30) {
      gameover = true
      isWin = true
      // soundPlayed = false
      endGame()
    }
    if (userInterface.booms >= 3) {
      gameover = true
      isWin = false
      // soundPlayed = false
      endGame()
    }
  } else {
    // if (isWin && !soundPlayed) {
    //   soundPlayed = true
    //   win.play()
    // }
  }
});

let count = 30
let timer

$(document).on('keypress',function(e) {
  if(e.which == 13) {
    if (!startShowed) {
      $("#start-modal").show()
      startShowed = true

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

      gameover = true;
      isWin = false
      // soundPlayed = false

      count = 30
      clearInterval(timer)
      $("#counter-modal").hide()

      $("#win-modal").hide()
      $("#lose-modal").hide()

      return
    }

    console.log("reset!!!")
    userInterface.scoreText.visible = true
    userInterface.bg.visible = true
    userInterface.heart1.visible = true
    userInterface.heart2.visible = true
    userInterface.heart3.visible = true
    userInterface.noheart1.visible = false
    userInterface.noheart2.visible = false
    userInterface.noheart3.visible = false
    userInterface.score = 0
    userInterface.booms = 0

    gameover = false;
    isWin = false
    // soundPlayed = false

    $("#start-modal").hide()
    startShowed = false

    $("#win-modal").hide()
    $("#lose-modal").hide()

    count = 30
    $("#counter-modal").show()
    $("#counter-modal").text(count)
    clearInterval(timer)
    timer = setInterval(() => {
      count--;
      $("#counter-modal").text(count)
      if (count <= 0) {
        gameover = true
        isWin = false
        endGame()
      }
    }, 1000);
  }
});

function endGame () {
  clearInterval(timer)

  gameover = true;

  $("#start-modal").hide()
  $("#counter-modal").hide()

  if (isWin) {
    win.play()
    $("#win-modal").show()
  } else {
    $("#lose-modal").show()
  }
}