/*
	将棋ゲーム本体
*/
function SG99A(element, left, top, width, height) {

	var frame_r_width = 1.0;

	this.header_r_height = 0.1;
	this.board_r_height = 1.0;
	this.table_r_height = 0.15;

	var frame_aspect = frame_r_width / (this.header_r_height + (this.table_r_height * 2) + this.board_r_height);

	// 配置サイズ算出
	var frame_width = Math.min(width, Math.floor(height / frame_aspect));
	var frame_height = Math.floor(frame_width / frame_aspect);

	this.rect = SG99A_Rect.createRect(left, top, frame_width, frame_height);

	this.element = document.createElement('div');

	this.element.style.position = 'relative';
	this.element.style.width = frame_width + 'px';
	this.element.style.height = frame_height + 'px';
	this.element.style.background = '#336699';

	element.appendChild(this.element);

	element.addEventListener('touchstart', function(e) {
		e.stopPropagation();
	}, false);

	this.init();

}

SG99A.GAME_STAGE_NONE = 0;
SG99A.GAME_STAGE_UP_HUMAN_SELECTING = 1;
SG99A.GAME_STAGE_UP_HUMAN_HOLDING = 2;
SG99A.GAME_STAGE_UP_HUMAN_PUTING = 3;
SG99A.GAME_STAGE_UP_HUMAN_PUTTED = 4;
SG99A.GAME_STAGE_UP_CPU_SELECTING = 5;
SG99A.GAME_STAGE_UP_CPU_HOLDING = 6;
SG99A.GAME_STAGE_UP_CPU_PUTTED = 7;
SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING = 8;
SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING = 9;
SG99A.GAME_STAGE_DOWN_HUMAN_PUTING = 10;
SG99A.GAME_STAGE_DOWN_HUMAN_PUTTED = 11;
SG99A.GAME_STAGE_DOWN_CPU_SELECTING = 12;
SG99A.GAME_STAGE_DOWN_CPU_HOLDING = 13;
SG99A.GAME_STAGE_DOWN_CPU_PUTTED = 14;
SG99A.GAME_STAGE_RESULT = 15;
SG99A.GAME_STAGE_DRAW = 16;

SG99A.PLAYER_NONE = 0;
SG99A.PLAYER_HUMAN = 1;
SG99A.PLAYER_CPU_LV1 = 2;
SG99A.PLAYER_CPU_LV2 = 3;
SG99A.PLAYER_CPU_LV3 = 4;
SG99A.PLAYER_CPU_LV4 = 5;

SG99A.prototype.random = function() {
	return this.rnd.nextFloat();
}

SG99A.prototype.randomInt = function(max) {
	return Math.floor(this.rnd.nextFloat() * (max + 1));
}

SG99A.prototype.init = function() {

	// 盤面サイズ
	this.board_cols = 9;
	this.board_rows = 9;

	// 成り範囲
	this.board_promote_rows = 3;

	// Canvas描画倍率
	this.draw_scale = 1;

	// 文字列リソース
	this.text_res = [];

	this.text_res['promote_dialog_text'] = '成りますか？';
	this.text_res['promote_dialog_yes'] = 'はい';
	this.text_res['promote_dialog_no'] = 'いいえ';
	this.text_res['start_button_label'] = '新ゲーム';
	this.text_res['undo_button_label'] = '待った';
	this.text_res['player_human'] = '人間';
	this.text_res['cpu_lv1'] = 'CPU Lv1';
	this.text_res['cpu_lv2'] = 'CPU Lv2';
	this.text_res['cpu_lv3'] = 'CPU Lv3';
	this.text_res['cpu_lv4'] = 'CPU Lv4';
	this.text_res['setting_1st'] = '先 手';
	this.text_res['setting_2nd'] = '後 手';
	this.text_res['setting_ok'] = '決 定';
	this.text_res['setting_cancel'] = '戻 る';
	this.text_res['turn_label_1st'] = '先手';
	this.text_res['turn_label_2nd'] = '後手';
	this.text_res['turn_num_label'] = '[:n:]手目';
	this.text_res['player_label'] = [];
	this.text_res['player_label'][SG99A.PLAYER_HUMAN] = '人間';
	this.text_res['player_label'][SG99A.PLAYER_CPU_LV1] = 'CPU LV1';
	this.text_res['player_label'][SG99A.PLAYER_CPU_LV2] = 'CPU LV2';
	this.text_res['player_label'][SG99A.PLAYER_CPU_LV3] = 'CPU LV3';
	this.text_res['player_label'][SG99A.PLAYER_CPU_LV4] = 'CPU LV4';

	this.piece = new SG99A_Piece();

	this.piece_images = null;

	// ピクセル表示倍率に応じてCanvas描画倍率を設定
	if (window.devicePixelRatio) {

		if (window.devicePixelRatio >= 1.5 && this.rect.width < 800) {
			this.draw_scale = 1.5;
		}

		if (window.devicePixelRatio >= 2.0 && this.rect.width < 500) {
			this.draw_scale = 2.0;
		}

		if (window.devicePixelRatio >= 3.0 && this.rect.width < 400) {
			this.draw_scale = 3.0;
		}

	}

	this.default_font_size = 4 + Math.floor(this.rect.width / 40);

	var header_width = this.rect.width;
	var header_height = Math.floor(this.rect.width * this.header_r_height);

	var table_height = Math.floor(this.rect.width * this.table_r_height);
	var table_width = Math.floor(table_height * 5.2);

	var board_height = Math.floor(this.rect.width * this.board_r_height);
	var board_width = board_height;

	var header_left = 0;
	var header_top = 0;

	var up_table_left = this.rect.width - table_width;
	var up_table_top = header_top + header_height;

	var board_left = 0;
	var board_top = up_table_top + table_height;

	var down_table_left = 0;
	var down_table_top = board_top + board_height;

	this.header = new SG99A_Header(this, this);
	this.board_view = new SG99A_BoardView(this, this, this.board_cols, this.board_cols);

	this.up_table_view = new SG99A_TableView(this, this, -1, [SG99A_Piece.KIN, SG99A_Piece.GIN, SG99A_Piece.KEI, SG99A_Piece.KYO, SG99A_Piece.SHA, SG99A_Piece.KAKU]);
	this.down_table_view = new SG99A_TableView(this, this, 1, [SG99A_Piece.KIN, SG99A_Piece.GIN, SG99A_Piece.KEI, SG99A_Piece.KYO, SG99A_Piece.SHA, SG99A_Piece.KAKU]);

	this.header.setRect(header_left, header_top, header_width, header_height);
	this.board_view.setRect(board_left, board_top, board_width, board_height);

	this.up_table_view.setRect(up_table_left, up_table_top, table_width, table_height);
	this.down_table_view.setRect(down_table_left, down_table_top, table_width, table_height);

	this.PromoteDialog = {};

	this.PromoteDialog.element = document.createElement('div');

	this.PromoteDialog.element.style.display = 'none';
	this.PromoteDialog.element.style.position = 'absolute';
	this.PromoteDialog.element.style.border = '2px solid';
	this.PromoteDialog.element.style.background = '#d8e0e4';
	this.PromoteDialog.element.style.width = Math.floor(this.board_view.rect.width * 0.52) + 'px';
	this.PromoteDialog.element.style.height = Math.floor(this.board_view.rect.width * 0.3) + 'px';
	this.PromoteDialog.element.style.left = Math.floor(this.board_view.rect.width * 0.23) + 'px';
	this.PromoteDialog.element.style.top = Math.floor(this.board_view.rect.width * 0.65) + 'px';

	this.PromoteDialog.text = document.createElement('div');

	this.PromoteDialog.text.style.position = 'absolute';
	this.PromoteDialog.text.style.width = Math.floor(this.board_view.rect.width * 0.54) + 'px';
	this.PromoteDialog.text.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
	this.PromoteDialog.text.style.fontSize = this.default_font_size + 'px';

	this.PromoteDialog.text.style.textAlign = 'center';
	this.PromoteDialog.text.textContent = this.text_res['promote_dialog_text'];

	this.PromoteDialog.element.appendChild(this.PromoteDialog.text);

	this.PromoteDialog.yes_button = document.createElement('button');

	this.PromoteDialog.yes_button.style.position = 'absolute';
	this.PromoteDialog.yes_button.style.width = Math.floor(this.board_view.rect.width * 0.18) + 'px';
	this.PromoteDialog.yes_button.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
	this.PromoteDialog.yes_button.style.left = Math.floor(this.board_view.rect.width * 0.06) + 'px';
	this.PromoteDialog.yes_button.style.top = Math.floor(this.board_view.rect.width * 0.16) + 'px';
	this.PromoteDialog.yes_button.style.fontSize = this.default_font_size + 'px';
	this.PromoteDialog.yes_button.textContent = this.text_res['promote_dialog_yes'];

	this.PromoteDialog.element.appendChild(this.PromoteDialog.yes_button);


	this.PromoteDialog.no_button = document.createElement('button');

	this.PromoteDialog.no_button.style.position = 'absolute';
	this.PromoteDialog.no_button.style.width = Math.floor(this.board_view.rect.width * 0.18) + 'px';
	this.PromoteDialog.no_button.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
	this.PromoteDialog.no_button.style.left = Math.floor(this.board_view.rect.width * 0.29) + 'px';
	this.PromoteDialog.no_button.style.top = Math.floor(this.board_view.rect.width * 0.16) + 'px';
	this.PromoteDialog.no_button.style.fontSize = this.DefaultFontSize + 'px';
	this.PromoteDialog.no_button.textContent = this.text_res['promote_dialog_no'];

	this.PromoteDialog.element.appendChild(this.PromoteDialog.no_button);

	this.PromoteDialog.yes_button.addEventListener('click', this.onPromoteYesButtonClicked.bind(this));
	this.PromoteDialog.no_button.addEventListener('click', this.onPromoteNoButtonClicked.bind(this));

	this.start_button = document.createElement('button');

	this.start_button.style.display = 'inline-block';
	this.start_button.style.position = 'absolute';
	this.start_button.style.top = Math.floor((header_height - this.default_font_size * 2.5) / 2) + 'px';
	this.start_button.style.right = Math.floor(this.default_font_size) + 'px';
	this.start_button.style.width = Math.floor(this.default_font_size * 8) + 'px';
	this.start_button.style.height = Math.floor(this.default_font_size * 2.5) + 'px';
	this.start_button.innerHTML = this.text_res['start_button_label'];

	var table_space_x = this.rect.width - table_width;
	var undo_width = Math.floor(table_space_x * 0.8);
	var undo_height = Math.floor(table_height * 0.6);

	this.up_undo_button = new SG99A_Button(this, this);
	this.up_undo_button.setRect(Math.floor(table_space_x * 0.1), up_table_top + Math.floor(table_height * 0.2), undo_width, undo_height);
	this.up_undo_button.setFontSize(Math.floor(this.default_font_size * 0.9));
	this.up_undo_button.setLabel(this.text_res['undo_button_label']);
	this.up_undo_button.element.style.webkitTransform = 'rotate(180deg)';
	this.up_undo_button.element.style.transform = 'rotate(180deg)';

	this.down_undo_button = new SG99A_Button(this, this);
	this.down_undo_button.setRect(Math.floor(this.rect.width - table_space_x * 0.1) - undo_width, Math.floor(this.rect.height - table_height * 0.2) - undo_height, undo_width, undo_height);
	this.down_undo_button.setFontSize(Math.floor(this.default_font_size * 0.9));
	this.down_undo_button.setLabel(this.text_res['undo_button_label']);

	setTimeout(this.createResources.bind(this), 10);

}

// 画像（駒image）作成
SG99A.prototype.createResources = function() {

	this.piece.createPieceImages(this.board_view.cell_width * this.board_view.draw_scale, this.board_view.cell_height * this.board_view.draw_scale);

	setTimeout(this.onResourcesSetuped.bind(this), 10);

}

// 画像作成完了
SG99A.prototype.onResourcesSetuped = function() {

	this.up_table_view.setPieceImages(this.piece.images);
	this.down_table_view.setPieceImages(this.piece.images);

	this.board_view.setPieceImages(this.piece.images);

	// 画面構成コンポーネントを配置
	this.element.appendChild(this.header.getHTMLElement());
	this.element.appendChild(this.up_table_view.getHTMLElement());
	this.element.appendChild(this.board_view.getHTMLElement());
	this.element.appendChild(this.down_table_view.getHTMLElement());
	this.element.appendChild(this.PromoteDialog.element);
	this.element.appendChild(this.up_undo_button.element);
	this.element.appendChild(this.down_undo_button.element);

	this.game = null;
	this.game_log = null;

	this.board_processer = new SG99A_BoardProcesser(this.board_cols, this.board_rows, this.board_promote_rows);

	this.game_stage = SG99A.GAME_STAGE_NONE;
	this.movable_hands = null;

	var init_rnd_seed = 1 + Date.now() % 1000000;

	// 乱数初期化
	this.rnd = new SG99A_Random(init_rnd_seed);

	this.workers_num = 0;
	this.workers = null;

	this.max_cpu_level = 1;
	this.default_cpu_level = 1;

	// Web Workers設定
	if (window.Worker) {

		this.workers_num = 3;

		this.max_cpu_level = 4;
		this.default_cpu_level = 2;

		// CPU数を取得
		if (window.navigator.hardwareConcurrency) {

			var cpu_num = window.navigator.hardwareConcurrency;

			if (cpu_num > 0) {

				this.workers_num = cpu_num - 1;

				if (this.workers_num < 3) {
					this.workers_num = 3;
				}

				if (this.workers_num > 7) {
					this.workers_num = 7;
				}

			}

			// 端末種別に応じてWorker数制限
			if (cpu_num >= 4) {

				var ua = window.navigator.userAgent;

				if (ua && (ua.indexOf('Android 6.') >= 0 || ua.indexOf('Android 7.') >= 0 || ua.indexOf('Android 8.') >= 0 || ua.indexOf('iPhone OS 10_') >= 0 || ua.indexOf('iPhone OS 10_') >= 0)) {
					this.default_cpu_level = 3;
				}

				if (ua && ua.indexOf('Windows') >= 0) {
					this.default_cpu_level = 4;
				}

			}

		}

		this.workers = [];

		for (var i = 0;i < this.workers_num;i++) {

			this.workers[i] = new Worker('sg99a/SG99A_Worker.js');
			this.workers[i].addEventListener('message', this.onWorkerMessage.bind(this));

		}

	}

	this.startGame(SG99A_Game.createNewGame());

	this.player_dialog = new SG99A_PlayerDialog(this, this);
	this.player_dialog.setRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);

	this.element.appendChild(this.player_dialog.element);

	this.process_count = 0;

	// 更新処理用ループ開始
	if (window.requestAnimationFrame) {
		requestAnimationFrame(this.process.bind(this));
	} else {
		setTimeout(this.process.bind(this), 30);
	}

}

SG99A.prototype.setGame = function(game) {

	this.game = game;

	this.header.setGame(this.game);
	this.board_view.setGame(this.game);
	this.up_table_view.setGame(this.game);
	this.down_table_view.setGame(this.game);

	this.game_id = this.game.game_id;

}

// 時刻取得
SG99A.prototype.getTimeMS = function() {

	if (window.performance && window.performance.now) {
		return performance.now();
	} else {
		return Date.now();
	}

}

// 更新ループ（定期処理）
SG99A.prototype.process = function() {

	switch (this.game_stage) {

	case SG99A.GAME_STAGE_UP_HUMAN_SELECTING:
	case SG99A.GAME_STAGE_UP_HUMAN_PUTING:
	case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_UP_CPU_SELECTING:
	case SG99A.GAME_STAGE_UP_CPU_HOLDING:

		var turn_ms = this.getTimeMS() - this.turn_start_ms;
		this.game.up_player_turn_time = turn_ms;

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING:
	case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_DOWN_HUMAN_PUTING:
	case SG99A.GAME_STAGE_DOWN_CPU_SELECTING:
	case SG99A.GAME_STAGE_DOWN_CPU_HOLDING:

		var turn_ms = this.getTimeMS() - this.turn_start_ms;
		this.game.down_player_turn_time = turn_ms;

		break;

	}

	// 画面更新
	if (this.process_count % 2 == 0) {
		this.update();
	}

	this.process_count++;

	if (window.requestAnimationFrame) {
		requestAnimationFrame(this.process.bind(this));
	} else {
		setTimeout(this.process.bind(this), 30);
	}

}

// CPU処理準備第一段階
SG99A.prototype.startCPUProcess = function(game, level) {

	this.processing = {};

	this.processing.game = game;
	this.processing.level = level;

	this.processing.stage = 1;

	this.processing.board_processer = new SG99A_BoardProcesser(9, 9, 3);

	this.processing.board_my_king_col = undefined;
	this.processing.board_my_king_row = undefined;
	this.processing.board_enemy_king_col = undefined;
	this.processing.board_enemy_king_row = undefined;

	this.processing.board_up_range_map = null;
	this.processing.board_down_range_map = null;

	this.processCPU(this.processing);

}

// CPU処理準備第一段階
SG99A.prototype.processCPU = function(processing) {

	var board_processer = this.processing.board_processer;

	var level = this.processing.level;

	var game = this.processing.game;
	var board = game.board;
	var turn = game.turn_player;

	var cols = board.cols;
	var rows = board.rows;
	var cells = board.cells;

	switch (this.processing.stage) {

	case 1:

		var l1_board = SG99A_Board.createBoard();
		var l2_board = SG99A_Board.createBoard();

		this.processing.board_up_range_map = new Int32Array(cells);
		this.processing.board_down_range_map = new Int32Array(cells);

		var up_range_map = new Int32Array(cells);
		var down_range_map = new Int32Array(cells);

		var board_my_range_map = null;
		var board_enemy_range_map = null;

		var my_king, enemy_king;

		if (turn == -1) {

			my_king = -SG99A_Piece.OU;
			enemy_king = SG99A_Piece.OU;

			board_my_range_map = this.processing.board_up_range_map;
			board_enemy_range_map = this.processing.board_down_range_map;

		} else {

			my_king = SG99A_Piece.OU;
			enemy_king = -SG99A_Piece.OU;

			board_my_range_map = this.processing.board_down_range_map;
			board_enemy_range_map = this.processing.board_up_range_map;

		}

		for (var row = 0;row < rows;row++) {

			var rc = row * cols;

			for (var col = 0;col < cols;col++) {

				if (board.data[col + rc] == my_king) {

					this.processing.board_my_king_col = col;
					this.processing.board_my_king_row = row;

				}

				if (board.data[col + rc] == enemy_king) {

					this.processing.board_enemy_king_col = col;
					this.processing.board_enemy_king_row = row;

				}

			}

		}

		// 駒効きマップ作製
		board_processer.setRangeMap(board, this.processing.board_up_range_map, this.processing.board_down_range_map);

		var hand = null;

		var l1_raw_hands = board_processer.getAllMovableHandWithKingPos(board, turn, this.processing.board_my_king_col, this.processing.board_my_king_row);
		var l1_raw_hands_num = l1_raw_hands.length;

		var l1_hands = [];

		// 車角歩の不成手を削除
		for (var i = 0;i < l1_raw_hands_num;i++) {

			var l1_hand = l1_raw_hands[i];

			if (l1_hand.from_row >= 0 && !l1_hand.promote) {

				var piece = board.data[l1_hand.from_col + l1_hand.from_row * cols];

				if ((piece == SG99A_Piece.SHA || piece == SG99A_Piece.KAKU || piece == SG99A_Piece.FU) && (l1_hand.from_row < SG99A_Board.PROMOTE_ROWS || l1_hand.to_row < SG99A_Board.PROMOTE_ROWS)) {
					l1_hand = null;
				}

				if (l1_hand != null && (piece == -SG99A_Piece.SHA || piece == -SG99A_Piece.KAKU || piece == -SG99A_Piece.FU) && (l1_hand.from_row >= (rows - SG99A_Board.PROMOTE_ROWS) || l1_hand.to_row >= (rows - SG99A_Board.PROMOTE_ROWS))) {
					l1_hand = null;
				}

			}

			if (l1_hand != null) {
				l1_hands.push(l1_hand);
			}

		}

		l1_raw_hands = null;

		var l1_hands_num = l1_hands.length;

		// 候補手を乱数でシャッフル
		for (var i = 0;i < l1_hands_num;i++) {

			var i1 = this.rnd.nextInt() % l1_hands_num;
			var i2 = this.rnd.nextInt() % l1_hands_num;

			if (i1 != i2) {

				var tmp = l1_hands[i1];

				l1_hands[i1] = l1_hands[i2];
				l1_hands[i2] = tmp;

			}

		}

		var l1_enemy_king_col = this.processing.board_enemy_king_col;
		var l1_enemy_king_row = this.processing.board_enemy_king_row;

		var addtional_hands = [];

		for (var i = 0;i < l1_hands_num;i++) {

			var l1_my_king_col = this.processing.board_my_king_col;
			var l1_my_king_row = this.processing.board_my_king_row;

			var l1_hand = l1_hands[i];

			l1_hand.board_score = 0;

			l1_hand.score[0] = 0;
			l1_hand.score[1] = 0;
			l1_hand.score[2] = 0;

			// 王の移動を反映
			if (l1_hand.from_col == l1_my_king_col && l1_hand.from_row == l1_my_king_row) {

				l1_my_king_col = l1_hand.to_col;
				l1_my_king_row = l1_hand.to_row;

			}

			if (!board_enemy_range_map[l1_hand.to_col + l1_hand.to_row * cols]) {
				if (l1_hand.from_row >= 0 && board.data[l1_hand.to_col + l1_hand.to_row * cols] == SG99A_Piece.FU) {

					var target_piece = board.data[l1_hand.to_col + (l1_hand.to_row - 1) * cols];

					if (target_piece == SG99A_Piece.KAKU) {
						addtional_hands.push(l1_hand);
					}

				}
			}

			// 候補手を打った盤面を作成
			l1_board.set(board);
			l1_board.putHand(l1_hand);

			// 敵の候補手を列挙
			var l2_hands = board_processer.getAllMovableHandWithKingPos(l1_board, -turn, l1_enemy_king_col, l1_enemy_king_row);
			var l2_hands_num = l2_hands.length;

			// 敵方打つ手なし（詰め）
			if (l2_hands_num == 0) {

				// 打ち歩詰め
				if (l1_hand.from_row == -1 && Math.abs(l1_hand.from_col) == SG99A_Piece.FU) {

					l1_hand.score[0] = SG99A_BoardProcesser.MIN_SCORE;

					continue;

				} else {

					this.onCPUHandSelected(game, turn, l1_hand);

					return;

				}

				break;

			}

			var l1_up_range_map = new Int32Array(cells);
			var l1_down_range_map = new Int32Array(cells);

			var l1_my_range_map = null;
			var l1_enemy_range_map = null;

			// 駒効きマップ作製
			board_processer.setRangeMap(l1_board, l1_up_range_map, l1_down_range_map);

			if (turn == -1) {

				l1_my_range_map = l1_up_range_map;
				l1_enemy_range_map = l1_down_range_map;

			} else {

				l1_my_range_map = l1_down_range_map;
				l1_enemy_range_map = l1_up_range_map;

			}

			// 最下段から桂馬を上げる手を抑制
			if ((turn == 1) && (l1_hand.from_row == rows - 1) && (board.data[l1_hand.from_col + l1_hand.from_row * cols] == SG99A_Piece.KEI)) {
				l1_hand.score[2] -= 5;
			}

			// 最上段から桂馬を下げる手を抑制
			if ((turn == -1) && (l1_hand.from_row == 0) && (board.data[l1_hand.from_col] == -SG99A_Piece.KEI)) {
				l1_hand.score[2] -= 5;
			}

			var hand_c = l1_hand.to_col;
			var hand_r = l1_hand.to_row;

			// 勢力圏外の取られる位置に駒を打つ手を抑制
			if (board_enemy_range_map[hand_c + hand_r * cols]) {

				var mc = hand_c - 1;
				var pc = hand_c + 1;
				var mr = hand_r - 1;
				var pr = hand_r + 1;

				if (mc < 0) {
					mc = 0;
				}

				if (pc >= cols) {
					pc = cols - 1;
				}

				if (mr < 0) {
					mr = 0;
				}

				if (pr >= rows) {
					pr = rows - 1;
				}

				var r_check = false;

				// 周囲に自分側の駒効きがあるか確認
				for (var r = mr;r <= pr;r++) {

					var rc = r * cols;

					for (var c = mc;c <= pc;c++) {
						if (board_my_range_map[c + rc]) {

							r_check = true;

							break;

						}
					}

					if (r_check) {
						break;
					}

				}

				// 勢力範囲外への自殺手
				if (!r_check) {
					if (l1_my_range_map[l1_enemy_king_col + l1_enemy_king_row * cells]) { // 自殺的王手
						l1_hand.score[2] -= 10 + Math.abs(SG99A_Piece.piece_scores[Math.abs(l1_hand.from_col)] / 10);
					} else {
						l1_hand.score[2] -= 10 + Math.abs(SG99A_Piece.piece_scores[Math.abs(l1_hand.from_col)] / 20);
					}
				}

			}

			// 候補手を打った盤面を評価
			l1_hand.board_score = board_processer.getBoardSimpleScoreWithKingPos(l1_board, turn, up_range_map, down_range_map, l1_my_king_col, l1_my_king_row, l1_enemy_king_col, l1_enemy_king_row);

			var l2_my_king_col = l1_my_king_col;
			var l2_my_king_row = l1_my_king_row;

			for (var j = 0;j < l2_hands_num;j++) {

				var l2_enemy_king_col = l1_enemy_king_col;
				var l2_enemy_king_row = l1_enemy_king_row;

				var l2_hand = l2_hands[j];

				// 王の移動を反映
				if (l2_hand.from_col == l1_enemy_king_col && l2_hand.from_row == l1_enemy_king_row) {

					l2_enemy_king_col = l2_hand.to_col;
					l2_enemy_king_row = l2_hand.to_row;

				}

				// 候補手を打った盤面を作成
				l2_board.set(l1_board);
				l2_board.putHand(l2_hand);

				// 候補手を打った盤面を評価
				l2_hand.board_score = board_processer.getBoardSimpleScoreWithKingPos(l2_board, -turn, up_range_map, down_range_map, l2_enemy_king_col, l2_enemy_king_row, l2_my_king_col, l2_my_king_row);

				l2_hand.score[0] = l2_hand.board_score;

			}

			var l2_sorted_hands = new Array(l2_hands_num);
			var l2_sorted_num = 0;

			l2_sorting_start_index = 0;
			l2_sorting_end_index = l2_hands_num - 1;

			while (l2_sorted_num < l2_hands_num) {

				var l2_sorting_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;

				for (var j = l2_sorting_start_index;j <= l2_sorting_end_index;j++) {
					if (l2_hands[j] != null && l2_hands[j].score[0] > l2_sorting_max_score) {
						l2_sorting_max_score = l2_hands[j].score[0];
					}
				}

				for (var j = l2_sorting_start_index;j <= l2_sorting_end_index;j++) {
					if (l2_hands[j] != null) {
						if (l2_hands[j].score[0] === l2_sorting_max_score) {

							l2_sorted_hands[l2_sorted_num++] = l2_hands[j];
							l2_hands[j] = null;

						}
					}
				}

			}

			l2_hands = null;
			var l2_selected_hands = null;

			if (l2_hands_num < 22) {
				l2_selected_hands = l2_sorted_hands;
			} else {

				l2_selected_hands = [];

				Array.prototype.push.apply(l2_selected_hands, l2_sorted_hands.splice(0, 8));
				Array.prototype.push.apply(l2_selected_hands, l2_sorted_hands.splice(Math.floor(l2_sorted_hands.length / 3) - 1, 5));
				Array.prototype.push.apply(l2_selected_hands, l2_sorted_hands.splice(Math.floor(l2_sorted_hands.length / 2) - 1, 4));

			}

			l1_hand.children = l2_selected_hands;

		}

		this.processing.l1_hands = l1_hands;

		this.processing.stage = 2;
		this.processing.step = 0;

		this.processing.up_range_map = new Int32Array(cells);
		this.processing.down_range_map = new Int32Array(cells);

		setTimeout(this.processCPU.bind(this), 10);

		break;

	case 2:

		var l1_board = SG99A_Board.createBoard();
		var l2_board = SG99A_Board.createBoard();
		var l3_board = SG99A_Board.createBoard();

		var l1_hands = this.processing.l1_hands;
		var l1_hands_num = l1_hands.length;

		var l1_enemy_king_col = this.processing.board_enemy_king_col;
		var l1_enemy_king_row = this.processing.board_enemy_king_row;

		var step_end = Math.min(this.processing.step + 16, l1_hands_num);

		for (var i = this.processing.step;i < step_end;i++) {

			var l1_my_king_col = this.processing.board_my_king_col;
			var l1_my_king_row = this.processing.board_my_king_row;

			var l1_hand = l1_hands[i];

			// 王の移動を反映
			if (l1_hand.from_col == l1_my_king_col && l1_hand.from_row == l1_my_king_row) {

				l1_my_king_col = l1_hand.to_col;
				l1_my_king_row = l1_hand.to_row;

			}

			// 候補手を打った盤面を作成
			l1_board.set(board);
			l1_board.putHand(l1_hand);

			var l2_hands = l1_hand.children;

			if (l2_hands == null) {

				l1_hand.score[0] = SG99A_BoardProcesser.MIN_SCORE;

				continue;

			}

			var l2_hands_num = l2_hands.length;

			var l2_my_king_col = l1_my_king_col;
			var l2_my_king_row = l1_my_king_row;

			var l2_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;
			var l2_max_hand = null;

			for (var j = 0;j < l2_hands_num;j++) {

				var l2_enemy_king_col = l1_enemy_king_col;
				var l2_enemy_king_row = l1_enemy_king_row;

				var l2_hand = l2_hands[j];

				// 王の移動を反映
				if (l2_hand.from_col == l2_enemy_king_col && l2_hand.from_row == l2_enemy_king_row) {

					l2_enemy_king_col = l2_hand.to_col;
					l2_enemy_king_row = l2_hand.to_row;

				}

				// 候補手を打った盤面を作成
				l2_board.set(l1_board);
				l2_board.putHand(l2_hand);

				// 3手先の候補手を列挙
				var l3_hands = board_processer.getAllMovableHandWithKingPos(l2_board, turn, l2_my_king_col, l2_my_king_row);
				var l3_hands_num = l3_hands.length;

				if (l3_hands_num < 1) {

					l2_hand.score[1] = SG99A_BoardProcesser.MIN_SCORE;

					l2_max_hand = l2_hand;
					l2_max_score = SG99A_BoardProcesser.MAX_SCORE;

					continue;

				}

				var l3_enemy_king_col = l2_enemy_king_col;
				var l3_enemy_king_row = l2_enemy_king_row;

				var l3_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;

				for (var k = 0;k < l3_hands_num;k++) {

					var l3_my_king_col = l2_my_king_col;
					var l3_my_king_row = l2_my_king_row;

					var l3_hand = l3_hands[k];

					// 候補手を打った盤面を作成
					l3_board.set(l2_board);
					l3_board.putHand(l3_hand);

					// 王の移動を反映
					if (l3_hand.from_col == l3_my_king_col && l3_hand.from_row == l3_my_king_row) {

						l3_my_king_col = l3_hand.to_col;
						l3_my_king_row = l3_hand.to_row;

					}

					if (board_processer.isLoseWithKingPos(l3_board, -turn, l3_enemy_king_col, l3_enemy_king_row)) {
						l3_hand.board_score = SG99A_BoardProcesser.MAX_SCORE;
					} else {
						l3_hand.board_score = board_processer.getBoardSimpleScoreWithKingPos(l3_board, turn, this.processing.up_range_map, this.processing.down_range_map, l3_my_king_col, l3_my_king_row, l3_enemy_king_col, l3_enemy_king_row);
					}

					if (l3_hand.board_score > l3_max_score) {
						l3_max_score = l3_hand.board_score;
					}

				}

				l2_hand.score[1] = -l3_max_score;
				l2_hand.score[0] = Math.floor(l2_hand.score[0] * 0.1 + l2_hand.score[1]);

				if (l2_hand.score[0] < SG99A_BoardProcesser.MIN_SCORE) {
					l2_hand.score[0] = SG99A_BoardProcesser.MIN_SCORE;
				}

				if (l2_hand.score[0] > l2_max_score) {

					l2_max_score = l2_hand.score[0];
					l2_max_hand = l2_hand;

				}

			}

			if (l2_max_score >= SG99A_BoardProcesser.MAX_SCORE) {

				l1_hand.score[0] = SG99A_BoardProcesser.MIN_SCORE;
				l1_hand.score[1] = SG99A_BoardProcesser.MIN_SCORE;

			} else {

				l1_hand.score[1] = -l2_max_score;
				l1_hand.score[0] = Math.floor(l1_hand.score[1] + (l1_hand.board_score / 8) + l1_hand.score[2]);

			}

			l1_hand.children = null;

		}

		if (step_end < l1_hands_num) {
			this.processing.step = step_end;
		} else {

			switch (level | 0) {

			case 1:

				this.processing.stage = 3;

				break;

			case 2:
			case 3:
			case 4:

				this.processing.stage = 4;

				break;

			}

		}

		setTimeout(this.processCPU.bind(this), 10);

		break;

	case 3:

		var l1_hands = this.processing.l1_hands;
		var l1_hands_num = l1_hands.length;

		var l1_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;
		var l1_max_hand = null;

		for (var i = 0;i < l1_hands_num;i++) {
			if (l1_hands[i].score[0] > l1_max_score) {

				l1_max_score = l1_hands[i].score[0];
				l1_max_hand = l1_hands[i];

			}
		}

		// 選択手を打った盤面を作成
		var test_board = this.game.board.clone();
		test_board.putHand(l1_max_hand);

		// 盤面のハッシュ値を算出
		var test_hash = test_board.getBoardHash();
		var same_board = false;

		var hash_log_length = this.board_hash_list.length;
		var hash_search_range = Math.min(hash_log_length, 100);

		// 過去に同じハッシュ値を持つ盤面があるか検査
		for (var i = 0;i < hash_search_range;i++) {
			if (this.board_hash_list[hash_log_length - 1 - i] == test_hash) {
				same_board = true;
			}
		}

		// 過去に同一ハッシュ値の盤面があれば次点手に変更（千日手抑制）
		if (same_board && l1_hands_num > 4) {

			var l1_nmax_score = SG99A_BoardProcesser.MIN_SCORE - 1;
			var l1_nmax_hand = null;

			for (var i = 0;i < l1_hands_num;i++) {
				if (l1_hands[i] != l1_max_hand && l1_hands[i].score[0] > l1_nmax_score) {

					l1_nmax_score = l1_hands[i].score[0];
					l1_nmax_hand = l1_hands[i];

				}
			}

			l1_max_hand = l1_nmax_hand;

		}

		this.onCPUHandSelected(game, turn, l1_max_hand);

		return;

	case 4:

		var l1_hands = this.processing.l1_hands;
		var l1_hands_num = l1_hands.length;

		var l1_sorted_hands = new Array(l1_hands_num);
		var l1_sorted_num = 0;

		l1_sorting_start_index = 0;
		l1_sorting_end_index = l1_hands_num - 1;

		while (l1_sorted_num < l1_hands_num) {

			var l1_sorting_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;

			for (var i = l1_sorting_start_index;i <= l1_sorting_end_index;i++) {
				if (l1_hands[i] != null && l1_hands[i].score[0] > l1_sorting_max_score) {
					l1_sorting_max_score = l1_hands[i].score[0];
				}
			}

			for (var i = l1_sorting_start_index;i <= l1_sorting_end_index;i++) {
				if (l1_hands[i] != null) {
					if (l1_hands[i].score[0] === l1_sorting_max_score) {

						l1_sorted_hands[l1_sorted_num++] = l1_hands[i];
						l1_hands[i] = null;

					}
				}
			}

		}

		l1_hands = null;

		// レベルに応じて枝刈りした候補手配列を作成
		if (level == 2) {
			if (l1_hands_num < 26) {
				l1_hands = l1_sorted_hands;
			} else {

				l1_hands = [];

				for (var i = 0;i < 11;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_sorted_num = l1_sorted_hands.length;
				var r_num = Math.floor(l1_sorted_num / 3);

				for (var i = 0;i < r_num;i++) {

					var i1 = this.rnd.nextInt() % l1_sorted_num;
					var i2 = this.rnd.nextInt() % l1_sorted_num;

					if (i1 != i2) {

						var tmp = l1_sorted_hands[i1];

						l1_sorted_hands[i1] = l1_sorted_hands[i2];
						l1_sorted_hands[i2] = tmp;

					}

				}

				for (var i = 0;i < 12;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_sorted_num = l1_sorted_hands.length;

				for (var i = 0;i < l1_sorted_num;i++) {
					if (l1_sorted_hands[i].from_row >= 0) {

						l1_hands.push(l1_sorted_hands[i]);

						break;

					}
				}

			}
		}

		if (level == 3) {
			if (l1_hands_num < 31) {
				l1_hands = l1_sorted_hands;
			} else {

				l1_hands = [];

				for (var i = 0;i < 15;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_sorted_num = l1_sorted_hands.length;
				var r_num = Math.floor(l1_sorted_num / 3);

				for (var i = 0;i < r_num;i++) {

					var i1 = this.rnd.nextInt() % l1_sorted_num;
					var i2 = this.rnd.nextInt() % l1_sorted_num;

					if (i1 != i2) {

						var tmp = l1_sorted_hands[i1];

						l1_sorted_hands[i1] = l1_sorted_hands[i2];
						l1_sorted_hands[i2] = tmp;

					}

				}

				for (var i = 0;i < 10;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2) - 1]);
				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2)]);
				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2) + 1]);

			}
		}

		if (level == 4) {
			if (l1_hands_num < 62) {
				l1_hands = l1_sorted_hands;
			} else {

				l1_hands = [];

				for (var i = 0;i < 28;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_sorted_num = l1_sorted_hands.length;
				var r_num = Math.floor(l1_sorted_num / 3);

				for (var i = 0;i < r_num;i++) {

					var i1 = this.rnd.nextInt() % l1_sorted_num;
					var i2 = this.rnd.nextInt() % l1_sorted_num;

					if (i1 != i2) {

						var tmp = l1_sorted_hands[i1];

						l1_sorted_hands[i1] = l1_sorted_hands[i2];
						l1_sorted_hands[i2] = tmp;

					}

				}

				for (var i = 0;i < 26;i++) {
					l1_hands.push(l1_sorted_hands.shift());
				}

				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2) - 1]);
				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2)]);
				l1_hands.push(l1_sorted_hands[Math.floor(l1_sorted_hands.length / 2) + 1]);

			}
		}

		l1_hands_num = l1_hands.length;
		l1_sorted_hands = null;

		this.processing.process_id = game.game_id + this.game.turn_num;
		this.processing.process_workers_num = this.workers_num;

		this.processing.processed_hands = [];

		this.processing.hands_num = l1_hands_num;

		for (var i = 0;i < this.processing.process_workers_num;i++) {
			this.processing.processed_hands[i] = null;
		}

		var worker_hands_num = Math.floor(l1_hands_num / this.processing.process_workers_num);

		var rnd_seed = this.rnd.nextInt();

		// Workerに盤面と候補手配列を転送し処理を始める
		for (var i = 0;i < this.processing.process_workers_num;i++) {

			var worker_hands = [];
			var hands_num = 0;

			if (i == 0) {
				var hands_num = l1_hands_num - (worker_hands_num * (this.processing.process_workers_num - 1));
			} else {
				var hands_num = worker_hands_num;
			}

			for (var j = 0;j < hands_num;j++) {
				worker_hands.push(l1_hands.shift());
			}

			var data = {};

			data.process_id = this.processing.process_id;
			data.board = game.board;
			data.hands = worker_hands;
			data.turn = turn;
			data.level = level;
			data.process_index = i;
			data.rnd_seed = rnd_seed;

			this.workers[i].postMessage(data);

		}

		break;

	}

}

// Workerの処理結果を受け取る
SG99A.prototype.onWorkerMessage = function(e) {

	var data = e.data;

	var process_id = data.process_id;

	if (process_id != this.processing.process_id) {
		return;
	}

	var process_index = data.process_index;

	this.processing.processed_hands[process_index] = data.hands;

	var process_completed = true;

	// すべての候補手の処理が終わったか検査
	for (var i = 0;i < this.processing.process_workers_num;i++) {
		if (this.processing.processed_hands[i] == null) {

			process_completed = false;

			break;

		}
	}

	if (!process_completed) {
		return;
	}

	var turn_num = this.game.turn_num;
	var board_hash = this.board_hash_list[this.board_hash_list.length - 1];

	var book_move = 0;

	switch (board_hash) {

	case 94609:

		if (this.game.turn_num == 2) {
			book_move = 1;
		}

		break;

	case 93981:

		if (this.game.turn_num == 2) {
			book_move = 2;
		}

		break;

	}

	var l1_hands = [];

	// 処理結果（得点付けされた候補手配列）を一つにまとめる
	for (var i = 0;i < this.processing.process_workers_num;i++) {

		var processed_hands = this.processing.processed_hands[i];
		var processed_hands_num = this.processing.processed_hands[i].length;

		for (var j = 0;j < processed_hands_num;j++) {
			l1_hands.push(processed_hands.shift());
		}

	}

	var l1_hands_num = l1_hands.length;

	if (book_move > 0) {

		switch (book_move) {

		case 1:

			for (var i = 0;i < l1_hands_num;i++) {
				if (l1_hands[i].from_row == 0 && l1_hands[i].from_col == 5 && l1_hands[i].to_col == 6 && l1_hands[i].to_row == 1) {
					 l1_hands[i].score[0] += 200;
				}
			}

			break;

		case 2:

			for (var i = 0;i < l1_hands_num;i++) {
				if (l1_hands[i].from_row == 8 && l1_hands[i].from_col == 3 && l1_hands[i].to_col == 2 && l1_hands[i].to_row == 7) {
					 l1_hands[i].score[0] += 200;
				}
			}

			break;

		}

	}

	var turn = data.turn;

	var l1_sorted_hands = new Array(l1_hands_num);
	var l1_sorted_num = 0;

	// 候補手を得点でソート
	while (l1_sorted_num < l1_hands_num) {

		var l1_sorting_max_score = SG99A_BoardProcesser.MIN_SCORE - 1;

		for (var i = 0;i < l1_hands_num;i++) {
			if (l1_hands[i] != null && (l1_hands[i].score[0] > l1_sorting_max_score)) {
				l1_sorting_max_score = l1_hands[i].score[0];
			}
		}

		for (var i = 0;i < l1_hands_num;i++) {
			if (l1_hands[i] != null && (l1_hands[i].score[0] == l1_sorting_max_score)) {

				l1_sorted_hands[l1_sorted_num++] = l1_hands[i];
				l1_hands[i] = null;

			}
		}

	}

	var selected_hand = l1_sorted_hands[0];

	// 選択手を打った盤面を作成
	var test_board = this.game.board.clone();
	test_board.putHand(selected_hand);

	// 盤面のハッシュ値を算出
	var test_hash = test_board.getBoardHash();
	var same_board = false;

	var hash_log_length = this.board_hash_list.length;
	var hash_search_range = Math.min(hash_log_length, 100);

	// 過去に同じハッシュ値を持つ手があるか検査
	for (var i = 0;i < hash_search_range;i++) {
		if (this.board_hash_list[hash_log_length - 1 - i] == test_hash) {
			same_board = true;
		}
	}

	// 過去に同一ハッシュ値の盤面があれば次点手に変更（千日手抑制）
	if (same_board && l1_sorted_hands.length > 4) {
		selected_hand = l1_sorted_hands[1];
	}

	this.onCPUHandSelected(this.game, turn, selected_hand);

}

SG99A.prototype.onCPUHandSelected = function(game, turn, hand) {

	switch (turn) {

	case -1:

		this.game_stage = SG99A.GAME_STAGE_UP_CPU_HOLDING;

		if (hand.from_row == -1) {
			this.up_table_view.setSelectedCol(-hand.from_col);
		} else {
			this.board_view.setHolding(hand.from_col, hand.from_row);
		}

		break;

	case 1:

		this.game_stage = SG99A.GAME_STAGE_DOWN_CPU_HOLDING;

		if (hand.from_row == -1) {
			this.down_table_view.setSelectedCol(hand.from_col);
		} else {
			this.board_view.setHolding(hand.from_col, hand.from_row);
		}

		break;

	}

//	setTimeout(this.onHandSelected.bind(this, game, hand), 450);
	this.onHandSelected(game, hand);

}

SG99A.prototype.startGame = function(game) {

	this.setGame(game);
	this.game_stage = SG99A.GAME_STAGE_NONE;

	this.board_view.reset();
	this.game_log = [];
	this.board_hash_list = [];

	this.game_start_ms = this.getTimeMS();
	this.startTurn(game);

}

SG99A.prototype.startTurn = function(game) {

	if (game == null || game.game_id != this.game_id) {
		return;
	}

	if (this.game.turn_num == 999) {

		this.game_stage = SG99A.GAME_STAGE_DRAW;

		return;

	}

	var game_log_item = {};

	game_log_item.game = this.game.clone();
	game_log_item.last_moved = this.board_view.getLastMoved();

	this.game_log[this.game.turn_num] = game_log_item;

	this.game.turn_num++;
	this.turn_start_ms = this.getTimeMS();

	this.game.up_player_turn_time = 0;
	this.game.down_player_turn_time = 0;

	this.up_undo_button.element.disabled = 'disabled';
	this.down_undo_button.element.disabled = 'disabled';

	switch (this.game.turn_player) {

	case -1:

		this.up_table_view.setActive(true);
		this.down_table_view.setActive(false);

		switch (this.game.up_player) {

		case SG99A.PLAYER_HUMAN:

			this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_SELECTING;
			this.up_undo_button.element.disabled = '';

			break;

		case SG99A.PLAYER_CPU_LV1:
		case SG99A.PLAYER_CPU_LV2:
		case SG99A.PLAYER_CPU_LV3:
		case SG99A.PLAYER_CPU_LV4:

			this.game_stage = SG99A.GAME_STAGE_UP_CPU_SELECTING;

			this.startCPUProcess(this.game, this.game.up_player - 1);

			break;

		}

		break;

	case 1:

		this.up_table_view.setActive(false);
		this.down_table_view.setActive(true);

		switch (this.game.down_player) {

		case SG99A.PLAYER_HUMAN:

			this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING;
			this.down_undo_button.element.disabled = '';

			break;

		case SG99A.PLAYER_CPU_LV1:
		case SG99A.PLAYER_CPU_LV2:
		case SG99A.PLAYER_CPU_LV3:
		case SG99A.PLAYER_CPU_LV4:

			this.game_stage = SG99A.GAME_STAGE_DOWN_CPU_SELECTING;

			this.startCPUProcess(this.game, this.game.down_player - 1);

			break;

		}

		break;

	}

}

SG99A.prototype.onHandSelected = function(game, hand) {

	if (game.game_id != this.game_id) {
		return;
	}

	switch (this.game_stage) {

	case SG99A.GAME_STAGE_UP_HUMAN_PUTING:
	case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_DOWN_HUMAN_PUTING:

		this.putHand(game, hand);

		break;

	case SG99A.GAME_STAGE_UP_CPU_HOLDING:
	case SG99A.GAME_STAGE_DOWN_CPU_HOLDING:

		this.putHand(game, hand);

		break;

	}

}

SG99A.prototype.putHand = function(game, hand) {

	if (game.game_id != this.game_id) {
		return;
	}

	var test_board = this.game.board.clone();
	test_board.putHand(hand);

	if (test_board.isChecked(this.game.turn_player, this.board_processer)) {

		this.board_view.resetHolding();
		this.board_view.resetMovableHands();

		var king_cell = this.game.board.getKingCell(this.game.turn_player);
		this.board_view.setCheckedCell(king_cell);

		switch (this.game_stage) {

		case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:
		case SG99A.GAME_STAGE_UP_HUMAN_PUTING:

			this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_SELECTING;

			break;

		case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:
		case SG99A.GAME_STAGE_DOWN_HUMAN_PUTING:

			this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING;

			break;

		}

		return;

	}

	this.board_view.resetCheckedCell();

	this.game.board.putHand(hand);
	this.game.last_hand = SG99A_Hand.cloneHand(hand);

	var hash = this.game.board.getBoardHash();
	this.board_hash_list.push(hash);

	var turn_ms = this.getTimeMS() - this.turn_start_ms;

	switch (this.game_stage) {

	case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_UP_HUMAN_PUTING:
	case SG99A.GAME_STAGE_UP_CPU_HOLDING:

		this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_PUTTED;

		this.board_view.setLastMoved(hand.to_col, hand.to_row);

		this.game.up_player_time += turn_ms;
		this.game.up_player_turn_time = 0;

		this.turn_start_ms = 0;

		this.onTurnEnd(game);

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:
	case SG99A.GAME_STAGE_DOWN_HUMAN_PUTING:
	case SG99A.GAME_STAGE_DOWN_CPU_HOLDING:

		this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_PUTTED;

		this.board_view.setLastMoved(hand.to_col, hand.to_row);

		this.game.down_player_time += turn_ms;
		this.game.down_player_turn_time = 0;

		this.turn_start_ms = 0;

		this.onTurnEnd(game);

		break;

	}

}

SG99A.prototype.onTurnEnd = function(game) {

	if (game.game_id != this.game_id) {
		return;
	}

	this.board_view.resetHolding();
	this.board_view.resetMovableHands();
	this.up_table_view.resetSelectedCol();
	this.down_table_view.resetSelectedCol();

	var result = 0;

	if (this.board_processer.isLose(this.game.board, -this.game.turn_player)) {
		// 打ち歩詰め検査
		if (this.game.last_hand.from_row == -1 && Math.abs(this.game.last_hand.from_col) == SG99A_Piece.FU && this.game.board.isChecked(-this.game.turn_player, this.board_processer)) {
			result = -this.game.turn_player;
		} else {
			result = this.game.turn_player;
		}
	}

	if (result == 0) {

		switch (this.game_stage) {

		case SG99A.GAME_STAGE_UP_HUMAN_PUTTED:

			this.game.turn_player = 1;

			break;

		case SG99A.GAME_STAGE_DOWN_HUMAN_PUTTED:

			this.game.turn_player = -1;

			break;

		}

		setTimeout(this.startTurn.bind(this, this.game), 100);

	} else {

		this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_RESULT;

		if (this.game.up_player == SG99A.PLAYER_HUMAN) {
			this.up_undo_button.element.disabled = '';
		} else {
			this.up_undo_button.element.disabled = 'disabled';
		}

		if (this.game.down_player == SG99A.PLAYER_HUMAN) {
			this.down_undo_button.element.disabled = '';
		} else {
			this.down_undo_button.element.disabled = 'disabled';
		}

		this.board_view.setLose(-result);

		switch (result) {

		case -1:

			this.up_table_view.setResult(true);
			this.down_table_view.setResult(false);

			break;

		case 1:

			this.up_table_view.setResult(false);
			this.down_table_view.setResult(true);

			break;

		}

		return;

	}
}

SG99A.prototype.getHTMLElement = function() {
	return this.element;
}

SG99A.prototype.update = function() {

	this.header.update();
	this.board_view.update();

	this.up_table_view.update();
	this.down_table_view.update();

}

SG99A.prototype.onPlayerDialogResult = function(up_player, down_player, first) {

	var game = SG99A_Game.createNewGame();

	game.up_player = up_player;
	game.down_player = down_player;

	game.first_player = first;

	if (first == -1) {
		game.turn_player = -1;
	} else {
		game.turn_player = 1;
	}

	this.startGame(game);

}

SG99A.prototype.onTableViewClicked = function(table, piece) {

	if (table == this.up_table_view) {
		piece *= -1;
	}

	if (piece < 0 && this.game.board.up_piece_table[-piece] < 1) {
		return;
	}

	if (piece > 0 && this.game.board.down_piece_table[piece] < 1) {
		return;
	}

	var col = piece;
	var row = -1;

	switch (this.game_stage) {

	case SG99A.GAME_STAGE_UP_HUMAN_SELECTING:

		if (piece < 0) {

			var hands = this.board_processer.getMovableHands(this.game.board, col, row);

			if (hands.length > 0) {

				this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_HOLDING;

				this.holding = {'col': col, 'row': row};
				this.movable_hands = hands;

				this.up_table_view.setSelectedCol(-col);

				this.board_view.setHolding(col, row);
				this.board_view.setMovableHands(this.movable_hands);

			}

		}

		break;

	case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:

		this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_SELECTING;

		this.holding = null;
		this.movable_hands = null;

		this.up_table_view.resetSelectedCol();

		this.board_view.resetHolding();
		this.board_view.resetMovableHands();

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING:

		if (piece > 0) {

			var hands = this.board_processer.getMovableHands(this.game.board, col, row);

			if (hands.length > 0) {

				this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING;

				this.holding = {'col': col, 'row': row};
				this.movable_hands = hands;

				this.down_table_view.setSelectedCol(col);

				this.board_view.setHolding(col, row);
				this.board_view.setMovableHands(this.movable_hands);

			}

		}

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:

		this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING;

		this.holding = null;
		this.movable_hands = null;

		this.down_table_view.resetSelectedCol();

		this.board_view.resetHolding();
		this.board_view.resetMovableHands();

		break;

	}

	this.update();

}

SG99A.prototype.onBoardViewCellClicked = function(col, row) {

	var piece = this.game.board.data[col + row * this.game.board.cols];

	this.board_view.resetCheckedCell();

	switch (this.game_stage) {

	case SG99A.GAME_STAGE_UP_HUMAN_SELECTING:

		if (piece < 0) {

			var hands = this.board_processer.getMovableHands(this.game.board, col, row);

			if (hands.length > 0) {

				this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_HOLDING;

				this.holding = {'col': col, 'row': row};
				this.movable_hands = hands;

				this.board_view.setHolding(col, row);
				this.board_view.setMovableHands(this.movable_hands);

			}

		}

		break;

	case SG99A.GAME_STAGE_UP_HUMAN_HOLDING:

		var hands = [];

		for (var i = 0;i < this.movable_hands.length;i++) {
			if (col == this.movable_hands[i].to_col && row == this.movable_hands[i].to_row) {
				hands.push(this.movable_hands[i]);
			}
		}

		if (hands.length >= 1) {

			if (hands.length == 1) {
				this.onHandSelected(this.game, hands[0]);
			} else {

				this.movable_hands = hands;

				this.board_view.resetMovableHands();
				this.up_table_view.resetSelectedCol();

				this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_PUTING;

				this.PromoteDialog.element.style.display = 'block';

			}

		} else {

			this.game_stage = SG99A.GAME_STAGE_UP_HUMAN_SELECTING;

			this.holding = null;
			this.movable_hands = null;

			this.board_view.resetHolding();
			this.board_view.resetMovableHands();
			this.up_table_view.resetSelectedCol();

		}

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING:

		if (piece > 0) {

			var hands = this.board_processer.getMovableHands(this.game.board, col, row);

			if (hands.length > 0) {

				this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING;

				this.holding = {'col': col, 'row': row};
				this.movable_hands = hands;

				this.board_view.setHolding(col, row);
				this.board_view.setMovableHands(this.movable_hands);

			}

		}

		break;

	case SG99A.GAME_STAGE_DOWN_HUMAN_HOLDING:

		var hands = [];

		for (var i = 0;i < this.movable_hands.length;i++) {
			if (col == this.movable_hands[i].to_col && row == this.movable_hands[i].to_row) {
				hands.push(this.movable_hands[i]);
			}
		}

		if (hands.length >= 1) {

			if (hands.length == 1) {
				this.onHandSelected(this.game, hands[0]);
			} else {

				this.movable_hands = hands;

				this.board_view.resetMovableHands();
				this.down_table_view.resetSelectedCol();

				this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_PUTING;

				this.PromoteDialog.element.style.display = 'block';

			}

		} else {

			this.game_stage = SG99A.GAME_STAGE_DOWN_HUMAN_SELECTING;

			this.holding = null;
			this.movable_hands = null;

			this.board_view.resetHolding();
			this.board_view.resetMovableHands();
			this.down_table_view.resetSelectedCol();

		}

		break;

	}

	this.update();

}

SG99A.prototype.onStartButtonClicked = function() {

	this.player_dialog.show();

}

SG99A.prototype.onPromoteYesButtonClicked = function(e) {

	var hand = null;

	for (var i = 0;i < this.movable_hands.length;i++) {
		if (this.movable_hands[i].promote) {
			hand = this.movable_hands[i];
		}
	}

	this.onHandSelected(this.game, hand);

	this.PromoteDialog.element.style.display = 'none';

}

SG99A.prototype.onPromoteNoButtonClicked = function(e) {

	var hand = null;

	for (var i = 0;i < this.movable_hands.length;i++) {
		if (!this.movable_hands[i].promote) {
			hand = this.movable_hands[i];
		}
	}

	this.onHandSelected(this.game, hand);

	this.PromoteDialog.element.style.display = 'none';

}

SG99A.prototype.onListeningComponentClicked = function(comp, x, y) {

	if (comp == this.up_undo_button) {

		var game_log_item = null;

		var log_last = this.game.turn_num - 1;

		if (this.game_stage != SG99A.GAME_STAGE_DOWN_HUMAN_RESULT) {
			log_last--;
		}

		for (var i = log_last;i >= 0;i--) {

			var item = this.game_log[i];

			if (item && item.game.turn_player == -1) {

				game_log_item = item;

				break;

			}
		}

		if (game_log_item != null) {

			var game = game_log_item.game;

			this.setGame(game);

			this.board_view.reset();

			if (game_log_item.last_moved != null) {
				this.board_view.setLastMoved(game_log_item.last_moved.col, game_log_item.last_moved.row);
			}

			this.startTurn(game);

		}

	}

	if (comp == this.down_undo_button) {

		var game_log_item = null;

		var log_last = this.game.turn_num - 1;

		if (this.game_stage != SG99A.GAME_STAGE_DOWN_HUMAN_RESULT) {
			log_last--;
		}

		for (var i = log_last;i >= 0;i--) {

			var item = this.game_log[i];

			if (item && item.game.turn_player == 1) {

				game_log_item = item;

				break;

			}
		}

		if (game_log_item != null) {

			var game = game_log_item.game;

			this.setGame(game);

			this.board_view.reset();

			if (game_log_item.last_moved != null) {
				this.board_view.setLastMoved(game_log_item.last_moved.col, game_log_item.last_moved.row);
			}

			this.startTurn(game);

		}

	}

}

var SG99A_Random = function(num) {

	this.Num = num;

}

SG99A_Random.prototype.nextInt = function() {

	var val = (this.Num * 48271) % 2147483647;

	this.Num = val;

	return val;

}

SG99A_Random.prototype.nextFloat = function() {

	return this.nextInt() / 2147483647;

}