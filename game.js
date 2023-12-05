const canvas = document.querySelector('#game')
const btnUp = document.querySelector('#up')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const btnLeft = document.querySelector('#left')
const game = canvas.getContext('2d')
const livesSpan = document.querySelector('#lives')
const timeSpan = document.querySelector('#time')
const recordSpan = document.querySelector('#record')
const resultP = document.querySelector('#result')

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;


const playerPosition = {
    x: undefined,
    y: undefined
};

const giftPosition = {
    x: undefined,
    y: undefined
};

let bombPosition = []

window.addEventListener('load',setCanvasSize)
window.addEventListener('resize',setCanvasSize)


function setCanvasSize(){

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7
    } else {
        canvasSize = window.innerHeight * 0.7
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    elementSize = (canvasSize / 10)-1

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame()
}

function startGame() {

    game.font =elementSize + 'px Verdana'
    game.textAlign = ''

    const map = maps[level];
    if (!map){
        gameWin()
        return;
    }

    if(!timeStart){
        timeStart = Date.now()
        timeInterval = setInterval(showTime,100)
        showRecord()
    }
    const mapRows = map.trim().split('\n')
    const mapRowsCols = mapRows.map(row => row.trim().split(''))

    showLives()
    
    game.clearRect(0,0,canvasSize,canvasSize)

    bombPosition = []
    
    mapRowsCols.forEach((row, rowi) => {
        row.forEach(
            (col, coli) => {
                const emoji = emojis[col]
                const posX = elementSize*coli
                const posY = elementSize*(rowi+1)
                game.fillText(emoji, posX, posY)

                if (col == 'O' && !playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX
                    playerPosition.y = posY
                } else if (col == 'I'){
                    giftPosition.x = posX.toFixed(2);
                    giftPosition.y = posY.toFixed(2);
                } else if (col == 'X'){
                    bombPosition.push({
                        x: posX.toFixed(2),
                        y: posY.toFixed(2)
                    })
                }
            }
        )
        
    });
    movePlayer()
}

function movePlayer(){
    const giftColisionX = Math.abs(playerPosition.x.toFixed(2)) == giftPosition.x;
    const giftColisionY = Math.abs(playerPosition.y.toFixed(2)) == giftPosition.y;
    const giftColision = giftColisionX && giftColisionY;
    const bombColision = bombPosition.find(bomb =>{
        const bombColisionX = bomb.x == playerPosition.x.toFixed(2);
        const bombColisionY = bomb.y == playerPosition.y.toFixed(2);
        return bombColisionX && bombColisionY
    })
    if (giftColision){
        levelWin()
    }

    game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y)

    if (bombColision){
        levelLose()
    }
}

function levelWin(){
    console.log("subes de nivel")
    level++;
    startGame()
}

function gameWin(){
    console.log("GANASTE")
    //localStorage()
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('recordTime')
    const playerTime = (Date.now() - timeStart)/1000

    if (recordTime){
        if (recordTime >= playerTime){
            localStorage.setItem('recordTime',playerTime)
            resultP.innerHTML = 'Nuevo record'
        } else {
            resultP.innerHTML = 'No superaste el record'
        }
    } else {
        localStorage.setItem('recordTime',playerTime)
        resultP.innerHTML = "Primer record"
    }
    console.log({recordTime, playerTime})
}

function levelLose(){

    lives--;

    
    if (lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined
    }
    setTimeout(() => {
        playerPosition.x = undefined,
        playerPosition.y = undefined,
        startGame()
    }, 70);
    
}

function showLives(){
    const heartArray = Array(lives).fill(emojis['HEART'])
    livesSpan.innerHTML = ''
    heartArray.forEach(heart=> livesSpan.append(heart))
    
}

function showTime() {
    timeSpan.innerHTML = (Date.now() - timeStart)/1000
}

function showRecord(){
    recordSpan.innerHTML = localStorage.getItem('recordTime')
}

btnUp.addEventListener('click', moveUp)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)
btnLeft.addEventListener('click', moveLeft)

window.addEventListener('keydown', moveByKeys)

function moveByKeys(event){
    switch (event.key){
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
    }
}

function moveUp(){
    if(playerPosition.y - elementSize*2 >= 0 ) playerPosition.y -= elementSize;
    startGame()
}
function moveRight(){
    if(playerPosition.x + elementSize * 2 < canvasSize) playerPosition.x += elementSize;
    startGame()
}
function moveDown(){
    if(playerPosition.y + elementSize < canvasSize) playerPosition.y += elementSize;
    startGame()
}
function moveLeft(){
    if(playerPosition.x - elementSize >= -1 ) playerPosition.x -= elementSize
    startGame()
}
