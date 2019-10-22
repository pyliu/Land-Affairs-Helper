//<![CDATA[

var xhrGetCaseLatestNum = function(e) {
	var code_select = $("#"+this.code_id);
	var code_val = code_select.val();
	if (isEmpty(code_val)) {
		return;
	}
	
	var year = $("#"+this.year_id).val().replace(/\D/g, "");
	var code = trim(code_val);

	var body = new FormData();
	body.append("type", "max");
	body.append("year", year);
	body.append("code", code);
	
	var display = $("#"+this.display_id);
	var number = $("#"+this.number_id);

	toggle(code_select);
	toggle(number);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		if (jsonObj.status == 1) {
			display.html("目前 " + code_val + " 最新案件號為 " + jsonObj.max);
			number.val(jsonObj.max);
		} else if (jsonObj.status == 0) {
			display.html("<strong class='text-danger'>" + jsonObj.message + "</strong>");
		} else {
			display.html("<strong class='text-danger'>" + code_val + "</strong>");
		}
		toggle(code_select);
		toggle(number);
	}).catch(function(ex) {
		console.error("xhrGetCaseLatestNum parsing failed", ex);
	  	display.html("<strong class='text-danger'>" + "查詢最大號碼失敗~【" + code_val + "】" + "</strong>");
	});
};

var showRegCaseDetail = function(jsonObj, use_modal) {
	var html = "<p>" + jsonObj.tr_html + "</p>";
	if (jsonObj.status == 0) {
		html = "<strong class='text-danger'>" + jsonObj.message + "</strong>";
	} else if (jsonObj.status == -1) {
		throw new Error("查詢失敗：" + jsonObj.message);
	} else {
		var area = "其他(" + jsonObj.資料管轄所 + "區)";
		var rm10 = jsonObj.raw.RM10 ? jsonObj.raw.RM10 : "XX";
		switch (rm10) {
			case "03":
				area = "中壢區";
				break;
			case "12":
				area = "觀音區";
				break;
			default:
				break;
		}

		html += (jsonObj.跨所 == "Y" ? "<span class='bg-info text-white rounded p-1'>跨所案件 (" + jsonObj.資料收件所 + " => " + jsonObj.資料管轄所 + ")</span><br />" : "");
		
		// http://220.1.35.34:9080/LandHB/CAS/CCD02/CCD0202.jsp?year=108&word=HB04&code=005001&sdlyn=N&RM90=
		html += "收件字號：" + "<a title='案件辦理情形 on " + landhb_svr + "' href='#' onclick='javascript:window.open(\"http://\"\+landhb_svr\+\":9080/LandHB/CAS/CCD02/CCD0202.jsp?year="+ jsonObj.raw["RM01"] +"&word="+ jsonObj.raw["RM02"] +"&code="+ jsonObj.raw["RM03"] +"&sdlyn=N&RM90=\")'>" + jsonObj.收件字號 + "</a> <br />";
		
		// options for switching server
		//html += "<label for='cross_svr'><input type='radio' id='cross_svr' name='svr_opts' value='220.1.35.123' onclick='javascript:landhb_svr=\"220.1.35.123\"' /> 跨縣市主機</label> <br />";

		html += isEmpty(jsonObj.結案已否) ? "<div class='text-danger'><strong>尚未結案！</strong></div>" : "";

		html += "收件時間：" + jsonObj.收件時間 + "<br/>";
		html += "限辦期限：" + jsonObj.限辦期限 + "<br/>";
		html += "作業人員：" + jsonObj.作業人員 + "<br/>";
		html += "辦理情形：" + jsonObj.辦理情形 + "<br/>";
		html += "登記原因：" + jsonObj.登記原因 + "<br/>";
		html += "區域：" + area + "【" + jsonObj.raw.RM10 + "】<br/>";
		html += "段小段：" + jsonObj.段小段 + "【" + jsonObj.段代碼 + "】<br/>";
		html += "地號：" + jsonObj.地號 + "<br/>";
		html += "建號：" + jsonObj.建號 + "<br/>";
		html += "件數：" + jsonObj.件數 + "<br/>";
		html += "登記處理註記：" + jsonObj.登記處理註記 + "<br/>";
		html += "地價處理註記：" + jsonObj.地價處理註記 + "<br/>";
		html += "權利人統編：" + jsonObj.權利人統編 + "<br/>";
		html += "權利人姓名：" + jsonObj.權利人姓名 + "<br/>";
		html += "義務人統編：" + jsonObj.義務人統編 + "<br/>";
		html += "義務人姓名：" + jsonObj.義務人姓名 + "<br/>";
		html += "義務人人數：" + jsonObj.義務人人數 + "<br/>";
		html += "代理人統編：" + jsonObj.代理人統編 + "<br/>";
		html += "代理人姓名：" + jsonObj.代理人姓名 + "<br/>";
		html += "手機號碼：" + jsonObj.手機號碼 + "<br/>";
	}
	
	if (use_modal) {
		showModal({
			body: html,
			title: "登記案件詳情",
			size: "lg"
		});
		// user info dialog event
		addUserInfoEvent();
	} else {
		$("#query_display").html(html);
		// make click case id tr can bring up the detail dialog 【use reg_case_id css class as identifier to bind event】
		$(".reg_case_id").on("click", xhrRegQueryCaseDialog);
		$(".reg_case_id").attr("title", "點我取得更多資訊！");
	}
}

var showPrcCaseDetail = function(jsonObj, use_modal) {
	var html = "<p>" + jsonObj.html + "</p>";
	if (jsonObj.status == 0) {
		html = "<strong class='text-danger'>" + jsonObj.message + "</strong>";
	} else if (jsonObj.status == -1) {
		throw new Error("查詢失敗：" + jsonObj.message);
	}
	if (use_modal) {
		showModal({
			body: html,
			title: "登記案件詳情",
			size: "lg"
		});
	} else {
		$("#query_display").html(html);
		$(".prc_case_serial").on("click", xhrRegQueryCaseDialog);
	}
}

var xhrRegQueryCaseDialog = function(e) {
	// ajax event binding
	var clicked_element = $(e.target);
	// remove additional characters for querying
	var id = trim(clicked_element.text());

	var body = new FormData();
	body.append("type", "reg_case");
	body.append("id", id);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		showRegCaseDetail(jsonObj, true);
	}).catch(function(ex) {
		console.error("xhrRegQueryCaseDialog parsing failed", ex);
	});
}

var xhrRegQueryCase = function(e) {
	if (!validateCaseInput("#query_year", "#query_code", "#query_num", "#query_display")) {
		return false;
	}
	var year = $("#query_year").val().replace(/\D/g, "");
	var code = $("#query_code").val();
	var number = $("#query_num").val().replace(/\D/g, "");
	// prepare post params
	var id = trim(year + code + number);
	var body = new FormData();
	body.append("type", "reg_case");
	body.append("id", id);
	
	toggle(e.target);

	fetch("query_json_api.php", {
		method: "POST",
		//headers: { "Content-Type": "application/json" },
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		showRegCaseDetail(jsonObj);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrRegQueryCase parsing failed", ex);
		$("#query_display").html("<strong class='text-danger'>無法取得 " + id + " 資訊!【" + ex + "】</strong>");
	});
}

var xhrPrcQueryCase = function(e) {
	if (!validateCaseInput("#query_year", "#query_code", "#query_num", "#query_display")) {
		return false;
	}
	var year = $("#query_year").val().replace(/\D/g, "");
	var code = $("#query_code").val();
	var number = $("#query_num").val().replace(/\D/g, "");
	// prepare post params
	var id = trim(year + code + number);
	var body = new FormData();
	body.append("type", "prc_case");
	body.append("id", id);
	
	toggle(e.target);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		showPrcCaseDetail(jsonObj);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrPrcQueryCase parsing failed", ex);
		$("#query_display").html("<strong class='text-danger'>無法取得 " + id + " 資訊!【" + ex + "】</strong>");
	});
}

var xhrCallWatchDog = function(e) {
	var body = new FormData();
	body.append("type", "watchdog");
	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		// normal success jsonObj.status == 1
		if (jsonObj.status != 1) {
			console.error(jsonObj.message);
			// stop interval timer
			clearTimeout(window.pyliuChkTimer);
			console.info("停止全域WATCHDOG定時器。");
		}
	}).catch(function(ex) {
		console.error("xhrCallWatchDog parsing failed", ex);
	});
}

var xhrCheckProblematicXCase = function(e) {
	toggle(e.target);
	
	var body = new FormData();
	body.append("type", "x");

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		if (jsonObj.status == 1) {
			var html = "<div class='mt-1'><span class='rounded-circle bg-danger'> 　 </span> <strong class='text-info'>請查看並修正下列案件：</strong></div>";
			for (var i = 0; i < jsonObj.data_count; i++) {
				html += "<a href='javascript:void(0)' class='reg_case_id'>" + jsonObj.case_ids[i] + "</a> ";
				html += "<button class='fix_xcase_button' data-id='" + jsonObj.case_ids[i] + "'>修正</button> ";
				html += "<span id='" + jsonObj.case_ids[i] + "'></span> <br />";
			}
			$("#cross_case_check_query_display").html(html);
			$(".reg_case_id").on("click", xhrRegQueryCaseDialog);
			$(".fix_xcase_button").on("click", xhrFixProblematicXCase);
		} else if (jsonObj.status == 0) {
			var now = new Date();
			$("#cross_case_check_query_display").html("<div class='mt-1'><span class='rounded-circle bg-success'> 　 </span> 目前一切良好！【" + now.toLocaleString() + "】</div>");
		}
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrCheckProblematicXCase parsing failed", ex);
	  $("#cross_case_check_query_display").html("<strong class='text-danger'>XHR連線查詢有問題!!【" + ex + "】</strong>");
	});
};

var xhrFixProblematicXCase = function(e) {
	var id = trim($(e.target).data("id"));
	console.log("The problematic xcase id: "+id);

	var body = new FormData();
	body.append("type", "fix_xcase");
	body.append("id", id);

	$(e.target).remove();

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		var msg_span_id = "#" + id;
		if (jsonObj.status == 1) {
			$(msg_span_id).html("<span class='text-success'>跨所註記修正完成!</span>");
		} else {
			$(msg_span_id).html("<span class='text-danger'>跨所註記修正失敗!</span>");
		}
	}).catch(function(ex) {
		console.error("xhrFixProblematicXCase parsing failed", ex);
		$("#cross_case_check_query_display").html("<span class='text-danger'>" + ex + "</span>");
	});


}

var xhrGetSectionRALIDCount = function(e) {
	var el = $(e.target);
	toggle(el);
	var text = $("#data_query_text").val();
	var xhr = $.ajax({
		url: "query_json_api.php",
		data: "type=ralid&text="+text,
		method: "POST",
		dataType: "json",
		success: function(jsonObj) {
			toggle(el);
			var count = jsonObj.data_count;
			var html = "";
			for (var i=0; i<count; i++) {
				if (isNaN(jsonObj.raw[i]["段代碼"])) {
					continue;
				}
				var this_count = parseInt(jsonObj.raw[i]["土地標示部筆數"]);
				this_count = this_count < 1000 ? 1000 : this_count;
				var blow = jsonObj.raw[i]["土地標示部筆數"].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var size = 0, size_o = 0;
				if (jsonObj.raw[i]["面積"]) {
					size = jsonObj.raw[i]["面積"].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					size_o = (jsonObj.raw[i]["面積"] * 3025 / 10000).toFixed(2);
					size_o = size_o.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				html += "【<span class='text-info'>" + jsonObj.raw[i]["段代碼"]  + "</span>】" + jsonObj.raw[i]["段名稱"] + "：土地標示部 <span class='text-primary'>" + blow + "</span> 筆【面積：" + size + " &#x33A1; | " + size_o + " 坪】 <br />";
			}
			$("#data_query_result").html(html);
		},
		error: function(obj) {
			toggle(el);
		}
	});
}

/*
	行政課來文查詢某統編是否有申請案件 ....
*/
var xhrGetCasesByID = function(e) {
	var el = $(e.target);
	toggle(".id_query_grp");
	var text = $("#id_query_text").val();

	var finish_count = 0;

	var xhr_crsms = $.ajax({
		url: "query_json_api.php",
		data: "type=crsms&id="+text,
		method: "POST",
		dataType: "json",
		success: function(jsonObj) {
			var count = jsonObj.data_count;
			if (count == 0) {
				$("#id_query_crsms_result").html("本所登記案件資料庫查無統編「"+text+"」收件資料。");
			} else {
				var html = "<p>登記案件：";
				for (var i=0; i<count; i++) {
					html += "<div class='reg_case_id'>" + jsonObj.raw[i]["RM01"] + "-" + jsonObj.raw[i]["RM02"]  + "-" + jsonObj.raw[i]["RM03"] + "</div>";
				}
				html += "</p>";
				$("#id_query_crsms_result").html(html);
				// make click case id tr can bring up the detail dialog 【use reg_case_id css class as identifier to bind event】
				$(".reg_case_id").on("click", xhrRegQueryCaseDialog);
				$(".reg_case_id").attr("title", "點我取得更多資訊！");
			}
			finish_count++;
			if (finish_count >= 2) {
				toggle(".id_query_grp");
			}
		},
		error: function(obj) {
			finish_count++;
			if (finish_count >= 2) {
				toggle(".id_query_grp");
			}
		}
	});
	var xhr_cmsms = $.ajax({
		url: "query_json_api.php",
		data: "type=cmsms&id="+text,
		method: "POST",
		dataType: "json",
		success: function(jsonObj) {
			var count = jsonObj.data_count;
			if (count == 0) {
				$("#id_query_cmsms_result").html("本所測量案件資料庫查無統編「"+text+"」收件資料。");
			} else {
				var html = "<p>測量案件：";
				for (var i=0; i<count; i++) {
					html += "<div>" + jsonObj.raw[i]["MM01"] + "-" + jsonObj.raw[i]["MM02"]  + "-" + jsonObj.raw[i]["MM03"] + "</div>";
				}
				html += "</p>";
				$("#id_query_cmsms_result").html(html);
			}
			finish_count++;
			if (finish_count >= 2) {
				toggle(".id_query_grp");
			}
		},
		error: function(obj) {
			finish_count++;
			if (finish_count >= 2) {
				toggle(".id_query_grp");
			}
		}
	});
}

var getEasycardPaymentStatus = function(code) {
	var status = "未知的狀態碼【" + code + "】";
	/*
		1：扣款成功
		2：扣款失敗
		3：取消扣款
		8：扣款異常交易
		9：取消扣款異常交易
	*/
	switch(code) {
		case "1":
			status = "扣款成功";
			break;
		case "2":
			status = "扣款失敗";
			break;
		case "3":
			status = "取消扣款";
			break;
		case "8":
			status = "扣款異常交易";
			break;
		case "9":
			status = "取消扣款異常交易";
			break;
		default:
			break;
	}
	return status;
}

var xhrFixEasycardPayment = function(qday, pc_number, amount, btn_id) {
	var message = "確定要修正 日期: " + qday + ", 電腦給號: " + pc_number + ", 金額: " + amount + " 悠遊卡付款資料?";
	if (confirm(message)) {
		var el = $("#"+btn_id);
		toggle(el);

		var body = new FormData();
		body.append("type", "fix_easycard");
		body.append("qday", qday);
		body.append("pc_num", pc_number);

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				alert("日期: " + qday + ", 電腦給號: " + pc_number + ", 金額: " + amount + " 悠遊卡付款資料修正成功!");
				// 移除BTN及該筆
				el.remove();
				el.closest(".easycard_item").remove();
			} else {
				throw new Error("回傳狀態碼不正確!【" + jsonObj.message + "】");
			}
		}).catch(function(ex) {
			console.error("xhrFixEasycardPayment parsing failed", ex);
		});
	}
}

var xhrEasycardPaymentQuery = function(e) {
	// basic checking for tw date input
	var regex = /^\d{7}$/;
	var txt = $("#easycard_query_day").val();
	if (!isEmpty(txt) && txt.match(regex) == null) {
		showPopper("#easycard_query_day");
		return;
	}

	toggle(".easycard_query");

	var body = new FormData();
	body.append("type", "easycard");
	body.append("qday", txt);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		if (jsonObj.status == 0) {
			$("#easycard_query_display").html("<span class='rounded-circle bg-success'> 　 </span> " + jsonObj.message);
		} else {
			var html = "<div><span class='rounded-circle bg-warning'> 　 </span> <strong class='text-danger'>找到下列資料：</strong></div>";
			for (var i = 0; i < jsonObj.data_count; i++) {
				html += "<div class='easycard_item'>日期: " + jsonObj.raw[i]["AA01"]
					 + ", 電腦給號: " + jsonObj.raw[i]["AA04"]
					 + ", 實收金額: " + jsonObj.raw[i]["AA28"]
					 + ", 作廢原因: " + jsonObj.raw[i]["AA104"]
					 + ", 目前狀態: " + getEasycardPaymentStatus(jsonObj.raw[i]["AA106"])
					 + "【" + jsonObj.raw[i]["AA106"] + "】 ";
				//  無作廢原因才可進行修正
				if (isEmpty(jsonObj.raw[i]["AA104"])) {
					html += "<button id='fix_easycard_payment_" + i + "' onclick='xhrFixEasycardPayment(\"" + jsonObj.raw[i]["AA01"] + "\", \"" + jsonObj.raw[i]["AA04"] + "\", \"" + jsonObj.raw[i]["AA28"] + "\", \"fix_easycard_payment_" + i + "\")'>修正</button>";
				}
				html += "</div>";
			}
			$("#easycard_query_display").html(html);
		}
		toggle(".easycard_query");
	}).catch(function(ex) {
		console.error("xhrEasycardPaymentQuery parsing failed", ex);
		$("#easycard_query_display").html("<strong class='text-danger'>XHR連線查詢有問題!!【" + ex + "】</strong>");
	});
}

var xhrGetExpacItems = function(e) {
	var number = $("#expac_query_number").val().replace(/\D/g, "");
	// only allow number
	if (isEmpty(number) || isNaN(number)) {
		showPopper("#expac_query_number");
		return;
	}

	// make total pc number length is 7
	var offset = 7 - number.length;
	if (offset < 0) {
		showPopper("#expac_query_number");
		return;
	} else if (offset > 0) {
		for (var i = 0; i < offset; i++) {
			number = "0" + number;
		}
	}

	$("#expac_query_number").val(number);

	// should be the query button (#expac_query_button)
	toggle("#expac_query_button");

	var body = new FormData();
	body.append("type", "expac");
	body.append("year", $("#expac_query_year").val());
	body.append("num", number);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		if (jsonObj.status == 0) {
			$("#expac_query_display").html("找不到規費收費項目資料！【電腦給號：" + number + "】");
		} else {
			var html = "<div><strong class='text-danger'>找到下列資料：</strong></div>";
			for (var i = 0; i < jsonObj.data_count; i++) {
				html += "<div class='expac_item'>"
					 + "<a href='javascript:void(0)' class='query_case_dialog'>" + jsonObj.raw[i]["AC16"] + "-" + jsonObj.raw[i]["AC17"] + "-" + jsonObj.raw[i]["AC18"] + "</a>"
					 + " 規費年度: " + jsonObj.raw[i]["AC25"]
					 + ", 電腦給號: " + jsonObj.raw[i]["AC04"]
					 + ", 實收金額: " + jsonObj.raw[i]["AC30"]
					 + ", <select id='modify_expac_item_" + i + "'>" + getExpacItemOptions(jsonObj.raw[i]["AC20"]) + "</select>";
				// modify button
				html += " <button id='modify_expac_item_" + i + "_btn' onclick='xhrModifyExpacItem(\"" + jsonObj.raw[i]["AC25"] + "\", \"" + jsonObj.raw[i]["AC04"] + "\", \"" + jsonObj.raw[i]["AC20"] + "\", \"" + jsonObj.raw[i]["AC30"] + "\", \"modify_expac_item_" + i + "\")'>修改</button>";
				html += " <span id='modify_expac_item_" + i + "_msg'></span>";
				html += "</div>";
			}
			$("#expac_query_display").html(html);
			$(".query_case_dialog").on("click", xhrRegQueryCaseDialog);
		}
		toggle("#expac_query_button");
	}).catch(function(ex) {
		console.error("xhrGetExpacItems parsing failed", ex);
		toggle("#expac_query_button");
		$("#expac_query_display").html("<strong class='text-danger'>XHR連線查詢有問題!!【" + ex + "】</strong>");
	});
}

var getExpacItemOptions = function(selected_ac20) {
	return  "<option " + (selected_ac20 == "01" ? "selected" : "") + " value='01'>【01】土地法65條登記費</option>"
			+ "<option " + (selected_ac20 == "02" ? "selected" : "") + " value='02'>【02】土地法76條登記費</option>"
			+ "<option " + (selected_ac20 == "03" ? "selected" : "") + " value='03'>【03】土地法67條書狀費</option>"
			+ "<option " + (selected_ac20 == "04" ? "selected" : "") + " value='04'>【04】地籍謄本工本費</option>"
			+ "<option " + (selected_ac20 == "06" ? "selected" : "") + " value='06'>【06】檔案閱覽抄錄複製費</option>"
			+ "<option " + (selected_ac20 == "07" ? "selected" : "") + " value='07'>【07】閱覽費</option>"
			+ "<option " + (selected_ac20 == "08" ? "selected" : "") + " value='08'>【08】門牌查詢費</option>"
			+ "<option " + (selected_ac20 == "09" ? "selected" : "") + " value='09'>【09】複丈費及建物測量費</option>"
			+ "<option " + (selected_ac20 == "10" ? "selected" : "") + " value='10'>【10】地目變更勘查費</option>"
			+ "<option " + (selected_ac20 == "14" ? "selected" : "") + " value='14'>【14】電子謄本列印</option>"
			+ "<option " + (selected_ac20 == "18" ? "selected" : "") + " value='18'>【18】塑膠樁土地界標</option>"
			+ "<option " + (selected_ac20 == "19" ? "selected" : "") + " value='19'>【19】鋼釘土地界標(大)</option>"
			+ "<option " + (selected_ac20 == "30" ? "selected" : "") + " value='30'>【30】104年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "31" ? "selected" : "") + " value='31'>【31】100年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "32" ? "selected" : "") + " value='32'>【32】101年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "33" ? "selected" : "") + " value='33'>【33】102年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "34" ? "selected" : "") + " value='34'>【34】103年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "35" ? "selected" : "") + " value='35'>【35】其他</option>"
			+ "<option " + (selected_ac20 == "36" ? "selected" : "") + " value='36'>【36】鋼釘土地界標(小)</option>"
			+ "<option " + (selected_ac20 == "37" ? "selected" : "") + " value='37'>【37】105年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "38" ? "selected" : "") + " value='38'>【38】106年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "39" ? "selected" : "") + " value='39'>【39】塑膠樁土地界標(大)</option>"
			+ "<option " + (selected_ac20 == "40" ? "selected" : "") + " value='40'>【40】107年度登記罰鍰</option>"
			+ "<option " + (selected_ac20 == "41" ? "selected" : "") + " value='41'>【41】108年度登記罰鍰</option>";
}

var xhrModifyExpacItem = function(year_ac25, num_ac04, now_code_ac20, amount_ac30, select_id) {
	var this_select = $("#" + select_id);
	if (this_select && this_select.val() != now_code_ac20) {
		var body = new FormData();
		body.append("type", "mod_expac");
		body.append("year", year_ac25);
		body.append("num", num_ac04);
		body.append("code", this_select.val());
		body.append("amount", amount_ac30);

		$("#" + select_id + "_btn").remove();

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				$("#" + select_id + "_msg").html("<span class='text-success'>修改完成!</span>");
			} else {
				$("#" + select_id + "_msg").html("<span class='text-danger'>修改失敗!</span>");
			}
		}).catch(function(ex) {
			console.error("xhrGetExpacItems parsing failed", ex);
			$("#" + select_id + "_msg").html("<span class='text-danger'>" + ex + "</span>");
		});
	}
}

var xhrCompareXCase = function(e) {
	if (!validateCaseInput("#sync_x_case_year", "#sync_x_case_code", "#sync_x_case_num", "#sync_x_case_display")) {
		return false;
	}
	
	var year = $("#sync_x_case_year").val().replace(/\D/g, "");
	var code = trim($("#sync_x_case_code").val());
	var number = $("#sync_x_case_num").val().replace(/\D/g, "");
	
	// toggle button disable attr
	toggle("#sync_x_case_button");

	// prepare post params
	var id = trim(year + code + number);
	var body = new FormData();
	body.append("type", "diff_xcase");
	body.append("id", id);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		var html = "<div>案件詳情：<a href='javascript:void(0)' id='sync_x_case_serial'>" + year + "-" + code + "-" + number + "</a><div>";
		if (jsonObj.status == 1) {
			html += "<span class='rounded-circle bg-warning'> 　 </span> 請參考下列資訊： <button id='sync_x_case_confirm_button'>同步全部資料</button>";
			html += "<table border='1' class='table-hover text-center mt-1'>";
			html += "<tr><th>欄位名稱</th><th>欄位代碼</th><th>局端</th><th>本所</th><th>同步按鈕</th></tr>";
			for (var key in jsonObj.raw) {
				html += "<tr>";
				html += "<td>" + jsonObj.raw[key]["TEXT"] + "</td>";
				html += "<td>" + jsonObj.raw[key]["COLUMN"] + "</td>";
				html += "<td class='text-danger'>" + jsonObj.raw[key]["REMOTE"] + "</td>";
				html += "<td class='text-info'>" + jsonObj.raw[key]["LOCAL"] + "</td>";
				html += "<td><button data-column='" + jsonObj.raw[key]["COLUMN"] + "' class='sync_column_button'>同步" + jsonObj.raw[key]["COLUMN"] + "</button></td>";
				html += "</tr>";
			};
			html += "</table>";
			$("#sync_x_case_display").html(html);
			$("#sync_x_case_confirm_button").on("click", xhrSyncXCase.bind(id));
			$(".sync_column_button").on("click", xhrSyncXCaseColumn.bind(id));
		} else if (jsonObj.status == -2) {
			html += "<div><span class='rounded-circle bg-warning'> 　 </span> " + jsonObj.message + " <button id='inst_x_case_confirm_button'>新增本地端資料</button></div>"
			$("#sync_x_case_display").html(html);
			$("#inst_x_case_confirm_button").on("click", xhrInsertXCase.bind(id));
		} else {
			html += "<div><span class='rounded-circle bg-success'> 　 </span> " + jsonObj.message + "</div>"
			$("#sync_x_case_display").html(html);
		}
		$("#sync_x_case_serial").on("click", xhrRegQueryCaseDialog);
		toggle("#sync_x_case_button");
	}).catch(function(ex) {
		console.error("xhrCompareXCase parsing failed", ex);
		$("#sync_x_case_display").html("<span class='text-danger'>" + ex + "</span>");
	});
}

var xhrInsertXCase = function(e) {
	if (confirm("確定要拉回局端資料新增於本所資料庫(CRSMS)？")) {
		// this binded as case id
		var id = this;
		var body = new FormData();
		body.append("type", "inst_xcase");
		body.append("id", id);
		$("#inst_x_case_confirm_button").remove();
		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				$("#sync_x_case_display").html("<span class='text-success'>" + id + " 新增成功！</span>");
			} else {
				$("#sync_x_case_display").html("<span class='text-danger'>" + jsonObj.message + "</span>");
			}
		}).catch(function(ex) {
			console.error("xhrInsertXCase parsing failed", ex);
			$("#sync_x_case_display").html("<span class='text-danger'>" + ex + "</span>");
		});
	}
}

var xhrSyncXCase = function(e) {
	if (confirm("確定要拉回局端資料覆蓋本所資料庫？")) {
		// this binded as case id
		var id = this;
		var body = new FormData();
		body.append("type", "sync_xcase");
		body.append("id", id);
		$("#sync_x_case_confirm_button").remove();
		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				$("#sync_x_case_display").html("<span class='text-success'>" + id + " 同步成功！</span>");
			} else {
				$("#sync_x_case_display").html("<span class='text-danger'>" + jsonObj.message + "</span>");
			}
		}).catch(function(ex) {
			console.error("xhrSyncXCase parsing failed", ex);
			$("#sync_x_case_display").html("<span class='text-danger'>" + ex + "</span>");
		});
	}
}

var xhrSyncXCaseColumn = function(e) {
	var the_btn = $(e.target);
	if (confirm("確定要同步" + the_btn.attr("data-column") + "？")) {
		// this binded as case id
		var id = this;
		var body = new FormData();
		body.append("type", "sync_xcase_column");
		body.append("id", id);
		body.append("column", the_btn.attr("data-column"));
		
		var td = the_btn.parent();
		the_btn.remove();

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				td.html("<span class='text-success'>" + the_btn.attr("data-column") + " 同步成功！</span>");
			} else {
				td.html("<span class='text-danger'>" + jsonObj.message + "</span>");
			}

		}).catch(function(ex) {
			console.error("xhrSyncXCaseColumn parsing failed", ex);
			td.html("<span class='text-danger'>" + ex + "</span>");
		});
	}
}

var xhrGetExpaaData = function(e) {
	// basic checking for tw date input
	var regex = /^\d{7}$/;
	var txt = $("#expaa_query_date").val();
	if (txt.match(regex) == null) {
		showPopper("#expaa_query_date");
		return;
	}
	
	var number = $.trim($("#expaa_query_number").val().replace(/\D/g, ""));
	if (!isEmpty(number)) {
		// basic checking for number input
		if (isNaN(number)) {
			showPopper("#expaa_query_number");
			return;
		}

		// make total number length is 7
		var offset = 7 - number.length;
		if (offset < 0) {
			showPopper("#expaa_query_number");
			return;
		} else if (offset > 0) {
			for (var i = 0; i < offset; i++) {
				number = "0" + number;
			}
		}
		$("#expaa_query_number").val(number);
	}

	toggle("[id*=expaa_query_]");

	var body = new FormData();
	body.append("type", "expaa");
	body.append("qday", txt);
	body.append("num", number);
	body.append("list_mode", $(e.target).attr("id") == "expaa_query_date_button");
	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function(jsonObj) {
		// only has one record
		if (jsonObj.status == 1) {
			var html = "<div class='text-info'>規費資料：</div>";
			html += "<ul>";
			for (var key in jsonObj.raw) {
				html += "<li>";
				html += key + "：";
				if (key == "列印註記") {
					html += "<select id='exapp_print_select'>"
						  + "<option value='0'" + (jsonObj.raw[key] == 0 ? "selected" : "") + ">【0】未印</option>"
						  + "<option value='1'" + (jsonObj.raw[key] == 1 ? "selected" : "") + ">【1】已印</option>"
						  + "</select> "
						  + "<button id='exapp_print_button'>修改</button>"
						  + "<span id='exapp_print_status'></span>";
				} else if (key == "繳費方式代碼") {
					html += "<select id='exapp_method_select'>"
						  + getExpaaAA100Options(jsonObj.raw[key])
						  + "</select> "
						  + "<button id='exapp_method_button'>修改</button>"
						  + "<span id='exapp_method_status'></span>";
				} else if (key == "悠遊卡繳費扣款結果") {
					html += getEasycardPaymentStatus(jsonObj.raw[key]) + "【" + jsonObj.raw[key] + "】";
					//  無作廢原因才可進行修正
					if (isEmpty(jsonObj.raw["作廢原因"]) && jsonObj.raw[key] != 1) {
						html += "<button id='fix_exapp_easycard_payment_btn" + "' onclick='xhrFixEasycardPayment(\"" + jsonObj.raw["開單日期"] + "\", \"" + jsonObj.raw["電腦給號"] + "\", \"" + jsonObj.raw["實收總金額"] + "\", \"fix_exapp_easycard_payment_btn" + "\")'>修正為扣款成功</button>";
					}
				} else {
					// others just show info
					html += jsonObj.raw[key];
				}
				html += "</li>";
			};
			html += "</ul>";
			$("#expaa_query_display").html(html);
			// attach event handler for the buttons
			$("#exapp_print_button").on("click", xhrUpdateExpaaAA09.bind({
				date: $("#expaa_query_date").val(),
				number: $("#expaa_query_number").val(),
				select_id: "exapp_print_select"
			}));
			$("#exapp_method_button").on("click", xhrUpdateExpaaAA100.bind({
				date: $("#expaa_query_date").val(),
				number: $("#expaa_query_number").val(),
				select_id: "exapp_method_select"
			}));
		} else if (jsonObj.status == 2) {
			// has many records
			var html = "<div>" 
					+ "<span class='block-secondary'>現金</span> "
					+ "<span class='block-primary'>悠遊卡</span> "
					+ "<span class='block-warning'>信用卡</span> "
					+ "<span class='block-danger'>行動支付</span> "
					+ "<span class='block-dark'>其他方式</span> "
					+ "</div>";
			html += "<div class='text-success'>" + jsonObj.message + "</div>";
			for (var i = 0; i < jsonObj.data_count; i++) {
				html += "<a href='javascript:void(0)' class='float-left mr-2 mb-2 expaa_a_aa04 "
					+ getAA04DisplayCss(jsonObj.raw[i])
					+ " "
					+ (jsonObj.raw[i]["AA09"] == 1 ? "text-secondary" : "text-danger font-weight-bold")
					+ " ' title='"
					+ getExpaaTooltip(jsonObj.raw[i])
					+ "'>"
					+ jsonObj.raw[i]["AA04"]
					+ "</a>";
			}
			$("#expaa_query_display").html(html);
			$("a.expaa_a_aa04").on("click", function(e) {
				var pc_num = $(e.target).text();
				$("#expaa_query_number").val(pc_num);
				$("#expac_query_number").val(pc_num);
				xhrGetExpaaData.call(null, [e]);
				xhrGetExpacItems.call(null, [e]);
			});
		} else {
			$("#expaa_query_display").html("<span class='text-danger'>" + jsonObj.message.replace(", ", "") + "</span>");
		}
		toggle("[id*=expaa_query_]");
	}).catch(function(ex) {
		console.error("xhrGetExpaaData parsing failed", ex);
		$("#expaa_query_display").html("<span class='text-danger'>" + ex + "</span>");
	});
}

var getAA04DisplayCss = function(row) {
	var css = "block-dark";
	switch (row["AA100"]) {
		case "01":	// 現金
			css = "block-secondary";
			break;
		case "02":	// 支票
		case "03":	// 匯票
		case "04":	// iBon
		case "05":	// ATM
		case "07":	// 其他匯款
			break;
		case "06":	// 悠遊卡
			css = "block-primary";
			break;
		case "08":	// 信用卡
			css = "block-warning";
			break;
		case "09":	// 行動支付
			css = "block-danger";
			break;
		default:
			css = "block-dark";
			break;
	}
	return css;
}

var getExpaaTooltip = function(row) {
	var title = row["AA09"] == 1 ? "規費收據已印" : "規費收據未印";
	switch (row["AA100"]) {
		case "01":
			title += ", 現金";
			break;
		case "02":
			title += ", 支票";
			break;
		case "03":
			title += ", 匯票";
			break;
		case "04":
			title += ", iBon";
			break;
		case "05":
			title += ", ATM";
			break;
		case "06":
			title += ", 悠遊卡";
			break;
		case "07":
			title += ", 其他匯款";
			break;
		case "08":
			title += ", 信用卡";
			break;
		case "09":
			title += ", 行動支付";
			break;
		default:
			title += ", 不支援的繳款方式代碼";
			break;
	}
	title += "【" + row["AA100"] + "】";
	return title;
}

var getExpaaAA100Options = function(selected_aa100) {
	return  "<option " + (selected_aa100 == "01" ? "selected" : "") + " value='01'>【01】現金</option>"
			+ "<option " + (selected_aa100 == "02" ? "selected" : "") + " value='02'>【02】支票</option>"
			+ "<option " + (selected_aa100 == "03" ? "selected" : "") + " value='03'>【03】匯票</option>"
			+ "<option " + (selected_aa100 == "04" ? "selected" : "") + " value='04'>【04】iBon</option>"
			+ "<option " + (selected_aa100 == "05" ? "selected" : "") + " value='05'>【05】ATM</option>"
			+ "<option " + (selected_aa100 == "06" ? "selected" : "") + " value='06'>【06】悠遊卡</option>"
			+ "<option " + (selected_aa100 == "07" ? "selected" : "") + " value='07'>【07】其他匯款</option>"
			+ "<option " + (selected_aa100 == "08" ? "selected" : "") + " value='08'>【08】信用卡</option>"
			+ "<option " + (selected_aa100 == "09" ? "selected" : "") + " value='09'>【09】行動支付</option>";
}

var xhrUpdateExpaaAA09 = function(e) {
	if (confirm("確定要修改列印註記？")) {
		var bindObj = this;
		var body = new FormData();
		body.append("type", "expaa_AA09_update");
		body.append("date", bindObj.date);
		body.append("number", bindObj.number);
		body.append("update_value", $("#"+bindObj.select_id).val());

		$(e.target).remove();

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			$("#exapp_print_status").html("<span class='text-" + ((jsonObj.status == 1) ? "success" : "danger") + "'>" + jsonObj.message + "</span>");
		});
	}
}

var xhrUpdateExpaaAA100 = function(e) {
	if (confirm("確定要規費付款方式？")) {
		var bindObj = this;
		var body = new FormData();
		body.append("type", "expaa_AA100_update");
		body.append("date", bindObj.date);
		body.append("number", bindObj.number);
		body.append("update_value", $("#"+bindObj.select_id).val());

		$(e.target).remove();

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			$("#exapp_method_status").html("<span class='text-" + ((jsonObj.status == 1) ? "success" : "danger") + "'>" + jsonObj.message + "</span>");
		});
	}
}

var xhrLoadSQL = function(e) {
	var val = $("#preload_sql_select").val();

	if (isEmpty(val)) {
		$("#sql_csv_text").val("");
		return;
	}

	toggle(e.target);

	var body = new FormData();
	body.append("type", "load_select_sql");
	body.append("file_name", val);
	fetch("load_file_api.php", {
		method: 'POST',
			body: body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		if (jsonObj.status == 1) {
			$("#sql_csv_text").val(jsonObj.data);
			toggle(e.target);
		} else {
			throw new Error("讀取異常，jsonObj.status非為1");
		}
	}).catch(function(ex) {
		console.error("xhrLoadSQL parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
};

var xhrExportSQLCsv = function(e) {
	var body = new FormData();
	body.append("type", "file_sql_csv");
	xhrExportSQLReport(e, body);
};

var xhrExportSQLTxt = function(e) {
	var body = new FormData();
	body.append("type", "file_sql_txt");
	xhrExportSQLReport(e, body);
};

var xhrExportSQLReport = function(e, form_body) {
	var text = $("#preload_sql_select option:selected").text();
	form_body.append("sql", $("#sql_csv_text").val());
	toggle(e.target);
	fetch("export_file_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		return response.blob();
	}).then(function (blob) {
		var d = new Date();
		var url = window.URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = text + (form_body.get("type") == "file_sql_txt" ? ".txt" : ".csv");
		document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
		a.click();    
		a.remove();  //afterwards we remove the element again
		// release object in memory
		window.URL.revokeObjectURL(url);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrExportSQLReport parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
};

var xhrExportLog = function(e) {
	var date = $("#log_date_text").val();
	var form_body = new FormData();
	form_body.append("type", "file_log");
	form_body.append("date", date);
	toggle(e.target);
	fetch("export_file_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		return response.blob();
	}).then(function (blob) {
		var d = new Date();
		var url = window.URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = date + ".log";
		document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
		a.click();    
		a.remove();  //afterwards we remove the element again
		// release object in memory
		window.URL.revokeObjectURL(url);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrExportLog parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
};

var xhrZipLog = function(e) {
	var form_body = new FormData();
	form_body.append("type", "zip_log");
	toggle(e.target);
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "回傳之json object status異常【" + jsonObj.message + "】");
		showModal({
			body: "<strong class='text-success'>壓縮完成</strong>",
			title: "LOG檔壓縮",
			size: "sm"
		});
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrZipLog parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrQueryAnnouncementData = function(e) {
	var form_body = new FormData();
	form_body.append("type", "announcement_data");
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "回傳之json object status異常【" + jsonObj.message + "】");
		var count = jsonObj.data_count;
		// 組合選單介面
		var html = "公告項目：<select id='prereg_announcement_select' class='mt-1 no-cache'><option value=''>======= 請選擇登記原因 =======</option>";
		for (var i=0; i<count; i++) {
			html += "<option value='" + jsonObj.raw[i]["RA01"] + "," + jsonObj.raw[i]["KCNT"] + "," + jsonObj.raw[i]["RA02"] + "," + jsonObj.raw[i]["RA03"] + "'>" + jsonObj.raw[i]["RA01"] + "：" + jsonObj.raw[i]["KCNT"] + "【" + jsonObj.raw[i]["RA02"] + "天, " + jsonObj.raw[i]["RA03"] + "】</option>";
		}
		html += "</select> <div id='prereg_update_ui' class='mt-1'></div>";
		$("#prereg_query_display").html(html);
		$("#prereg_announcement_select").on("change", function(e) {
			$("#prereg_update_ui").empty();
			var csv = $("#prereg_announcement_select option:selected").val();
			if (isEmpty(csv)) {
				return;
			}
			var data = csv.split(",");
			var html = "登記代碼：" + data[0] + "<br />" +
					   "登記原因：" + data[1] + "<br />";
				html += "公告天數：<select id='ann_day_" + data[0] + "' class='no-cache'><option>15</option><option>30</option><option>45</option><option>60</option><option>75</option><option>90</option></select><br />";
				html += "先行准登：<select id='ann_reg_flag_" + data[0] + "' class='no-cache'><option>N</option><option>Y</option></select><br />";
				html += "<button id='ann_upd_btn_" + data[0] + "'>更新</button>";
			$("#prereg_update_ui").html(html);
			$("#ann_day_" + data[0]).val(data[2]);
			$("#ann_reg_flag_" + data[0]).val(data[3]);
			$("#ann_upd_btn_" + data[0]).on("click", xhrUpdateAnnouncementData.bind(data));
		});
	}).catch(function(ex) {
		console.error("xhrQueryAnnouncementData parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
};

var xhrUpdateAnnouncementData = function(e) {
	var reason_code = this[0];
	var day = $("#ann_day_"+reason_code).val();
	var flag = $("#ann_reg_flag_"+reason_code).val();
	if (this[2] == day && this[3] == flag) {
		showModal({
			body: "無變更，不需更新！",
			title: "訊息通知",
			size: "sm"
		});
		return;
	}
	console.assert(reason_code.length == 2, "登記原因代碼應為2碼，如'30'");
	$(e.target).remove();
	var form_body = new FormData();
	form_body.append("type", "update_announcement_data");
	form_body.append("code", reason_code);
	form_body.append("day", $("#ann_day_"+reason_code).val());
	form_body.append("flag", $("#ann_reg_flag_"+reason_code).val());
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "更新公告期限回傳狀態碼有問題【" + jsonObj.status + "】");
		showModal({
			body: "<strong class='text-success'>更新完成</strong>",
			title: "公告期限更新",
			size: "sm"
		});
		// refresh the select list
		xhrQueryAnnouncementData.call(null, [e]);
	}).catch(function(ex) {
		console.error("xhrUpdateAnnouncementData parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrClearAnnouncementFlag = function(e) {
	if (!confirm("請確認要是否要清除所有登記原因的准登旗標？")) {
		return;
	}
	var form_body = new FormData();
	form_body.append("type", "clear_announcement_flag");
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "清除先行准登回傳狀態碼有問題【" + jsonObj.status + "】");
		showModal({
			body: "<strong class='text-success'>已全部清除完成</strong>",
			title: "清除先行准登",
			size: "sm"
		});
		// refresh the select list
		xhrQueryAnnouncementData.call(null, [e]);
	}).catch(function(ex) {
		console.error("xhrUpdateAnnouncementData parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrQueryTempData = function(e) {
	if (!validateCaseInput("#temp_clr_year", "#temp_clr_code", "#temp_clr_num", "#temp_clr_display")) {
		return false;
	}

	var year = $("#temp_clr_year").val().replace(/\D/g, "");
	var code = trim($("#temp_clr_code").val());
	var number = $("#temp_clr_num").val().replace(/\D/g, "");

	toggle(e.target);

	var form_body = new FormData();
	form_body.append("type", "query_temp_data");
	form_body.append("year", year);
	form_body.append("code", code);
	form_body.append("number", number);
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "查詢暫存資料回傳狀態碼有問題【" + jsonObj.status + "】");
		
		var html = "";
		for (var i = 0; i < jsonObj.data_count; i++) {
			if(jsonObj.raw[i][1].length == 0) {
				continue;
			}
			// 0: Table, 1: all raw data, 2: SQL
			html += "● " + jsonObj.raw[i][0] + ": <span class='text-danger'>" + jsonObj.raw[i][1].length + "</span> "
			// use saveAs to download backup SQL file
			if (saveAs) {
				let filename_prefix = year + "-" + code + "-" + number;
				// Prepare INS SQL text for BACKUP
				let INS_SQL = "";
				for (let y = 0; y < jsonObj.raw[i][1].length; y++) {
					let this_row = jsonObj.raw[i][1][y];
					let fields = [];
					let values = [];
					for (let key in this_row) {
						fields.push(key);
						values.push(isEmpty(this_row[key]) ? "null" : "'" + this_row[key] + "'");
					}
					INS_SQL += "insert into " + jsonObj.raw[i][0] + " (" + fields.join(",") + ")";
					INS_SQL += " values (" + values.join(",") + ");\n";
				}
				html += "　<small><button data-filename='" + filename_prefix + "-" + jsonObj.raw[i][0] + "' class='backup_tbl_temp_data'>備份</button>"
						+ "<span class='hide ins_sql'>" + INS_SQL + "</span> "
						+ " <button data-tbl='" + jsonObj.raw[i][0] + "' class='clean_tbl_temp_data'>清除</button></small>";
			}
			html += "<br />　<small>－　" + jsonObj.raw[i][2] + "</small> <br />";
		}

		toggle(e.target);
		
		if (isEmpty(html)) {
			showModal({
				body: "案件 " + year + "-" + code + "-" + number + " 查無暫存資料",
				title: "查詢暫存資料",
				size: "sm"
			});
			return;
		}
		html += "<button id='temp_backup_button' class='mt-2'>全部備份</button> <button class='mt-2' id='temp_clr_button' data-trigger='manual' data-toggle='popover' data-placement='bottom'>全部清除</button>";
		showModal({
			body: html,
			title: year + "-" + code + "-" + number + " 案件暫存檔統計",
			size: "sm"
		});
		setTimeout(function() {
			$("#temp_clr_button").on("click", xhrClearTempData.bind({
				year: year,
				code: code,
				number: number,
				table: ""
			}));
			showPopper("#temp_clr_button", "請「備份後」再選擇清除", 5000);

			$("#temp_backup_button").on("click", (e) => {
				toggle(e.target);
				let filename = year + "-" + code + "-" + number + "-TEMP-DATA";
				// any kind of extension (.txt,.cpp,.cs,.bat)
				filename += ".sql";
				let all_content = "";
				$(".ins_sql").each((index, hidden_span) => {
					all_content += $(hidden_span).text();
				});
				let blob = new Blob([all_content], {
					type: "text/plain;charset=utf-8"
				});
				saveAs(blob, filename);
			});
		}, 1000);
		// attach backup event to the buttons
		$(".backup_tbl_temp_data").on("click", function(e) {
			let filename = $(e.target).data("filename");
			// any kind of extension (.txt,.cpp,.cs,.bat)
			filename += ".sql";
			let hidden_data = $(e.target).next("span"); // find DIRECT next span of the clicked button
			let content = hidden_data.text();
			let blob = new Blob([content], {
				type: "text/plain;charset=utf-8"
			});
			saveAs(blob, filename);
		});
		// attach clean event to the buttons
		$(".clean_tbl_temp_data").on("click", function(e) {
			let table_name = $(e.target).data("tbl");
			xhrClearTempData.call({
				year: year,
				code: code,
				number: number,
				table: table_name
			}, e);
		});
	}).catch(function(ex) {
		console.error("xhrQueryTempData parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrClearTempData = function(e) {
	let bindArgsObj = this;

	let msg = "確定要清除案件 " + bindArgsObj.year + "-" + bindArgsObj.code + "-" + bindArgsObj.number + " 全部暫存檔?\n ★ 警告：無法復原，除非你有備份!!";
	if (!isEmpty(bindArgsObj.table)) {
		msg = "確定要清除案件 " + bindArgsObj.year + "-" + bindArgsObj.code + "-" + bindArgsObj.number + " " + bindArgsObj.table + " 表格的暫存檔?\n ★ 警告：無法復原，除非你有備份!!";
	}

	if(!confirm(msg)) {
		return;
	}

	$(e.target).remove();

	var form_body = new FormData();
	form_body.append("type", "clear_temp_data");
	form_body.append("year", bindArgsObj.year);
	form_body.append("code", bindArgsObj.code);
	form_body.append("number", bindArgsObj.number);
	form_body.append("table", bindArgsObj.table);
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "清除暫存資料回傳狀態碼有問題【" + jsonObj.status + "】");
		closeModal();
		setTimeout(() => {
			showModal({
				body: "<strong class='text-success'>已清除完成</strong><p>" + bindArgsObj.year + "-" + bindArgsObj.code + "-" + bindArgsObj.number + (bindArgsObj.table ? " 表格：" + bindArgsObj.table : "") + "</p>",
				title: "清除暫存資料",
				size: "md"
			});
		}, 500);
	}).catch(function(ex) {
		console.error("xhrClearTempData parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrRM30UpdateQuery = function(e) {
	if (!validateCaseInput("#rm30_update_year", "#rm30_update_code", "#rm30_update_num", "#rm30_update_display")) {
		return false;
	}
	var year = $("#rm30_update_year").val().replace(/\D/g, "");
	var code = $("#rm30_update_code").val();
	var number = $("#rm30_update_num").val().replace(/\D/g, "");
	// prepare post params
	var id = trim(year + code + number);
	var body = new FormData();
	body.append("type", "reg_case");
	body.append("id", id);
	
	toggle(e.target);

	fetch("query_json_api.php", {
		method: "POST",
		//headers: { "Content-Type": "application/json" },
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		showRM30UpdateCaseDetail(jsonObj);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrRM30UpdateQuery parsing failed", ex);
		$("#rm30_update_display").html("<strong class='text-danger'>無法取得 " + id + " 資訊!【" + ex + "】</strong>");
	});
}

var showRM30UpdateCaseDetail = function(jsonObj) {
	if (jsonObj.status == 0) {
		$("#rm30_update_display").html("<strong class='text-danger'>" + jsonObj.message + "</strong>");
	} else if (jsonObj.status == -1) {
		throw new Error("查詢失敗：" + jsonObj.message);
	}
	var html = "辦理情形：<select id='rm30_update_select'>";
	html += '<option value="A">A: 初審</option>';
	html += '<option value="B">B: 複審</option>';
	html += '<option value="H">H: 公告</option>';
	html += '<option value="I">I: 補正</option>';
	html += '<option value="R">R: 登錄</option>';
	html += '<option value="C">C: 校對</option>';
	html += '<option value="U">U: 異動完成</option>';
	html += '<option value="F">F: 結案</option>';
	html += '<option value="X">X: 補正初核</option>';
	html += '<option value="Y">Y: 駁回初核</option>';
	html += '<option value="J">J: 撤回初核</option>';
	html += '<option value="K">K: 撤回</option>';
	html += '<option value="Z">Z: 歸檔</option>';
	html += '<option value="N">N: 駁回</option>';
	html += '<option value="L">L: 公告初核</option>';
	html += '<option value="E">E: 請示</option>';
	html += '<option value="D">D: 展期</option>';
	html += "</select>";
	if (isEmpty(jsonObj.raw["RM31"])) {
		html += " <button id='rm30_update_button'>更新</button><br/>";
	} else {
		html += " <strong class='text-danger'>本案已結案，無法變更狀態！</strong>";
	}
	
	html += "<p>" + jsonObj.tr_html + "</p>";
	$("#rm30_update_display").html(html);
	$("#rm30_update_select").val(jsonObj.raw["RM30"]);
	// user info event
	addUserInfoEvent();

	// make click case id tr can bring up the detail dialog 【use reg_case_id css class as identifier to bind event】
	$(".reg_case_id").on("click", xhrRegQueryCaseDialog);
	$(".reg_case_id").attr("title", "點我取得更多資訊！");
	// update button xhr event
	$("#rm30_update_button").on("click", function(e) {
		var selected = $("#rm30_update_select").val();
		if (selected != jsonObj.raw["RM30"] && confirm("確認更新狀態？")) {
			$(e.target).remove();
			var body = new FormData();
			body.append("type", "reg_upd_rm30");
			body.append("rm01", jsonObj.raw["RM01"]);
			body.append("rm02", jsonObj.raw["RM02"]);
			body.append("rm03", jsonObj.raw["RM03"]);
			body.append("rm30", selected);
			fetch("query_json_api.php", {
				method: "POST",
				body: body
			}).then(function(response) {
				return response.json();
			}).then(function(jsonObj) {
				console.assert(jsonObj.status == 1, "更新辦理情形回傳狀態碼有問題【" + jsonObj.status + "】");
				showModal({
					body: "<strong class='text-success'>辦理情形狀態更新完成</strong><p>" + jsonObj.query_string + "</p>",
					title: "更新辦理情形",
					size: "sm"
				});
			}).catch(function(ex) {
				console.error("xhrRM30UpdateQuery parsing failed", ex);
				$("#rm30_update_display").html("<strong class='text-danger'>無法取得 " + id + " 資訊!【" + ex + "】</strong>");
			});
		}
	});
}

var xhrGetSURCase = function(e) {
	if (!validateCaseInput("#sur_delay_case_fix_year", "#sur_delay_case_fix_code", "#sur_delay_case_fix_num", "#sur_delay_case_fix_display")) {
		return false;
	}
	var year = $("#sur_delay_case_fix_year").val().replace(/\D/g, "");
	var code = $("#sur_delay_case_fix_code").val();
	var number = $("#sur_delay_case_fix_num").val().replace(/\D/g, "");
	// prepare post params
	var id = trim(year + code + number);
	var body = new FormData();
	body.append("type", "sur_case");
	body.append("id", id);
	
	toggle(e.target);

	fetch("query_json_api.php", {
		method: "POST",
		body: body
	}).then(function(response) {
		return response.json();
	}).then(function(jsonObj) {
		showSURCaseDetail(jsonObj);
		toggle(e.target);
	}).catch(function(ex) {
		console.error("xhrGetSURCase parsing failed", ex);
		$("#sur_delay_case_fix_display").html("<strong class='text-danger'>無法取得 " + id + " 資訊!【" + ex + "】</strong>");
	});
}

var showSURCaseDetail = function(jsonObj) {
	if (jsonObj.status == 0) {
		var html = "收件字號：" + "<a title='案件辦理情形 on " + landhb_svr + "' href='#' onclick='javascript:window.open(\"http://\"\+landhb_svr\+\":9080/LandHB/Dispatcher?REQ=CMC0202&GRP=CAS&MM01="+ jsonObj.raw["MM01"] +"&MM02="+ jsonObj.raw["MM02"] +"&MM03="+ jsonObj.raw["MM03"] +"&RM90=\")'>" + jsonObj.收件字號 + "</a> </br>";
		html += "收件時間：" + jsonObj.收件時間 + " <br/>";
		html += "收件人員：" + jsonObj.收件人員 + " <br/>";
		html += "　連件數：<input type='text' id='mm24_upd_text' value='" + jsonObj.raw["MM24"] + "' /> <button id='mm24_upd_btn' data-table='SCMSMS' data-case-id='" + jsonObj.收件字號 + "' data-origin-value='" + jsonObj.raw["MM24"] + "' data-column='MM24' data-input-id='mm24_upd_text' data-title=' " + jsonObj.raw["MM01"] + "-" + jsonObj.raw["MM02"] + "-" + jsonObj.raw["MM03"] + " 連件數'>更新</button><br/>";
		html += "申請事由：" + jsonObj.raw["MM06"] + "：" + jsonObj.申請事由 + " <br/>";
		html += "　段小段：" + jsonObj.raw["MM08"] + " <br/>";
		html += "　　地號：" + (isEmpty(jsonObj.raw["MM09"]) ? "" : jsonObj.地號) + " <br/>";
		html += "　　建號：" + (isEmpty(jsonObj.raw["MM10"]) ? "" : jsonObj.建號) + " <br/>";
		html += "<span class='text-info'>辦理情形</span>：" + jsonObj.辦理情形 + " <br/>";
		html += "結案狀態：" + jsonObj.結案狀態 + " <br/>";
		html += "<span class='text-info'>延期原因</span>：" + jsonObj.延期原因 + " <br/>";
		html += "<span class='text-info'>延期時間</span>：" + jsonObj.延期時間 + " <br/>";
		if (jsonObj.結案已否 && jsonObj.raw["MM22"] == "C") {
			html += '<h6 class="mt-2 mb-2"><span class="text-danger">※</span> ' + "發現 " + jsonObj.收件字號 + " 已「結案」但辦理情形為「延期複丈」!" + '</h6>';
			html += "<button id='sur_delay_case_fix_button' class='text-danger' data-trigger='manual' data-toggle='popover' data-content='需勾選右邊其中一個選項才能進行修正' title='錯誤訊息' data-placement='top'>修正</button> ";
			html += "<label for='sur_delay_case_fix_set_D'><input id='sur_delay_case_fix_set_D' type='checkbox' checked /> 辦理情形改為核定</label> ";
			html += "<label for='sur_delay_case_fix_clear_delay_datetime'><input id='sur_delay_case_fix_clear_delay_datetime' type='checkbox' checked /> 清除延期時間</label> ";
		}
		$("#sur_delay_case_fix_display").html(html);
		$("#sur_delay_case_fix_button").on("click", xhrFixSurDelayCase.bind(jsonObj.收件字號));
		$("#mm24_upd_btn").on("click", function(e) {
			// input validation
			var number = $("#mm24_upd_text").val().replace(/\D/g, "");
			$("#mm24_upd_text").val(number);
			xhrUpdateCaseColumnData(e);
		});
	} else if (jsonObj.status == -1) {
		throw new Error("查詢失敗：" + jsonObj.message);
	}
}

var xhrFixSurDelayCase = function(e) {
	var is_checked_upd_mm22 = $("#sur_delay_case_fix_set_D").is(":checked");
	var is_checked_clr_delay = $("#sur_delay_case_fix_clear_delay_datetime").is(":checked");
	if (!is_checked_clr_delay && !is_checked_upd_mm22) {
		showPopper("#sur_delay_case_fix_button");
		return;
	}
	if (confirm("確定要修正本案件?")) {
		$(e.target).remove();
		var id = this;
		//fix_sur_delay_case
		var body = new FormData();
		body.append("type", "fix_sur_delay_case");
		body.append("id", id);
		body.append("UPD_MM22", is_checked_upd_mm22);
		body.append("CLR_DELAY", is_checked_clr_delay);
		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				showModal({
					body: id + " 複丈案件修正成功!",
					title: "延期複丈案件修正",
					size: "sm"
				});
				// refresh case status
				xhrGetSURCase.call(null, e);
			} else {
				showModal({
					body: jsonObj.message,
					title: "延期複丈案件修正",
					size: "sm"
				});
				throw new Error("回傳狀態碼不正確!【" + jsonObj.message + "】");
			}
		}).catch(function(ex) {
			console.error("xhrFixSurDelayCase parsing failed", ex);
			$("#sur_delay_case_fix_display").html("<strong class='text-danger'>修正 " + id + " 失敗!【" + ex + "】</strong>");
		});
	}
}

var xhrUpdateCaseColumnData = function(e) {
	/**
	 * add various data attrs in the button tag
	 */
	var the_btn = $(e.target);
	var origin_val = the_btn.attr("data-origin-value");
	var upd_val = $("#"+the_btn.attr("data-input-id")).val();
	var title = the_btn.attr("data-title");
	if (origin_val != upd_val && confirm("確定要修改 " + title + " 為「" + upd_val + "」？")) {
		var id = the_btn.attr("data-case-id");
		var column = the_btn.attr("data-column");
		var table = the_btn.attr("data-table");
		var body = new FormData();
		body.append("type", "upd_case_column");
		body.append("id", id);
		body.append("table", table);
		body.append("column", column);
		body.append("value", upd_val);

		the_btn.remove();

		fetch("query_json_api.php", {
			method: "POST",
			body: body
		}).then(function(response) {
			if (response.status != 200) {
				throw new Error("XHR連線異常，回應非200");
			}
			return response.json();
		}).then(function(jsonObj) {
			if (jsonObj.status == 1) {
				showModal({
					body: title + "更新成功",
					title: "更新欄位",
					size: "sm"
				});
			} else {
				showModal({
					body: jsonObj.message,
					title: "更新欄位失敗",
					size: "sm"
				});
			}
		}).catch(function(ex) {
			console.error("xhrUpdateCaseColumnData parsing failed", ex);
			showModal({
				body: ex.toString(),
				title: "更新欄位失敗",
				size: "sm"
			});
		});
	}
}

var xhrSearchUsers = function(e) {
	let keyword = $.trim($("#msg_who").val().replace(/\?/g, ""));
	if (isEmpty(keyword)) {
		console.warn("Keyword field should not be empty.");
		return;
	}
	
	var form_body = new FormData();
	form_body.append("type", "search_user");
	form_body.append("keyword", keyword);

	
	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "回傳之json object status異常【" + jsonObj.message + "】");
		var html = jsonObj.message;
		if (jsonObj.status == 1) {
			showUserInfoByRAW(jsonObj.raw[jsonObj.data_count - 1]);
		} else {
			showModal({
				body: "查無資料",
				title: "查詢使用者",
				size: "sm"
			});
		}
	}).catch(function(ex) {
		console.error("xhrSearchUsers parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var showUserInfoByRAW = function(tdoc_raw) {
	var year = 31536000000;
	var now = new Date();
	var age = "";
	var birth = tdoc_raw["AP_BIRTH"];
	var birth_regex = /^\d{3}\/\d{2}\/\d{2}$/;
	if (birth.match(birth_regex)) {
		birth = (parseInt(birth.substring(0, 3)) + 1911) + birth.substring(3);
		var temp = Date.parse(birth);
		if (temp) {
			var born = new Date(temp);
			age += " (" + ((now - born) / year).toFixed(1) + "歲)";
		}
	}

	var on_board_date = "";
	if(!isEmpty(tdoc_raw["AP_ON_DATE"])) {
		on_board_date = tdoc_raw["AP_ON_DATE"].date.split(" ")[0];
		var temp = Date.parse(on_board_date.replace('/-/g', "/"));
		if (temp) {
			var on = new Date(temp);
			if (tdoc_raw["AP_OFF_JOB"] == "Y") {
				var off_board_date = tdoc_raw["AP_OFF_DATE"];
				off_board_date = (parseInt(off_board_date.substring(0, 3)) + 1911) + off_board_date.substring(3);
				temp = Date.parse(off_board_date.replace('/-/g', "/"));
				if (temp) {
					// replace now Date to off board date
					now = new Date(temp);
				}
			}
			on_board_date += " (" + ((now - on) / year).toFixed(1) + "年)";
		}
	}

	html = '<a href="get_pho_img.php?name=' + tdoc_raw["AP_USER_NAME"] + '" target="_blank"><img src="get_pho_img.php?name=' + tdoc_raw["AP_USER_NAME"] + '" width="180" /></a> </br />';
	html += tdoc_raw["AP_OFF_JOB"] == "N" ? "" : "<p class='text-danger'>已離職【" + tdoc_raw["AP_OFF_DATE"] + "】</p>";
	html += "ID：" + tdoc_raw["DocUserID"] + "<br />"
		+ "電腦：" + tdoc_raw["AP_PCIP"] + "<br />"
		+ "姓名：" + tdoc_raw["AP_USER_NAME"] + "<br />"
		+ "生日：" + tdoc_raw["AP_BIRTH"] + age + "<br />"
		+ "單位：" + tdoc_raw["AP_UNIT_NAME"] + "<br />"
		+ "工作：" + tdoc_raw["AP_WORK"] + "<br />"
		+ "職稱：" + tdoc_raw["AP_JOB"] + "<br />"
		+ "學歷：" + tdoc_raw["AP_HI_SCHOOL"] + "<br />"
		+ "考試：" + tdoc_raw["AP_TEST"] + "<br />"
		+ "手機：" + tdoc_raw["AP_SEL"] + "<br />"
		+ "到職：" + on_board_date + "<br />"
		;
	showModal({
		body: html,
		title: "使用者資訊",
		size: "md",
		class: tdoc_raw["AP_OFF_JOB"] == "N" ? "" : "quit_bg"
	});
}

var xhrQueryUserInfo = function(e) {
	var clicked_element = $(e.target);
	if (!clicked_element.hasClass("user_tag")) {
		console.warn("Clicked element(" + clicked_element.prop("tagName") + ") doesn't have user_tag class ... find its closest parent");
		clicked_element = $(clicked_element.closest(".user_tag"));
	}

	var name = $.trim(clicked_element.data("name").replace(/\?A-Za-z0-9/g, ""));
	var id = trim(clicked_element.data("id"));

	if (isEmpty(name) || isEmpty(id)) {
		console.warn("Require query params are empty, skip xhr querying. (" + id + ", " + name + ")");
		return;
	}

	var form_body = new FormData();
	form_body.append("type", "user_info");
	form_body.append("name", name);
	form_body.append("id", id);

	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "回傳之json object status異常【" + jsonObj.message + "】");
		var html = jsonObj.message;
		if (jsonObj.status == 1) {
			var latest = jsonObj.data_count - 1;
			showUserInfoByRAW(jsonObj.raw[latest]);
		}
	}).catch(function(ex) {
		console.error("xhrQueryUserInfo parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}

var xhrSendMessage = function(e) {
	var title = $("#msg_title").val();
	var content = $("#msg_content").val().replace(/\n/g, "\r\n");	// Messenger client is Windows app, so I need to replace \n to \r\n
	var who = $("#msg_who").val();

	if (!confirm("確認要送 「" + title + "」 給 「" + who + "」？\n\n" + content)) {
		return false;
	}

	if(isEmpty(title) || isEmpty(content) || isEmpty(who)) {
		console.warn("Require query params are empty, skip xhr querying. (" + title + ", " + content + ")");
		showModal({
			body: "<span class='text-danger'>標題或是內容為空白。</span>",
			title: "輸入錯誤",
			size: "sm"
		});
		return;
	}

	if (content.length > 1000) {
		console.warn("Content should not exceed 1000 chars, skip xhr querying. (" + content.length + ")");
		showModal({
			body: "<span class='text-danger'>內容不能超過1000個字元。</span><p>" + content + "</p>",
			title: "內容錯誤",
			size: "sm"
		});
		return;
	}

	var clicked_element = $(e.target);
	toggle(clicked_element);

	var form_body = new FormData();
	form_body.append("type", "send_message");
	form_body.append("title", title);
	form_body.append("content", content);
	form_body.append("who", who);


	fetch("query_json_api.php", {
		method: 'POST',
		body: form_body
	}).then(function(response) {
		if (response.status != 200) {
			throw new Error("XHR連線異常，回應非200");
		}
		return response.json();
	}).then(function (jsonObj) {
		console.assert(jsonObj.status == 1, "回傳之json object status異常【" + jsonObj.message + "】");
		var html = jsonObj.message;
		showModal({
			body: html,
			title: "訊息送出結果",
			size: "sm"
		});
		toggle(clicked_element);
	}).catch(function(ex) {
		console.error("xhrSendMessage parsing failed", ex);
		alert("XHR連線查詢有問題!!【" + ex + "】");
	});
}
//]]>
