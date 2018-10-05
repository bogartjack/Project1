const WIDTH = $('#game').width();
const HEIGHT = $('#game').height();
const BLOCKHEIGHT = 8;
const BLOCKSWIDE = WIDTH/(BLOCKHEIGHT+2)-1;
const BLOCKSTALL = HEIGHT/(BLOCKHEIGHT+2)-1;
let evolving = false;
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
			liveCells--;
		}	
		else {
			this.state = false;
			liveCells++;
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
		if (evolving){
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
						liveCells--;	
					}
					if(this.allBlocks[i][j].neighbors===2 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;
						liveCells++;
					}
					if(this.allBlocks[i][j].neighbors===3 && this.allBlocks[i][j].state) {
						liveCells++;
						this.allBlocks[i][j].state = true;
					}
					if(this.allBlocks[i][j].neighbors>3 && this.allBlocks[i][j].state){
						liveCells--;
						this.allBlocks[i][j].state = false;
					}
					if(this.allBlocks[i][j].neighbors===3 && !this.allBlocks[i][j].state){
						liveCells++;
						this.allBlocks[i][j].state = true;
					}
				}
			}
			for (let i=0; i<BLOCKSTALL; i++){
			for (let j=0; j<BLOCKSWIDE; j++){
					this.allBlocks[i][j].changeColorBasedOnState();
					this.allBlocks[i][j].neighbors = 0;
				}
			}
		iterations++;
		}
	}, 250);
	}	
};

board.addBlocksToBoard();

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
	overlay();
	updateStats();
});

$('.someBlock').mouseover((e) => {
	if(e.buttons == 1){
		console.log($(e.currentTarget).attr('id'));
		console.log($(e.currentTarget).data('xIndex'));
		board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].toggleState();
		board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].changeColorBasedOnState();
	}
});

$('body').keydown( (e) => {
	if (evolving === false) {evolving = true;}
	else {evolving = false;}

	if (e.keyCode === 32){	
		board.evolve();
		updateStats();
	}
	else if(e.keyCode === 77){
		overlay();
	}
});
