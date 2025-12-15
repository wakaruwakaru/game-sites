function SG99A_Board() {

	this.data = null;

	this.cols = 0;
	this.rows = 0;
	this.cells = 0;

	this.up_piece_table = null;
	this.down_piece_table = null;

	this.turn = 0;

}

// 謌舌ｊ谿ｵ謨ｰ
SG99A_Board.PROMOTE_ROWS = 3;

// 蛻晄悄逶､髱｢
SG99A_Board.INIT_BOARD = [
	-SG99A_Piece.KYO, -SG99A_Piece.KEI, -SG99A_Piece.GIN, -SG99A_Piece.KIN, -SG99A_Piece.OU, -SG99A_Piece.KIN, -SG99A_Piece.GIN, -SG99A_Piece.KEI, -SG99A_Piece.KYO,
SG99A_Piece.NONE, -SG99A_Piece.SHA, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, -SG99A_Piece.KAKU, SG99A_Piece.NONE,
-SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU, -SG99A_Piece.FU,
SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE,
SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE,
SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE,
SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU, SG99A_Piece.FU,
SG99A_Piece.NONE, SG99A_Piece.KAKU, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.NONE, SG99A_Piece.SHA, SG99A_Piece.NONE,
	SG99A_Piece.KYO, SG99A_Piece.KEI, SG99A_Piece.GIN, SG99A_Piece.KIN, SG99A_Piece.OU, SG99A_Piece.KIN, SG99A_Piece.GIN, SG99A_Piece.KEI, SG99A_Piece.KYO
];

SG99A_Board.INIT_UP_TABLE = [0, 0, 0, 0, 0, 0, 0, 0, 0];
SG99A_Board.INIT_DOWN_TABLE = [0, 0, 0, 0, 0, 0, 0, 0, 0];

SG99A_Board.createBoard = function() {

	var board = new SG99A_Board();

	board.cols = 9;
	board.rows = 9;
	board.cells = board.cols * board.rows;

	board.data = new Int32Array(board.cells);

	for (var i = 0;i < board.cells;i++) {
		board.data[i] = SG99A_Board.INIT_BOARD[i];
	}

	board.up_piece_table = new Int32Array(9);
	board.down_piece_table = new Int32Array(9);

	for (var i = 0;i <= 8;i++) {

		board.up_piece_table[i] = SG99A_Board.INIT_UP_TABLE[i];
		board.down_piece_table[i] = SG99A_Board.INIT_DOWN_TABLE[i];

	}

	return board;

}

SG99A_Board.prototype.set = function(board) {

	for (var i = 0;i < this.cells;i++) {
		this.data[i] = board.data[i];
	}

	for (var i = 2;i <= 8;i++) {

		this.up_piece_table[i] = board.up_piece_table[i];
		this.down_piece_table[i] = board.down_piece_table[i];

	}

	this.turn = board.turn;

}

SG99A_Board.prototype.clone = function() {

	var board = new SG99A_Board();

	board.cols = this.cols;
	board.rows = this.rows;
	board.cells = this.cells;

	board.data = new Int32Array(this.cells);

	for (var i = 0;i < this.cells;i++) {
		board.data[i] = this.data[i];
	}

	board.up_piece_table = new Int32Array(9);
	board.down_piece_table = new Int32Array(9);

	for (var i = 0;i <= 8;i++) {

		board.up_piece_table[i] = this.up_piece_table[i];
		board.down_piece_table[i] = this.down_piece_table[i];

	}

	board.turn = this.turn;

	return board;

}

// 逶､髱｢繝上ャ繧ｷ繝･蛟､繧堤ｮ怜
SG99A_Board.prototype.getBoardHash = function() {

	var hash = 0;

	for (var i = 0;i < this.cells;i++) {

		var piece = this.data[i];

		if (piece != 0) {

			hash += piece + ((i * i) & 0x1ff);
			hash += (piece * i * i) & 0xfff;

		}

	}

	for (var i = 2;i <= 8;i++) {

		if (this.up_piece_table[i] > 0) {
			hash += (i + 1) * this.up_piece_table[i];
		}

		if (this.down_piece_table[i] > 0) {
			hash += i * this.down_piece_table[i];
		}

	}

	return hash;

}

SG99A_Board.prototype.getKingCell = function(turn) {

	var king_col = -1;
	var king_row = -1;

	for (var row = 0;row < this.rows;row++) {
		for (var col = 0;col < this.cols;col++) {
			if (this.data[col + row * this.rows] * turn == SG99A_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return {'col': king_col, 'row': king_row};

}

SG99A_Board.prototype.isChecked = function(turn, processer) {

	var king_col = -1;
	var king_row = -1;

	for (var row = 0;row < this.rows;row++) {
		for (var col = 0;col < this.cols;col++) {
			if (this.data[col + row * this.rows] * turn == SG99A_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return processer.isInRange(this, -turn, king_col, king_row);

}

// 謖ｮ壽焔繧堤乢髱｢縺ｫ蜿肴丐
SG99A_Board.prototype.putHand = function(hand) {

	var to_index = hand.to_col + hand.to_row * this.cols;

	var to_piece = this.data[to_index];
	var from_piece = 0;

	if (hand.from_row === -1) {

		from_piece = hand.from_col;

		if (from_piece < 0) {
			this.up_piece_table[-from_piece]--;
		}

		if (from_piece > 0) {
			this.down_piece_table[from_piece]--;
		}

	} else {

		from_piece = this.data[hand.from_col + hand.from_row * this.cols];
		this.data[hand.from_col + hand.from_row * this.cols] = 0;

	}

	if (to_piece * from_piece < 0) {

		if (to_piece < 0) {
			if (to_piece < -SG99A_Piece.PROMOTED) {
				this.down_piece_table[-to_piece - SG99A_Piece.PROMOTED]++;
			} else {
				this.down_piece_table[-to_piece]++;
			}
		}

		if (to_piece > 0) {
			if (to_piece > SG99A_Piece.PROMOTED) {
				this.up_piece_table[to_piece - SG99A_Piece.PROMOTED]++;
			} else {
				this.up_piece_table[to_piece]++;
			}
		}

	}

	if (hand.promote) {

		switch (from_piece) {

		case SG99A_Piece.GIN:
		case SG99A_Piece.KEI:
		case SG99A_Piece.KYO:
		case SG99A_Piece.SHA:
		case SG99A_Piece.KAKU:
		case SG99A_Piece.FU:

			from_piece += SG99A_Piece.PROMOTED;

			break;

		case SG99A_Piece.M_GIN:
		case SG99A_Piece.M_KEI:
		case SG99A_Piece.M_KYO:
		case SG99A_Piece.M_SHA:
		case SG99A_Piece.M_KAKU:
		case SG99A_Piece.M_FU:

			from_piece -= SG99A_Piece.PROMOTED;

			break;

		}

	}

	this.data[to_index] = from_piece;

}