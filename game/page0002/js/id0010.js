function SG99A_BoardView(app, ui_listener, cols, rows) {

	SG99A_Component.call(this, app, ui_listener);

	this.cols = cols;
	this.rows = rows;

	this.draw_scale = 1;

	this.cell_width = undefined;
	this.cell_height = undefined;

	this.game = null;
	this.holding = null;
	this.movable_hands = null;

	this.last_moved = null;
	this.lose_cell = null;

}

SG99A_BoardView.prototype = Object.create(SG99A_Component.prototype);
SG99A_BoardView.prototype.constructor = SG99A_BoardView;

SG99A_BoardView.prototype.createElement = function() {

	this.element = document.createElement('canvas');

	this.element.style.display = 'block';
	this.element.style.position = 'absolute';

	this.setBackground('#ccffff');

}

SG99A_BoardView.prototype.onRectSetted = function() {

	SG99A_Component.prototype.onRectSetted.call(this);

	this.draw_scale = this.app.draw_scale;

	this.cell_width = Math.floor(this.rect.width / (this.cols + 0.25));
	this.cell_height = Math.floor(this.rect.height / (this.rows + 0.25));

	this.board_padding_x = Math.floor((this.rect.width - this.cell_width * this.cols) / 2);
	this.board_padding_y = Math.floor((this.rect.height - this.cell_height * this.rows) / 2);

	this.bg_img = document.createElement('canvas');

	var draw_width = this.rect.width * this.draw_scale;
	var draw_height = this.rect.height * this.draw_scale;

	this.draw_width = draw_width;
	this.draw_height = draw_height;

	this.element.width = this.draw_width;
	this.element.height = this.draw_height;

	this.bg_img.width = this.draw_width;
	this.bg_img.height = this.draw_height;

	var context = this.bg_img.getContext('2d');

	var bg_data = context.getImageData(0, 0, this.draw_width, this.draw_height);

	for (var i = 0;i < draw_width * draw_height;i++) {

		var r = Math.floor(188 + Math.random() * 8);
		var g = Math.floor(204 + Math.random() * 12);
		var b = Math.floor(212 + Math.random() * 20);
		var a = 255;

		bg_data.data[i * 4] = r;
		bg_data.data[i * 4 + 1] = g;
		bg_data.data[i * 4 + 2] = b;
		bg_data.data[i * 4 + 3] = a;

	}

	context.putImageData(bg_data, 0, 0);

	var board_padding_x = this.board_padding_x * this.draw_scale;
	var board_padding_y = this.board_padding_y * this.draw_scale;
	var cell_width = this.cell_width * this.draw_scale;
	var cell_height = this.cell_height * this.draw_scale;

	var line_width = Math.min(4, Math.floor(1 + this.rect.width / 500));

	context.fillStyle = '#eeffee';

	context.lineWidth = line_width;
	context.strokeStyle = '#112233';

	// 蜊岼謠冗判
	for (var col = 0;col <= this.cols;col++) {

		context.beginPath();

		context.moveTo(board_padding_x + col * cell_width, board_padding_y);
		context.lineTo(board_padding_x + col * cell_width, board_padding_y + this.rows * cell_height);

		context.closePath();
		context.stroke();

	}

	for (var row = 0;row <= this.rows;row++) {

		context.beginPath();

		context.moveTo(board_padding_x, board_padding_y + row * cell_height);
		context.lineTo(board_padding_x + this.cols * cell_width, board_padding_y + row * cell_height);

		context.closePath();
		context.stroke();

	}

}

SG99A_BoardView.prototype.setPieceImages = function(images) {
	this.piece_images = images;
}

SG99A_BoardView.prototype.setGame = function(game) {
	this.game = game;
}

SG99A_BoardView.prototype.update = function() {

	if (this.bg_img == null) {
		return;
	}

	var context = this.element.getContext('2d');

	var board_padding_x = this.board_padding_x * this.draw_scale;
	var board_padding_y = this.board_padding_y * this.draw_scale;
	var cell_width = this.cell_width * this.draw_scale;
	var cell_height = this.cell_height * this.draw_scale;

	var mark_width = Math.floor(1 + cell_width / 16);

	context.drawImage(this.bg_img, 0, 0);

	if (this.piece_images != null && this.game != null) {

		var cols = this.game.board.cols;
		var board_data = this.game.board.data;

		if (this.last_moved) {

			context.fillStyle = '#6699cc';

			var cell_left = board_padding_x + cell_width * this.last_moved.col;
			var cell_top = board_padding_y + cell_height * this.last_moved.row;

			context.fillRect(cell_left, cell_top, cell_width, cell_height);

		}

		if (this.lose_cell) {

			context.fillStyle = '#cc3333';

			var cell_left = board_padding_x + cell_width * this.lose_cell.col;
			var cell_top = board_padding_y + cell_height * this.lose_cell.row;

			context.fillRect(cell_left, cell_top, cell_width, cell_height);

		}

		if (this.checked_cell) {

			context.fillStyle = '#cc6633';

			var cell_left = board_padding_x + cell_width * this.checked_cell.col;
			var cell_top = board_padding_y + cell_height * this.checked_cell.row;

			context.fillRect(cell_left, cell_top, cell_width, cell_height);

		}

		for (var row = 0;row < this.rows;row++) {
			for (var col = 0;col < this.cols;col++) {

				var piece = board_data[col + row * cols];

				var cell_left = board_padding_x + cell_width * col;
				var cell_top = board_padding_y + cell_height * row;

				if (this.piece_images[piece]) {
					context.drawImage(this.piece_images[piece], cell_left, cell_top);
				}

			}
		}

		if (this.holding && this.holding.row >= 0) {

			context.strokeStyle = '#333399';
			context.lineWidth = mark_width;

			var cell_left = board_padding_x + cell_width * this.holding.col;
			var cell_top = board_padding_y + cell_height * this.holding.row;

			context.strokeRect(cell_left + 1, cell_top + 1, cell_width - 2, cell_height - 2);

		}

		if (this.movable_hands) {

			context.fillStyle = '#999966';

			for (var i = 0;i < this.movable_hands.length;i++) {

				var hand = this.movable_hands[i];

				var cell_center_x = Math.floor(board_padding_x + cell_width * (hand.to_col + 0.5));
				var cell_center_y = Math.floor(board_padding_y + cell_height * (hand.to_row + 0.5));

				var dot_range = Math.floor(cell_width / 8);

				context.fillRect(cell_center_x - dot_range, cell_center_y - dot_range, dot_range * 2, dot_range * 2);

			}

		}

	}

}

SG99A_BoardView.prototype.onElementClicked = function(x, y) {

	var col = Math.floor((x - this.board_padding_x) / this.cell_width);
	var row = Math.floor((y - this.board_padding_y) / this.cell_height);

	if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
		this.ui_listener.onBoardViewCellClicked(col, row);
	}

}

SG99A_BoardView.prototype.setHolding = function(col, row) {

	this.holding = {'col': col, 'row': row};

	this.update();

}

SG99A_BoardView.prototype.resetHolding = function() {

	this.holding = null;

	this.update();

}

SG99A_BoardView.prototype.setMovableHands = function(hands) {

	this.movable_hands = hands;

	this.update();

}

SG99A_BoardView.prototype.resetMovableHands = function() {

	this.movable_hands = null;

	this.update();

}

SG99A_BoardView.prototype.setCheckedCell = function(cell) {

	this.checked_cell = cell;

	this.update();

}
SG99A_BoardView.prototype.resetCheckedCell = function() {

	this.checked_cell = null;

	this.update();

}

SG99A_BoardView.prototype.getLastMoved = function() {
	return this.last_moved;
}

SG99A_BoardView.prototype.setLastMoved = function(col, row) {
	this.last_moved = {'col': col, 'row': row};
}

SG99A_BoardView.prototype.resetLastMoved = function() {
	this.last_moved = null;
}

SG99A_BoardView.prototype.setLose = function(player) {

	var lose_col = -1;
	var lose_row = -1;

	for (var row = 0;row < this.rows;row++) {
		for (var col = 0;col < this.cols;col++) {
			if (this.game.board.data[col + row * this.cols] * player == SG99A_Piece.OU) {

				lose_col = col;
				lose_row = row;

				break;

			}
		}
	}

	this.lose_cell = {'col': lose_col, 'row': lose_row};

}

SG99A_BoardView.prototype.resetLose = function() {
	this.lose_cell = null;
}

SG99A_BoardView.prototype.reset = function() {

	this.resetHolding();
	this.resetHolding();
	this.resetMovableHands();
	this.resetCheckedCell();
	this.resetLastMoved();
	this.resetLose();

}