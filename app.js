//create loading message while assets are downloading
const loadmsg = document.getElementById("loadMsg");
let loadIncrement = 0;
const loadInterval = setInterval(()=>{
    if(loadIncrement != 3){
      loadMsg.innerHTML += ".";
      loadIncrement++;
    } else {
      loadMsg.innerHTML = "Loading Assets";
      loadIncrement = 0;
    }
  },500);

window.addEventListener('load', function () {
  //clear loading message
  clearInterval(loadInterval);
  loadMsg.style = "display:none;";
  
  //load canvas
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext('2d');
  let canvasPosition = canvas.getBoundingClientRect();
  
  //set origin to lower left corner
  ctx.translate(0, canvas.height);
  ctx.scale(1,-1);

  //add audio effects
  var pew = new Audio('https://drive.google.com/uc?id=1s0ATFaXqqMNtK65DsmlxCvAw9TCXGwj0&export=download');
  var bang = new Audio('https://drive.google.com/uc?id=1V7Q6v6ZijbTZX3Lj3Uz26dERtGktyUo7&export=download');
  pew.load();
  pew.volume = 0.4;
  bang.load();
  bang.volume = 0.5;
  
  //load Images
  const boom = document.getElementById("boom");

  class Grid{  
    constructor(){
      this.blockWidth = canvas.width/10;
      this.blockHeight = canvas.height/10;
    }

    render(){    
      ctx.beginPath();

      //Draw 10x10 grid
      for(let i=0; i<=10; i++){
        let posx = i*this.blockWidth;      
        let posy = i*this.blockHeight;

        ctx.moveTo(posx,0);
        ctx.lineTo(posx, canvas.height);

        ctx.moveTo(0,posy);
        ctx.lineTo(canvas.width, posy);
      }

      ctx.closePath();
      //draw lines
      ctx.stroke();
    }  
  }
  class Player{
    constructor(grid,dir='down'){
      this.xunits = canvas.width/40;
      this.yunits = canvas.height/40;
      this.x = canvas.width/40;
      this.y = canvas.height/40;
      this.width = canvas.width/20;
      this.height = canvas.height/20;
      this.dir = dir;
      this.grid = grid;
      this.firedProj = false;

    }

    render(){
      // Draw player according to direction
      ctx.beginPath();

      if(this.dir=='up'){
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.xunits, this.y + this.yunits);
        ctx.lineTo(this.x + this.xunits*2, this.y);
        ctx.lineTo(this.x + this.xunits, this.y + this.yunits*2);
      } else if(this.dir=='down'){
        ctx.moveTo(this.x, this.y + this.yunits*1.5);
        ctx.lineTo(this.x + this.xunits, this.y - this.yunits/2);
        ctx.lineTo(this.x + this.xunits*2, this.y + this.yunits*1.5);
        ctx.lineTo(this.x + this.xunits, this.y + this.yunits/2);
      } else if(this.dir=='right'){
        ctx.moveTo(this.x + this.xunits, this.y - this.yunits);
        ctx.lineTo(this.x + this.xunits*2, this.y + this.yunits);
        ctx.lineTo(this.x + this.xunits, this.y + this.yunits*3);
        ctx.lineTo(this.x + this.xunits*1.5, this.y + this.yunits);
      } else if(this.dir=='left'){
        ctx.moveTo(this.x + this.xunits, this.y - this.yunits);
        ctx.lineTo(this.x - this.xunits/4, this.y + this.yunits);
        ctx.lineTo(this.x + this.xunits, this.y + this.yunits*3);
        ctx.lineTo(this.x + this.xunits/6, this.y + this.yunits);
      }

      ctx.closePath();
      ctx.fill();   
    }

    clear(){
      //clear rect that player occupies
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.grid.render();
    }

    move(dir){    
      this.clear();

      if(dir==='down'){      
        //move up if y value will be above 0
        if(this.y-(canvas.height/10)<0){
          alert('cant move further down');
        } else {
          this.y -= canvas.height/10;
        }
      } else if (dir==='up'){
        //move down if y value will be less than view height
        if(this.y+(canvas.height/10)>canvas.height){
          alert('cant move further up');
        } else {
          this.y += canvas.height/10;        
        }
      } else if (dir==='left'){
        //move left if x value will be above 0
        if(this.x-(canvas.width/10)<0){
          alert('cant move further left');
        } else {
          this.x -= canvas.width/10;       
        }      
      } else if (dir==='right'){
        //move down if x value will be less than view width
        if(this.x+(canvas.width/10)>canvas.width){
          alert('cant move further right');
        } else {
          this.x += canvas.width/10;    
        }    
      }

      this.dir = dir;        
      this.render();
    }
  }
  class Projectile{
    constructor(x,y,height,width,velocity,dir,player,active=false){
        this.x = x-(width/2)+(player.width/2);
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        //direction
        this.dir = dir;
        this.player = player;
        this.active = active;
      }

    render(){    
      //render projectile object
      ctx.fillStyle = "#000000";
      this.active = true;

      //draw projectile according to player orientation
      if(this.dir=="up"||this.dir=="down"){
        ctx.fillRect(this.x, this.y, this.width, this.height);   
      } else {
        ctx.fillRect(this.x+0, this.y+(this.player.height/4), this.height, this.width);  
      }
    }

    clear(){
      //clear rect that player occupies
      ctx.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
    }

    update(){

      //check for border collision
      if(
        this.y + this.height <= canvas.height &&
        this.y >= 0 &&
        this.x + this.width <= canvas.width &&
        this.x >= 0
      ){
        if(this.dir==='left'){
          this.x-=this.velocity;
        }

        if(this.dir==='right'){
          this.x+=this.velocity;
        } 

        if(this.dir==='down'){
          this.y-=this.velocity;
        }

        if(this.dir==='up'){
          this.y+=this.velocity;
        }

      }else{
        this.dir = null;
        this.active = false;
      }
    }
  }
  class Explosion{
    constructor(x,y,boom, active){
      this.x = x - 25;
      this.y = y - (179/8);
      this.spriteWidth = 200;
      this.spriteHeight = 179;
      this.width = this.spriteWidth/4;
      this.height = this.spriteHeight/4;
      this.image = boom;
      this.frame = 0;
      this.timer = 0;
      this.active = active;
    }
    
    update(){
      this.timer++;
      if(this.timer % 10 === 0){
        this.frame++;
      }
    }
    
    render(){
      ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
      
      if(this.frame>4){
        this.active = false;        
        this.frame = 0;
        this.timer = 0;
      }
    }
  }

  //instantiate grid 
  const grid = new Grid();
  grid.render();

  //render player at origin
  const player = new Player(grid,'up');
  player.render();

  //listen for button press and start action
  window.addEventListener("keydown",({code})=>{

    if(code==='KeyD'||code==='ArrowRight'){
      player.move('right');
    }

    if(code==='KeyA'||code==='ArrowLeft'){
      player.move('left');
    }

    if(code==='KeyW'||code==='ArrowUp'){
      player.move('up');
    }

    if(code==='KeyS'||code==='ArrowDown'){
      player.move('down');
    }

    if(code==='KeyF'){

      if(!player.firedProj){
        let projectile = new Projectile(player.x,player.y,10,3,4,player.dir,player);
      projectile.render();
        pew.currentTime = 0;
        pew.play();

      //keeps on running
      let animateProjectile = () => {	
        if(projectile.active){
          player.firedProj = true;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          window.requestAnimationFrame(animateProjectile);
          projectile.render();
          projectile.update();
          grid.render();
          player.render();
        }else{
          let test = new Explosion(projectile.x,projectile.y, boom, true);
          
          bang.currentTime = 0;
          bang.play();          
          ctx.clearRect(0, 0, canvas.width, canvas.height); 
          
          function animateExplosion(){

            if(test.active){
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              test.update();
              test.render();
              player.render();
              grid.render();
              requestAnimationFrame(animateExplosion);
            } else {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              console.log('end of explosion animation');

              player.render();
              grid.render();
            }
          }          
          animateExplosion();
          
          grid.render();
          player.render();
          console.log('End of projectile animation');
          player.firedProj = false;
        }
      }
       animateProjectile();
      }
    }
  });
  
//   window.addEventListener("click",(e)=>{
//     // test.render();
//     let test = new Explosion(canvas.width/2,canvas.height/2, boom, true);
//   function animateExplosion(){
    
//       if(test.active){
//         ctx.clearRect(0, 0, canvas.width, canvas.height); 
//         console.log('2. update timer and frame ~');
//         test.update();
//         console.log('3. Render Image');
//         test.render();
//         player.render();
//         grid.render();
//         requestAnimationFrame(animateExplosion);
//       } else {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         console.log('end of explosion animation');

//         player.render();
//         grid.render();
//       }
//     }
//     console.log('1. start explosion animation');
//     animateExplosion();
//   });

});

