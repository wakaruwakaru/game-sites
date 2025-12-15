function SG99A_BoardProcesser(cols, rows, promote_rows) {

	this.cols = cols;
	this.rows = rows;

	this.promote_rows = promote_rows;

	this.up_promote_row = this.promote_rows - 1;
	this.down_promote_row = this.rows - this.promote_rows;

}

SG99A_BoardProcesser.MAX_SCORE = 1000000;
SG99A_BoardProcesser.MIN_SCORE = -1000000;

SG99A_BoardProcesser.SL_ARRAY = new Int32Array(50);
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_OU + 24] = 1;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KIN + 24] = 2;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_GIN + 24] = 3;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KEI + 24] = 4;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KYO + 24] = 5;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_SHA + 24] = 6;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KAKU + 24] = 7;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_FU + 24] = 8;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_GIN_P + 24] = 2;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KEI_P + 24] = 2;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KYO_P + 24] = 2;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_SHA_P + 24] = 9;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_KAKU_P + 24] = 10;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.M_FU_P + 24] = 2;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.OU + 24] = 11;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KIN + 24] = 12;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.GIN + 24] = 13;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KEI + 24] = 14;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KYO + 24] = 15;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.SHA + 24] = 16;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KAKU + 24] = 17;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.FU + 24] = 18;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.GIN_P + 24] = 12;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KEI_P + 24] = 12;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KYO_P + 24] = 12;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.SHA_P + 24] = 19;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.KAKU_P + 24] = 20;
SG99A_BoardProcesser.SL_ARRAY[SG99A_Piece.FU_P + 24] = 12;

// 盤面評価関数
SG99A_BoardProcesser.prototype.getBoardSimpleScoreWithKingPos = function(board, turn, up_range_map, down_range_map, my_king_col, my_king_row, enemy_king_col, enemy_king_row) {

	var cols = board.cols;
	var rows = board.rows;
	var cells = cols * rows;

	this.setRangeMap(board, up_range_map, down_range_map);

	var up_king_col, up_king_row;
	var down_king_col, down_king_row;

	if (turn === -1) {

		up_king_col = my_king_col;
		up_king_row = my_king_row;
		down_king_col = enemy_king_col;
		down_king_row = enemy_king_row;

	} else {

		up_king_col = enemy_king_col;
		up_king_row = enemy_king_row;
		down_king_col = my_king_col;
		down_king_row = my_king_row;

	}

	var board_data = board.data;

	var my_guard_val = 0;
	var enemy_guard_val = 0;

	var my_invade_val = 0;
	var enemy_invade_val = 0;

	var my_table_val = 0;
	var enemy_table_val = 0;

	var cells_piece_score = 0;
	var piece_score_table = SG99A_Piece.piece_scores;

	for (var i = 0;i < cells;i++) {

		var piece = board_data[i];

		if (piece < 0) {
			cells_piece_score -= piece_score_table[-piece];
		}

		if (piece > 0) {
			cells_piece_score += piece_score_table[piece];
		}

	}

	var table_piece_score = 0;
	var table_score_table = SG99A_Piece.table_piece_scores;

	for (var i = 2;i <= 8;i++) {

		table_piece_score -= board.up_piece_table[i] * table_score_table[i];
		table_piece_score += board.down_piece_table[i] * table_score_table[i];

	}

	if (board.up_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score += 10;
	}

	if (board.down_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score -= 10;
	}

	var board_piece_score = cells_piece_score + table_piece_score;

	var up_area_left = up_king_col - 2;
	var up_area_right = up_king_col + 2;
	var up_area_top = up_king_row - 2;
	var up_area_bottom = up_king_row + 2;

	if (up_area_left < 0) {
		up_area_left = 0;
	}

	if (up_area_right >= cols) {
		up_area_right = cols - 1;
	}

	if (up_area_top < 0) {
		up_area_top = 0;
	}

	if (up_area_bottom >= rows) {
		up_area_bottom = rows - 1;
	}

	var up_area_invaded = 0;
	var up_area_guard = 0;

	for (var row = up_area_top;row <= up_area_bottom;row++) {

		var rc = row * cols;

		for (var col = up_area_left;col <= up_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.M_KIN || piece === SG99A_Piece.M_GIN || piece < -16) {
					up_area_guard++;
			}

			if (down_range_map[c]) {
				up_area_invaded += down_range_map[c];
			}

			if (piece > 0 && (down_range_map[c] || !up_range_map[c])) {

				up_area_invaded += 2;

				if (piece === SG99A_Piece.FU_P) {
					up_area_invaded++;
				}

			}

		}

	}

	var up_inner_left = up_king_col - 1;
	var up_inner_right = up_king_col + 1;
	var up_inner_top = up_king_row - 1;
	var up_inner_bottom = up_king_row + 1;

	if (up_inner_left < 0) {
		up_inner_left = 0;
	}

	if (up_inner_right >= cols) {
		up_inner_right = cols - 1;
	}

	if (up_inner_top < 0) {
		up_inner_top = 0;
	}

	if (up_inner_bottom >= rows) {
		up_inner_bottom = rows - 1;
	}

	var up_inner_invaded = 0;
	var up_inner_space = 0;

	for (var row = up_inner_top;row <= up_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = up_inner_left;col <= up_inner_right;col++) {

			var c = col + rc;

			if (down_range_map[c]) {
				up_inner_invaded += down_range_map[c];
			} else {
				if (board_data[c] == 0) {
					up_inner_space++;
				}
			}

		}

	}

	var down_area_left = down_king_col - 2;
	var down_area_right = down_king_col + 2;
	var down_area_top = down_king_row - 2;
	var down_area_bottom = down_king_row + 2;

	if (down_area_left < 0) {
		down_area_left = 0;
	}

	if (down_area_right >= cols) {
		down_area_right = cols - 1;
	}

	if (down_area_top < 0) {
		down_area_top = 0;
	}

	if (down_area_bottom >= rows) {
		down_area_bottom = rows - 1;
	}

	var down_area_invaded = 0;
	var down_area_guard = 0;

	for (var row = down_area_top;row <= down_area_bottom;row++) {

		var rc = row * cols;

		for (var col = down_area_left;col <= down_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.KIN || piece === SG99A_Piece.GIN || piece > 16) {
					down_area_guard++;
			}

			if (up_range_map[c]) {
				down_area_invaded += up_range_map[c];
			}

			if (piece < 0 && (up_range_map[c] || !down_range_map[c])) {

				down_area_invaded += 2;

				if (piece === -SG99A_Piece.FU_P) {
					down_area_invaded++;
				}

			}

		}

	}

	var down_inner_left = down_king_col - 1;
	var down_inner_right = down_king_col + 1;
	var down_inner_top = down_king_row - 1;
	var down_inner_bottom = down_king_row + 1;

	if (down_inner_left < 0) {
		down_inner_left = 0;
	}

	if (down_inner_right >= cols) {
		down_inner_right = cols - 1;
	}

	if (down_inner_top < 0) {
		down_inner_top = 0;
	}

	if (down_inner_bottom >= rows) {
		down_inner_bottom = rows - 1;
	}

	var down_inner_invaded = 0;
	var down_inner_space = 0;

	for (var row = down_inner_top;row <= down_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = down_inner_left;col <= down_inner_right;col++) {

			var c = col + rc;

			if (up_range_map[c]) {
				down_inner_invaded += up_range_map[c];
			} else {
				if (board_data[c] == 0) {
					down_inner_space++;
				}
			}

		}

	}

	var up_area_guard_score = up_area_guard * 15;

	if (up_area_guard_score > 50) {
		up_area_guard_score = 50;
	}

	var down_area_guard_score = down_area_guard * 15;

	if (down_area_guard_score > 50) {
		down_area_guard_score = 50;
	}

	var up_area_invaded_score = up_area_invaded * 10;

	if (up_area_invaded_score > 120) {
		up_area_invaded_score = 120;
	}

	var up_inner_invaded_score = up_inner_invaded * 5;

	if (up_inner_invaded_score > 25) {
		up_inner_invaded_score = 25;
	}

	up_area_invaded_score += up_inner_invaded_score;

	var down_area_invaded_score = down_area_invaded * 10;

	if (down_area_invaded_score > 120) {
		down_area_invaded_score = 120;
	}

	var down_inner_invaded_score = down_inner_invaded * 5;

	if (down_inner_invaded_score > 25) {
		down_inner_invaded_score = 25;
	}

	down_area_invaded_score += down_inner_invaded_score;

	if (up_inner_space == 0) {

		up_area_guard_score -= 10;

		if (up_area_invaded > 1) {
			up_area_guard_score -= 20;
		}

	}

	if (up_area_invaded > 2) {

		if (up_area_guard <= 2) {

			up_area_guard_score -= 40;

			if (up_area_invaded > 5) {
				up_area_guard_score -= 30;
			}

		}

		if (up_area_guard == 0) {
			up_area_guard_score -= 40;
		}

	}

	if (down_inner_space == 0) {

		down_area_guard_score -= 10;

		if (down_area_invaded > 1) {
			down_area_guard_score -= 20;
		}

	}

	if (down_area_invaded > 2) {

		if (down_area_guard <= 2) {

			down_area_guard_score -= 40;

			if (down_area_invaded > 5) {
				down_area_guard_score -= 30;
			}

		}

		if (down_area_guard == 0) {
			down_area_guard_score -= 40;
		}

	}

	var guard_score = down_area_guard_score - up_area_guard_score;
	var invaded_score = down_area_invaded_score - up_area_invaded_score;

	var score = Math.floor(board_piece_score + guard_score - invaded_score);

	if (turn == -1) {
		score = -score;
	}

	return score;

}

// 盤面評価関数
SG99A_BoardProcesser.prototype.getBoardSimpleScoreWithKingPosAndRangeMap = function(board, turn, my_range_map, enemy_range_map, my_king_col, my_king_row, enemy_king_col, enemy_king_row) {

	var cols = board.cols;
	var rows = board.rows;
	var cells = cols * rows;

	var up_king_col, up_king_row;
	var down_king_col, down_king_row;
	var up_range_map, down_range_map;

	if (turn === -1) {

		up_king_col = my_king_col;
		up_king_row = my_king_row;
		down_king_col = enemy_king_col;
		down_king_row = enemy_king_row;

		up_range_map = my_range_map;
		down_range_map = enemy_range_map;

	} else {

		up_king_col = enemy_king_col;
		up_king_row = enemy_king_row;
		down_king_col = my_king_col;
		down_king_row = my_king_row;

		up_range_map = enemy_range_map;
		down_range_map = my_range_map;

	}

	var board_data = board.data;

	var my_guard_val = 0;
	var enemy_guard_val = 0;

	var my_invade_val = 0;
	var enemy_invade_val = 0;

	var my_table_val = 0;
	var enemy_table_val = 0;

	var cells_piece_score = 0;
	var piece_score_table = SG99A_Piece.piece_scores;

	for (var i = 0;i < cells;i++) {

		var piece = board_data[i];

		if (piece < 0) {
			cells_piece_score -= piece_score_table[-piece];
		}

		if (piece > 0) {
			cells_piece_score += piece_score_table[piece];
		}

	}

	var table_piece_score = 0;
	var table_score_table = SG99A_Piece.table_piece_scores;

	for (var i = 2;i <= 8;i++) {

		var ts = board.down_piece_table[i] - board.up_piece_table[i];

		if (ts != 0) {
			table_piece_score += ts * table_score_table[i];
		}

	}

	if (board.up_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score += 10;
	}

	if (board.down_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score -= 10;
	}

	var board_piece_score = cells_piece_score + table_piece_score;

	var up_area_left = up_king_col - 2;
	var up_area_right = up_king_col + 2;
	var up_area_top = up_king_row - 2;
	var up_area_bottom = up_king_row + 2;

	if (up_area_left < 0) {
		up_area_left = 0;
	}

	if (up_area_right >= cols) {
		up_area_right = cols - 1;
	}

	if (up_area_top < 0) {
		up_area_top = 0;
	}

	if (up_area_bottom >= rows) {
		up_area_bottom = rows - 1;
	}

	var up_area_invaded = 0;
	var up_area_guard = 0;

	for (var row = up_area_top;row <= up_area_bottom;row++) {

		var rc = row * cols;

		for (var col = up_area_left;col <= up_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.M_KIN || piece === SG99A_Piece.M_GIN || piece < -16) {
					up_area_guard++;
			}

			if (down_range_map[c]) {
				up_area_invaded += down_range_map[c];
			}

			if (piece > 0 && (down_range_map[c] || !up_range_map[c])) {

				up_area_invaded += 2;

				if (piece === SG99A_Piece.FU_P) {
					up_area_invaded++;
				}

			}

		}

	}

	var up_inner_left = up_king_col - 1;
	var up_inner_right = up_king_col + 1;
	var up_inner_top = up_king_row - 1;
	var up_inner_bottom = up_king_row + 1;

	if (up_inner_left < 0) {
		up_inner_left = 0;
	}

	if (up_inner_right >= cols) {
		up_inner_right = cols - 1;
	}

	if (up_inner_top < 0) {
		up_inner_top = 0;
	}

	if (up_inner_bottom >= rows) {
		up_inner_bottom = rows - 1;
	}

	var up_inner_invaded = 0;
	var up_inner_space = 0;

	for (var row = up_inner_top;row <= up_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = up_inner_left;col <= up_inner_right;col++) {

			var c = col + rc;

			if (down_range_map[c]) {
				up_inner_invaded += down_range_map[c];
			} else {
				if (board_data[c] == 0) {
					up_inner_space++;
				}
			}

		}

	}

	var down_area_left = down_king_col - 2;
	var down_area_right = down_king_col + 2;
	var down_area_top = down_king_row - 2;
	var down_area_bottom = down_king_row + 2;

	if (down_area_left < 0) {
		down_area_left = 0;
	}

	if (down_area_right >= cols) {
		down_area_right = cols - 1;
	}

	if (down_area_top < 0) {
		down_area_top = 0;
	}

	if (down_area_bottom >= rows) {
		down_area_bottom = rows - 1;
	}

	var down_area_invaded = 0;
	var down_area_guard = 0;

	for (var row = down_area_top;row <= down_area_bottom;row++) {

		var rc = row * cols;

		for (var col = down_area_left;col <= down_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.KIN || piece === SG99A_Piece.GIN || piece > 16) {
					down_area_guard++;
			}

			if (up_range_map[c]) {
				down_area_invaded += up_range_map[c];
			}

			if (piece < 0 && (up_range_map[c] || !down_range_map[c])) {

				down_area_invaded += 2;

				if (piece === -SG99A_Piece.FU_P) {
					down_area_invaded++;
				}

			}

		}

	}

	var down_inner_left = down_king_col - 1;
	var down_inner_right = down_king_col + 1;
	var down_inner_top = down_king_row - 1;
	var down_inner_bottom = down_king_row + 1;

	if (down_inner_left < 0) {
		down_inner_left = 0;
	}

	if (down_inner_right >= cols) {
		down_inner_right = cols - 1;
	}

	if (down_inner_top < 0) {
		down_inner_top = 0;
	}

	if (down_inner_bottom >= rows) {
		down_inner_bottom = rows - 1;
	}

	var down_inner_invaded = 0;
	var down_inner_space = 0;

	for (var row = down_inner_top;row <= down_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = down_inner_left;col <= down_inner_right;col++) {

			var c = col + rc;

			if (up_range_map[c]) {
				down_inner_invaded += up_range_map[c];
			} else {
				if (board_data[c] == 0) {
					down_inner_space++;
				}
			}

		}

	}

	var up_area_guard_score = up_area_guard * 15;

	if (up_area_guard_score > 50) {
		up_area_guard_score = 50;
	}

	var down_area_guard_score = down_area_guard * 15;

	if (down_area_guard_score > 50) {
		down_area_guard_score = 50;
	}

	var up_area_invaded_score = up_area_invaded * 10;

	if (up_area_invaded_score > 120) {
		up_area_invaded_score = 120;
	}

	var up_inner_invaded_score = up_inner_invaded * 5;

	if (up_inner_invaded_score > 25) {
		up_inner_invaded_score = 25;
	}

	up_area_invaded_score += up_inner_invaded_score;

	var down_area_invaded_score = down_area_invaded * 10;

	if (down_area_invaded_score > 120) {
		down_area_invaded_score = 120;
	}

	var down_inner_invaded_score = down_inner_invaded * 5;

	if (down_inner_invaded_score > 25) {
		down_inner_invaded_score = 25;
	}

	down_area_invaded_score += down_inner_invaded_score;

	if (up_inner_space == 0) {

		up_area_guard_score -= 15;

		if (up_area_invaded > 1) {
			up_area_guard_score -= 30;
		}

		if (up_area_invaded > 2) {
			up_area_guard_score -= 10;
		}

	}

	if (up_area_invaded > 2) {

		if (up_area_guard <= 2) {

			up_area_guard_score -= 40;

			if (up_area_invaded > 5) {
				up_area_guard_score -= 30;
			}

		}

		if (up_area_guard == 0) {
			up_area_guard_score -= 40;
		}

	}

	if (down_inner_space == 0) {

		down_area_guard_score -= 15;

		if (down_area_invaded > 1) {
			down_area_guard_score -= 30;
		}

		if (down_area_invaded > 2) {
			down_area_guard_score -= 10;
		}

	}

	if (down_area_invaded > 2) {

		if (down_area_guard <= 2) {

			down_area_guard_score -= 40;

			if (down_area_invaded > 5) {
				down_area_guard_score -= 30;
			}

		}

		if (down_area_guard == 0) {
			down_area_guard_score -= 40;
		}

	}

	var guard_score = down_area_guard_score - up_area_guard_score;
	var invaded_score = down_area_invaded_score - up_area_invaded_score;

	var score = Math.floor(board_piece_score + guard_score - invaded_score);

	if (turn == -1) {
		score = -score;
	}

	return score;

}

// 枝刈り用盤面評価関数
SG99A_BoardProcesser.prototype.getBoardSelectingScoreWithKingPosAndRangeMap = function(board, turn, my_range_map, enemy_range_map, my_king_col, my_king_row, enemy_king_col, enemy_king_row) {

	var cols = board.cols;
	var rows = board.rows;
	var cells = cols * rows;

	var up_king_col, up_king_row;
	var down_king_col, down_king_row;
	var up_range_map, down_range_map;

	if (turn === -1) {

		up_king_col = my_king_col;
		up_king_row = my_king_row;
		down_king_col = enemy_king_col;
		down_king_row = enemy_king_row;

		up_range_map = my_range_map;
		down_range_map = enemy_range_map;

	} else {

		up_king_col = enemy_king_col;
		up_king_row = enemy_king_row;
		down_king_col = my_king_col;
		down_king_row = my_king_row;

		up_range_map = enemy_range_map;
		down_range_map = my_range_map;

	}

	var board_data = board.data;

	var my_guard_val = 0;
	var enemy_guard_val = 0;

	var my_invade_val = 0;
	var enemy_invade_val = 0;

	var my_table_val = 0;
	var enemy_table_val = 0;

	var cells_piece_score = 0;
	var piece_score_table = SG99A_Piece.piece_scores;

	for (var i = 0;i < cells;i++) {

		var piece = board_data[i];

		if (piece < 0) {
			if (piece != SG99A_Piece.M_OU && down_range_map[i] > 0) {
				cells_piece_score -= piece_score_table[-piece] * 0.95;
			} else {
				cells_piece_score -= piece_score_table[-piece];
			}
		}

		if (piece > 0) {
			if (piece != SG99A_Piece.OU && up_range_map[i] > 0) {
				cells_piece_score += piece_score_table[piece] * 0.95;
			} else {
				cells_piece_score += piece_score_table[piece];
			}
		}

	}

	var table_piece_score = 0;
	var table_score_table = SG99A_Piece.table_piece_scores;

	for (var i = 2;i <= 8;i++) {

		table_piece_score -= board.up_piece_table[i] * table_score_table[i];
		table_piece_score += board.down_piece_table[i] * table_score_table[i];

	}

	if (board.up_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score += 10;
	}

	if (board.down_piece_table[SG99A_Piece.FU] < 1) {
		table_piece_score -= 10;
	}

	var board_piece_score = cells_piece_score + table_piece_score;

	var up_area_left = up_king_col - 2;
	var up_area_right = up_king_col + 2;
	var up_area_top = up_king_row - 2;
	var up_area_bottom = up_king_row + 2;

	if (up_area_left < 0) {
		up_area_left = 0;
	}

	if (up_area_right >= cols) {
		up_area_right = cols - 1;
	}

	if (up_area_top < 0) {
		up_area_top = 0;
	}

	if (up_area_bottom >= rows) {
		up_area_bottom = rows - 1;
	}

	var up_area_invaded = 0;
	var up_area_guard = 0;

	for (var row = up_area_top;row <= up_area_bottom;row++) {

		var rc = row * cols;

		for (var col = up_area_left;col <= up_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.M_KIN || piece === SG99A_Piece.M_GIN || piece < -16) {
					up_area_guard++;
			}

			if (down_range_map[c]) {
				up_area_invaded += down_range_map[c];
			}

			if (piece > 0 && (down_range_map[c] || !up_range_map[c])) {

				up_area_invaded += 2;

				if (piece === SG99A_Piece.FU_P) {
					up_area_invaded++;
				}

			}

		}

	}

	var up_inner_left = up_king_col - 1;
	var up_inner_right = up_king_col + 1;
	var up_inner_top = up_king_row - 1;
	var up_inner_bottom = up_king_row + 1;

	if (up_inner_left < 0) {
		up_inner_left = 0;
	}

	if (up_inner_right >= cols) {
		up_inner_right = cols - 1;
	}

	if (up_inner_top < 0) {
		up_inner_top = 0;
	}

	if (up_inner_bottom >= rows) {
		up_inner_bottom = rows - 1;
	}

	var up_inner_invaded = 0;
	var up_inner_space = 0;

	for (var row = up_inner_top;row <= up_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = up_inner_left;col <= up_inner_right;col++) {

			var c = col + rc;

			if (down_range_map[c]) {
				up_inner_invaded += down_range_map[c];
			} else {
				if (board_data[c] == 0) {
					up_inner_space++;
				}
			}

		}

	}

	var down_area_left = down_king_col - 2;
	var down_area_right = down_king_col + 2;
	var down_area_top = down_king_row - 2;
	var down_area_bottom = down_king_row + 2;

	if (down_area_left < 0) {
		down_area_left = 0;
	}

	if (down_area_right >= cols) {
		down_area_right = cols - 1;
	}

	if (down_area_top < 0) {
		down_area_top = 0;
	}

	if (down_area_bottom >= rows) {
		down_area_bottom = rows - 1;
	}

	var down_area_invaded = 0;
	var down_area_guard = 0;

	for (var row = down_area_top;row <= down_area_bottom;row++) {

		var rc = row * cols;

		for (var col = down_area_left;col <= down_area_right;col++) {

			var c = col + rc;

			var piece = board_data[c];

			if (piece === SG99A_Piece.KIN || piece === SG99A_Piece.GIN || piece > 16) {
					down_area_guard++;
			}

			if (up_range_map[c]) {
				down_area_invaded += up_range_map[c];
			}

			if (piece < 0 && (up_range_map[c] || !down_range_map[c])) {

				down_area_invaded += 2;

				if (piece === -SG99A_Piece.FU_P) {
					down_area_invaded++;
				}

			}

		}

	}

	var down_inner_left = down_king_col - 1;
	var down_inner_right = down_king_col + 1;
	var down_inner_top = down_king_row - 1;
	var down_inner_bottom = down_king_row + 1;

	if (down_inner_left < 0) {
		down_inner_left = 0;
	}

	if (down_inner_right >= cols) {
		down_inner_right = cols - 1;
	}

	if (down_inner_top < 0) {
		down_inner_top = 0;
	}

	if (down_inner_bottom >= rows) {
		down_inner_bottom = rows - 1;
	}

	var down_inner_invaded = 0;
	var down_inner_space = 0;

	for (var row = down_inner_top;row <= down_inner_bottom;row++) {

		var rc = row * cols;

		for (var col = down_inner_left;col <= down_inner_right;col++) {

			var c = col + rc;

			if (up_range_map[c]) {
				down_inner_invaded += up_range_map[c];
			} else {
				if (board_data[c] == 0) {
					down_inner_space++;
				}
			}

		}

	}

	var up_area_guard_score = up_area_guard * 15;

	if (up_area_guard_score > 50) {
		up_area_guard_score = 50;
	}

	var down_area_guard_score = down_area_guard * 15;

	if (down_area_guard_score > 50) {
		down_area_guard_score = 50;
	}

	var up_area_invaded_score = up_area_invaded * 10;

	if (up_area_invaded_score > 120) {
		up_area_invaded_score = 120;
	}

	var up_inner_invaded_score = up_inner_invaded * 5;

	if (up_inner_invaded_score > 25) {
		up_inner_invaded_score = 25;
	}

	up_area_invaded_score += up_inner_invaded_score;

	var down_area_invaded_score = down_area_invaded * 10;

	if (down_area_invaded_score > 120) {
		down_area_invaded_score = 120;
	}

	var down_inner_invaded_score = down_inner_invaded * 5;

	if (down_inner_invaded_score > 25) {
		down_inner_invaded_score = 25;
	}

	down_area_invaded_score += down_inner_invaded_score;

	if (up_inner_space == 0) {

		up_area_guard_score -= 15;

		if (up_area_invaded > 1) {
			up_area_guard_score -= 30;
		}

		if (up_area_invaded > 2) {
			up_area_guard_score -= 10;
		}

	}

	if (up_area_invaded > 2) {

		if (up_area_guard <= 2) {

			up_area_guard_score -= 40;

			if (up_area_invaded > 5) {
				up_area_guard_score -= 30;
			}

		}

		if (up_area_guard == 0) {
			up_area_guard_score -= 40;
		}

	}

	if (down_inner_space == 0) {

		down_area_guard_score -= 15;

		if (down_area_invaded > 1) {
			down_area_guard_score -= 30;
		}

		if (down_area_invaded > 2) {
			down_area_guard_score -= 10;
		}

	}

	if (down_area_invaded > 2) {

		if (down_area_guard <= 2) {

			down_area_guard_score -= 40;

			if (down_area_invaded > 5) {
				down_area_guard_score -= 30;
			}

		}

		if (down_area_guard == 0) {
			down_area_guard_score -= 40;
		}

	}

	var guard_score = down_area_guard_score - up_area_guard_score;
	var invaded_score = down_area_invaded_score - up_area_invaded_score;

	var score = Math.floor(board_piece_score + guard_score - invaded_score);

	if (turn == -1) {
		score = -score;
	}

	return score;

}

SG99A_BoardProcesser.prototype.getAllMovableHand = function(board, turn) {

	var cols = board.cols;
	var rows = board.rows;

	var king_col = -1;
	var king_row = -1;

	for (var row = 0;row < rows;row++) {
		for (var col = 0;col < cols;col++) {
			if (turn * board.data[col + row * cols] == SG99A_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return this.getAllMovableHandWithKingPos(board, turn, king_col, king_row);

}

SG99A_BoardProcesser.prototype.getAllMovableHandWithKingPos = function(board, turn, king_col, king_row) {

	var cols = board.cols;
	var rows = board.rows;

	var hands = [];
	var result_hands = [];

	var test_board = board.clone();

	for (var row = 0;row < rows;row++) {

		var rc = row * cols;

		if (row == king_row) {
			for (var col = 0;col < cols;col++) {
				if (turn * board.data[col + rc] > 0) {

					var piece_hands = this.getMovableHands(board, col, row);

					var hands_num = piece_hands.length;

					if (col == king_col) {
						for (var i = 0;i < hands_num;i++) {

							var hand = piece_hands[i];

							var kc = hand.to_col;
							var kr = hand.to_row;

							test_board.set(board);
							test_board.putHand(hand);

							if (!this.isInRange(test_board, -turn, kc, kr)) {
								result_hands.push(hand);
							}

						}
					} else {
						for (var i = 0;i < hands_num;i++) {

							var hand = piece_hands[i];

							test_board.set(board);
							test_board.putHand(hand);

							if (!this.isInRange(test_board, -turn, king_col, king_row)) {
								result_hands.push(hand);
							}

						}
					}
				}
			}
		} else {
			for (var col = 0;col < cols;col++) {
				if (turn * board.data[col + rc] > 0) {

					var piece_hands = this.getMovableHands(board, col, row);

					var hands_num = piece_hands.length;

					for (var i = 0;i < hands_num;i++) {

						var hand = piece_hands[i];

						test_board.set(board);
						test_board.putHand(hand);

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							result_hands.push(hand);
						}

					}
				}

			}
		}

	}

	var check_test = this.isInRange(board, -turn, king_col, king_row);

	if (check_test) {

		if (turn < 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.up_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, -i, -1);

					var hands_num = piece_hands.length;

					for (var j = 0;j < hands_num;j++) {

						var hand = piece_hands[j];


						test_board.set(board);
						test_board.putHand(hand);

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							result_hands.push(hand);
						}

					}

				}
			}

		}

		if (turn > 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.down_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, i, -1);

					var hands_num = piece_hands.length;

					for (var j = 0;j < hands_num;j++) {

						var hand = piece_hands[j];

						test_board.set(board);
						test_board.putHand(hand);

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							result_hands.push(hand);
						}

					}

				}
			}

		}

	} else {

		if (turn < 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.up_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, -i, -1);

					if (piece_hands && piece_hands.length > 0) {
						Array.prototype.push.apply(result_hands, piece_hands);
					}

				}
			}

		}

		if (turn > 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.down_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, i, -1);

					if (piece_hands && piece_hands.length > 0) {
						Array.prototype.push.apply(result_hands, piece_hands);
					}

				}
			}

		}

	}

	return result_hands;

}

SG99A_BoardProcesser.prototype.isInRange = function(board, turn, col, row) {

	var board_data = board.data;

	var cols = this.cols;
	var rows = this.rows;

	var cols_p1 = cols + 1;

	var row_p1 = row + 1;

	var scol = col - 1;
	var ecol = col + 1;
	var srow = row - 1;
	var erow = row_p1;

	if (scol < 0) {
		scol = 0;
	}

	if (ecol >= cols) {
		ecol = cols - 1;
	}

	if (srow < 0) {
		srow = 0;
	}

	if (erow >= rows) {
		erow = rows - 1;
	}

	if (turn === -1) {

		for (var r = srow;r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol;c <= ecol;c++) {

				if (r === row && c === col) {
					continue;
				}

				switch (board_data[c + rc]) {

				case SG99A_Piece.M_OU:
				case SG99A_Piece.M_SHA_P:
				case SG99A_Piece.M_KAKU_P:

					return true;

				case SG99A_Piece.M_KIN:
				case SG99A_Piece.M_GIN_P:
				case SG99A_Piece.M_KEI_P:
				case SG99A_Piece.M_KYO_P:
				case SG99A_Piece.M_FU_P:

					if (!((r === row_p1) && (c != col))) {
						return true;
					}

					break;

				case -SG99A_Piece.GIN:

					if (!(r === row) && !((r === row_p1) && (c === col))) {
						return true;
					}

					break;

				case -SG99A_Piece.FU:

					if (r === row - 1 && c === col) {
						return true;
					}

					break;

				}

			}
		}

		if (row > 0) {
			for (var r = row - 1;r >= 0;r--) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p === -SG99A_Piece.KYO || p === -SG99A_Piece.SHA || p === -SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (row < rows - 1) {
			for (var r = row_p1;r < rows;r++) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p === -SG99A_Piece.SHA || p === -SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		var rc = row * cols;

		if (col > 0) {
			for (var c = col - 1;c >= 0;c--) {

				var p = board_data[c + rc];

				if (p === -SG99A_Piece.SHA || p === -SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (col < cols - 1) {
			for (var c = col + 1;c < cols;c++) {

				var p = board_data[c + rc];

				if (p === -SG99A_Piece.SHA || p === -SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if ((col > 0) && (row >= 2) && (board_data[(col - 1) + (row - 2) * cols] === -SG99A_Piece.KEI)) {
			return true;
		}

		if ((col < cols - 1) && (row >= 2) && (board_data[(col + 1) + (row - 2) * cols] === -SG99A_Piece.KEI)) {
			return true;
		}

	}

	if (turn === 1) {

		for (var r = srow;r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol;c <= ecol;c++) {

				if (r === row && c === col) {
					continue;
				}

				switch (board_data[c + rc]) {

				case SG99A_Piece.OU:
				case SG99A_Piece.SHA_P:
				case SG99A_Piece.KAKU_P:

					return true;

				case SG99A_Piece.KIN:
				case SG99A_Piece.GIN_P:
				case SG99A_Piece.KEI_P:
				case SG99A_Piece.KYO_P:
				case SG99A_Piece.FU_P:

					if (!((r === row - 1) && (c != col))) {
						return true;
					}

					break;

				case SG99A_Piece.GIN:

					if (!(r === row) && !((r === row - 1) && (c === col))) {
						return true;
					}

					break;

				case SG99A_Piece.FU:

					if (r === row_p1 && c === col) {
						return true;
					}

					break;

				}

			}
		}

		if (row > 0) {
			for (var r = row - 1;r >= 0;r--) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p === SG99A_Piece.SHA || p === SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (row < rows - 1) {
			for (var r = row_p1;r < rows;r++) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p === SG99A_Piece.KYO || p === SG99A_Piece.SHA || p === SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		var rc = row * cols;

		if (col > 0) {
			for (var c = col - 1;c >= 0;c--) {

				var p = board_data[c + rc];

				if (p === SG99A_Piece.SHA || p === SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (col < cols - 1) {
			for (var c = col + 1;c < cols;c++) {

				var p = board_data[c + rc];

				if (p === SG99A_Piece.SHA || p === SG99A_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if ((col > 0) && (row < rows - 2) && (board_data[(col - 1) + (row + 2) * cols] === SG99A_Piece.KEI)) {
			return true;
		}

		if ((col < cols - 1) && (row < rows - 2) && (board_data[(col + 1) + (row + 2) * cols] === SG99A_Piece.KEI)) {
			return true;
		}

	}

	if (col > 0 && row > 0) {

		var dcol = col - 1;
		var drow = row - 1;

		var to = dcol + drow * cols;

		while (dcol >= 0 && drow >= 0) {

			var p = board_data[to] * turn;

			if (p === SG99A_Piece.KAKU || p === SG99A_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol--;
			drow--;

			to = to - cols_p1;

		}

	}

	if (col < cols - 1 && row > 0) {

		var dcol = col + 1;
		var drow = row - 1;

		while (dcol < cols && drow >= 0) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p === SG99A_Piece.KAKU || p === SG99A_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol++;
			drow--;

		}

	}

	if (col > 0 && row < rows - 1) {

		var dcol = col - 1;
		var drow = row_p1;

		while (dcol >= 0 && drow < rows) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p === SG99A_Piece.KAKU || p === SG99A_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol--;
			drow++;

		}

	}

	if (col < cols - 1 && row < rows - 1) {

		var dcol = col + 1;
		var drow = row_p1;

		var to = dcol + row_p1 * cols;

		while (dcol < cols && drow < rows) {

			var p = board_data[to] * turn;

			if (p === SG99A_Piece.KAKU || p === SG99A_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol++;
			drow++;

			to = to + cols_p1;

		}

	}

	return false;

}

SG99A_BoardProcesser.prototype.setRangeMap = function(board, range_map1, range_map2) {

	var board_cells = board.data;
	var cols = board.cols | 0;
	var rows = board.rows | 0;
	var cells = (cols * rows) | 0;

	var colsm1 = cols - 1;
	var colsp1 = cols + 1;
	var rowsm1 = rows - 1;

	for (var i = 0;i < cells;i = (i + 1) | 0) {

		range_map1[i] = 0;
		range_map2[i] = 0;

	}

	var p_index = 0;
	var row_nt1 = false;

	var bottom_c = rowsm1;
	var sl_array = SG99A_BoardProcesser.SL_ARRAY;

	for (var row = 0;row < rows;row++) {

		var row_nb1 = row < rowsm1;
		var right_c = colsm1;

		for (var col = 0;col < cols;col++) {

			var piece = board_cells[p_index] | 0;

			if (piece != 0) {

				switch (sl_array[piece + 24]) {

				case 1: // M_OU

					if (col > 0) {

						range_map1[p_index - 1] += 1;

						if (row_nt1) {

							range_map1[p_index - cols] += 1;
							range_map1[p_index - colsp1] += 1;

						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsm1] += 1;

						}

						if (right_c > 0) {

							range_map1[p_index + 1] += 1;

							if (row_nt1) {
								range_map1[p_index - colsm1] += 1;
							}

							if (row_nb1) {
								range_map1[p_index + colsp1] += 1;
							}

						}

					} else {

						range_map1[p_index + 1] += 1;

						if (row_nt1) {

							range_map1[p_index - cols] += 1;
							range_map1[p_index - colsm1] += 1;

						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsp1] += 1;

						}

					}

					break;

				case 2: //M_KIN:

					if (col > 0) {

						range_map1[p_index - 1] += 1;

						if (row_nt1) {
							range_map1[p_index - cols] += 1;
						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsm1] += 1;

						}

						if (col < colsm1) {

							range_map1[p_index + 1] += 1;

							if (row_nb1) {
								range_map1[p_index + colsp1] += 1;
							}

						}

					} else {

						range_map1[p_index + 1] += 1;

						if (row_nt1) {
							range_map1[p_index - cols] += 1;
						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsp1] += 1;

						}

					}

					break;

				case 3: //M_GIN:

					if (col > 0) {

						if (row_nt1) {
							range_map1[p_index - colsp1] += 1;
						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsm1] += 1;

						}

						if (col < colsm1) {

							if (row_nt1) {
								range_map1[p_index - colsm1] += 1;
							}

							if (row_nb1) {
								range_map1[p_index + colsp1] += 1;
							}

						}

					} else {

						if (row_nt1) {
							range_map1[p_index - colsm1] += 1;
						}

						if (row_nb1) {

							range_map1[p_index + cols] += 1;
							range_map1[p_index + colsp1] += 1;

						}

					}

					break;

				case 4: // M_KEI:

					var p_pr2 = p_index + cols * 2;

					if(col > 0) {
						range_map1[p_pr2 - 1] += 1;
					}

					if(right_c > 0) {
						range_map1[p_pr2 + 1] += 1;
					}

					break;

				case 5: // M_KYO:

					var to = p_index + cols;

					while (to < cells) {

						range_map1[to] += 1;

						if (board_cells[to] != 0) {
							break;
						}

						to += cols;

					}

					break;

				case 6: // M_SHA

					if (row_nb1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

					}

					if (row_nt1) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

					}

					if (right_c > 0) {

						var to2 = p_index + right_c;

						for (var to = p_index + 1;to <= to2;to = (to + 1) | 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					if (col > 0) {

						var to2 = row * cols;

						for (var to = p_index - 1;to >= to2;to = (to - 1) | 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					break;

				case 7: // M_KAKU

					if (row_nt1) {

						var d_num = col;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsp1;

						}

						var d_num = right_c;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsm1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsm1;

						}

					}

					if (bottom_c > 0) {

						var d_num = col;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsm1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsm1;

						}

						var d_num = right_c;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsp1;

						}

					}

					break;

				case 8: // M_FU

					range_map1[p_index + cols] += 1;

					break;

				case 9: // M_SHA_P:

					if (row_nb1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

						if (col < colsm1) {
							range_map1[p_index + colsp1] += 1;
						}

						if (col > 0) {
							range_map1[p_index + colsm1] += 1;
						}

					}

					if (row_nt1) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

						if (right_c > 0) {
							range_map1[p_index - colsm1] += 1;
						}

						if (col > 0) {
							range_map1[p_index - colsp1] += 1;
						}

					}

					if (right_c > 0) {

						var to2 = p_index + right_c;

						for (var to = p_index + 1;to <= to2;to = (to + 1) | 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					if (col > 0) {

						var to2 = row * cols;

						for (var to = p_index - 1;to >= to2;to = (to - 1) | 0) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					break;

				case 10: // M_KAKU_P:

					if (row_nt1) {

						var d_num = col;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsp1;

						}

						var d_num = right_c;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsm1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsm1;

						}

						range_map1[p_index - cols] += 1;

					}

					if (row < rowsm1) {

						var d_num = col;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsm1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsm1;

						}

						var d_num = right_c;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map1[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsp1;

						}

						range_map1[p_index + cols] += 1;

					}

					if (col > 0) {
						range_map1[p_index - 1] += 1;
					}

					if (right_c > 0) {
						range_map1[p_index + 1] += 1;
					}

					break;

				case 11: // OU:

					if (col > 0) {

						range_map2[p_index - 1] += 1;

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsp1] += 1;

						}

						if (row_nb1) {

							range_map2[p_index + cols] += 1;
							range_map2[p_index + colsm1] += 1;

						}

						if (right_c > 0) {

							range_map2[p_index + 1] += 1;

							if (row_nt1) {
								range_map2[p_index - colsm1] += 1;
							}

							if (row_nb1) {
								range_map2[p_index + colsp1] += 1;
							}

						}

					} else {

						range_map2[p_index + 1] += 1;

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsm1] += 1;

						}

						if (row_nb1) {

							range_map2[p_index + cols] += 1;
							range_map2[p_index + colsp1] += 1;

						}

					}

					break;

				case 12: // KIN:

					if (col > 0) {

						range_map2[p_index - 1] += 1;

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsp1] += 1;

						}

						if (row_nb1) {
							range_map2[p_index + cols] += 1;
						}

						if (right_c > 0) {

							range_map2[p_index + 1] += 1;

							if (row_nt1) {
								range_map2[p_index - colsm1] += 1;
							}

						}

					} else {

						range_map2[p_index + 1] += 1;

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsm1] += 1;

						}

						if (row_nb1) {
							range_map2[p_index + cols] += 1;
						}

					}

					break;

				case 13: // GIN:

					if (col > 0) {

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsp1] += 1;

						}

						if (row_nb1) {
							range_map2[p_index + colsm1] += 1;
						}

						if (right_c > 0) {

							if (row_nt1) {
								range_map2[p_index - colsm1] += 1;
							}

							if (row_nb1) {
								range_map2[p_index + colsp1] += 1;
							}

						}

					} else {

						if (row_nt1) {

							range_map2[p_index - cols] += 1;
							range_map2[p_index - colsm1] += 1;

						}

						if (row_nb1) {
							range_map2[p_index + colsp1] += 1;
						}

					}


					break;

				case 14: // KEI:

					var p_mr2 = p_index - cols * 2;

					if (col > 0) {
						range_map2[p_mr2 - 1] += 1;
					}

					if(right_c > 0) {
						range_map2[p_mr2 + 1] += 1;
					}

					break;

				case 15: // KYO:

					var to = p_index - cols;

					while (to >= 0) {

						range_map2[to] += 1;

						if (board_cells[to] != 0) {
							break;
						}

						to -= cols;

					}

					break;

				case 16: // SG99A_Piece.SHA:

					if (row_nb1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

					}

					if (row_nt1) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

					}

					if (right_c > 0) {

						var to2 = p_index + right_c;

						for (var to = p_index + 1;to <= to2;to = (to + 1) | 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					if (col > 0) {

						var to2 = row * cols;

						for (var to = p_index - 1;to >= to2;to = (to - 1) | 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					break;

				case 17: // KAKU:

					if (row > 0) {

						var d_num = col;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsp1;

						}

						var d_num = right_c;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsm1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsm1;

						}

					}

					if (row < rowsm1) {

						var d_num = col;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsm1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsm1;

						}

						var d_num = right_c;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsp1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsp1;

						}

					}

					break;

				case 18: // FU:

					range_map2[p_index - cols] += 1;

					break;

				case 19: // SG99A_Piece.SHA_P:

					if (row_nb1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

						if (col < colsm1) {
							range_map2[p_index + colsp1] += 1;
						}

						if (col > 0) {
							range_map2[p_index + colsm1] += 1;
						}

					}

					if (row_nt1) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

						if (col < colsm1) {
							range_map2[p_index - colsm1] += 1;
						}

						if (col > 0) {
							range_map2[p_index - colsp1] += 1;
						}

					}

					if (right_c > 0) {

						var to2 = p_index + right_c;

						for (var to = p_index + 1;to <= to2;to = (to + 1) | 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					if (col > 0) {

						var to2 = row * cols;

						for (var to = p_index - 1;to >= to2;to = (to - 1) | 0) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

						}

					}

					break;

				case 20: // KAKU_P:

					if (row > 0) {

						var d_num = col;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsp1;

						for (var i = 0;i < d_num;i += 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsp1;

						}

						var d_num = right_c;

						if (row < d_num) {
							d_num = row;
						}

						var to = p_index - colsm1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to -= colsm1;

						}

						range_map2[p_index - cols] += 1;

					}

					if (bottom_c > 0) {

						var d_num = col;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsm1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsm1;

						}

						var d_num = right_c;

						if (bottom_c < d_num) {
							d_num = bottom_c;
						}

						var to = p_index + colsp1;

						for (var i = 0;i < d_num;i = i + 1) {

							range_map2[to] += 1;

							if (board_cells[to] != 0) {
								break;
							}

							to += colsp1;

						}

						range_map2[p_index + cols] += 1;

					}

					if (col > 0) {
						range_map2[p_index - 1] += 1;
					}

					if (col < colsm1) {
						range_map2[p_index + 1] += 1;
					}

					break;

				}

			}

			p_index = (p_index + 1) | 0;

			right_c--;

		}

		row_nt1 = true;

		bottom_c--;

	}

}

SG99A_BoardProcesser.prototype.getMovableHands = function(board, col, row) {

	var board_cells = board.data;
	var cols = this.cols;
	var rows = this.rows;

	var cols_m1 = cols - 1;
	var cols_p1 = cols + 1;
	var rows_m1 = rows - 1;
	var rows_p1 = rows + 1;

	var promote_rows = this.promote_rows;

	var hands = [];

	if (row === -1) {

		var piece = col;

		switch (piece) {

		case SG99A_Piece.M_FU:

			for (var r = 0; r < rows_m1;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] === 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows_m1;r2++) {
							if (board_cells[c + r2 * cols] === SG99A_Piece.M_FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
						}

					}
				}
			}

			break;

		case SG99A_Piece.FU:

			for (var r = 1; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] === 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] === SG99A_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
						}

					}
				}
			}

			break;

		case -SG99A_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case SG99A_Piece.KEI:

			for (var r = 2; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case SG99A_Piece.M_KYO:

			for (var r = 0; r < rows_m1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case SG99A_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, c, r, false));
					}
				}

			}

		}

	} else {

		var p_index = col + row * cols;
		var piece = board_cells[p_index];

		switch (piece) {

		case SG99A_Piece.M_OU:
		case SG99A_Piece.OU:

			var col_m1 = col - 1;
			var col_p1 = col + 1;
			var row_m1 = row - 1;
			var row_p1 = row + 1;

			if (col > 0) {

				if (piece * board_cells[p_index - 1] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col_m1, row, false));
				}

				if (row > 0) {

					if (piece * board_cells[p_index - cols_p1] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col_m1, row_m1, false));
					}

					if (piece * board_cells[p_index - cols] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, row_m1, false));
					}

				}

				if (row < rows_m1) {

					if (piece * board_cells[p_index + cols_m1] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col_m1, row_p1, false));
					}

					if (piece * board_cells[p_index + cols] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, row_p1, false));
					}

				}

				if (col < cols_m1) {

					if (piece * board_cells[p_index + 1] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row, false));
					}

					if (row > 0) {
						if (piece * board_cells[p_index - cols_m1] <= 0) {
							hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row_m1, false));
						}
					}

					if (row < rows - 1) {
						if (piece * board_cells[p_index + cols_p1] <= 0) {
							hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row_p1, false));
						}
					}

				}

			} else {

				if (piece * board_cells[p_index + 1] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row, false));
				}

				if (row > 0) {

					if (piece * board_cells[p_index - cols_m1] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row_m1, false));
					}

					if (piece * board_cells[p_index - cols] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, row_m1, false));
					}

				}

				if (row < rows_m1) {

					if (piece * board_cells[p_index + cols_p1] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col_p1, row_p1, false));
					}

					if (piece * board_cells[p_index + cols] <= 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, row_p1, false));
					}

				}

			}

			break;

		case SG99A_Piece.M_KIN:
		case SG99A_Piece.M_GIN_P:
		case -SG99A_Piece.KEI - SG99A_Piece.PROMOTED:
		case -SG99A_Piece.KYO - SG99A_Piece.PROMOTED:
		case -SG99A_Piece.FU - SG99A_Piece.PROMOTED:
		case SG99A_Piece.KIN:
		case SG99A_Piece.GIN_P:
		case SG99A_Piece.KEI_P:
		case SG99A_Piece.KYO_P:
		case SG99A_Piece.FU_P:

			var col_m1 = col - 1;
			var col_p1 = col + 1;
			var row_m1 = row - 1;
			var row_p1 = row + 1;

			if (col >= 1 && piece * board_cells[p_index - 1] <= 0) {
				hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), row, false));
			}

			if (col < cols_m1 && piece * board_cells[p_index + 1] <= 0) {
				hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), row, false));
			}

			if (row >= 1 && piece * board_cells[p_index - cols] <= 0) {
				hands.push(SG99A_Hand.createHand(piece, col, row, col, (row - 1), false));
			}

			if (row < rows_m1 && piece * board_cells[p_index + cols] <= 0) {
				hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), false));
			}

			if (piece < 0 && row < rows_m1) {

				if (col >= 1 && board_cells[p_index + cols_m1] >= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
				}

				if (col < cols_m1 && board_cells[p_index + cols_p1] >= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
				}

			}

			if (piece > 0 && row >= 1) {

				if ((col >= 1) && board_cells[(col - 1) + (row - 1) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
				}

				if (col < cols_m1 && board_cells[(col + 1) + (row - 1) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
				}

			}

			break;

		case -SG99A_Piece.GIN:
		case SG99A_Piece.GIN:

			if (row >= 1) {

				if((col >= 1) && (piece * board_cells[p_index - cols_p1] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
				}

				if(piece == SG99A_Piece.GIN && (board_cells[p_index - cols] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row - 1), false));
				}

				if(col < cols_m1 && piece * board_cells[p_index - cols_m1] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
				}

			}

			if (row <= rows - 2) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 1) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
				}

				if(piece == SG99A_Piece.M_GIN && board_cells[col + (row + 1) * cols] >= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), false));
				}

				if(col < cols_m1 && piece * board_cells[(col + 1) + (row + 1) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
				}

			}

			break;

		case -SG99A_Piece.KEI:

			if (row >= rows - 4) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row + 2), true));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row + 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row + 2), true));
				}

			}

			if (row <= rows - 5) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row + 2), false));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row + 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row + 2), false));
				}

			}

			break;

		case SG99A_Piece.KEI:

			if (row <= 3) {

				if(col >= 1 && board_cells[col - 1 + (row - 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), row - 2, true));
				}

				if(col <= cols - 2 && board_cells[col + 1 + (row - 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), row - 2, true));
				}

			}

			if (row >= 4) {

				if(col >= 1 && board_cells[(col - 1) + (row - 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row - 2), false));
				}

				if(col <= cols - 2 && board_cells[(col + 1) + (row - 2) * cols] <= 0) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row - 2), false));
				}

			}

			break;

		case -SG99A_Piece.KYO:

			if ((row === rows - 2) && (board_cells[p_index + cols] >= 0)) {
				hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), true));
			}

			if (row <= rows - 3) {

				for (var r = row + 1;r < rows;r++) {

					var rc = r * cols;

					if (board_cells[col + rc] > 0) {

						if (r === rows - 1) {
							hands.push(SG99A_Hand.createHand(piece, col, row, col, r, true));
						} else {
							hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));
						}

						break;

					}

					if (board_cells[col + rc] < 0) {
						break;
					}

					if (r === rows - 1) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, true));
					} else {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));
					}

				}

			}

			break;

		case SG99A_Piece.KYO:

			if ((row === 1) && (board_cells[col] <= 0)) {
				hands.push(SG99A_Hand.createHand(piece, col, row, col, 0, true));
			}

			if (row >= 2) {

				for (var r = row - 1;r >= 0;r--) {

					if (board_cells[col + r * cols] < 0) {

						if (r == 0) {
							hands.push(SG99A_Hand.createHand(piece, col, row, col, r, true));
						} else {
							hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));
						}

						break;

					}

					if (board_cells[col + r * cols] > 0) {
						break;
					}

					if (r === 0) {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, true));
					} else {
						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));
					}

				}

			}

			break;

		case -SG99A_Piece.SHA:
		case -SG99A_Piece.SHA_P:
		case SG99A_Piece.SHA:
		case SG99A_Piece.SHA_P:

			if (piece === SG99A_Piece.M_SHA_P || piece === SG99A_Piece.SHA_P) {

				if (col < cols_m1) {

					if (row >= 1 && (piece * board_cells[col + 1 + (row - 1) * cols] <= 0)) {
						hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
					}

					if (row < rows_m1 && (piece * board_cells[p_index + cols_p1] <= 0)) {
						hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
					}

				}

				if (col >= 1) {

					if (row >= 1 && (piece * board_cells[col - 1 + (row - 1) * cols] <= 0)) {
						hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
					}

					if (row <= rows - 2 && (piece * board_cells[col - 1 + (row + 1) * cols] <= 0)) {
						hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
					}

				}

			}

			var rowc = row * cols;

			if (col < cols_m1) {

				for (var c = col + 1;c < cols;c++) {

					if (piece * board_cells[c + rowc] < 0) {

						hands.push(SG99A_Hand.createHand(piece, col, row, c, row, false));

						break;

					}

					if (piece * board_cells[c + rowc] > 0) {
						break;
					}

					hands.push(SG99A_Hand.createHand(piece, col, row, c, row, false));

				}

			}

			if (col >= 1) {

				for (var c = col - 1;c >= 0;c--) {

					if (piece * board_cells[c + rowc] < 0) {

						hands.push(SG99A_Hand.createHand(piece, col, row, c, row, false));

						break;

					}

					if (piece * board_cells[c + rowc] > 0) {
						break;
					}

					hands.push(SG99A_Hand.createHand(piece, col, row, c, row, false));

				}

			}

			if (row < rows_m1) {

				for (var r = row + 1;r < rows;r++) {

					var rc = r * cols;

					if (piece * board_cells[col + rc] < 0) {

						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));

						break;

					}

					if (piece * board_cells[col + rc] > 0) {
						break;
					}

					hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));

				}

			}

			if (row >= 1) {

				for (var r = row - 1;r >= 0;r--) {

					var rc = r * cols;

					if (piece * board_cells[col + rc] < 0) {

						hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));

						break;

					}

					if (piece * board_cells[col + rc] > 0) {
						break;
					}

					hands.push(SG99A_Hand.createHand(piece, col, row, col, r, false));

				}

			}

			break;

		case -SG99A_Piece.KAKU:
		case -SG99A_Piece.KAKU - SG99A_Piece.PROMOTED:
		case SG99A_Piece.KAKU:
		case SG99A_Piece.KAKU_P:

			if (piece === -SG99A_Piece.KAKU - SG99A_Piece.PROMOTED || piece === SG99A_Piece.KAKU_P) {

				if (col < cols_m1 && (piece * board_cells[p_index + 1] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col + 1), row, false));
				}

				if (col >= 1 && (piece * board_cells[p_index - 1] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, (col - 1), row, false));
				}

				if (row < rows_m1 && (piece * board_cells[p_index + cols] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), false));
				}

				if (row >= 1 && (piece * board_cells[p_index - cols] <= 0)) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row - 1), false));
				}

			}

			var dcol = col + 1;
			var drow = row + 1;

			var dp_index = p_index + cols_p1;

			while (dcol < cols && drow < rows) {

				var p = piece * board_cells[dp_index];

				if (p < 0) {

					hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol++;
				drow++;
				dp_index = dp_index + cols_p1;

			}

			dcol = col - 1;
			drow = row + 1;

			var dp_index = p_index + cols_m1;

			while (dcol >= 0 && drow < rows) {

				var p = piece * board_cells[dp_index];

				if (p < 0) {

					hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol--;
				drow++;

				dp_index = dp_index + cols_m1;

			}

			dcol = col + 1;
			drow = row - 1;

			var dp_index = p_index - cols_m1;

			while (dcol < cols && drow >= 0) {

				var p = piece * board_cells[dp_index];

				if (p < 0) {

					hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol++;
				drow--;

				dp_index = dp_index - cols_m1;

			}

			dcol = col - 1;
			drow = row - 1;

			var dp_index = p_index - cols_p1;

			while (dcol >= 0 && drow >= 0) {

				var p = piece * board_cells[dp_index];

				if (p < 0) {

					hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(SG99A_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol--;
				drow--;

				dp_index = dp_index - cols_p1;

			}

			break;

		case SG99A_Piece.M_FU:

			if (row < rows_m1 && board_cells[p_index + cols] >= 0) {
				if (row == rows - 2) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), true));
				} else {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row + 1), false));
				}
			}

			break;

		case SG99A_Piece.FU:

			if (row >= 1 && board_cells[p_index - cols] <= 0) {
				if (row == 1) {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row - 1), true));
				} else {
					hands.push(SG99A_Hand.createHand(piece, col, row, col, (row - 1), false));
				}
			}

			break;

		}

		var promote_hands = [];

		switch (piece) {

		case SG99A_Piece.GIN:
		case SG99A_Piece.KEI:
		case SG99A_Piece.KYO:
		case SG99A_Piece.SHA:
		case SG99A_Piece.KAKU:
		case SG99A_Piece.FU:

			for (var i = 0;i < hands.length;i++) {

				var hand = hands[i];

				if (((hand.to_row <= this.up_promote_row) || (hand.from_row <= this.up_promote_row)) && !hand.promote) {
					promote_hands.push(SG99A_Hand.createHand(piece, hand.from_col, hand.from_row, hand.to_col, hand.to_row, true));
				}

			}

			break;

		case SG99A_Piece.M_GIN:
		case SG99A_Piece.M_KEI:
		case SG99A_Piece.M_KYO:
		case SG99A_Piece.M_SHA:
		case SG99A_Piece.M_KAKU:
		case SG99A_Piece.M_FU:

			for (var i = 0;i < hands.length;i++) {

				var hand = hands[i];

				if (((hands[i].to_row >= this.down_promote_row) || (hands[i].from_row >= this.down_promote_row)) && !hand.promote) {
					promote_hands.push(SG99A_Hand.createHand(piece, hand.from_col, hand.from_row, hand.to_col, hand.to_row, true));
				}

			}

			break;

		}

		for (var i = 0;i < promote_hands.length;i++) {
			hands.push(promote_hands[i]);
		}

	}

	return hands;

}

SG99A_BoardProcesser.prototype.canTableMovableHand = function(board, turn, col, check_test, king_col, king_row) {

	var test_board = board.clone();

	var hand_num = 0;

	var cols = board.cols;
	var rows = board.rows;
	var board_cells = board.data;

	if (check_test) {

		var piece = col;

		switch (piece) {

		case -SG99A_Piece.FU:

			for (var r = 0; r < rows - 1;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] === 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows - 1;r2++) {
							if (board_cells[c + r2 * cols] === -SG99A_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {

							test_board.data[c + rc] = piece;

							if (!this.isInRange(test_board, -turn, king_col, king_row)) {
								return true;
							}

							test_board.data[c + rc] = 0;

						}

					}
				}
			}

			break;

		case SG99A_Piece.FU:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] === 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] === SG99A_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {

							test_board.data[c + r * cols] = piece;

							if (!this.isInRange(test_board, -turn, king_col, king_row)) {
								return true;
							}

							test_board.data[c + r * cols] = 0;

						}

					}
				}
			}

			break;

		case -SG99A_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case SG99A_Piece.KEI:

			for (var r = 2; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case -SG99A_Piece.KYO:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case SG99A_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] === 0) {

						test_board.data[c + rc] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + rc] = 0;

					}
				}

			}

		}

	} else {

		piece = col;

		switch (piece) {

		case -SG99A_Piece.FU:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] === 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows - 1;r2++) {
							if (board_cells[c + r2 * cols] === -SG99A_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							return true;
						}

					}
				}
			}

			break;

		case SG99A_Piece.FU:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] === 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] === SG99A_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							return true;
						}

					}
				}
			}

			break;

		case -SG99A_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						return true;
					}
				}
			}

			break;

		case SG99A_Piece.KEI:

			for (var r = 2; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						return true;
					}
				}
			}

			break;

		case -SG99A_Piece.KYO:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						return true;
					}
				}
			}

			break;

		case SG99A_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] === 0) {
						return true;
					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] === 0) {
						return true;
					}
				}

			}

		}

	}

	return false;

}

SG99A_BoardProcesser.prototype.canMoveHandWithKingPos = function(board, turn, col, row, king_col, king_row) {

	var test_board = board.clone();

	var hand_num = 0;

	var cols = test_board.cols;
	var rows = test_board.rows;
	var board_cells = test_board.data;

	var from = col + row * cols;

	var piece = board_cells[col + row * cols];

	switch (piece) {

	case -SG99A_Piece.OU:
	case SG99A_Piece.OU:

		var scol = col - 1, ecol = col + 1;
		var srow = row - 1, erow = row + 1;

		if (scol < 0) {
			scol = 0;
		}

		if (ecol > cols - 1) {
			ecol = cols - 1;
		}

		if (srow < 0) {
			srow = 0;
		}

		if (erow > rows - 1) {
			erow = rows - 1;
		}

		for (var r = srow; r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol; c <= ecol;c++) {

				var to = c + rc;

				if (piece * board_cells[to] <= 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, c, r)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}
		}

		break;

	case -SG99A_Piece.KIN:
	case -SG99A_Piece.GIN - SG99A_Piece.PROMOTED:
	case -SG99A_Piece.KEI - SG99A_Piece.PROMOTED:
	case -SG99A_Piece.KYO - SG99A_Piece.PROMOTED:
	case -SG99A_Piece.FU - SG99A_Piece.PROMOTED:
	case SG99A_Piece.KIN:
	case SG99A_Piece.GIN + SG99A_Piece.PROMOTED:
	case SG99A_Piece.KEI + SG99A_Piece.PROMOTED:
	case SG99A_Piece.KYO + SG99A_Piece.PROMOTED:
	case SG99A_Piece.FU + SG99A_Piece.PROMOTED:

		var to = (col - 1) + row * cols;

		if (col >= 1 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = (col + 1) + row * cols;

		if (col <= cols - 2 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = col + (row - 1) * cols;

		if (row >= 1 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = col + (row + 1) * cols;

		if (row <= rows - 2 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = to;

		}

		if (piece < 0 && row <= rows - 2) {

			var to = (col - 1) + (row + 1) * cols;

			if (col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 1) * cols;

			if (col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = to;

			}

		}

		if (piece > 0 && row >= 1) {

			var to = (col - 1) + (row - 1) * cols;

			if (col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row - 1) * cols;

			if (col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -SG99A_Piece.GIN:
	case SG99A_Piece.GIN:

		if (row >= 1) {

			var rm1c = (row - 1) * cols;
			var to = (col - 1) + rm1c;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + rm1c;

			if(piece == SG99A_Piece.GIN && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + rm1c;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 2) {

			var to = (col - 1) + (row + 1) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + (row + 1) * cols;

			if(piece == -SG99A_Piece.GIN && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 1) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -SG99A_Piece.KEI:

		if (row == rows - 3) {

			var to = (col - 1) + (row + 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 4) {

			var to = (col - 1) + (row + 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case SG99A_Piece.KEI:

		if (row == 2) {

			var to = col - 1;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + 1;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row >= 3) {

			var to = (col - 1) + (row - 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row - 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -SG99A_Piece.KYO:

		var to = col + (row + 1) * cols;

		if ((row == rows - 2) && (board_cells[to] >= 0)) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		if (row <= rows - 3) {

			for (var r = row + 1;r < rows;r++) {

				var rc = r * cols;

				var to = col + rc;

				if (board_cells[to] > 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (board_cells[to] < 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case SG99A_Piece.KYO:

		if ((row == 1) && (board_cells[col] <= 0)) {

			var tmp = test_board.data[col];

			test_board.data[from] = 0;
			test_board.data[col] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[col] = tmp;

		}

		if (row >= 2) {

			for (var r = row - 1;r >= 0;r--) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -SG99A_Piece.SHA:
	case -SG99A_Piece.SHA_P:
	case SG99A_Piece.SHA:
	case SG99A_Piece.SHA_P:

		if (piece == (-SG99A_Piece.SHA_P) || piece == (SG99A_Piece.SHA_P)) {

			if (col <= cols - 2) {

				var to = col + 1 + (row - 1) * cols;

				if (row >= 1 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = to;

				}

				var to = col + 1 + (row + 1) * cols;

				if (row <= rows - 2 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}

			if (col >= 1) {

				var to = col - 1 + (row - 1) * cols;

				if (row >= 1 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

				var to = col - 1 + (row + 1) * cols;

				if (row <= rows - 2 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}

		}

		if (col <= cols - 2) {

			var rc = row * cols;

			for (var c = col + 1;c < cols;c++) {

				var to = c + rc;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (col >= 1) {

			var rc = row * cols;

			for (var c = col - 1;c >= 0;c--) {

				var to = c + rc;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 2) {

			for (var r = row + 1;r < rows;r++) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					break;

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row >= 1) {

			for (var r = row - 1;r >= 0;r--) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -SG99A_Piece.KAKU:
	case -SG99A_Piece.KAKU_P:
	case SG99A_Piece.KAKU:
	case SG99A_Piece.KAKU_P:

		if (piece == -SG99A_Piece.KAKU_P || piece == SG99A_Piece.KAKU_P) {

			var to = col + 1 + row * cols;

			if (col <= cols - 2 && (piece * board_cells[to] <= 0)) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			if (col >= 1 && (piece * board_cells[col - 1 + row * cols] <= 0)) {

				var tmp = test_board.data[col - 1 + row * cols];

				test_board.data[from] = 0;
				test_board.data[col - 1 + row * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col - 1 + row * cols] = tmp;

			}

			if (row <= rows - 2 && (piece * board_cells[col + (row + 1) * cols] <= 0)) {

				var tmp = test_board.data[col + (row + 1) * cols];

				test_board.data[from] = 0;
				test_board.data[col + (row + 1) * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col + (row + 1) * cols] = tmp;

			}

			if (row >= 1 && (piece * board_cells[col + (row - 1) * cols] <= 0)) {

				var tmp = test_board.data[col + (row - 1) * cols];

				test_board.data[from] = 0;
				test_board.data[col + (row - 1) * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col + (row - 1) * cols] = tmp;

			}

		}

		var d = 1;

		var dcol = col + d;
		var drow = row + d;

		while (dcol < cols && drow < rows) {

			var to = dcol + drow * cols;

			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol++;
			drow++;

		}

		d = 1;

		dcol = col - d;
		drow = row + d;

		while (dcol >= 0 && drow < rows) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol--;
			drow++;

		}

		d = 1;

		dcol = col + d;
		drow = row - d;

		while (dcol < cols && drow >= 0) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol++;
			drow--;

		}

		d = 1;

		dcol = col - d;
		drow = row - d;

		while (dcol >= 0 && drow >= 0) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;


				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol--;
			drow--;

		}

		break;

	case -SG99A_Piece.FU:

		var to = col + (row + 1) * cols;

		if (row <= rows - 2 && board_cells[to] >= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		break;

	case SG99A_Piece.FU:

		var to = col + (row - 1) * cols;

		if (row >= 1 && board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		break;

	}

	return false;

}

SG99A_BoardProcesser.prototype.isLose = function(board, turn) {

	var king_col = -1;
	var king_row = -1;

	var cols = board.cols;
	var rows = board.rows;

	var board_data = board.data;

	for (var row = 0;row < rows;row++) {
		for (var col = 0;col < cols;col++) {
			if (board_data[col + row * cols] * turn == SG99A_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return this.isLoseWithKingPos(board, turn, king_col, king_row);

}

SG99A_BoardProcesser.prototype.isLoseWithKingPos = function(board, turn, king_col, king_row) {

	var cols = board.cols;
	var rows = board.rows;

	var board_data = board.data;

	var scol = king_col - 1, ecol = king_col + 1;
	var srow = king_row - 1, erow = king_row + 1;

	if (scol < 0) {
		scol = 0;
	}

	if (ecol > cols - 1) {
		ecol = cols - 1;
	}

	if (srow < 0) {
		srow = 0;
	}

	if (erow > rows - 1) {
		erow = rows - 1;
	}

	var test_board = board.clone();
	test_board.data[king_col + king_row * cols] = 0;

	for (var r = srow; r <= erow;r++) {

		var rc = r * cols;

		for (var c = scol; c <= ecol;c++) {

			if (!(c == king_col && r == king_row) && (turn * test_board.data[c + rc] <= 0) && !this.isInRange(test_board, -turn, c, r)) {
				return false;
			}

		}

	}

	for (var row = 0;row < rows;row++) {

		var rc = row * cols;

		for (var col = 0;col < cols;col++) {
			if (turn * board_data[col + rc] > 0) {

				var test = this.canMoveHandWithKingPos(board, turn, col, row, king_col, king_row);

				if (test) {
					return false;
				}

			}
		}
	}

	var check_test = this.isInRange(board, -turn, king_col, king_row);

	var hand_num = 0;

	if (turn < 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.up_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, -i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	if (turn > 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.down_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	return true;

}

SG99A_BoardProcesser.prototype.isLoseWithKingPosAndRangeMap = function(board, turn, king_col, king_row, enemy_range_map) {

	var cols = board.cols;
	var rows = board.rows;

	var board_data = board.data;

	var scol = king_col - 1, ecol = king_col + 1;
	var srow = king_row - 1, erow = king_row + 1;

	if (scol < 0) {
		scol = 0;
	}

	if (ecol > cols - 1) {
		ecol = cols - 1;
	}

	if (srow < 0) {
		srow = 0;
	}

	if (erow > rows - 1) {
		erow = rows - 1;
	}

	for (var r = srow; r <= erow;r++) {

		var rc = r * cols;

		for (var c = scol; c <= ecol;c++) {

			if (!(c == king_col && r == king_row) && (turn * board.data[c + rc] <= 0) && !enemy_range_map[c + rc]) {
				return false;
			}

		}

	}

	for (var row = 0;row < rows;row++) {

		var rc = row * cols;

		for (var col = 0;col < cols;col++) {
			if (turn * board_data[col + rc] > 0) {

				var test = this.canMoveHandWithKingPos(board, turn, col, row, king_col, king_row);

				if (test) {
					return false;
				}

			}
		}
	}

	var check_test = this.isInRange(board, -turn, king_col, king_row);

	var hand_num = 0;

	if (turn < 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.up_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, -i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	if (turn > 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.down_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	return true;

}