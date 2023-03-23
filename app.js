const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

class Grid{  
  constructor(){
    this.blockWidth = canvas.width/10;
    this.blockHeight = canvas.height/10;
  }
	
	render(){    
    //Draw 10x10 grid
    for(let i=1; i<=10; i++){
      let posx = i*this.blockWidth;      
      let posy = i*this.blockHeight;
      
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
    this.xunits = canvas.width/40;
    this.yunits = canvas.height/40;
    this.x = canvas.width/40;
    this.y = canvas.height/40;
    this.width = canvas.width/20;
    this.height = canvas.height/20;
  }
	
	render(){
		//color player object
		// ctx.fillStyle = "#ff00ff";
		// ctx.fillRect(this.x, this.y, this.width, this.height);
    
    console.log('x: '+this.x);
    console.log('y: '+this.y);
    console.log('width offset: '+this.width);
    console.log('Height offset: '+this.height);
    
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.xunits, this.y + this.yunits);
    ctx.lineTo(this.x + this.xunits + this.xunits, this.y);
    ctx.lineTo(this.x + this.xunits, this.y + this.yunits + this.yunits);
    ctx.closePath();
    ctx.fill();
    console.log(`drawn`);
    
    
    
    // this.move('down');
    // this.clear();
    
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
        console.log('y added: '+canvas.height/10);
        
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
    
    console.log('**********');
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
    
    console.log('x: '+ this.x);
    console.log('y: '+ this.y);
    console.log('height: '+this.height);
    console.log('width: '+ this.width);
    console.log('canvas w: '+ canvas.width);
    console.log('canvas h: '+ canvas.height);
    console.log('less than canvas height: '+(this.y + this.height <= canvas.height));
    console.log('more than canvas y origin: '+(this.y >= 0));
    console.log('less than canvas width: '+ (this.x + this.width <= canvas.width));
    console.log('more than x origin: '+ (this.x >= 0));
		
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
      
      if(this.dir==='up'){
				this.y-=this.velocity;
			}
      
      if(this.dir==='down'){
				this.y+=this.velocity;
			}
      
		}else{
			this.dir = null;
      this.active = false;
		}
	}
}


//instantiate grid 
const grid = new Grid();
grid.render();

//render player at origin
const player = new Player();
player.render();
player.move('down');

// const projectile = new Projectile(player.x,player.y,10,3,1,'down',player);
// projectile.render();
// projectile.update();

//keeps on running
const animateProjectile = () => {	
  if(projectile.active){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animateProjectile);
    projectile.render();
    projectile.update();
    grid.render();
    player.render();
  }else{
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    grid.render();
    player.render();
    console.log('End of animation');
  }
}

// animateProjectile();
