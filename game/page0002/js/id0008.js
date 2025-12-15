var SG99A_Button = function(app, ui_listener) {

	SG99A_Component.call(this, app, ui_listener);

}

SG99A_Button.prototype = Object.create(SG99A_Component.prototype);
SG99A_Button.prototype.constructor = SG99A_Button;

SG99A_Button.prototype.createElement = function() {

	this.element = document.createElement('button');

	this.element.style.display = 'inline-block';
	this.element.style.position = 'absolute';

}

SG99A_Button.prototype.setFontSize = function(font_size) {
	this.element.style.fontSize = font_size + 'px';
}

SG99A_Button.prototype.setLabel = function(label) {
	this.element.textContent = label;
}

SG99A_Button.prototype.setEnabled = function(enabled) {
	this.element.disabled = !enabled;
}