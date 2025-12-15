/*
	荳企Κ諠ｱ陦ｨ遉ｺ繝舌
*/
function SG99A_Header(app, ui_listener) {

	SG99A_Component.call(this, app, ui_listener);

	this.turn_num_label_text = app.text_res['turn_num_label'];

}

SG99A_Header.prototype = Object.create(SG99A_Component.prototype);
SG99A_Header.prototype.constructor = SG99A_Header;

SG99A_Header.prototype.createElement = function() {

	this.element = document.createElement('div');

	this.element.style.position = 'absolute';

	this.start_button = new SG99A_Button(this.app, this);

}

SG99A_Header.prototype.onRectSetted = function() {

	SG99A_Component.prototype.onRectSetted.call(this);

	this.setBackground('#f8f8d8');

	var player_box_width = Math.floor(this.rect.width * 0.35);
	var player_box_height = Math.floor(this.rect.height * 0.5);

	var turn_num_width = Math.floor(this.rect.width * 0.2);
	var turn_num_height = Math.floor(this.rect.height * 0.5);
	var turn_num_left = Math.floor(this.rect.width * 0.48);
	var turn_num_top = Math.floor(this.rect.height * 0.25);

	var player_turn_width = Math.floor(this.rect.width * 0.1);
	var player_name_width = Math.floor(this.rect.width * 0.17);
	var player_time_width = Math.floor(this.rect.width * 0.1);

	var player_turn_font_size = Math.floor(this.rect.height * 0.36);
	var player_name_font_size = Math.floor(this.rect.height * 0.36);
	var player_time_font_size = Math.floor(this.rect.height * 0.32);
	var turn_num_font_size = Math.floor(this.rect.height * 0.32);

	var player_box_left = Math.floor(this.rect.width * 0.04);

	var player_turn_left = 0;
	var player_name_left = player_turn_width;
	var player_time_left = player_name_left + player_name_width;

	var up_player_box_top = 0;
	var down_player_box_top = player_box_height;

	this.up_player_box = document.createElement('div');

	this.up_player_box.style.position = 'absolute';
	this.up_player_box.style.width = player_box_width + 'px';
	this.up_player_box.style.height = player_box_height + 'px';
	this.up_player_box.style.left = player_box_left + 'px';
	this.up_player_box.style.top = up_player_box_top + 'px';
	this.up_player_box.style.margin = 0;
	this.up_player_box.style.padding = 0;

	this.up_player_turn_label = document.createElement('p');

	this.up_player_turn_label.style.position = 'absolute';
	this.up_player_turn_label.style.width = player_turn_width + 'px';
	this.up_player_turn_label.style.height = player_box_height + 'px';
	this.up_player_turn_label.style.left = player_turn_left + 'px';
	this.up_player_turn_label.style.top = 0 + 'px';
	this.up_player_turn_label.style.margin = 0;
	this.up_player_turn_label.style.padding = 0;
	this.up_player_turn_label.style.lineHeight = player_box_height + 'px';
	this.up_player_turn_label.style.fontSize = player_turn_font_size + 'px';

	this.up_player_name_label = document.createElement('p');

	this.up_player_name_label.style.position = 'absolute';
	this.up_player_name_label.style.width = player_name_width + 'px';
	this.up_player_name_label.style.height = player_box_height + 'px';
	this.up_player_name_label.style.left = player_name_left + 'px';
	this.up_player_name_label.style.top = 0 + 'px';
	this.up_player_name_label.style.margin = 0;
	this.up_player_name_label.style.padding = 0;
	this.up_player_name_label.style.lineHeight = player_box_height + 'px';
	this.up_player_name_label.style.fontSize = player_name_font_size + 'px';

	this.up_player_time_label = document.createElement('p');

	this.up_player_time_label.style.position = 'absolute';
	this.up_player_time_label.style.width = player_time_width + 'px';
	this.up_player_time_label.style.height = player_box_height + 'px';
	this.up_player_time_label.style.left = player_time_left + 'px';
	this.up_player_time_label.style.top = 0 + 'px';
	this.up_player_time_label.style.margin = 0;
	this.up_player_time_label.style.padding = 0;
	this.up_player_time_label.style.lineHeight = player_box_height + 'px';
	this.up_player_time_label.style.fontSize = player_time_font_size + 'px';

	this.up_player_box.appendChild(this.up_player_turn_label);
	this.up_player_box.appendChild(this.up_player_name_label);
	this.up_player_box.appendChild(this.up_player_time_label);

	this.down_player_box = document.createElement('div');

	this.down_player_box.style.position = 'absolute';
	this.down_player_box.style.width = player_box_width + 'px';
	this.down_player_box.style.height = player_box_height + 'px';
	this.down_player_box.style.left = player_box_left + 'px';
	this.down_player_box.style.top = down_player_box_top + 'px';
	this.down_player_box.style.margin = 0;
	this.down_player_box.style.padding = 0;

	this.down_player_turn_label = document.createElement('p');

	this.down_player_turn_label.style.position = 'absolute';
	this.down_player_turn_label.style.width = player_turn_width + 'px';
	this.down_player_turn_label.style.height = player_box_height + 'px';
	this.down_player_turn_label.style.left = player_turn_left + 'px';
	this.down_player_turn_label.style.top = 0 + 'px';
	this.down_player_turn_label.style.margin = 0;
	this.down_player_turn_label.style.padding = 0;
	this.down_player_turn_label.style.lineHeight = player_box_height + 'px';
	this.down_player_turn_label.style.fontSize = player_turn_font_size + 'px';

	this.down_player_name_label = document.createElement('p');

	this.down_player_name_label.style.position = 'absolute';
	this.down_player_name_label.style.width = player_name_width + 'px';
	this.down_player_name_label.style.height = player_box_height + 'px';
	this.down_player_name_label.style.left = player_name_left + 'px';
	this.down_player_name_label.style.top = 0 + 'px';
	this.down_player_name_label.style.margin = 0;
	this.down_player_name_label.style.padding = 0;
	this.down_player_name_label.style.lineHeight = player_box_height + 'px';
	this.down_player_name_label.style.fontSize = player_name_font_size + 'px';

	this.down_player_time_label = document.createElement('p');

	this.down_player_time_label.style.position = 'absolute';
	this.down_player_time_label.style.width = player_time_width + 'px';
	this.down_player_time_label.style.height = player_box_height + 'px';
	this.down_player_time_label.style.left = player_time_left + 'px';
	this.down_player_time_label.style.top = 0 + 'px';
	this.down_player_time_label.style.margin = 0;
	this.down_player_time_label.style.padding = 0;
	this.down_player_time_label.style.lineHeight = player_box_height + 'px';
	this.down_player_time_label.style.fontSize = player_time_font_size + 'px';

	this.down_player_box.appendChild(this.down_player_turn_label);
	this.down_player_box.appendChild(this.down_player_name_label);
	this.down_player_box.appendChild(this.down_player_time_label);

	this.turn_num_label = document.createElement('p');

	this.turn_num_label.style.position = 'absolute';
	this.turn_num_label.style.width = turn_num_width + 'px';
	this.turn_num_label.style.height = turn_num_height + 'px';
	this.turn_num_label.style.left = turn_num_left + 'px';
	this.turn_num_label.style.top = turn_num_top + 'px';
	this.turn_num_label.style.margin = 0;
	this.turn_num_label.style.padding = 0;
	this.turn_num_label.style.lineHeight = player_box_height + 'px';
	this.turn_num_label.style.fontSize = turn_num_font_size + 'px';

	var start_width = Math.floor(this.app.default_font_size * 6.4);
	var start_height = this.app.default_font_size * 2.2;

	if (turn_num_font_size < 12) {

		start_width = Math.floor(this.app.default_font_size * 7.2);
		start_height = Math.floor(this.app.default_font_size * 2.32);

	}

	var start_left = this.rect.width - (start_width + this.app.default_font_size);
	var start_top = Math.floor((this.rect.height - start_height) / 2);

	this.start_button.setRect(start_left, start_top, start_width, start_height);
	this.start_button.setLabel(this.app.text_res['start_button_label']);

	this.element.appendChild(this.up_player_box);
	this.element.appendChild(this.down_player_box);
	this.element.appendChild(this.turn_num_label);
	this.element.appendChild(this.start_button.element);

}

SG99A_Header.prototype.onListeningComponentClicked = function(comp, x, y) {

	if (comp == this.start_button) {
		this.app.onStartButtonClicked.call(this.app);
	}

}

SG99A_Header.prototype.setGame = function(game) {
	this.game = game;
}

SG99A_Header.prototype.setBackground = function(bg) {

	SG99A_Component.prototype.setBackground.call(this, bg);

	this.element.style.background = this.background;

}

SG99A_Header.prototype.update = function() {

	if (this.game) {

		this.up_player_name_label.textContent = this.app.text_res['player_label'][this.game.up_player];
		this.down_player_name_label.textContent = this.app.text_res['player_label'][this.game.down_player];

		if (this.game.first_player == -1) {

			this.up_player_turn_label.textContent = this.app.text_res['turn_label_1st'];
			this.down_player_turn_label.textContent = this.app.text_res['turn_label_2nd'];

		} else {

			this.up_player_turn_label.textContent = this.app.text_res['turn_label_2nd'];
			this.down_player_turn_label.textContent = this.app.text_res['turn_label_1st'];

		}

		var up_player_time = Math.floor((this.game.up_player_time + this.game.up_player_turn_time) / 1000);
		var down_player_time = Math.floor((this.game.down_player_time + this.game.down_player_turn_time) / 1000);

		var up_player_hour = Math.floor(up_player_time / 3600);
		var up_player_min = Math.floor((up_player_time % 3600) / 60);
		var up_player_sec = Math.floor(up_player_time % 60);

		var down_player_hour = Math.floor(down_player_time / 3600);
		var down_player_min = Math.floor((down_player_time % 3600) / 60);
		var down_player_sec = Math.floor(down_player_time % 60);

		if (up_player_min <= 9) {
			up_player_min = '0' + up_player_min;
		}

		if (up_player_sec <= 9) {
			up_player_sec = '0' + up_player_sec;
		}

		if (down_player_min <= 9) {
			down_player_min = '0' + down_player_min;
		}

		if (down_player_sec <= 9) {
			down_player_sec = '0' + down_player_sec;
		}

		this.up_player_time_label.textContent = up_player_hour + ':' + up_player_min + ':' + up_player_sec;
		this.down_player_time_label.textContent = down_player_hour + ':' + down_player_min + ':' + down_player_sec;

		this.turn_num_label.textContent = this.turn_num_label_text.replace('[:n:]', this.game.turn_num);

	}

}