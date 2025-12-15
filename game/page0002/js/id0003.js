var SG99A_Hand = function() {

	this.from_col = 0;
	this.from_row = 0;
	this.to_col = 0;
	this.to_row = 0;

	this.promote = false;

	this.score = new Int32Array(3);
	this.score[0] = 0;
	this.score[1] = 0;
	this.score[2] = 0;

	this.board_score = 0;

	this.children = null;

}

SG99A_Hand.createHand = function(piece, from_col, from_row, to_col, to_row, promote) {

	var hand = new SG99A_Hand();

	hand.from_col = from_col;
	hand.from_row = from_row;
	hand.to_col = to_col;
	hand.to_row = to_row;

	hand.promote = promote;

	return hand;

}

SG99A_Hand.cloneHand = function(src) {

	var hand = new SG99A_Hand();

	hand.from_col = src.from_col;
	hand.from_row = src.from_row;
	hand.to_col = src.to_col;
	hand.to_row = src.to_row;
	hand.promote = src.promote;

	hand.board_score = src.board_score;
	hand.score[0] = src.score[0];
	hand.score[1] = src.score[1];
	hand.score[2] = src.score[2];

	return hand;

}

SG99A_Hand.prototype.toString = function() {
	return this.from_col + ',' + this.from_row + ':' + this.to_col + ',' + this.to_row + '/' + this.promote + ':';
}