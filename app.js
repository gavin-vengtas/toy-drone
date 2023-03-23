const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

class Grid{  
  constructor(){}
	
	render(){
    let blockWidth = canvas.width/10;
    let blockHeight = canvas.height/10;
    
    //Draw 10x10 grid
    for(let i=1; i<=10; i++){
      let posx = i*blockWidth;      
      let posy = i*blockHeight;
      
      ctx.moveTo(posx,0);
      ctx.lineTo(posx, canvas.height);
      
      ctx.moveTo(0,posy);
      ctx.lineTo(canvas.width, posy);
    }
    
    //draw lines
    ctx.stroke();
  }  
}
class Player{
    constructor(){
      this.x = canvas.width/40;
      this.y = canvas.height/40;
      this.width = canvas.width/20;
      this.height = canvas.height/20;
    }
	
	render(){
		//color player object
		ctx.fillStyle = "#ff00ff";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  
  clear(){
    //clear rect that player occupies
    ctx.clearRect(player.x-1, player.y-1, player.width+2, player.height+2);
  }
  
  move(dir){    
    this.clear();
    
    if(dir==='up'){      
      //move up if y value will be above 0
      if(this.y-(canvas.height/10)<0){
        console.log('cant move further up');
      } else {
        this.y -= canvas.height/10;        
      }
    } else if (dir==='down'){
      //move down if y value will be less than view height
      if(this.y+(canvas.height/10)>canvas.height){
        console.log('cant move further down');
      } else {
        this.y += canvas.height/10;        
      }
    } else if (dir==='left'){
      //move left if x value will be above 0
      if(this.x-(canvas.width/10)<0){
        console.log('cant move further left');
      } else {
        this.x -= canvas.width/10;       
      }      
    } else if (dir==='right'){
      //move down if x value will be less than view width
      if(this.x+(canvas.width/10)>canvas.width){
        console.log('cant move further right');
      } else {
        this.x += canvas.width/10;    
      }    
    }
    
    this.render();
  }
  
}

//instantiate grid 
const grid = new Grid();
grid.render();

//render player at origin
const player = new Player();
player.render();
player.move('right');

//keeps on running
// const animate = () => {	
// ctx.clearRect(player.x-1, player.y-1, player.width+2, player.height+2);
// 	window.requestAnimationFrame(animate);
// 	player.render();
// 	player.update();
// 	platform.render();
	
// 	// collision detection
// 	if(
// 		//check y collision
// 		player.y + player.height <= platform.y &&
// 		player.y + player.gravity + player.height >= platform.y &&
// 		player.x + player.width >= platform.x &&
// 		player.x <= platform.x+platform.width
// 	){
// 		player.gravity = 0;
// 	}else{
// 		player.gravity = 1;
// 	}
// }

// animate();
