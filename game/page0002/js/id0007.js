function SG99A_Component(app, ui_listener) {

	this.app = app;
	this.ui_listener = ui_listener;

	this.draw_scale = this.app.draw_scale;

	this.createElement();

	this.element.style.webkitTouchAction = 'none';
	this.element.style.webkitUserSelect = 'none';
	this.element.style.userSelect = 'none';
	this.element.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
	this.element.style.tapHighlightColor = 'rgba(0,0,0,0)';

	this.element.addEventListener('click', this.processElementClicked.bind(this), false);
	this.element.addEventListener('touchstart', this.processElementTouchStart.bind(this), false);

	this.last_touch_start_ms = 0;

}

SG99A_Component.prototype.setBackground = function(bg) {

	this.element.style.background = bg;
	this.background = bg;

}

SG99A_Component.prototype.setRect = function(left, top, width, height) {

	this.rect = SG99A_Rect.createRect(left, top, width, height);

	this.onRectSetted();

}

SG99A_Component.prototype.onRectSetted = function() {

	this.draw_scale = this.app.draw_scale;

	this.element.style.width = this.rect.width + 'px';
	this.element.style.height = this.rect.height + 'px';
	this.element.style.left = this.rect.left + 'px';
	this.element.style.top = this.rect.top + 'px';

}

SG99A_Component.prototype.processElementTouchStart = function(e) {

	// 隍焚繧ｿ繝メ縺ｯ辟｡蜉ｹ
	if (e.touches.length >= 2) {

		e.preventDefault();
		e.stopPropagation();

		return false;

	}

	var now = this.app.getTimeMS();

	// 繝繝悶Ν繧ｿ繝辟｡蜉ｹ蛹
	if (now - this.last_touch_start_ms < 300) {

		e.preventDefault();
		e.stopPropagation();

		this.last_touch_start_ms = now;

		return false;

	}

	// 繧ｿ繝メ髢句ｧ区凾蛻ｻ繧定ｨ倬鹸
	this.last_touch_start_ms = now;

}

SG99A_Component.prototype.processElementClicked = function(e) {

	e.preventDefault();
	e.stopPropagation();

	var elm = e.target;

	var element_rect = elm.getBoundingClientRect();

	var element_x = element_rect.left + window.pageXOffset;
	var element_y = element_rect.top + window.pageYOffset;

	var x = e.pageX - element_x;
	var y = e.pageY - element_y;

	this.onElementClicked(x, y);

}

SG99A_Component.prototype.onElementClicked = function(x, y) {
	if (this.ui_listener && this.ui_listener.onListeningComponentClicked) {
		this.ui_listener.onListeningComponentClicked.call(this.ui_listener, this, x, y);
	}
}

SG99A_Component.prototype.getHTMLElement = function() {
	return this.element;
}