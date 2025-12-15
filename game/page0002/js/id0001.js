function SG99A_Piece() {

	this.images = new Array(9);

}

SG99A_Piece.prototype.createPieceImages = function(cell_width, cell_height) {

	for (var i = SG99A_Piece.MIN;i <= SG99A_Piece.MAX;i++) {

		var piece_width = 0, piece_height = 0;

		switch (Math.abs(i)) {

		case SG99A_Piece.OU:

			piece_width = Math.floor(cell_width * 0.94);
			piece_height = Math.floor(cell_height * 0.94);

			break;

		case SG99A_Piece.KIN:
		case SG99A_Piece.SHA:
		case SG99A_Piece.KAKU:
		case SG99A_Piece.SHA_P:
		case SG99A_Piece.KAKU_P:

			piece_width = Math.floor(cell_width * 0.90);
			piece_height = Math.floor(cell_height * 0.90);

			break;

		case SG99A_Piece.GIN:
		case SG99A_Piece.KEI:
		case SG99A_Piece.KYO:
		case SG99A_Piece.GIN_P:
		case SG99A_Piece.KEI_P:
		case SG99A_Piece.KYO_P:

			piece_width = Math.floor(cell_width * 0.86);
			piece_height = Math.floor(cell_height * 0.86);

			break;

		case SG99A_Piece.FU:
		case SG99A_Piece.FU_P:

			piece_width = Math.floor(cell_width * 0.82);
			piece_height = Math.floor(cell_height * 0.82);

			break;

		}

		if (piece_width > 0) {
			this.images[i] = this.createPieceImage(i, cell_width, cell_height, piece_width, piece_height);
		}

	}

}

SG99A_Piece.prototype.createPieceImage = function(piece, img_width, img_height, width, height) {

	var cv = document.createElement("canvas");

	var upset = piece < 0;

	if (upset) {
		piece *= -1;
	}

	cv.width = width;
	cv.height = height;

	var context = cv.getContext("2d");

	context.fillStyle = "#e8e4a0";
	context.strokeStyle = "#101018";
	context.lineWidth = 2.0;

	context.beginPath();

	context.moveTo(Math.floor(width / 2), 1);
	context.lineTo(Math.floor(width * 0.12), Math.floor(height * 0.2));
	context.lineTo(1, height - 2);
	context.lineTo(width - 2, height - 2);
	context.lineTo(Math.floor(width * 0.88), Math.floor(height * 0.2));
	context.lineTo(Math.floor(width / 2), 1);

	context.closePath();

	context.fill();
	context.stroke();

	var chars = [];

	var color_1 = '#080810';
	var color_2 = '#cc0810';

	switch (piece) {

	case SG99A_Piece.OU:

		chars.push(this.createCharCanvas("王", Math.floor(width * 0.44), Math.floor(width * 0.30), color_1));
		chars.push(this.createCharCanvas("将", Math.floor(width * 0.46), Math.floor(width * 0.35), color_1));

		break;

	case SG99A_Piece.KIN:

		chars.push(this.createCharCanvas("金", Math.floor(width * 0.44), Math.floor(width * 0.33), color_1));
		chars.push(this.createCharCanvas("将", Math.floor(width * 0.46), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.GIN:

		chars.push(this.createCharCanvas("銀", Math.floor(width * 0.44), Math.floor(width * 0.33), color_1));
		chars.push(this.createCharCanvas("将", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.KEI:

		chars.push(this.createCharCanvas("桂", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
		chars.push(this.createCharCanvas("馬", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.KYO:

		chars.push(this.createCharCanvas("香", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
		chars.push(this.createCharCanvas("車", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.SHA:

		chars.push(this.createCharCanvas("飛", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
		chars.push(this.createCharCanvas("車", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.KAKU:

		chars.push(this.createCharCanvas("角", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
		chars.push(this.createCharCanvas("行", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.FU:

		chars.push(this.createCharCanvas("歩", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
		chars.push(this.createCharCanvas("兵", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));

		break;

	case SG99A_Piece.GIN_P:

		chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.33), color_2));
		chars.push(this.createCharCanvas("銀", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	case SG99A_Piece.KEI_P:

		chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
		chars.push(this.createCharCanvas("桂", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	case SG99A_Piece.KYO_P:

		chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
		chars.push(this.createCharCanvas("香", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	case SG99A_Piece.SHA_P:

		chars.push(this.createCharCanvas("龍", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
		chars.push(this.createCharCanvas("王", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	case SG99A_Piece.KAKU_P:

		chars.push(this.createCharCanvas("龍", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
		chars.push(this.createCharCanvas("馬", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	case SG99A_Piece.FU_P:

		chars.push(this.createCharCanvas("と", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));

		break;

	}

	var vgap = Math.floor(chars[0].height * 0.15);

	var chars_height = chars[0].height;

	if (chars.length > 1) {

		chars_height += vgap;
		chars_height += chars[1].height;

	}

	var chars_top = Math.floor(height * 0.05 + (height - chars_height) / 2);

	var chars_y = chars_top;

	for (var i = 0;i < 2;i++) {
		if (i < chars.length) {

			var left = Math.floor((width - chars[i].width) / 2);

			context.drawImage(chars[i], left, chars_y);
			chars_y += chars[i].height + vgap;

		}
	}

	var result_cv = document.createElement("canvas");

	result_cv.width = img_width;
	result_cv.height = img_height;

	var result_context = result_cv.getContext("2d");

	if (upset) {

		result_context.translate(img_width / 1, img_height / 1);
		result_context.rotate(Math.PI);

	}

	result_context.drawImage(cv, Math.floor((img_width - width) / 2), Math.floor((img_height - height) / 2));

	return result_cv;

}

SG99A_Piece.prototype.createCharCanvas = function(c, width, height, color) {

	var cv = document.createElement("canvas");

	cv.width = width * 3;
	cv.height = width * 2;

	var context = cv.getContext("2d");

	context.font = "bold " + (width * 2) + "px 'ｭｳ ｰ繧ｴ繧ｷ繝け'";
	context.textAlign = "center";
	context.textBaseline = "middle";

	context.fillStyle = color;

	context.fillText(c, cv.width / 2, cv.height / 2);

	var drawn_data = context.getImageData(0, 0, cv.width, cv.height);

	var min_x = cv.width;
	var min_y = cv.height;
	var max_x = 0;
	var max_y = 0;

	for (var y = 0;y < cv.height;y++) {

		var p_index = y * cv.width * 4;

		for (var x = 0;x < cv.width;x++) {

			var a = drawn_data.data[p_index + 3];

			if (a > 1) {

				if (x < min_x) {
					min_x = x;
				}

				if (y < min_y) {
					min_y = y;
				}

				if (x > max_x) {
					max_x = x;
				}

				if (y > max_y) {
					max_y = y;
				}

			}

			p_index += 4;

		}
	}

	var drawn_width = max_x - min_x + 1;
	var drawn_height = max_y - min_y + 1;

	var drawn_cv = document.createElement('canvas');
	drawn_cv.width = drawn_width;
	drawn_cv.height = drawn_height;

	var drawn_context = drawn_cv.getContext("2d");

	drawn_context.putImageData(drawn_data, -min_x, -min_y);

	var result_cv = document.createElement("canvas");
	result_cv.width = width;
	result_cv.height = height;

	var result_context = result_cv.getContext("2d");

	result_context.drawImage(drawn_cv, 0, 0, drawn_width, drawn_height, 0, 0, width, height);

	return result_cv;

}

SG99A_Piece.NONE = 0;
SG99A_Piece.OU = 1;
SG99A_Piece.KIN = 2;
SG99A_Piece.GIN = 3;
SG99A_Piece.KEI = 4;
SG99A_Piece.KYO = 5;
SG99A_Piece.FU = 6;
SG99A_Piece.KAKU = 7;
SG99A_Piece.SHA = 8;
SG99A_Piece.PROMOTED = 16;
SG99A_Piece.GIN_P = SG99A_Piece.GIN + SG99A_Piece.PROMOTED;
SG99A_Piece.KEI_P = SG99A_Piece.KEI + SG99A_Piece.PROMOTED;
SG99A_Piece.KYO_P = SG99A_Piece.KYO + SG99A_Piece.PROMOTED;
SG99A_Piece.SHA_P = SG99A_Piece.SHA + SG99A_Piece.PROMOTED;
SG99A_Piece.KAKU_P = SG99A_Piece.KAKU + SG99A_Piece.PROMOTED;
SG99A_Piece.FU_P = SG99A_Piece.FU + SG99A_Piece.PROMOTED;

SG99A_Piece.M_OU = -SG99A_Piece.OU;
SG99A_Piece.M_KIN = -SG99A_Piece.KIN;
SG99A_Piece.M_GIN = -SG99A_Piece.GIN;
SG99A_Piece.M_KEI = -SG99A_Piece.KEI;
SG99A_Piece.M_KYO = -SG99A_Piece.KYO;
SG99A_Piece.M_FU = -SG99A_Piece.FU;
SG99A_Piece.M_KAKU = -SG99A_Piece.KAKU;
SG99A_Piece.M_SHA = -SG99A_Piece.SHA;
SG99A_Piece.M_GIN_P = -SG99A_Piece.GIN_P;
SG99A_Piece.M_KEI_P = -SG99A_Piece.KEI_P;
SG99A_Piece.M_KYO_P = -SG99A_Piece.KYO_P;
SG99A_Piece.M_SHA_P = -SG99A_Piece.SHA_P;
SG99A_Piece.M_KAKU_P = -SG99A_Piece.KAKU_P;
SG99A_Piece.M_FU_P = -SG99A_Piece.FU_P;
SG99A_Piece.MIN = -24;
SG99A_Piece.MAX = 24;

SG99A_Piece.M_OU_U = -SG99A_Piece.OU;
SG99A_Piece.M_KIN_U = -SG99A_Piece.KIN;
SG99A_Piece.M_GIN_U = -SG99A_Piece.GIN;
SG99A_Piece.M_KEI_U = -SG99A_Piece.KEI;
SG99A_Piece.M_KYO_U = -SG99A_Piece.KYO;
SG99A_Piece.M_FU_U = -SG99A_Piece.FU;
SG99A_Piece.M_KAKU_U = -SG99A_Piece.KAKU;
SG99A_Piece.M_SHA_U = -SG99A_Piece.SHA;
SG99A_Piece.M_GIN_P_U = -SG99A_Piece.GIN_P;
SG99A_Piece.M_KEI_P_U = -SG99A_Piece.KEI_P;
SG99A_Piece.M_KYO_P_U = -SG99A_Piece.KYO_P;
SG99A_Piece.M_SHA_P_U = -SG99A_Piece.SHA_P;
SG99A_Piece.M_KAKU_P_U = -SG99A_Piece.KAKU_P;
SG99A_Piece.M_FU_P_U = -SG99A_Piece.FU_P;
SG99A_Piece.OU_U = 1;
SG99A_Piece.KIN_U = 2;
SG99A_Piece.GIN_U = 3;
SG99A_Piece.KEI_U = 4;
SG99A_Piece.KYO_U = 5;
SG99A_Piece.FU_U = 6;
SG99A_Piece.KAKU_U = 7;
SG99A_Piece.SHA_U = 8;
SG99A_Piece.PROMOTED_U = 16;
SG99A_Piece.GIN_P_U = SG99A_Piece.GIN + SG99A_Piece.PROMOTED;
SG99A_Piece.KEI_P_U = SG99A_Piece.KEI + SG99A_Piece.PROMOTED;
SG99A_Piece.KYO_P_U = SG99A_Piece.KYO + SG99A_Piece.PROMOTED;
SG99A_Piece.SHA_P_U = SG99A_Piece.SHA + SG99A_Piece.PROMOTED;
SG99A_Piece.KAKU_P_U = SG99A_Piece.KAKU + SG99A_Piece.PROMOTED;
SG99A_Piece.FU_P_U = SG99A_Piece.FU + SG99A_Piece.PROMOTED;

SG99A_Piece.piece_scores = new Int32Array(25);

SG99A_Piece.piece_scores[SG99A_Piece.OU] = 9999;
SG99A_Piece.piece_scores[SG99A_Piece.KIN] = 400;
SG99A_Piece.piece_scores[SG99A_Piece.GIN] = 360;
SG99A_Piece.piece_scores[SG99A_Piece.KEI] = 300;
SG99A_Piece.piece_scores[SG99A_Piece.KYO] = 310;
SG99A_Piece.piece_scores[SG99A_Piece.SHA] = 1000;
SG99A_Piece.piece_scores[SG99A_Piece.KAKU] = 880;
SG99A_Piece.piece_scores[SG99A_Piece.FU] = 60;
SG99A_Piece.piece_scores[SG99A_Piece.GIN_P] = 380;
SG99A_Piece.piece_scores[SG99A_Piece.KEI_P] = 350;
SG99A_Piece.piece_scores[SG99A_Piece.KYO_P] = 350;
SG99A_Piece.piece_scores[SG99A_Piece.SHA_P] = 1200;
SG99A_Piece.piece_scores[SG99A_Piece.KAKU_P] = 1060;
SG99A_Piece.piece_scores[SG99A_Piece.FU_P] = 360;

SG99A_Piece.table_piece_rate = 1.15;

SG99A_Piece.table_piece_scores = [];

SG99A_Piece.table_piece_scores[SG99A_Piece.OU] = 9999 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KIN] = 400 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.GIN] = 360 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KEI] = 300 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KYO] = 310 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.SHA] = 1000 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KAKU] = 880 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.FU] = 60 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.GIN_P] = 380 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KEI_P] = 350 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KYO_P] = 350 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.SHA_P] = 1200 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.KAKU_P] = 1060 * SG99A_Piece.table_piece_rate;
SG99A_Piece.table_piece_scores[SG99A_Piece.FU_P] = 360 * SG99A_Piece.table_piece_rate;