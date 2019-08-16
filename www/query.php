<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="For tracking taoyuan land registration cases">
<meta name="author" content="LIU, PANG-YU">
<title>登記案件繼承審查檢核表(BETA)</title>

<!-- Bootstrap core CSS -->
<link rel="stylesheet" href="assets/css/bootstrap.min.css">
<!-- Custom styles for this template -->
<link href="assets/css/starter-template.css" rel="stylesheet">
<link href="assets/css/bootstrap-datepicker.standalone.min.css" rel="stylesheet">
<link href="assets/css/bootstrap-treeview.min.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
</head>

<body id="body" class="bg-light-blue">

  <nav class="navbar navbar-expand-md navbar-dark bg-zhongli fixed-top">
    <!--<img src="assets/img/tao.png" style="vertical-align: middle;" />　-->
    <a class="navbar-brand" href="http://www.zhongli-land.tycg.gov.tw/" target="_blank"><img src="assets/img/zhongli_logo.png" width="85%" height="auto" /></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav ml-auto">
        <!--
        <li class="nav-item active">
          <a class="nav-link" href="/">登記案件追蹤 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="http://www.taoyuan-land.tycg.gov.tw" target="_blank">地所首頁</a>
        </li>
        -->
        <li class="nav-item dropdown active">
          <a class="nav-link dropdown-toggle hamburger" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="assets/img/menu.png" width="32" height="auto" /></a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
            <a class="dropdown-item" href="index.html" target="_self">繼承輕鬆審系統</span></a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="http://www.zhongli-land.tycg.gov.tw/" target="_blank">地所首頁</a>
			<a class="dropdown-item" href="shortcuts.html">各WEB系統黃頁</a>
            <a class="dropdown-item" href="https://law.moj.gov.tw/Law/LawSearchResult.aspx?ty=LAW&kw=%E7%B9%BC%E6%89%BF" target="_blank">繼承法規查詢(需外網)</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <section class="more-gap">
    <div class="container-fluid container-custom-width">
      <div class="row">
        <div class="col" id="preview">
          <!-- preview selected result here -->
          <div id="tree"></div>
        </div>
        <div class="col-8 text-center">
          <form id="inheritance_form" name="inheritance_form" action="">

            <div id="no0_btn_grp" class="btn_grp">
              <button id="no0_btn_next" class="btn btn-outline-light" title="下一步"><img src="assets/img/right.png" /></button>
            </div>
            
            <fieldset class="layer1" id="layer1_input_case">
              <legend><span class="text-danger">*</span>收件資訊</legend>
              <label for="serial">收件年期字號：</label>
              <input type="text" id="serial" name="serial" value="" data-trigger="focus" data-toggle="popover" data-content="如：107-HA81-012345" data-placement="bottom" />
              <label for="heir">被繼承人姓名：</label>
              <input type="text" id="heir" name="heir" value="" data-trigger="focus" data-toggle="popover" data-content="繼承人姓名不能空值！" />
            </fieldset>
            
            <div id="no1_btn_grp" class="hide btn_grp">
              <button id="no1_btn_prev" class="btn btn-outline-light" title="上一步"><img src="assets/img/left.png" /></button>
              <button id="no1_btn_next" class="btn btn-outline-light" title="下一步"><img src="assets/img/right.png" /></button>
            </div>

            <fieldset class="layer1 hide" id="layer1_select_type">
              <legend id="heir_reg_type_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇繼承登記類型！" data-placement="right"><span class="text-danger">*</span>繼承登記類型</legend>
              <div class="heir_reg_type">
				<div class="fl">
					<label for="type_0_law_heir"><input type="radio" id="type_0_law_heir" name="heir_reg_type" value="type_0_law_heir" /> 繼承</label>
				</div>
				<div class="fl">
					<label for="type_1_split_heir"><input type="radio" id="type_1_split_heir" name="heir_reg_type" value="type_1_split_heir" /> 分割繼承</label>
                </div>
				<div class="fl">
					<label for="type_2_share_heir"><input type="radio" id="type_2_share_heir" name="heir_reg_type" value="type_2_share_heir" /> 公同共有繼承</label>
                </div>
				<div class="fl">
					<label for="type_3_modify"><input type="radio" id="type_3_modify" name="heir_reg_type" value="type_3_modify" /> 名義更正</label> <a href="assets/files/10_名義更正.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a>
                </div>
				<div class="fl">
					<label for="type_4_will_heir"><input type="radio" id="type_4_will_heir" name="heir_reg_type" value="type_4_will_heir" /> 遺囑繼承</label> <a href="assets/files/08_遺囑繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a>
                </div>
				<div class="fl">
					<div><label for="type_5_judge_heir"><input type="radio" id="type_5_judge_heir" name="heir_reg_type" value="type_5_judge_heir" /> 判決繼承</label></div>
					<div><label for="type_7"><input type="radio" id="type_7" name="heir_reg_type" value="type_7" /> 和解繼承</label></div>
					<div><label for="type_8"><input type="radio" id="type_8" name="heir_reg_type" value="type_8" /> 調解繼承</label></div>
                </div>
				<div class="fl">
					<div><input type="radio" id="type_6_nobody_heir" name="heir_reg_type" value="type_6_nobody_heir" class="hide" />無人承認<div>
					<div class="ml-4"><label for="type_9"><input type="radio" id="type_9" name="heir_reg_type" value="type_9" /> 遺產管理人</label></div>
					<div class="ml-2"><label for="type_10"><input type="radio" id="type_10" name="heir_reg_type" value="type_10" /> 收歸國有</label></div>
				</div>
              </div>
            </fieldset>

            <div id="no2_btn_grp" class="hide btn_grp">
              <button id="no2_btn_prev" class="btn btn-outline-light" title="上一步"><img src="assets/img/left.png" /></button>
              <button id="no2_btn_next" class="btn btn-outline-light" title="下一步"><img src="assets/img/right.png" /></button>
            </div>

            <fieldset class="layer1 hide" id="layer1_target_check_items">
              <legend>被繼承人審查項目</legend>
              <fieldset class="layer2 fix">
                <legend id="death_period_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇死亡日期！" data-placement="right">死亡日期</legend>
                <label for="jp"><input type="radio" id="jp" name="death_period" value="jp" /> 日據時期(民國34年10月24日前死亡)</label> <a href="assets/files/01_日據時期繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a><br/>
                  <fieldset class="layer3" id="death_period_jp_layer3">
                    <legend id="house_owner_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇被繼承人身分！" data-placement="right">被繼承人身分</legend>
                    <label for="house_owner_yes"><input type="radio" id="house_owner_yes" name="house_owner" value="yes" /> 戶主</label> <br/>
                      <fieldset class="layer4" id="house_owner_yes_layer4">
                        <legend id="house_owner_yes_heir_seq_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇繼承人順位(戶主)！" data-placement="right">繼承人順位(戶主)</legend>
                        <label for="house_owner_yes_heir_seq_1"><input type="radio" id="house_owner_yes_heir_seq_1" name="house_owner_yes_heir_seq" value="1" /> 1.法定戶主繼承人-同一戶內男子直系卑親屬(親等近者為先)</label> <br/>
                          <fieldset class="layer5" id="house_owner_yes_heir_seq_one_layer5">
                            <legend></legend>
                            <label for="house_owner_yes_heir_seq_1_children_1"><input type="checkbox" id="house_owner_yes_heir_seq_1_children_1" name="house_owner_yes_heir_seq_1_children_1" value="1" /> 婚、私生子</label> <br/>
                            <label for="house_owner_yes_heir_seq_1_children_2"><input type="checkbox" id="house_owner_yes_heir_seq_1_children_2" name="house_owner_yes_heir_seq_1_children_2" value="2" /> 養子</label> <br/>
                            <label for="house_owner_yes_heir_seq_1_children_3"><input type="checkbox" id="house_owner_yes_heir_seq_1_children_3" name="house_owner_yes_heir_seq_1_children_3" value="3" /> 過房子</label> <br/>
                            <label for="house_owner_yes_heir_seq_1_children_4"><input type="checkbox" id="house_owner_yes_heir_seq_1_children_4" name="house_owner_yes_heir_seq_1_children_4" value="4" /> 螟蛉子</label> <br/>
                            <fieldset class="layer6" id="house_owner_yes_heir_seq_1_children_fourth_layer6">
                              <legend>代位或再轉</legend>
                              <label for="house_owner_yes_heir_seq_method_subrogation"><input type="checkbox" id="house_owner_yes_heir_seq_method_subrogation" name="house_owner_yes_heir_seq_method_subrogation" value="subrogation" /> 代位</label> <br/>
                              <label for="house_owner_yes_heir_seq_method_transfer"><input type="checkbox" id="house_owner_yes_heir_seq_method_transfer" name="house_owner_yes_heir_seq_method_transfer" value="transfer" /> 再轉</label> <br/>
                            </fieldset>
                          </fieldset>
                        <label for="house_owner_yes_heir_seq_2"><input type="radio" id="house_owner_yes_heir_seq_2" name="house_owner_yes_heir_seq" value="2" /> 2.指定戶主繼承人-依當時戶籍登記為準</label> <br/>
                        <label for="house_owner_yes_heir_seq_3"><input type="radio" id="house_owner_yes_heir_seq_3" name="house_owner_yes_heir_seq" value="3" /> 3.選定戶主繼承人-依當時戶籍登記為準</label> <br/>
                      </fieldset>
                      <label for="house_owner_no"><input type="radio" id="house_owner_no" name="house_owner" value="no" /> 非戶主</label> <br/>
                      <fieldset class="layer4" id="house_owner_no_layer4">
                        <legend id="house_owner_no_heir_seq_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇繼承人順位(非戶主)！" data-placement="right">繼承人順位(非戶主)</legend>
                        <label for="house_owner_no_heir_seq_1"><input type="radio" id="house_owner_no_heir_seq_1" name="house_owner_no_heir_seq" value="1" /> 1.直系卑親屬(親等近者為先)</label> <br/>
                          <fieldset class="layer5" id="house_owner_no_heir_seq_one_layer5">
                            <legend></legend>
                            <label for="house_owner_no_heir_seq_1_children_1"><input type="checkbox" id="house_owner_no_heir_seq_1_children_1" name="house_owner_no_heir_seq_1_children_1" value="1" /> 婚、私生子</label> <br/>
                            <label for="house_owner_no_heir_seq_1_children_2"><input type="checkbox" id="house_owner_no_heir_seq_1_children_2" name="house_owner_no_heir_seq_1_children_2" value="2" /> 養子</label> <br/>
                            <label for="house_owner_no_heir_seq_1_children_3"><input type="checkbox" id="house_owner_no_heir_seq_1_children_3" name="house_owner_no_heir_seq_1_children_3" value="3" /> 過房子</label> <br/>
                            <label for="house_owner_no_heir_seq_1_children_4"><input type="checkbox" id="house_owner_no_heir_seq_1_children_4" name="house_owner_no_heir_seq_1_children_4" value="4" /> 螟蛉子</label> <br/>
                            <fieldset class="layer6" id="house_owner_no_heir_seq_1_children_fourth_layer6">
                              <legend>代位或再轉</legend>
                              <label for="house_owner_no_heir_seq_method_subrogation"><input type="checkbox" id="house_owner_no_heir_seq_method_subrogation" name="house_owner_no_heir_seq_method_subrogation" value="subrogation" /> 代位</label> <br/>
                              <label for="house_owner_no_heir_seq_method_transfer"><input type="checkbox" id="house_owner_no_heir_seq_method_transfer" name="house_owner_no_heir_seq_method_transfer" value="transfer" /> 再轉</label> <br/>
                            </fieldset>
                          </fieldset>
                        <label for="house_owner_no_heir_seq_2"><input type="radio" id="house_owner_no_heir_seq_2" name="house_owner_no_heir_seq" value="2" /> 2.配偶</label> <br/>
                        <label for="house_owner_no_heir_seq_3"><input type="radio" id="house_owner_no_heir_seq_3" name="house_owner_no_heir_seq" value="3" /> 3.直系尊親屬(親等近者為先)</label> <br/>
                        <label for="house_owner_no_heir_seq_4"><input type="radio" id="house_owner_no_heir_seq_4" name="house_owner_no_heir_seq" value="4" /> 4.戶主</label> <br/>
                      </fieldset>
                  </fieldset>
                <label for="tw"><input type="radio" id="tw" name="death_period" value="tw" /> 光復後(民國34年10月25日後死亡)</label> <a href="assets/files/02_光復後繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                  <fieldset class="layer3" id="death_period_tw_layer3">
                    <legend id="tw_death_period_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇確切時間！" data-placement="right">確切時間</legend>
                    <label for="tw34_74"><input type="radio" id="tw34_74" name="tw_death_period" value="tw34_74" /> 民法修正前(民國34年10月25日~74年6月4日前)</label> <br/>
                    <label for="after_tw74"><input type="radio" id="after_tw74" name="tw_death_period" value="after_tw74" /> 民法修正後(民國74年6月5日後)</label> <br/>
                    <fieldset class="layer4" id="tw_death_period_layer4">
                      <legend id="tw_death_period_heir_seq_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇繼承人順位！" data-placement="right">繼承人順位</legend>
                      <label for="tw_death_period_heir_spouse"><input type="checkbox" id="tw_death_period_heir_spouse" name="tw_death_period_heir_spouse" value="yes" /> 配偶</label> <br/>
                      <fieldset class="layer5" id="tw_death_period_heir_spouse_yes_layer5">
                        <legend id="tw_death_period_heir_spouse_live_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇配偶存歿！" data-placement="right">存歿</legend>
                        <label for="tw_death_period_heir_spouse_live_yes"><input type="radio" id="tw_death_period_heir_spouse_live_yes" name="tw_death_period_heir_spouse_live" value="yes" /> 生存</label>
                        <label for="tw_death_period_heir_spouse_live_no"><input type="radio" id="tw_death_period_heir_spouse_live_no" name="tw_death_period_heir_spouse_live" value="no" /> 亡歿</label>
                      </fieldset>
                      <label for="tw_death_period_heir_seq_1"><input type="radio" id="tw_death_period_heir_seq_1" name="tw_death_period_heir_seq" value="1" /> 1. 直系血親卑親屬(親等近者為先)</label> <br/>
                      <fieldset class="layer5" id="tw_death_period_heir_seq_one_layer5">
                        <legend>名份</legend>
                        <label for="tw_death_period_heir_seq_1_option1"><input type="checkbox" id="tw_death_period_heir_seq_1_option1" name="tw_death_period_heir_seq_1_option1" value="1" /> 1. 婚生子女</label> <br/>
                        <label for="tw_death_period_heir_seq_1_option2"><input type="checkbox" id="tw_death_period_heir_seq_1_option2" name="tw_death_period_heir_seq_1_option2" value="2" /> 2. 認領</label> <br/>
                        <label for="tw_death_period_heir_seq_1_option3"><input type="checkbox" id="tw_death_period_heir_seq_1_option3" name="tw_death_period_heir_seq_1_option3" value="3" /> 3. 養子女</label> <br/>
                        <fieldset class="layer6" id="tw_death_period_heir_seq_1_option_third_layer6">
                          <legend>代位或再轉</legend>
                          <label for="tw_death_period_heir_seq_1_option_method_1"><input type="checkbox" id="tw_death_period_heir_seq_1_option_method_1" name="tw_death_period_heir_seq_1_option_method_1" value="1" /> 代位</label> <br/>
                          <label for="tw_death_period_heir_seq_1_option_method_2"><input type="checkbox" id="tw_death_period_heir_seq_1_option_method_2" name="tw_death_period_heir_seq_1_option_method_2" value="2" /> 再轉</label> <br/>
                        </fieldset>
                      </fieldset>
                      <label for="tw_death_period_heir_seq_2"><input type="radio" id="tw_death_period_heir_seq_2" name="tw_death_period_heir_seq" value="2" /> 2. 父母</label> <br/>
                      <label for="tw_death_period_heir_seq_3"><input type="radio" id="tw_death_period_heir_seq_3" name="tw_death_period_heir_seq" value="3" /> 3. 兄弟姊妹</label> <br/>
                      <fieldset class="layer5" id="tw_death_period_heir_seq_third_layer5">
                        <legend></legend>
                        <label for="tw_death_period_heir_seq_3_method"><input type="checkbox" id="tw_death_period_heir_seq_3_method" name="tw_death_period_heir_seq_3_method" value="transfer" /> 再轉</label> <br/>
                      </fieldset>
                      <label for="tw_death_period_heir_seq_4"><input type="radio" id="tw_death_period_heir_seq_4" name="tw_death_period_heir_seq" value="4" /> 4. 祖父母</label> <br/>
                    </fieldset>
                  </fieldset>
              </fieldset>
            </fieldset>

            <div id="no3_btn_grp" class="hide btn_grp">
              <button id="no3_btn_prev" class="btn btn-outline-light" title="上一步"><img src="assets/img/left.png" /></button>
              <button id="no3_btn_next" class="btn btn-outline-light" title="下一步"><img src="assets/img/right.png" /></button>
            </div>

            <fieldset class="layer1 hide" id="layer1_heir_check_items">
              <legend id="heir_method_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇繼承人審查項目！" data-placement="right">繼承人審查項目</legend>
              <div class="left">
                <label for="heir_method_subrogation"><input type="checkbox" id="heir_method_subrogation" name="heir_method_subrogation" value="subrogation" class="heir_method_checkbox" /> 代位</label> <a href="assets/files/03_代位及再轉繼承之規定.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <label for="heir_method_transfer"><input type="checkbox" id="heir_method_transfer" name="heir_method_transfer" value="transfer" class="heir_method_checkbox" /> 再轉</label> <a href="assets/files/03_代位及再轉繼承之規定.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <label for="heir_method_abandon"><input type="checkbox" id="heir_method_abandon" name="heir_method_abandon" value="abandon" class="heir_method_checkbox" /> 繼承權拋棄</label> <a href="assets/files/04_繼承之喪失及拋棄.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <fieldset class="layer2" id="heir_method_abandon_layer2">
                  <legend id="heir_method_abandon_yn_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇有或無！" data-placement="right">Y/N</legend>
                  <label for="heir_method_abandon_yes"><input type="radio" id="heir_method_abandon_yes" name="heir_method_abandon_yn" value="yes" /> 有</label> 
                  <label for="heir_method_abandon_no"><input type="radio" id="heir_method_abandon_no" name="heir_method_abandon_yn" value="no" /> 無</label>
                </fieldset>
                <label for="heir_method_lost"><input type="checkbox" id="heir_method_lost" name="heir_method_lost" value="lost" class="heir_method_checkbox" /> 繼承權喪失</label> <a href="assets/files/04_繼承之喪失及拋棄.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <fieldset class="layer2" id="heir_method_lost_layer2">
                  <legend id="heir_method_lost_yn_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇有或無！" data-placement="right">Y/N</legend>
                  <label for="heir_method_lost_yes"><input type="radio" id="heir_method_lost_yes" name="heir_method_lost_yn" value="yes" /> 有</label>
                  <label for="heir_method_lost_no"><input type="radio" id="heir_method_lost_no" name="heir_method_lost_yn" value="no" /> 無</label>
                </fieldset>
                <label for="heir_method_domestic"><input type="checkbox" id="heir_method_domestic" name="heir_method_domestic" value="domestic" class="heir_method_checkbox" /> 本國人繼承</label> <a href="assets/files/05_本國人繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <fieldset class="layer2" id="heir_method_domestic_layer2">
                  <legend></legend>
                  <label for="heir_method_domestic_opt1"><input type="checkbox" id="heir_method_domestic_opt1" name="heir_method_domestic_opt1" value="1" class="heir_method_domestic_opt" /> 有行為能力(滿20歲或未成年已結婚者)</label> <br/>
                  <label for="heir_method_domestic_opt2"><input type="checkbox" id="heir_method_domestic_opt2" name="heir_method_domestic_opt2" value="2" class="heir_method_domestic_opt" /> 限制行為能力(7-20歲或受輔助宣告之人)</label> <br/>
                  <label for="heir_method_domestic_opt3"><input type="checkbox" id="heir_method_domestic_opt3" name="heir_method_domestic_opt3" value="3" class="heir_method_domestic_opt" /> 無行為能力(7歲以下或受監護宣告之人)</label> <br/>
                  <label for="heir_method_domestic_opt4"><input type="checkbox" id="heir_method_domestic_opt4" name="heir_method_domestic_opt4" value="4" class="heir_method_domestic_opt" /> 養子女</label> <br/>
                  <label for="heir_method_domestic_opt5"><input type="checkbox" id="heir_method_domestic_opt5" name="heir_method_domestic_opt5" value="5" class="heir_method_domestic_opt" /> 胎兒</label> <br/>
                  <fieldset class="layer3" id="heir_method_domestic_opt5_layer3">
                    <legend></legend>
                    <label for="heir_method_domestic_opt5_rename"><input type="checkbox" id="heir_method_domestic_opt5_rename" name="heir_method_domestic_opt5_rename" value="rename" /> 更名登記</label> <br/>
                    <label for="heir_method_domestic_opt5_correct"><input type="checkbox" id="heir_method_domestic_opt5_correct" name="heir_method_domestic_opt5_correct" value="correct" /> 更正登記</label> <br/>
                  </fieldset>
                </fieldset>
                <label for="heir_method_foreign"><input type="checkbox" id="heir_method_foreign" name="heir_method_foreign" value="foreign" class="heir_method_checkbox" /> 外國人繼承</label> <a href="assets/files/06_外國人繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <fieldset class="layer2" id="heir_method_foreign_layer2">
                  <legend></legend>
                  <label for="heir_method_foreign_opt1"><input type="checkbox" id="heir_method_foreign_opt1" name="heir_method_foreign_opt1" value="1" class="heir_method_foreign_opt" /> 平等互惠(土地法第18條)</label> <br/>
                  <fieldset class="layer3" id="heir_method_foreign_opt1_layer3">
                    <legend id="heir_method_foreign_opt1_yn_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇有或無！" data-placement="right">Y/N</legend>
                    <label for="heir_method_foreign_opt1_yes"><input type="radio" id="heir_method_foreign_opt1_yes" name="heir_method_foreign_opt1_yn" value="yes" /> 有</label>
                    <label for="heir_method_foreign_opt1_no"><input type="radio" id="heir_method_foreign_opt1_no" name="heir_method_foreign_opt1_yn" value="no" /> 無</label>
                  </fieldset>
                  <label for="heir_method_foreign_opt2"><input type="checkbox" id="heir_method_foreign_opt2" name="heir_method_foreign_opt2" value="2" class="heir_method_foreign_opt" /> 繼承土地法第17條第1項土地</label> <br/>
                  <fieldset class="layer3" id="heir_method_foreign_opt2_layer3">
                    <legend id="heir_method_foreign_opt2_yn_legend" data-trigger="manual" data-toggle="popover" data-content="請選擇有或無！" data-placement="right">Y/N</legend>
                    <label for="heir_method_foreign_opt2_yes"><input type="radio" id="heir_method_foreign_opt2_yes" name="heir_method_foreign_opt2_yn" value="yes" /> 有</label>
                    <label for="heir_method_foreign_opt2_no"><input type="radio" id="heir_method_foreign_opt2_no" name="heir_method_foreign_opt2_yn" value="no" /> 無</label>
                  </fieldset>
                  <label for="heir_method_foreign_opt3"><input type="checkbox" id="heir_method_foreign_opt3" name="heir_method_foreign_opt3" value="3" class="heir_method_foreign_opt" /> 有行為能力(滿20歲或未成年已結婚者)</label> <br/>
                  <label for="heir_method_foreign_opt4"><input type="checkbox" id="heir_method_foreign_opt4" name="heir_method_foreign_opt4" value="4" class="heir_method_foreign_opt" /> 限制行為能力(7-20歲或受輔助宣告之人)</label> <br/>
                  <label for="heir_method_foreign_opt5"><input type="checkbox" id="heir_method_foreign_opt5" name="heir_method_foreign_opt5" value="5" class="heir_method_foreign_opt" /> 無行為能力(7歲以下或受監護宣告之人)</label> <br/>
                  <label for="heir_method_foreign_opt6"><input type="checkbox" id="heir_method_foreign_opt6" name="heir_method_foreign_opt6" value="6" class="heir_method_foreign_opt" /> 養子女</label> <br/>
                  <label for="heir_method_foreign_opt7"><input type="checkbox" id="heir_method_foreign_opt7" name="heir_method_foreign_opt7" value="7" class="heir_method_foreign_opt" /> 胎兒</label> <br/>
                  <fieldset class="layer3" id="heir_method_foreign_opt7_layer3">
                    <legend></legend>
                    <label for="heir_method_foreign_opt7_rename"><input type="checkbox" id="heir_method_foreign_opt7_rename" name="heir_method_foreign_opt7_rename" value="rename" /> 更名登記</label> <br/>
                    <label for="heir_method_foreign_opt7_correct"><input type="checkbox" id="heir_method_foreign_opt7_correct" name="heir_method_foreign_opt7_correct" value="correct" /> 更正登記</label> <br/>
                  </fieldset>
                </fieldset>
                <label for="heir_method_china"><input type="checkbox" id="heir_method_china" name="heir_method_china" value="china" class="heir_method_checkbox" /> 大陸地區人民繼承</label> <a href="assets/files/07_大陸地區人民繼承.pdf" title="相關法令" target="_blank"><img src="assets/img/pdf.png" class="pdf" /></a> <br/>
                <fieldset class="layer2" id="heir_method_china_layer2">
                  <legend></legend>
                  <label for="heir_method_china_opt1"><input type="checkbox" id="heir_method_china_opt1" name="heir_method_china_opt1" value="1" /> 依兩岸人民關係條例-不得繼承不動產</label> <br/>
                  <label for="heir_method_china_opt2"><input type="checkbox" id="heir_method_china_opt2" name="heir_method_china_opt2" value="2" /> 配偶(長期居留許可者)</label> <br/>
                  <label for="heir_method_china_opt3"><input type="checkbox" id="heir_method_china_opt3" name="heir_method_china_opt3" value="3" /> 繼承土地法第17條第1項土地</label> <br/>
                  <label for="heir_method_china_opt4"><input type="checkbox" id="heir_method_china_opt4" name="heir_method_china_opt4" value="4" /> 台灣地區繼承人賴以居住</label> <br/>
                </fieldset>
              </div>
            </fieldset>

            <div id="no4_btn_grp" class="hide btn_grp">
              <label for="is_luzhu_table" class="luzhu-table-checkbox"><input type="checkbox" id="is_luzhu_table" name="is_luzhu_table" value="yes" /> 輸出蘆竹版表格</label>
              <button id="no4_btn_prev" class="btn btn-outline-light" title="上一步"><img src="assets/img/left.png" /></button>
              <button id='GEN_btn' class="btn btn-outline-light" title="產製審查表格"><img src="assets/img/right.png" /></button>
              <!--<button id='GEN_btn' class='btn btn-success' title="GENERATE TABLE">產製審查表格</button>-->
            </div>

            <fieldset class="layer1 hide" id="layer1_result">
              <legend>
                應附文件
              </legend>
              <div class="container-fluid left">
				<div id="luzhu_doc">
					<div class="w3-row">
					  <label for="heir_death_remove_cert" class="w3-col"><input type="checkbox" id="heir_death_remove_cert" name="heir_death_remove_cert" value="yes" /> 被繼承人死亡除戶戶籍謄本</label>
					  <label for="heir_now_cert" class="w3-col"><input type="checkbox" id="heir_now_cert" name="heir_now_cert" value="yes" /> 繼承人現在戶籍謄本</label>
					  <label for="heir_sys_table" class="w3-col"><input type="checkbox" id="heir_sys_table" name="heir_sys_table" value="yes" /> 繼承系統表</label>
					  <label for="heir_drop_doc" class="w3-col"><input type="checkbox" id="heir_drop_doc" name="heir_drop_doc" value="yes" /> 拋棄繼承權證明文件</label>
					  <label for="heir_tax_doc" class="w3-col"><input type="checkbox" id="heir_tax_doc" name="heir_tax_doc" value="yes" /> 遺產稅完免納證明文件</label>
					  <label for="heir_affidavit_doc" class="w3-col"><input type="checkbox" id="heir_affidavit_doc" name="heir_affidavit_doc" value="yes" /> 權利書狀或切結書</label>
					</div>
					<div class="w3-row">
					  <label for="heir_split_doc" class="w3-col"><input type="checkbox" id="heir_split_doc" name="heir_split_doc" value="yes" /> 遺產分割協議書</label>
					  <label for="heir_stamp_doc" class="w3-col"><input type="checkbox" id="heir_stamp_doc" name="heir_stamp_doc" value="yes" /> 繼承人之印鑑證明書</label>
					  <label for="heir_check_id" class="w3-col"><input type="checkbox" id="heir_check_id" name="heir_check_id" value="yes" /> 親自到場核對身分</label>
					  <label for="heir_oversea_doc" class="w3-col"><input type="checkbox" id="heir_oversea_doc" name="heir_oversea_doc" value="yes" /> 海外授權書</label>
					  <label for="heir_court_doc" class="w3-col"><input type="checkbox" id="heir_court_doc" name="heir_court_doc" value="yes" /> 法院判決書及確定證明書</label>
					  <label for="heir_will_doc" class="w3-col"><input type="checkbox" id="heir_will_doc" name="heir_will_doc" value="yes" /> 遺囑</label>
					</div>
					<div class="w3-row">
					  <label for="heir_other_doc" class="w3-rest"><input type="checkbox" id="heir_other_doc" name="heir_other_doc" value="yes" /> 其他 <input id="heir_other_doc_text" name="heir_other_doc_text" type="text" value="" disabled/></label>
					</div>
				</div>
				<div id="taoyuan_doc">
					<div id="taoyuan_doc_type_0_law_heir_type_2_share_heir" class="taoyuan_doc_item">
						<p><strong>繼承、共同共有繼承</strong></p>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt1"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt1" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt2"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt2" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt2" value="2" /> 繼承人現戶戶籍謄本</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt3"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt3" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt3" value="3" /> 登記清冊</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt4"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt4" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt4" value="4" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt5"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt5" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt5" value="5" /> 繼承系統表</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt6">
							<input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt6" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt6" value="6" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt7"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt7" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt7" value="7" /> 切結書</label>
						</label>
						<ul>
							<li>其他：</li>
						</ul>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt8">
							<input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt8" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt8" value="8" /> 拋棄繼承時-法院拋棄繼承文件、
							<label style="display:inline" for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt9"><input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt9" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt9" value="9" /> 繼承人在國外-海外授權書、</label>
						</label>
						<label for="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt10">
							<input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt10" type="checkbox" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt10" value="10" />
							<input id="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt11" type="text" name="taoyuan_doc_type_0_law_heir_type_2_share_heir_opt11" />
						</label>
					</div>
					
					<div id="taoyuan_doc_type_1_split_heir" class="taoyuan_doc_item">
						<p><strong>分割繼承</strong></p>
						<label for="taoyuan_doc_type_1_split_heir_opt1"><input id="taoyuan_doc_type_1_split_heir_opt1" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_1_split_heir_opt2"><input id="taoyuan_doc_type_1_split_heir_opt2" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt2" value="2" /> 繼承人現戶戶籍謄本</label>
						<label for="taoyuan_doc_type_1_split_heir_opt3"><input id="taoyuan_doc_type_1_split_heir_opt3" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt3" value="3" /> 登記清冊</label>
						<label for="taoyuan_doc_type_1_split_heir_opt4"><input id="taoyuan_doc_type_1_split_heir_opt4" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt4" value="4" /> 分割協議書-含應繳納印花稅</label>
						<label for="taoyuan_doc_type_1_split_heir_opt5">
							<input id="taoyuan_doc_type_1_split_heir_opt5" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt5" value="5" /> 印鑑證明，或
							<label style="display:inline" for="taoyuan_doc_type_1_split_heir_opt6"><input id="taoyuan_doc_type_1_split_heir_opt6" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt6" value="6" /> 親自到場核對身分</label>
						</label>
						<label for="taoyuan_doc_type_1_split_heir_opt7"><input id="taoyuan_doc_type_1_split_heir_opt7" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt7" value="7" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_1_split_heir_opt8"><input id="taoyuan_doc_type_1_split_heir_opt8" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt8" value="8" /> 繼承系統表</label>
						<label for="taoyuan_doc_type_1_split_heir_opt9">
							<input id="taoyuan_doc_type_1_split_heir_opt9" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt9" value="9" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_1_split_heir_opt10"><input id="taoyuan_doc_type_1_split_heir_opt10" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt10" value="10" /> 切結書</label>
						</label>
						<ul>
							<li>其他：</li>
						</ul>
						<label for="taoyuan_doc_type_1_split_heir_opt11">
							<input id="taoyuan_doc_type_1_split_heir_opt11" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt11" value="11" /> 拋棄繼承時-法院拋棄繼承文件、
							<label style="display:inline" for="taoyuan_doc_type_1_split_heir_opt12"><input id="taoyuan_doc_type_1_split_heir_opt12" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt12" value="12" /> 繼承人在國外-海外授權書、</label>
						</label>
						<label for="taoyuan_doc_type_1_split_heir_opt13">
							<input id="taoyuan_doc_type_1_split_heir_opt13" type="checkbox" name="taoyuan_doc_type_1_split_heir_opt13" value="13" />
							<input id="taoyuan_doc_type_1_split_heir_opt14" type="text" name="taoyuan_doc_type_1_split_heir_opt14" />
						</label>
					</div>
					
					<div id="taoyuan_doc_type_3_modify" class="taoyuan_doc_item">
						<p><strong>名義更正</strong></p>
						<label for="taoyuan_doc_type_3_modify_opt1"><input id="taoyuan_doc_type_3_modify_opt1" type="checkbox" name="taoyuan_doc_type_3_modify_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_3_modify_opt2"><input id="taoyuan_doc_type_3_modify_opt2" type="checkbox" name="taoyuan_doc_type_3_modify_opt2" value="2" /> 繼承人現戶戶籍謄本(含台灣光復初期原合法繼承人戶籍謄本)</label>
						<label for="taoyuan_doc_type_3_modify_opt3"><input id="taoyuan_doc_type_3_modify_opt3" type="checkbox" name="taoyuan_doc_type_3_modify_opt3" value="3" /> 登記清冊</label>
						<label for="taoyuan_doc_type_3_modify_opt4"><input id="taoyuan_doc_type_3_modify_opt4" type="checkbox" name="taoyuan_doc_type_3_modify_opt4" value="4" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_3_modify_opt5"><input id="taoyuan_doc_type_3_modify_opt5" type="checkbox" name="taoyuan_doc_type_3_modify_opt5" value="5" /> 繼承系統表</label>
						<label for="taoyuan_doc_type_3_modify_opt6">
							<input id="taoyuan_doc_type_3_modify_opt6" type="checkbox" name="taoyuan_doc_type_3_modify_opt6" value="6" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_3_modify_opt7"><input id="taoyuan_doc_type_3_modify_opt7" type="checkbox" name="taoyuan_doc_type_3_modify_opt7" value="7" /> 切結書</label>
						</label>
						<ul>
							<li>其他：</li>
						</ul>
						<label for="taoyuan_doc_type_3_modify_opt8">
							<input id="taoyuan_doc_type_3_modify_opt8" type="checkbox" name="taoyuan_doc_type_3_modify_opt8" value="8" />
							<input id="taoyuan_doc_type_3_modify_opt9" type="text" name="taoyuan_doc_type_3_modify_opt9" />
						</label>
					</div>
					
					<div id="taoyuan_doc_type_4_will_heir" class="taoyuan_doc_item">
						<p><strong>遺囑繼承</strong></p>
						<label for="taoyuan_doc_type_4_will_heir_opt1"><input id="taoyuan_doc_type_4_will_heir_opt1" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_4_will_heir_opt2"><input id="taoyuan_doc_type_4_will_heir_opt2" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt2" value="2" /> 繼承人現戶戶籍謄本</label>
						<label for="taoyuan_doc_type_4_will_heir_opt3"><input id="taoyuan_doc_type_4_will_heir_opt3" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt3" value="3" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_4_will_heir_opt4"><input id="taoyuan_doc_type_4_will_heir_opt4" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt4" value="4" /> 繼承系統表</label>
						<label for="taoyuan_doc_type_4_will_heir_opt5"><input id="taoyuan_doc_type_4_will_heir_opt5" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt5" value="5" /> 遺囑</label>
						<label for="taoyuan_doc_type_4_will_heir_opt6">
							<input id="taoyuan_doc_type_4_will_heir_opt6" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt6" value="6" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_4_will_heir_opt7"><input id="taoyuan_doc_type_4_will_heir_opt7" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt7" value="7" /> 切結書</label>
						</label>
						<ul>
							<li>其他：</li>
						</ul>
						<label for="taoyuan_doc_type_4_will_heir_opt8"><input id="taoyuan_doc_type_4_will_heir_opt8" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt8" value="8" /> 代筆遺囑-見證人身分證明文件</label>
						<label for="taoyuan_doc_type_4_will_heir_opt9">
							<input id="taoyuan_doc_type_4_will_heir_opt9" type="checkbox" name="taoyuan_doc_type_4_will_heir_opt9" value="9" />
							<input id="taoyuan_doc_type_4_will_heir_opt10" type="text" name="taoyuan_doc_type_4_will_heir_opt10" />
						</label>
					</div>
					
					<div id="taoyuan_doc_type_5_judge_heir_type_7_type_8" class="taoyuan_doc_item">
						<p><strong>判決、調解、和解繼承</strong></p>
						<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt1"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt1" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt2"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt2" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt2" value="2" /> 繼承人現戶戶籍謄本</label>
						<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt3"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt3" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt3" value="3" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt4"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt4" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt4" value="4" /> 繼承系統表</label>
						<div>
							判決繼承：
							<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt5" style="display:inline"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt5" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt5" value="5" /> 判決書，</label>
							<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt6" style="display:inline"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt6" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt6" value="6" /> 判決確定證明書</label>
						</div>
						<div>
							調解繼承：
							<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt7" style="display:inline"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt7" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt7" value="7" /> 調解筆錄</label>
						</div>
						<div>
							和解繼承：
							<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt8" style="display:inline"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt8" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt8" value="8" /> 和解筆錄</label>
						</div>
						<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt9">
							<input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt9" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt9" value="9" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt10"><input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt10" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt10" value="10" /> 切結書</label>
						</label>
						<ul>
							<li>
								其他：
								<label for="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt11" style="display:inline">
									<input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt11" type="checkbox" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt11" value="11" />
									<input id="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt12" type="text" name="taoyuan_doc_type_5_judge_heir_type_7_type_8_opt12" />
								</label>
							</li>
						</ul>
					</div>

					<div id="taoyuan_doc_type_9" class="taoyuan_doc_item">
						<p><strong>無人承認繼承-遺產管理人</strong></p>
						<label for="taoyuan_doc_type_9_opt1"><input id="taoyuan_doc_type_9_opt1" type="checkbox" name="taoyuan_doc_type_9_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_9_opt2"><input id="taoyuan_doc_type_9_opt2" type="checkbox" name="taoyuan_doc_type_9_opt2" value="2" /> 登記清冊</label>
						<label for="taoyuan_doc_type_9_opt3"><input id="taoyuan_doc_type_9_opt3" type="checkbox" name="taoyuan_doc_type_9_opt3" value="3" /> 親屬會議選定或經法院指定之證明文件</label>
						<label for="taoyuan_doc_type_9_opt4"><input id="taoyuan_doc_type_9_opt4" type="checkbox" name="taoyuan_doc_type_9_opt4" value="4" /> 遺產管理人身分證明文件</label>
						<ul>
							<li>
								其他：
								<label for="taoyuan_doc_type_9_opt5" style="display:inline">
									<input id="taoyuan_doc_type_9_opt5" type="checkbox" name="taoyuan_doc_type_9_opt5" value="5" />
									<input id="taoyuan_doc_type_9_opt6" type="text" name="taoyuan_doc_type_9_opt6" />
								</label>
							</li>
						</ul>
					</div>
					
					<div id="taoyuan_doc_type_10" class="taoyuan_doc_item">
						<p><strong>無人承認繼承-收歸國有</strong></p>
						<label for="taoyuan_doc_type_10_opt1"><input id="taoyuan_doc_type_10_opt1" type="checkbox" name="taoyuan_doc_type_10_opt1" value="1" /> 被繼承人除戶戶籍謄本</label>
						<label for="taoyuan_doc_type_10_opt2"><input id="taoyuan_doc_type_10_opt2" type="checkbox" name="taoyuan_doc_type_10_opt2" value="2" /> 登記清冊</label>
						<label for="taoyuan_doc_type_10_opt3"><input id="taoyuan_doc_type_10_opt3" type="checkbox" name="taoyuan_doc_type_10_opt3" value="3" /> 移交清冊</label>
						<label for="taoyuan_doc_type_10_opt4"><input id="taoyuan_doc_type_10_opt4" type="checkbox" name="taoyuan_doc_type_10_opt4" value="4" /> 切結已完成公示催告無人報明債權及受遺贈人</label>
						<label for="taoyuan_doc_type_10_opt5"><input id="taoyuan_doc_type_10_opt5" type="checkbox" name="taoyuan_doc_type_10_opt5" value="5" /> 公示催告裁定書</label>
						<label for="taoyuan_doc_type_10_opt6"><input id="taoyuan_doc_type_10_opt6" type="checkbox" name="taoyuan_doc_type_10_opt6" value="6" /> 刊報影本</label>
						<label for="taoyuan_doc_type_10_opt7"><input id="taoyuan_doc_type_10_opt7" type="checkbox" name="taoyuan_doc_type_10_opt7" value="7" /> 遺產稅免稅或繳納證明書</label>
						<label for="taoyuan_doc_type_10_opt8">
							<input id="taoyuan_doc_type_10_opt8" type="checkbox" name="taoyuan_doc_type_10_opt8" value="8" /> 權利書狀，未能檢附權利書狀：
							<label style="display:inline" for="taoyuan_doc_type_10_opt9"><input id="taoyuan_doc_type_10_opt9" type="checkbox" name="taoyuan_doc_type_10_opt9" value="9" /> 切結書</label>
						</label>
						<ul>
							<li>
								其他：
								<label for="taoyuan_doc_type_10_opt10" style="display:inline">
									<input id="taoyuan_doc_type_10_opt10" type="checkbox" name="taoyuan_doc_type_10_opt10" value="10" />
									<input id="taoyuan_doc_type_10_opt11" type="text" name="taoyuan_doc_type_10_opt11" />
								</label>
							</li>
						</ul>
					</div>
				</div>
              </div>
            </fieldset>

          </form>
        </div>
        <div class="col"></div>
      </div>
      <p id="contact" class="text-center">
        <small id="copyright" class="text-muted my-2">&copy; 2018, 2019 <strong><a href="mailto:pangyu.liu@gmail.com">LIU, PANG-YU</a></strong> at <a href="http://www.taoyuan-land.tycg.gov.tw/" target="_blank">Taoyuan-Land Office</a>.</small>
      </p>
    </div>
  </section><!-- /section -->

  <!-- Bootstrap core JavaScript
  ================================================== -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script src="assets/js/jquery-3.2.1.min.js"></script>
  <!-- <script>window.jQuery || document.write('<script src="../../../../assets/js/vendor/jquery.min.js"><\/script>')</script> -->
  <script src="assets/js/popper.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>
  <script src="assets/js/bootstrap-treeview.min.js"></script>
  <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
  <script src="assets/js/ie10-viewport-bug-workaround.js"></script>
  <!-- Custom scripts for UI event handling -->
  <script src="assets/js/utils.js"></script>
  <script src="assets/js/ready.js"></script>
  <script src="assets/js/wizard.js"></script>
  <script src="assets/js/preview.js"></script>
  <script>
    // other custom scripts start here
    var btype = getBrowserType();
    if (btype == "0" || (btype.indexOf('IE') !== -1 && btype != "IE11")) {
      document.getElementById("body").innerHTML = "<h1 style='font-weight:bolder; color: red; text-align: center;'>抱歉，本網頁只支援IE11瀏覽器、Chrome或是Firefox。</h1>";
    }
  </script>
</body>
</html>
