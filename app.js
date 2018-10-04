const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const BLOCKHEIGHT = 5;
const BLOCKSWIDE = WIDTH/(BLOCKHEIGHT);
const BLOCKSTALL = HEIGHT/(BLOCKHEIGHT);

class Block {
	constructor(x,y){
		this.state = false;
		this.xIndex = x;
		this.yIndex = y;
		this.xLoc = this.xIndex*BLOCKHEIGHT;
		this.yLoc = this.yIndex*BLOCKHEIGHT;
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
	setState(){
		console.log(this.xIndex);
		console.log(this.yIndex);
		this.state = true;
	}
	changeColorBasedOnState(){
		if(this.state === true) this.$block.css('background-color', '#000000');
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
	changeState (){

		for (let i =0; i<BLOCKSTALL;i++){
			for (let j =0; j<BLOCKSWIDE; j++){
				
			}
		}
	}
};

board.addBlocksToBoard();
board.changeState();

$('.someBlock').on('click', (e) => {
	console.log($(e.currentTarget).attr('id'));
	console.log($(e.currentTarget).data('xIndex'));
	board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].setState();
	board.allBlocks[$(e.currentTarget).data('yIndex')][$(e.currentTarget).data('xIndex')].changeColorBasedOnState();

});
