const WIDTH = Math.floor($('#content').width());
const HEIGHT = Math.floor($('#content').height());
console.log(WIDTH + '' +HEIGHT);
const BLOCKHEIGHT = 8;
const BLOCKSWIDE = Math.floor((WIDTH-(WIDTH%BLOCKHEIGHT))/(BLOCKHEIGHT+2))-1;
console.log(BLOCKSWIDE);
const BLOCKSTALL = Math.floor((HEIGHT-(HEIGHT%BLOCKHEIGHT))/(BLOCKHEIGHT+2))-1;
console.log(BLOCKSTALL);

$('#game').width((BLOCKHEIGHT+2)*BLOCKSWIDE);
$('#game').height((BLOCKHEIGHT+2)*BLOCKSTALL);

let liveCells = 0;
let iterations = 0;
let $liveCells = $('#liveCells');
let $iterations = $('#iterations');

class Block {
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
//			.text(this.xIndex + ',' + this.yIndex);
	}
	addToPage(){
		$('#game').append(this.$block);
	}
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
	changeColorBasedOnState(){
		if(this.state) this.$block.css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));
		else this.$block.css('background', '#F0F0F0');
	}
}

const board = {
	allBlocks:[],
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
	evolve (){
		setTimeout(() => {
			for (let i =0; i<BLOCKSTALL;i++){
				for (let j =0; j<BLOCKSWIDE; j++){
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
					
					if(this.allBlocks[i][j].neighbors < 2 && this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = false;
//						liveCells--;	
					}
					if(this.allBlocks[i][j].neighbors===2 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;
//						liveCells++;
					}
					if(this.allBlocks[i][j].neighbors===3 && this.allBlocks[i][j].state) {
//						liveCells++;
						this.allBlocks[i][j].state = true;
					}
					if(this.allBlocks[i][j].neighbors>3 && this.allBlocks[i][j].state){
//						liveCells--;
						this.allBlocks[i][j].state = false;
					}
					if(this.allBlocks[i][j].neighbors===3 && !this.allBlocks[i][j].state){
//						liveCells++;
						this.allBlocks[i][j].state = true;
					}
				}
			}
			liveCells=0;
			for (let i=0; i<BLOCKSTALL; i++){
			for (let j=0; j<BLOCKSWIDE; j++){
					if(this.allBlocks[i][j].state) liveCells++;
					this.allBlocks[i][j].changeColorBasedOnState();
					this.allBlocks[i][j].neighbors = 0;
				}
			}
		iterations++;
		}, 250);
	}	
};
const startTheRave = () => {
	let temp = 0;
	let up = true;
	window.setInterval( () => {	
		$('#game').css('border-color', '#'+Math.floor(Math.random()*16777215).toString(16));
		$('.someBlock').css('border-color', '#'+Math.floor(Math.random()*1677215).toString(16));
		$('#content').css('border-color', '#'+Math.floor(Math.random()*16777215).toString(16));
		$('#stats').css('color', '#'+Math.floor(Math.random()*16777215).toString(16));
		switch (temp){
			case 0:
				$('#game').css('border-thickness', '2px');
				if (up){
					$('#game').css('border-style', 'solid');
					temp++;
				}
				else{
					$('#game').css('border-style', 'none');
					up = true;
				}
				
				break;
			case 1:
				$('#game').css('border-thickness', '4px');
				if (up){
					$('#game').css('border-style', 'dotted');

					temp++;
				}
				else{
					$('#game').css('border-style', 'dashed inset ridge dotted');
					temp--;
				}
				break;
			case 2:
				$('#game').css('border-thickness', '6px');
				if (up){
					$('#game').css('border-style', 'dashed');
					temp++;
				}
				else{
					$('#game').css('border-style', 'dotted solid double groove');
					temp--;
				}
				break;
			case 3:
				$('#game').css('border-thickness', '8px');
				if (up){
					$('#game').css('border-style', 'double');
					temp++;
				}
				else{
					$('#game').css('border-style', 'outset');
					temp--;
				}
				break;
			case 4:
				$('#game').css('border-thickness', '10px');
				if (up){
					$('#game').css('border-style', 'solid');
					temp++;
				}
				else{
					$('#game').css('border-style', 'inset');
					temp--;
				}
			case 5:
				$('#game').css('border-thickness', '12px');
				if (up){
					$('#game').css('border-style', 'groove');
					up = false;
			
				}
				else{
					$('#game').css('border-style', 'ridge');
					temp--;
				}
				break;
		};

	}, 250);
}

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

$(document).ready( () => {
	board.addBlocksToBoard();
	$('#stats').prepend($liveCells);
	$('#stats').prepend($iterations);
	drawOnBoard();
	overlay();
	startTheRave();
	updateStats();
});
const drawOnBoard = () => {
	$('.someBlock').mouseover((e) => { 
		console.log('doohick');
		if(e.buttons == 1){
			console.log($(e.currentTarget).attr('id'));
	//		console.log($(e.currentTarget).data('xIndex'))
			board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].toggleState();
			board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].changeColorBasedOnState();
		}
	});
}

$('body').keydown( (e) => {
	if (e.keyCode === 32){	
		e.preventDefault();
		board.evolve();
		updateStats();
	}
	else if(e.keyCode === 77){
		overlay();
	}
});
