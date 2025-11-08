import './style.css'
import gsap from 'gsap';
let fallingtime=-1;
const gravity =0.005;
let posflapy =0;
const jump=100;
const speead=0.25;
const pipeMinSpace = 10;
const pipeMaxSpace = 30;
const pipeMinDist = 400;
const pipeMaxDist = 1000;
const planthitbox = 15;
const tuberiacontiner = document.querySelector('div[tuberia-aliner]')
const scoreElement=document.querySelector(`#score`)
const flappy=document.querySelector(`#flapy`)
const menu=document.querySelector("div.menu")
let playing=false
let score = 0;
let lastScorePipe = -1
let pipes = [];
let pipeCounter = 0;
function createPipe() {
  const plantuperpipe= Math.random() >0.6
  // Create the parent container
  const pipeSegment = document.createElement("div");
  pipeSegment.setAttribute('tuberia-container', '');
  pipeSegment.setAttribute("pipe-idx", pipeCounter);
  pipeSegment.style = `margin-left: ${pipeMinDist + Math.random() * (pipeMaxDist - pipeMinDist)}px`;

  // Create the upper pipe
  const upperPipe = document.createElement("img");
  upperPipe.classList.add("tuberia", "ariba");
  upperPipe.src = "/tuberia.png";
  const upper=100 - (pipeMinSpace + Math.random() * (pipeMaxSpace - pipeMinSpace))
  upperPipe.style = `bottom: ${upper}%`;

  // Create the lower pipe
  const lowerPipe = document.createElement("img");
  lowerPipe.classList.add("tuberia", "abajo");
  lowerPipe.src = "/tuberia.png";
  const lower=100 - (pipeMinSpace + Math.random() * (pipeMaxSpace - pipeMinSpace))
  lowerPipe.style = `top: ${lower}%`;

  // Create the plant
  const plant = document.createElement("img");
  plant.classList.add("plant");
  plant.src = "/plant.png";

  if(plantuperpipe) {
    plant.style = `bottom: ${upper}%`;
    plant.classList.add("ariba")
    gsap.fromTo(plant, {y: "0%"}, {y:"100%", repeat: -1, yoyo :true, duration: 2})
  } else {
    plant.style = `top: ${lower}%`;
gsap.fromTo(plant, {y: "0%"}, {y:"-100%", repeat: -1, yoyo :true, duration: 2})
  }
  
   

  

  //append plant
  pipeSegment.appendChild(plant)

  // Append children
  pipeSegment.appendChild(upperPipe);
  pipeSegment.appendChild(lowerPipe);

  // Append to some container in your DOM and store reference
  tuberiacontiner.appendChild(pipeSegment);
  pipes.push(pipeSegment);

  // Increment pipe counter
  pipeCounter++;

  // Return the newly created pipe segment
  return pipeSegment;
}
window. addEventListener("keydown", e => {
if (e.code=== "Space" || e.code=== "ArrowUp" )
{
    posflapy += jump;
    fallingtime =-1;
} 
})
function start(){
  playing=true
  menu.style="display:none;";
}
document . querySelector("button.but").onclick=start
// function gameOver(){

// }
const flapycontiner = document.querySelector("div.fp")
requestAnimationFrame(function update(time){
  if(playing){
    if (fallingtime == -1) fallingtime = time
    const falling = time - fallingtime;
    posflapy-= gravity * falling;
    flapycontiner.style = `transform: translateY(${-posflapy}px) ;`;
    tuberiacontiner.style = `transform: translateX(${-time*speead}px) ;`;

  }

  const lastpipe= pipes[pipes.length-1]
  if(lastpipe){
      const pipe = lastpipe.getBoundingClientRect()
      if(pipe.right<window.innerWidth)createPipe()
  } else createPipe()

// * Check flappy collisions
  // Get the bounding rect of flappy
  const flappyRect = flappy.getBoundingClientRect();

  // Bottom collision
  if (flappyRect.bottom > window.innerHeight) gameOver();

  // Top collision
  if (flappyRect.top < 0) gameOver();

  // Pipe collisions and score counting
  for (const pipe of pipes) {
    const [plant, upperPipe, lowerPipe] = pipe.children;
    
    const plantRect = plant.getBoundingClientRect();
    const upperRect = upperPipe.getBoundingClientRect();
    const lowerRect = lowerPipe.getBoundingClientRect();

    if (
      flappyRect.left < plantRect.right-planthitbox &&
      flappyRect.right > plantRect.left+planthitbox &&
      flappyRect.top < plantRect.bottom-planthitbox &&
      flappyRect.bottom > plantRect.top+planthitbox 
    ) {
      gameOver();
    }

    // Check for collision with upper pipe
    if (
      flappyRect.left < upperRect.right &&
      flappyRect.right > upperRect.left &&
      flappyRect.top < upperRect.bottom
    ) {
      gameOver();
    }

    // Check for collision with lower pipe
    if (
      flappyRect.left < lowerRect.right &&
      flappyRect.right > lowerRect.left &&
      flappyRect.bottom > lowerRect.top
    ) {
      gameOver();
    }

    // Score counting
    const pipeIdx = parseInt(pipe.getAttribute("pipe-idx"));
    if (pipeIdx > lastScorePipe && flappyRect.left > upperRect.right) {
      score++;
      lastScorePipe = pipeIdx;
      console.log("Score:", score);
      scoreElement.textContent = `Score: ${score}`;
    }
  }
  requestAnimationFrame(update);
})