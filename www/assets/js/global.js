//<![CDATA[
var landhb_svr = "220.1.35.34";

var trim = function(text) {
	//return text.replace(/[\-字號第年桃登跨德壢溪楊蘆平山資總更速標永\s\(\)]/g, "");
	return text.replace(/[^a-zA-Z0-9]/g, "");
}

var isEmpty = function(variable) {
	if (variable === undefined || $.trim(variable) == "") {
		return true;
	}
	
	if (typeof variable == "object" && variable.length == 0) {
		return true;
	}
	return false;
}

var showPopper = function(selector, content) {
	if (!isEmpty(content)) {
		$(selector).attr("data-content", content);
	}
	$(selector).popover('show');
	setTimeout(function() {
		$(selector).popover('hide');
	}, 2000);
	scrollToElement(selector);
}

var toggle = function(selector) {
	var el = $(selector);
	el.attr("disabled") ? el.attr("disabled", false) : el.attr("disabled", true);
}

var scrollToElement = function (element) {
	var pos = $(element).offset().top - 100;
	if (pos < 0) return;
	$("html, body").animate({
		scrollTop: pos
	}, 1000);
}

var setLoadingHTML = function(selector) {
	$(selector).html("<img src='assets/img/walking.gif' border='0' title='loading ...... ' width='25' height='25' />");
}

var bindPressEnterEvent = function(selector, callback_func) {
	$(selector).on("keypress", function(e) {
		var keynum = (e.keyCode ? e.keyCode : e.which);
		if (keynum == '13') {
		callback_func.call(e.target, e);
		}
	});
}

$(document).ready(function(e) {
	// for cache purpose
	if (localStorage) {
		var cacheIt = function(el) {
			var this_text_input = $(el);
			var val = this_text_input.val();
			var ele_id = this_text_input.attr("id");
			if (val === undefined || $.trim(val) == "") {
				localStorage.removeItem(ele_id);
			} else {
				localStorage[ele_id] = val;
			}
		}
		window.pyliuIntTimer = setInterval(function(e) {
			$("input[type='text'], select, textarea").each(function(index, el) {
				cacheIt(el);
			});
		}, 10000);
		$("input[type='text'], select, textarea").on("blur", function(e) {
			cacheIt(e.target);
		});
	}
	// add responsive and thumbnail style to blockquote img
	$("blockquote img").addClass("img-responsive img-thumbnail");
	// control blockquote block for *_quote_button
	$("button[id*='_quote_button']").on("click", function(e) {
		var quote = $(e.target).next("blockquote"); // find DIRECT next element by selector
		quote.hasClass("hide") ? quote.removeClass("hide") : quote.addClass("hide");
	});
	
	// tooltip enablement
	$('[data-toggle="tooltip"]').tooltip({
		delay: {
			show: 300,
			hide: 100
		}
	});
	// for any field that needs date picking purpose (add .date_picker to its class)
	/**
	 * <script src="assets/js/bootstrap-datepicker.min.js"></script>
  	 * <script src="assets/js/bootstrap-datepicker.zh-TW.min.js"></script>
	 */
	if ($(".date_picker").datepicker) {
		$(".date_picker").datepicker({
			daysOfWeekDisabled: "",
			language: "zh-TW",
			daysOfWeekHighlighted: "1,2,3,4,5",
			//todayBtn: true,
			todayHighlight: true,
			autoclose: true,
			format: {
				/*
				* Say our UI should display a week ahead,
				* but textbox should store the actual date.
				* This is useful if we need UI to select local dates,
				* but store in UTC
				*/
				toDisplay: function (date, format, language) {
				var d = new Date(date);
				return (d.getFullYear() - 1911)
						+ ("0" + (d.getMonth()+1)).slice(-2)
						+ ("0" + d.getDate()).slice(-2);
				},
				toValue: function (date, format, language) {
				// initialize to now
				return new Date();
				}
			}
		});
	}
});
//]]>
