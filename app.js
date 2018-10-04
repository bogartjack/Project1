const WIDTH = $(window).width();
const HEIGHT = $(window).height();
const BLOCKHEIGHT = 20;
const BLOCKSWIDE = WIDTH/(BLOCKHEIGHT+2)-1;
const BLOCKSTALL = HEIGHT/(BLOCKHEIGHT+2)-1;
let evolving = false;

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
			.css('border', '1px solid red')
			.data('xIndex', this.xIndex)
			.data('yIndex', this.yIndex);
//			.text(this.xIndex + ',' + this.yIndex);
	}
	addToPage(){
		$('#game').append(this.$block);
	}
	toggleState(){
		if (!this.state) this.state = true;
		else this.state = false;
	}
	changeColorBasedOnState(){
		if(this.state) this.$block.css('background-color', '#000000');
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
	updateBoard (){
		for (let i=0; i<BLOCKSTALL; i++){
			for (let j=0; j<BLOCKSWIDE; j++){
				this.allBlocks[i][j].changeColorBasedOnState();
			}
		}
	},
	evolve (){
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
					if((j<BLOCKSWIDE-1) && (i<BLOCKSTALL-1) && this.allBlocks[i+1][j+1].state){							this.allBlocks[i][j].neighbors++;}	
				}
			}	
			for (let i=0; i<BLOCKSTALL; i++){
				for (let j=0; j<BLOCKSWIDE; j++){
					
					if(this.allBlocks[i][j].neighbors < 2 && this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = false;}
					if(this.allBlocks[i][j].neighbors===2 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;}
					if(this.allBlocks[i][j].neighbors===3 && this.allBlocks[i][j].state) {
						this.allBlocks[i][j].state = true;}
					if(this.allBlocks[i][j].neighbors>3 && this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = false;}
					if(this.allBlocks[i][j].neighbors===3 && !this.allBlocks[i][j].state){
						this.allBlocks[i][j].state = true;}
				}
			}
			for (let i=0; i<BLOCKSTALL; i++){
				for (let j=0; j<BLOCKSWIDE; j++){
					this.allBlocks[i][j].changeColorBasedOnState();
					this.allBlocks[i][j].neighbors = 0;
				}
			}
		}
	}	
};

board.addBlocksToBoard();

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
	}
});
