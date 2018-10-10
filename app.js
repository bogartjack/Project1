const WIDTH = Math.floor($('#content').width());
const HEIGHT = Math.floor($('#content').height());
console.log(WIDTH + '' +HEIGHT);
const BLOCKHEIGHT = 8;
const BLOCKSWIDE = Math.floor((WIDTH-(WIDTH%BLOCKHEIGHT))/(BLOCKHEIGHT+2))-1;
console.log(BLOCKSWIDE);
const BLOCKSTALL = Math.floor((HEIGHT-(HEIGHT%BLOCKHEIGHT))/(BLOCKHEIGHT+2))-1;
console.log(BLOCKSTALL);

//this is for formatting, so all blocks end up on the correct row/column
$('#game').width((BLOCKHEIGHT+2)*BLOCKSWIDE);
$('#game').height((BLOCKHEIGHT+2)*BLOCKSTALL);

let liveCells = 0;
let iterations = 0;
let $liveCells = $('#liveCells');
let $iterations = $('#iterations');

class Block {
//everything is self explanatory, each block needs to have a neighbor property so it's abstracted away from evolve function
	constructor(x,y){
		this.state = false;
		this.xIndex = x;
		this.yIndex = y;
		this.xLoc = this.xIndex*BLOCKHEIGHT;
		this.yLoc = this.yIndex*BLOCKHEIGHT;
		this.neighbors = 0;
		this.$block = $('<div></div>').attr('id','block'+this.xIndex+','+this.yIndex)
			.attr('class', 'someBlock')
			.css('background', '#F0F0F0')
			.css('height', BLOCKHEIGHT+'px')
			.css('width', BLOCKHEIGHT+'px')
			.css('border', '1px solid black')
			.data('xIndex', this.xIndex)
			.data('yIndex', this.yIndex);
	}

//used on instantiation
	addToPage(){
		$('#game').append(this.$block);
	}

//toggling is used when user is drawing so they can erase blocks
	toggleState(){
		if (!this.state){
			this.state = true;
			liveCells++;
		}	
		else {
			this.state = false;
			liveCells--;
		}
		updateStats();
	}

//random colors are pretty
	changeColorBasedOnState(){
		if(this.state) this.$block.css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));
		else this.$block.css('background', '#F0F0F0');
	}
}

const board = {
	allBlocks:[],

//board is in y,x coordinates
	addBlocksToBoard (){
		for (let i =0; i<BLOCKSTALL;i++){
			const row =[];
			for (let j =0; j<BLOCKSWIDE; j++){
				const newBlock = new Block(j,i);
				row.push(newBlock);
				newBlock.addToPage();
			}
			this.allBlocks.push(row);
		}
	},

//uses 3 double for loops to evolve board. Can't have everything happen at once or one check of a neighbor will affect future checks
	evolve (){
			for (let i =0; i<BLOCKSTALL;i++){
				for (let j =0; j<BLOCKSWIDE; j++){
//determine how many neighbors a cell has 
					if((i>0) && (j>0) && this.allBlocks[i-1][j-1].state){
						this.allBlocks[i][j].neighbors++;}	
					if((i>0) && this.allBlocks[i-1][j].state){
						this.allBlocks[i][j].neighbors++;}	
					if((i>0) && (j < BLOCKSWIDE-1) && this.allBlocks[i-1][j+1].state){
						this.allBlocks[i][j].neighbors++;}	
					if((j>0) && this.allBlocks[i][j-1].state){
						this.allBlocks[i][j].neighbors++;}	
					if((j<BLOCKSWIDE-1) && this.allBlocks[i][j+1].state){
						this.allBlocks[i][j].neighbors++;}	
					if((j>0) && (i<BLOCKSTALL-1) && this.allBlocks[i+1][j-1].state){
						this.allBlocks[i][j].neighbors++;}	
					if((i<BLOCKSTALL-1) && this.allBlocks[i+1][j].state){
						this.allBlocks[i][j].neighbors++;}	
					if((j<BLOCKSWIDE-1) && (i<BLOCKSTALL-1) && this.allBlocks[i+1][j+1].state){
						this.allBlocks[i][j].neighbors++;}	
				}
			}	
			for (let i=0; i<BLOCKSTALL; i++){
				for (let j=0; j<BLOCKSWIDE; j++){
//determine if cell should be alive or dead based on Life's rules					
					if(this.allBlocks[i][j].neighbors < 2 && this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = false;	
					}
					if(this.allBlocks[i][j].neighbors===2 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;
					}
					if(this.allBlocks[i][j].neighbors===3 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;
					}
					if(this.allBlocks[i][j].neighbors>3 && this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = false;
					}
					if(this.allBlocks[i][j].neighbors===3 && !this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = true;
					}
				}
			}
//keep track of all live cells, needs to reset here on each evolution
			liveCells=0;

//actual changing state occurs
			for (let i=0; i<BLOCKSTALL; i++){
				for (let j=0; j<BLOCKSWIDE; j++){
					if(this.allBlocks[i][j].state) liveCells++;
					this.allBlocks[i][j].changeColorBasedOnState();
					this.allBlocks[i][j].neighbors = 0;
				}
			}
//the number of generations that have occurred
		iterations++;
	}	
};

raveDJ = null;

//this is our interval controller
const isItARave = (keepTrackOfRave) => {
	if(keepTrackOfRave){
		raveDJ = setInterval( raving, 50);
	}
	else{
		stopTheRave();
		clearInterval(raveDJ);
	}
}
			
//reset all colors
const stopTheRave = () =>{
	$('#menu').css('background-color', '#FF00F2');
	$('#menu').css('border', 'none');
	$('#game').css('border-color', '#000000');
	$('.someBlock').css('border-color', '#000000');
	$('#game').css('border-style', 'solid');
	$('#game').css('border-color', '#FF00F2');
	$('#game').css('border-thickness', '2px');
	$('#content').css('background-color', '#FFFFFF');
	$('#stats').css('color', '#ff00f2');
	$('#stats').css('background-color', '#FFFFFF');
	$('#content').css('background-color', '#FFFFFF');
	$('#instructions').css('color', '#ff00f2');
	$('#information').css('color', '#ff00f2');
	$('#sprites').css('color', '#ff00f2');
	$('#sprites').css('color', '#ff00f2');
	$('#play').css('color', '#ff00f2');
	$('.sprite').css('border-color', '#ff00f2');
}

//how quickly colors get cycled through
const raveFrequency = .5;

//sine wave needs a center
const CENTER = 127;

//constantly increments each iteration to cycle through hex colors
let raveIncrement = 0;

//creates a full rgb hex string 
const RGB = (r,g,b) => {
	return '#' + makeHex(r) + makeHex(g) + makeHex(b);
}

//uses bitwise operators to convert an rgb value to hex
const makeHex = (n) => {
	const hex = '0123456789ABCDEF';
	return String(hex.substr((n>>4) & 0x0F, 1)) + hex.substr(n & 0x0F,1);
}	

//cycle through colors
const colorify = (offset) => {
	const phase1 = 2*Math.PI/3;
	const phase2 = 4*Math.PI/3;
	const red = Math.sin((raveFrequency*raveIncrement)+offset)*127.5+CENTER;
	const green = Math.sin((raveFrequency*raveIncrement)+offset+phase1)*127.5+CENTER;
	const blue = Math.sin((raveFrequency*raveIncrement)+offset+phase2)*127.5+CENTER;	
	return RGB(red, green, blue);
}

//abstract this to keep track of raveIncrement without needing to pass as parameter
const raving = () => {	
		makeElementsRave();
		raveIncrement++;
}

//just for fun to make the game interesting
let controlBorder =0;
let controlBorderBool = true;
const makeElementsRave = (c) =>{
		$('#menu').css('border', '2px solid ' + colorify(16));
		$('#menu').css('background-color', colorify(216));	
		$('#game').css('border-color', colorify(0));
		$('.someBlock').css('border-color', colorify(32));
		$('#content').css('background-color', colorify(64));
		$('#stats').css('color', colorify(256));
		$('#stats').css('background-color', colorify(128));
		$('#instructions').css('color', colorify(160));
		$('#information').css('color', colorify(160));
		$('#sprites').css('color', colorify(160));
		$('.sprite').css('border-color', colorify(160));
		$('#play').css('color', colorify(192));
		switch (controlBorder){
			case 0:
				$('#game').css('border-thickness', '2px');
				if (controlBorderBool){
					$('#game').css('border-style', 'solid');
					controlBorder++;
				}
				else{
					$('#game').css('border-style', 'none');
					controlBorderBool = true;
				}
				
				break;
			case 1:
				$('#game').css('border-thickness', '4px');
				if (controlBorderBool){
					$('#game').css('border-style', 'dotted');

					controlBorder++;
				}
				else{
					$('#game').css('border-style', 'dashed inset ridge dotted');
					controlBorder--;
				}
				break;
			case 2:
				$('#game').css('border-thickness', '6px');
				if (controlBorderBool){
					$('#game').css('border-style', 'dashed');
					controlBorder++;
				}
				else{
					$('#game').css('border-style', 'dotted solid double groove');
					controlBorder--;
				}
				break;
			case 3:
				$('#game').css('border-thickness', '8px');
				if (controlBorderBool){
					$('#game').css('border-style', 'double');
					controlBorder++;
				}
				else{
					$('#game').css('border-style', 'outset');
					controlBorder--;
				}
				break;
			case 4:
				$('#game').css('border-thickness', '10px');
				if (controlBorderBool){
					$('#game').css('border-style', 'solid');
					controlBorder++;
				}
				else{
					$('#game').css('border-style', 'inset');
					controlBorder--;
				}
			case 5:
				$('#game').css('border-thickness', '12px');
				if (controlBorderBool){
					$('#game').css('border-style', 'groove');
					controlBorderBool = false;
			
				}
				else{
					$('#game').css('border-style', 'ridge');
					controlBorder--;
				}
				break;
		};
}

//make overlay visible
const overlay = () => {
	$('#overlay').css('display', 'block');
	$('#play').on('click', () => {
		$('#overlay').css('display', 'none');
	});

}

const updateStats = () =>{
	$($iterations).text('number of iterations: '+iterations);
	$($liveCells).text('number of live cells: '+liveCells);
}

//initialize the game 

$(document).ready( () => {
	$('.sprite-image').attr('draggable', false);
	board.addBlocksToBoard();
	$('#stats').prepend($liveCells);
	$('#stats').prepend($iterations);
	drawOnBoard();
	overlay();
	updateStats();
});


const drawOnBoard = () => {
	$('.someBlock').mouseover((e) => { 

		//check if mouse is over block and down
		if(e.buttons == 1){ 
			board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].toggleState();
			board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].changeColorBasedOnState();
		}
	});
}

$('#instruction-link').on('click', () =>{
	$('#instruction-link').css('text-decoration', 'overline underline');
	$('#info-link').css('text-decoration', 'none');
	$('#sprites-link').css('text-decoration', 'none');
	$('#instructions').css('display', 'block');
	$('#information').css('display', 'none');
	$('#sprites').css('display', 'none');
});

$('#info-link').on('click', () => {
	$('#instruction-link').css('text-decoration', 'none');
	$('#info-link').css('text-decoration', 'overline underline');
	$('#sprites-link').css('text-decoration', 'none');
	$('#instructions').css('display', 'none');
	$('#information').css('display', 'block');
	$('#sprites').css('display', 'none');
});

$('#sprites-link').on('click', ()=>{
	$('#instructions').css('display', 'none');
	$('#instruction-link').css('text-decoration', 'none');
	$('#info-link').css('text-decoration', 'none');
	$('#sprites-link').css('text-decoration', 'overline underline');
	$('#information').css('display', 'none');
	$('#sprites').css('display', 'block');
});

//needs to be global, outside of keydown function
let keepTrack = true;

$('body').keydown( (e) => {
	if (e.keyCode === 32){	
		e.preventDefault();
		board.evolve();
		updateStats();
	}
	else if(e.keyCode === 77){
		overlay();
	}
	else if(e.keyCode === 52){
		isItARave(keepTrack);
		if (keepTrack) keepTrack = false;
		else keepTrack = true;
	}
});
