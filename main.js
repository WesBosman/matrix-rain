import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const letterSize = 20;
const numRows = Math.ceil(canvas.width / letterSize);

const text =
  '我你不abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const textArray = text.split('');

let lanes = [];
let voidLanes = [];

const numberInRange = (min, max) => {
  return Math.ceil(Math.random() * (max - min) + min);
};

const clearCanvas = () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawText = (text, x, y, a) => {
  ctx.fillStyle = `rgba(0,255,65,${a})`;
  ctx.font = letterSize + 'px monospace';
  ctx.fillText(text, x, y);
};

const updateRandomLetters = () => {
  let randLength = numberInRange(12, 20);
  let randLetters = [];

  for (let k = 0; k < randLength; k++) {
    let l = textArray[Math.floor(Math.random() * (textArray.length - 1))];
    randLetters.push(l);
  }

  return randLetters;
};

const updateRandomAlphas = (letters) => {
  let alphas = [];
  let alphaStart = Math.random();

  for (let i = 0; i < letters.length; i++) {
    if (alphaStart > 1.5) {
      alphaStart = 0;
    }
    alphas.push(alphaStart);
    alphaStart += 0.15;
  }

  return alphas;
};

// A lane is a column of strings stacked on top of each other
// with the alpha values increasing as the you get the the letter
// closest to the bottom of the screen
const lane = (x, y, ls) => {
  // Create alpha values based on the position of the letter
  let alphas = updateRandomAlphas(ls);

  return {
    x: x,
    y: y,
    letters: ls,
    speed: numberInRange(3, 8),
    update: function () {
      // Start all the lanes off screen
      let startY = this.y - this.letters.length * letterSize;

      for (let i = 0; i < this.letters.length; i++) {
        let l = this.letters[i];
        let y = startY + letterSize * i;
        let a = alphas[i];

        // Change to a random letter
        if (Math.random() > 0.95) {
          l = textArray[Math.floor(Math.random() * (textArray.length - 1))];
          this.letters[i] = l;
        }
        drawText(l, this.x, y, a);
      }

      // If the entire string of letters goes off canvas remove it
      if (
        this.y - this.letters.length * letterSize >
        canvas.height + letterSize
      ) {
        this.y = -letterSize;

        // Update the letters in the lane
        this.letters = updateRandomLetters();

        // Update their alphas
        alphas = updateRandomAlphas(this.letters);
      }

      this.y += this.speed;
    },
  };
};

// Create columns of blank space so lanes aren't so close together
const updateVoidLanes = () => {
  voidLanes = [];

  const randVoidLanes = numberInRange(5, 9);

  for (let i = 0; i < randVoidLanes; i++) {
    const voidLane = Math.ceil(Math.random() * lanes.length);
    voidLanes.push(voidLane);
  }
};

const init = () => {
  for (let i = 0; i < numRows; i++) {
    let x = i * letterSize;
    let y = Math.ceil(Math.random() * 10 * letterSize);
    let randLetters = updateRandomLetters();

    lanes.push(lane(x, y, randLetters));
  }

  updateVoidLanes();
};

const draw = () => {
  clearCanvas();

  ctx.save();

  ctx.fillStyle = '#0D0208';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < lanes.length; i++) {
    if (voidLanes.indexOf(i) !== -1) {
      continue;
    }
    let lane = lanes[i];
    lane.update();
  }

  ctx.restore();

  window.requestAnimationFrame(draw);
};

// Call the init function to start everything off
init();

window.requestAnimationFrame(draw);
