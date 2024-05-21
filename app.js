document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50 
    let startPoint = 150
    let doodlerBotomSpace = startPoint
    let platfromCount = 5 
    let isGameOver = false
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = false
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBotomSpace + 'px'

    }

    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }


    function createPlatforms(){
        for(let i = 0; i < platfromCount ; i++){
            let platGap = 600 / platfromCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)

        }
    }

    function movePlatforms(){
        if(doodlerBotomSpace > 200){
            platforms.forEach(platform =>{
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)

                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })

        }

    }

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function(){
            doodlerBotomSpace += 20
            doodler.style.bottom = doodlerBotomSpace + 'px'
            if(doodlerBotomSpace > (startPoint + 200)){
                fall()
            }
        },30)
    }

    function fall(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function(){
            doodlerBotomSpace -= 5
            doodler.style.bottom = doodlerBotomSpace + 'px'
            if(doodlerBotomSpace <= 0){
                gameOver();
            }
            platforms.forEach(platform =>{
                if(
                    (doodlerBotomSpace >= platform.bottom) &&
                    (doodlerBotomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log("landed")
                    startPoint = doodlerBotomSpace
                    jump()
                }

            })
        },30)
    }

    function gameOver(){
        isGameOver = true
        console.log("game over")
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e){
        if(e.key === "ArrowLeft"){
            console.log("left")
            moveLeft()
        }
        else if(e.key === "ArrowRight"){
            moveRight()
        }
        else if(e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveRight()
        },30)     
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace +=5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveLeft()
        },30)     
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start(){
        if (!isGameOver){
            createPlatforms() 
            createDoodler() 
            movePlatforms()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',control)
        }
    }
     
    //attach to button
    start()
}) 
