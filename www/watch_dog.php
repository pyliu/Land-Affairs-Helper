<?php
require_once("./include/init.php");
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="For tracking taoyuan land registration cases">
<meta name="author" content="LIU, PANG-YU">
<title>桃園市中壢地政事務所</title>

<!-- Bootstrap core CSS -->
<link rel="stylesheet" href="assets/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/css/loading.css">
<link rel="stylesheet" href="assets/css/loading-btn.css">
<!-- Custom styles for this template -->
<link href="assets/css/starter-template.css" rel="stylesheet">
<link href="assets/css/bootstrap-datepicker.standalone.min.css" rel="stylesheet">
<link href="assets/css/basic.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
<style type="text/css">
#contact a:link, a:visited, a:hover {
	color: gray;
}

#dropdown01 img {
  width: 32px;
  height: auto;
  vertical-align: middle;
}

.expac_item {
  margin-bottom: 5px;
}

blockquote img {
  /*width: 80%;*/
  display: block;
}
</style>
</head>

<body>

  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <img src="assets/img/tao.png" style="vertical-align: middle;" />　
    <a class="navbar-brand" href="watch_dog.php">地政輔助系統 <span class="small">(α)</span></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item mt-3">
          <a class="nav-link" href="/index.php">登記案件追蹤</a>
        </li>
        <li class="nav-item mt-3">
          <a class="nav-link" href="/query.php">查詢＆報表</a>
        </li>
        <li class="nav-item mt-3 active">
          <a class="nav-link" href="/watch_dog.php">監控＆修正</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle hamburger" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="assets/img/menu.png" /></a>
          <div class="dropdown-menu" aria-labelledby="dropdown01">
            <a class="dropdown-item" href="http://220.1.35.87/" target="_blank">內部知識網</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="http://www.zhongli-land.tycg.gov.tw/" target="_blank">地所首頁</a>
            <a class="dropdown-item" href="http://webitr.tycg.gov.tw:8080/WebITR/" target="_blank">差勤系統</a>
            <a class="dropdown-item" href="/heir_share.html" target="_blank">繼承案件應繼分<span class="text-mute small">(α)</span></a>
            <a class="dropdown-item" href="/heir.html" target="_blank">繼承案件輕鬆審<span class="text-mute small">(β)</span></a>
            <a class="dropdown-item" href="http://tycgcloud.tycg.gov.tw/" target="_blank">公務雲</a>
            <a class="dropdown-item" href="http://220.1.35.24/Web/ap06.asp" target="_blank">分機查詢</a>
            <a class="dropdown-item" href="http://220.1.35.42:9080/SMS98/" target="_blank">案件辦理情形通知系統（簡訊＆EMAIL）</a>
            <a class="dropdown-item" href="/shortcuts.html" target="_blank">各類WEB版應用黃頁</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <section id="main_content_section" class="mb-5">
    <div class="container-fluid">
      <div class="row">
        <div class="col-6">
          <fieldset>
            <legend>跨所註記遺失檢測<small>(一周內)</small></legend>
            <button id="cross_case_check_query_button" data-toggle='tooltip'>立即檢測</button>
            <button id="cross_case_check_quote_button">備註</button>
            <blockquote id="cross_case_check_quote" class="hide">
              <h5><span class="text-danger">※</span>通常發生的情況是案件內的權利人/義務人/代理人姓名內有罕字造成。</h5>
              QUERY: <br />
              SELECT * <br />
                FROM SCRSMS <br />
              WHERE RM07_1 >= '1080715' <br />
                AND RM02 LIKE 'H%1' <br />
                AND (RM99 is NULL OR RM100 is NULL OR RM100_1 is NULL OR RM101 is NULL OR RM101_1 is NULL) 
              <br /><br />
              FIX: <br />
              UPDATE MOICAS.CRSMS SET RM99 = 'Y', RM100 = '資料管轄所代碼', RM100_1 = '資料管轄所縣市代碼', RM101 = '收件所代碼', RM101_1 = '收件所縣市代碼' <br />
              WHERE RM01 = '收件年' AND RM02 = '收件字' AND RM03 = '收件號'
            </blockquote>
            <div id="cross_case_check_query_display"></div>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset>
            <legend>悠遊卡自動加值付款失敗回復</legend>
            <label for="easycard_query_day" data-toggle='tooltip' title='輸入查詢日期'>日期：</label>
            <input type="text" id="easycard_query_day" name="easycard_query_day" class="easycard_query date_picker no-cache" data-trigger="manual" data-toggle="popover" data-content="需輸入7位數民國日期，如「1080321」。" data-placement="bottom" value="<?php echo $today; ?>" />
            <button id="easycard_query_button" class="easycard_query">查詢</button>
            <button id="easycard_quote_button">備註</button>
            <blockquote id="easycard_quote" class="hide">
              <ol>
                <li>櫃台來電通知悠遊卡扣款成功但地政系統卻顯示扣款失敗，需跟櫃台要【電腦給號】</li>
                <li>管理師處理方法：AA106為'2' OR '8'將AA106更正為'1'即可【AA01:事發日期、AA04:電腦給號】。<br />
                  UPDATE MOIEXP.EXPAA SET AA106 = '1' WHERE AA01='1070720' AND AA04='0043405'
                </li>
              </ol>
              <img src="assets/img/easycard_screenshot.jpg" />
            </blockquote>
            <div id="easycard_query_display"></div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <fieldset>
            <legend>公告期限維護<small>(先行准登)</small></legend>
            <span id="prereg_query_display"></span>
            <button id="prereg_clear_button" class="btn-outline-danger">清除准登</button>
            <button id="prereg_quote_button">備註</button>
            <blockquote id="prereg_quote" class="hide">
              <h5><span class="text-danger">※</span>注意：中壢所規定超過30件案件才能執行此功能，並於完成時須馬上關掉以免其他案件誤登。</h5>
              <h5><span class="text-danger">※</span>注意：准登完後該案件須手動於資料庫中調整辦理情形（RM30）為「公告」（H）。</h5>
              <img src="assets/howto/登記原因先行准登設定.jpg" />
            </blockquote>
            <div id='prereg_update_ui' class='mt-1'></div>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset>
            <legend>調整登記案件欄位資料</legend>
            
            <div class="form-row">
              <div class="input-group input-group-sm col">
                <select id="reg_case_update_year" name="reg_case_update_year" class="form-control" aria-label="年" aria-describedby="inputGroup-reg_case_update_year" required>
                  <option>107</option>
                  <option selected>108</option>
                </select>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-temp_clr_year">年</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
              <?php echo getCodeSelectHTML("reg_case_update_code", 'class="form-control" data-trigger="manual" data-toggle="popover" data-content="請選擇案件字" title="案件字" data-placement="top" aria-label="字" aria-describedby="inputGroup-reg_case_update_code" required'); ?>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-temp_clr_code">字</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
                <input type="text" id="reg_case_update_num" name="reg_case_update_num" class="form-control" aria-label="號" aria-describedby="inputGroup-reg_case_update_num" required data-trigger="manual" data-toggle="popover" data-content='請輸入案件號(最多6碼)' title='案件號' data-placement="top" />
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-reg_case_update_num">號</span>
                </div>
              </div>
              <div class="filter-btn-group col">
                <button id="reg_case_update_query" class="btn btn-sm btn-primary">查詢</button>
                <button id="reg_case_update_quote_button" class="btn btn-sm btn-light">備註</button>
              </div>
            </div>

            <blockquote id="reg_case_update_quote" class="hide">
              <ul>
                <li>使用情境1：先行准登後案件須回復至公告</li>
                <li>使用情境2：案件卡住需退回初審</li>
                <li>使用情境3：案件辦理情形與登記處理註記不同步造成地價課無法登錄收件卡住</li>
              </ul>
            </blockquote>
            <div id="reg_case_update_display"></div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <fieldset>
            <legend>案件暫存檔清除</legend>

            <div class="form-row">
              <div class="input-group input-group-sm col">
                <select id="temp_clr_year" name="temp_clr_year" class="form-control" aria-label="年" aria-describedby="inputGroup-temp_clr_year" required>
                  <option>107</option>
                  <option selected>108</option>
                </select>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-temp_clr_year">年</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
              <?php echo getCodeSelectHTML("temp_clr_code", 'class="form-control" data-trigger="manual" data-toggle="popover" data-content="請選擇案件字" title="案件字" data-placement="top" aria-label="字" aria-describedby="inputGroup-temp_clr_code" required'); ?>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-temp_clr_code">字</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
                <input type="text" id="temp_clr_num" name="temp_clr_num" class="form-control" aria-label="號" aria-describedby="inputGroup-temp_clr_num" required data-trigger="manual" data-toggle="popover" data-content='請輸入案件號(最多6碼)' title='案件號' data-placement="top" />
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-temp_clr_num">號</span>
                </div>
              </div>
              <div class="filter-btn-group col">
                <button id="query_temp_clr_button" class="btn btn-sm btn-primary">查詢</button>
                <button id="temp_clr_quote_button" class="btn btn-sm btn-light">備註</button>
              </div>
            </div>

            <blockquote id="temp_clr_quote" class="hide">
              <h6 class="text-info">檢查下列的表格</h6>
              <ul>
                <!-- // 登記 -->
                <li>"MOICAT.RALID" => "A"   // 土地標示部</li>
                <li>"MOICAT.RBLOW" => "B"   // 土地所有權部</li>
                <li>"MOICAT.RCLOR" => "C"   // 他項權利部</li>
                <li>"MOICAT.RDBID" => "D"   // 建物標示部</li>
                <li>"MOICAT.REBOW" => "E"   // 建物所有權部</li>
                <li>"MOICAT.RLNID" => "L"   // 人檔</li>
                <li>"MOICAT.RRLSQ" => "R"   // 權利標的</li>
                <li>"MOICAT.RGALL" => "G"   // 其他登記事項</li>
                <li>"MOICAT.RMNGR" => "M"   // 管理者</li>
                <li>"MOICAT.RTOGH" => "T"   // 他項權利檔</li>
                <li>"MOICAT.RHD10" => "H"   // 基地坐落／地上建物</li>
                <li class="text-danger">"MOICAT.RINDX" => "II"  // 案件異動索引，通常需留存，除非你要刪除整個案件</li>
                <li>"MOICAT.RINXD" => "ID"</li>
                <li>"MOICAT.RINXR" => "IR"</li>
                <li>"MOICAT.RINXR_EN" => "IRE"</li>
                <li>"MOICAT.RJD14" => "J"</li>
                <li>"MOICAT.ROD31" => "O"</li>
                <li>"MOICAT.RPARK" => "P"</li>
                <li>"MOICAT.RPRCE" => "PB"</li>
                <li>"MOICAT.RSCNR" => "SR"</li>
                <li>"MOICAT.RSCNR_EN" => "SRE"</li>
                <li>"MOICAT.RVBLOW" => "VB"</li>
                <li>"MOICAT.RVCLOR" => "VC"</li>
                <li>"MOICAT.RVGALL" => "VG"</li>
                <li>"MOICAT.RVMNGR" => "VM"</li>
                <li>"MOICAT.RVPON" => "VP"  // 重測/重劃暫存</li>
                <li>"MOICAT.RVRLSQ" => "VR"</li>
                <li>"MOICAT.RXIDD04" => "ID"</li>
                <li>"MOICAT.RXLND" => "XL"</li>
                <li>"MOICAT.RXPRI" => "XP"</li>
                <li>"MOICAT.RXSEQ" => "XS"</li>
                <li>"MOICAT.B2104" => "BR"</li>
                <li>"MOICAT.B2118" => "BR"</li>
                <li>"MOICAT.BGALL" => "G"</li>
                <li>"MOICAT.BHD10" => "H"</li>
                <li>"MOICAT.BJD14" => "J"</li>
                <li>"MOICAT.BMNGR" => "M"</li>
                <li>"MOICAT.BOD31" => "O"</li>
                <li>"MOICAT.BPARK" => "P"</li>
                <li>"MOICAT.BRA26" => "C"</li>
                <li>"MOICAT.BRLSQ" => "R"</li>
                <li>"MOICAT.BXPRI" => "XP"</li>
                <li>"MOICAT.DGALL" => "G"</li>
                <!-- // 地價 -->
                <li>"MOIPRT.PPRCE" => "MA"</li>
                <li>"MOIPRT.PGALL" => "GG"</li>
                <li>"MOIPRT.PBLOW" => "LA"</li>
                <li>"MOIPRT.PALID" => "KA"</li>
                <li>"MOIPRT.PNLPO" => "NA"</li>
                <li>"MOIPRT.PBLNV" => "BA"</li>
                <li>"MOIPRT.PCLPR" => "CA"</li>
                <li>"MOIPRT.PFOLP" => "FA"</li>
                <li>"MOIPRT.PGOBP" => "GA"</li>
                <li>"MOIPRT.PAPRC" => "AA"</li>
                <li>"MOIPRT.PEOPR" => "EA"</li>
                <li>"MOIPRT.POA11" => "OA"</li>
                <li>"MOIPRT.PGOBPN" => "GA"</li>
                <!--<li>"MOIPRC.PKCLS" => "KK"</li>-->
                <li>"MOIPRT.PPRCE" => "MA"</li>
                <li>"MOIPRT.P76SCRN" => "SS"</li>
                <li>"MOIPRT.P21T01" => "TA"</li>
                <li>"MOIPRT.P76ALID" => "AS"</li>
                <li>"MOIPRT.P76BLOW" => "BS"</li>
                <li>"MOIPRT.P76CRED" => "BS"</li>
                <li>"MOIPRT.P76INDX" => "II"</li>
                <li>"MOIPRT.P76PRCE" => "UP"</li>
                <li>"MOIPRT.P76SCRN" => "SS"</li>
                <li>"MOIPRT.PAE0301" => "MA"</li>
                <li>"MOIPRT.PB010" => "TP"</li>
                <li>"MOIPRT.PB014" => "TB"</li>
                <li>"MOIPRT.PB015" => "TB"</li>
                <li>"MOIPRT.PB016" => "TB"</li>
                <li>"MOIPRT.PHIND" => "II"</li>
                <li>"MOIPRT.PNLPO" => "NA"</li>
                <li>"MOIPRT.POA11" => "OA"</li>
              </ul>
            </blockquote>
            <div id="temp_clr_display"></div>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset>
            <legend>同步局端跨所案件資料</legend>
            <div><span class="text-danger">※</span>主機IP不在局端<span class="text-info">白名單</span>內將無法使用本功能，目前為<span class="text-danger"><?php echo $_SERVER["SERVER_ADDR"] ?></span>。</div>
            
            <div class="form-row">
              <div class="input-group input-group-sm col">
                <select id="sync_x_case_year" name="sync_x_case_year" class="form-control" aria-label="年" aria-describedby="inputGroup-sync_x_case_year" required>
                  <option selected>108</option>
                </select>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-sync_x_case_year">年</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
                <select id="sync_x_case_code" name="sync_x_case_code" class="form-control"  data-trigger="manual" data-toggle="popover" data-content='請選擇案件字' title='案件字' data-placement="top" aria-label="年" aria-describedby="inputGroup-sync_x_case_code" required>
                  <option></option>
                  <option>HAB1 壢桃登跨</option>
                  <option>HCB1 壢溪登跨</option>
                  <option>HDB1 壢楊登跨</option>
                  <option>HEB1 壢蘆登跨</option>
                  <option>HFB1 壢德登跨</option>
                  <option>HGB1 壢平登跨</option>
                  <option>HHB1 壢山登跨</option>
              </select>
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-sync_x_case_code">字</span>
                </div>
              </div>
              <div class="input-group input-group-sm col">
                <input type="text" id="sync_x_case_num" name="sync_x_case_num" class="form-control" aria-label="號" aria-describedby="inputGroup-sync_x_case_num" required data-trigger="manual" data-toggle="popover" data-content='請輸入案件號(最多6碼)' title='案件號' data-placement="top" />
                <div class="input-group-append">
                  <span class="input-group-text" id="inputGroup-sync_x_case_num">號</span>
                </div>
              </div>
              <div class="filter-btn-group col">
                <button id="sync_x_case_button" class="btn btn-sm btn-primary">比對</button>
                <button id="sync_x_case_quote_button" class="btn btn-sm btn-light">備註</button>
              </div>
            </div>
            
            <blockquote id="sync_x_case_quote" class="hide">
              <h6>將局端跨所資料同步回本所資料庫</h6>
              <div><span class="text-danger">※</span>新版跨縣市回寫機制會在每一分鐘時自動回寫，故局端資料有可能會比較慢更新。【2019-06-26】</div>
              <div><span class="text-danger">※</span>局端針對遠端連線同步異動資料庫有鎖IP，故<span class="text-danger">IP不在局端白名單內的主機將無法使用本功能</span>，目前主機IP為 <span class="text-warning"><?php echo $_SERVER["SERVER_ADDR"] ?></span> 。【2019-10-01】</div>
            </blockquote>
            <div id="sync_x_case_display"></div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <fieldset>
            <legend>規費資料集修正<small>(EXPAA)</small></legend>
            <label for="expaa_query_date" data-toggle='tooltip' title='欄位:AA01'>　　日期：</label>
            <input type="text" id="expaa_query_date" class="date_picker no-cache" name="expaa_query_date" data-trigger="manual" data-toggle="popover" data-content="需輸入7位數民國日期，如「1080426」。" data-placement="bottom" value="<?php echo $today; ?>" />
            <button id="expaa_query_date_button">查詢</button>
            <button id="expaa_add_obsolete_button" title="新增作廢假資料以利空白規費單作廢" class="btn-outline-danger">作廢</button><br />
            <label for="expaa_query_number" data-toggle='tooltip' title='欄位:AA04'>電腦給號：</label>
            <input type="text" id="expaa_query_number" name="expaa_query_number" data-trigger="manual" data-toggle="popover" data-content="需輸入7位數電腦給號，如「0021131」。" data-placement="bottom" />
            <button id="expaa_query_button">查詢</button>
            <button id="expaa_quote_button">備註</button>
            <blockquote id="expaa_quote" class="hide">
              AA09 - 列印註記【1：已印，0：未印】<br />
              AA100 - 付款方式<br />
              <img src="assets/img/EXPAA_AA100_Update.jpg" /><br />
              AA106 - 悠遊卡繳費扣款結果<br />
              AA107 - 悠遊卡交易流水號<br />
              <img src="assets/img/easycard_screenshot.jpg" />
            </blockquote>
            <div id="expaa_query_display"></div>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset>
            <legend>規費收費項目修正<small>(EXPAC)</small></legend>
            <label for="expac_query_year" data-toggle='tooltip' title='欄位:AC25'>規費年度：</label>
            <select id="expac_query_year" name="expac_query_year">
              <option selected>108</option>
            </select>
            <label for="expac_query_number" data-toggle='tooltip' title='欄位:AC04'>電腦給號：</label>
            <input type="text" id="expac_query_number" name="expac_query_number" data-trigger="manual" data-toggle="popover" data-content="需輸入7位數電腦給號，如「0021131」。" data-placement="bottom" />
            <button id="expac_query_button">查詢</button>
            <button id="expac_quote_button">備註</button>
            <blockquote id="expac_quote" class="hide">
              <img src="assets/img/correct_payment_screenshot.jpg" />
              -- 規費收費項目<br/>
              SELECT t.AC25 AS "規費年度",<br/>
                    t.AC04 AS "電腦給號",<br/>
                    t.AC16 AS "收件年",<br/>
                    t.AC17 AS "收件字",<br/>
                    t.AC18 AS "收件號",<br/>
                    t.AC20 AS "收件項目代碼",<br/>
                    p.e21  AS "收費項目名稱",<br/>
                    t.AC29 AS "應收金額",<br/>
                    t.AC30 AS "實收金額"<br/>
              FROM MOIEXP.EXPAC t<br/>
              LEFT JOIN MOIEXP.EXPE p<br/>
                  ON p.E20 = t.AC20<br/>
              WHERE t.AC04 = '0021131' AND t.AC25 = '108'
            </blockquote>
            <div id="expac_query_display"></div>
          </fieldset>
        </div>
      </div>
    </div>
  </section><!-- /section -->
  <small id="copyright" class="text-muted fixed-bottom my-2 mx-3 bg-white border rounded">
    <p id="copyright" class="text-center my-2">
    <a href="https://github.com/pyliu/Land-Affairs-Helper" target="_blank" title="View project on Github!"><svg class="octicon octicon-mark-github v-align-middle" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
      <strong>&copy; <a href="mailto:pangyu.liu@gmail.com">LIU, PANG-YU</a> ALL RIGHTS RESERVED.</strong>
    </p>
  </small>
  <!-- Bootstrap core JavaScript -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script src="assets/js/jquery-3.4.1.min.js"></script>
  <script src="assets/js/popper.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>
  <!-- bs datepicker -->
  <script src="assets/js/bootstrap-datepicker.min.js"></script>
  <script src="assets/js/bootstrap-datepicker.zh-TW.min.js"></script>
  <!-- Promise library -->
  <script src="assets/js/polyfill.min.js"></script>
  <!-- fetch library -->
  <script src="assets/js/fetch.min.js"></script>

  <script src="assets/js/vue.js"></script>
  <script src="assets/js/global.js"></script>
  <script src="assets/js/xhr_query.js"></script>
  
  <script src="assets/js/cache.js"></script>
  <script src="assets/js/FileSaver.min.js"></script>

  <script type="text/javascript">
    $(document).ready(e => {
      // unsupported IE detection
      if (window.attachEvent) {
        document.getElementById("main_content_section").innerHTML = '<h2 style="margin-top: 50px; text-align: center; color: red;">不支援舊版IE瀏覽器, 請使用Chrome/Firefox/IE11瀏覽器。</h2>';
        return;
      }
      
      // 跨所註記檢測
      $("#cross_case_check_query_button").on("click", xhrCheckProblematicXCase);

      // query section data event
      $("#easycard_query_button").on("click", xhrEasycardPaymentQuery);
      bindPressEnterEvent("#easycard_query_day", xhrEasycardPaymentQuery);

      // query EXPAC items event
      $("#expac_query_button").on("click", xhrGetExpacItems);
      bindPressEnterEvent("#expac_query_number", xhrGetExpacItems);
      
      // query EXPAA data event
      $("#expaa_query_button").on("click", xhrGetExpaaData);
      $("#expaa_query_date_button").on("click", e => {
        $("#expaa_query_number").val("");
        xhrGetExpaaData(e);
      });
      // for query by date, so we need to clear #expaa_query_number value first
      bindPressEnterEvent("#expaa_query_date", e => { $("#expaa_query_number").val(""); });
      bindPressEnterEvent("input[id*=expaa_query_", xhrGetExpaaData);
      // obselete event
      $("#expaa_add_obsolete_button").on("click", xhrQueryObsoleteFees);
      
      // check diff xcase 
      $("#sync_x_case_button").on("click", xhrCompareXCase);
      bindPressEnterEvent("#sync_x_case_num", xhrCompareXCase);
      $("#sync_x_case_code").on("change", xhrGetCaseLatestNum.bind({
        code_id: "sync_x_case_code",
        year_id: "sync_x_case_year",
        number_id: "sync_x_case_num",
        display_id: "sync_x_case_display"
      }));

      // query for announcement
      xhrQueryAnnouncementData.call(e, null);
      $("#prereg_clear_button").on("click", xhrClearAnnouncementFlag);

      // clear temp data
      $("#query_temp_clr_button").on("click", xhrQueryTempData);
      bindPressEnterEvent("#temp_clr_num", xhrQueryTempData);
      // clear temp code event
      $("#temp_clr_code").on("change", xhrGetCaseLatestNum.bind({
        code_id: "temp_clr_code",
        year_id: "temp_clr_year",
        number_id: "temp_clr_num",
        display_id: "temp_clr_display"
      }));

      // reg case data update
      $("#reg_case_update_code").on("change", xhrGetCaseLatestNum.bind({
        code_id: "reg_case_update_code",
        year_id: "reg_case_update_year",
        number_id: "reg_case_update_num",
        display_id: "reg_case_update_display"
      }));
      $("#reg_case_update_query").on("click", xhrRegCaseUpdateQuery);
      bindPressEnterEvent("#reg_case_update_num", xhrRegCaseUpdateQuery);
    });
  </script>
</body>
</html>
