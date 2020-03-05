<?php
require_once("./include/init.php");
require_once("./include/authentication.php");
$operators = GetDBUserMapping();
ksort($operators);
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
<link href="assets/css/bootstrap-vue.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/loading.css">
<link rel="stylesheet" href="assets/css/loading-btn.css">
<link href="assets/css/animate.css" rel="stylesheet">
<link href="assets/css/awesome-font.css" rel="stylesheet">
<!-- Custom styles for this template -->
<link href="assets/css/starter-template.css" rel="stylesheet">
<link href="assets/css/bootstrap-datepicker.standalone.min.css" rel="stylesheet">
<link href="assets/css/basic.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
</head>

<body>

  <section id="main_content_section" class="mb-5">
    <div class="container-fluid">
      
      <div class="row">
        <div id="case-reg-search" class="col-6">
          <case-reg-search></case-reg-search>
        </div>
        <div id="case-sur-mgt" class="col-6">
          <case-sur-mgt></case-sur-mgt>
        </div>
      </div>
      <div class="row">
        <div id="case-query-by-pid" class="col-6">
          <case-query-by-pid></case-query-by-pid>
          <fieldset>
            <legend>轄區各段土地標示部筆數＆面積查詢</legend>
            <a href="http://220.1.35.24/%E8%B3%87%E8%A8%8A/webinfo2/%E4%B8%8B%E8%BC%89%E5%8D%80%E9%99%84%E4%BB%B6/%E6%A1%83%E5%9C%92%E5%B8%82%E5%9C%9F%E5%9C%B0%E5%9F%BA%E6%9C%AC%E8%B3%87%E6%96%99%E5%BA%AB%E9%9B%BB%E5%AD%90%E8%B3%87%E6%96%99%E6%94%B6%E8%B2%BB%E6%A8%99%E6%BA%96.pdf" target="_blank">電子資料申請收費標準</a>
            <a href="assets/files/土地基本資料庫電子資料流通申請表.doc">電子資料申請書</a> <br />
            
            <div class="form-row">
              <div class="input-group input-group-sm col">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroup-data_query_text">關鍵字/段代碼</span>
                </div>
                <input type="text" id="data_query_text" name="data_query_text" class="form-control" placeholder="榮民段" />
              </div>
              <div class="filter-btn-group col">
                <button id="data_query_button" class="btn btn-sm btn-outline-primary">查詢</button>
                <button id="data_quote_button" class="btn btn-sm btn-outline-success">備註</button>
              </div>
            </div>
            
            <blockquote id="data_blockquote" class="hide" data-title="土地標示部筆數＆面積查詢">
              -- 段小段筆數＆面積計算 (RALID 登記－土地標示部) <br/>
              SELECT t.AA48 as "段代碼", <br/>
                  m.KCNT as "段名稱", <br/>
                  SUM(t.AA10) as "面積", <br/>
                  COUNT(t.AA10) as "筆數" <br/>
              FROM MOICAD.RALID t <br/>
              LEFT JOIN MOIADM.RKEYN m ON (m.KCDE_1 = '48' and m.KCDE_2 = t.AA48) <br/>
              --WHERE t.AA48 = '%【輸入數字】'<br/>
              --WHERE m.KCNT = '%【輸入文字】%'<br/>
              GROUP BY t.AA48, m.KCNT;
            </blockquote>
            <div id="data_query_result"></div>
          </fieldset>
          <fieldset>
            <legend>地政局索取地籍資料</legend>
            <div class="form-row">
              <div class="filter-btn-group col">
                <button id="export_txt_quote_button" class="btn btn-sm btn-outline-success">打開說明</button>
              </div>
            </div>
            <blockquote id="export_txt_blockquote" class="hide" data-title="地政局索取地籍資料">
              <span class="text-danger">※</span> 系統管理子系統/資料轉入轉出 (共14個txt檔案，地/建號範圍從 00000000 ~ 99999999) <br/>
              　- <small class="mt-2 mb-2"> 除下面標示為黃色部分須至地政系統產出並下載，其餘皆可於「報表匯出」區塊產出。</small> <br/>
              　AI001-10 <br/>
              　　AI00301 - 土地標示部 <br/>
              　　AI00401 - 土地所有權部 <br/>
              　　AI00601 - 管理者資料【土地、建物各做一次】 <br/>
              　　AI00701 - 建物標示部 <br/>
              　　AI00801 - 基地坐落 <br/>
              　　AI00901 - 建物分層及附屬 <br/>
              　　AI01001 - 主建物與共同使用部分 <br/>
              　AI011-20 <br/>
              　　AI01101 - 建物所有權部 <br/>
              　　<span class="text-warning">AI01901 - 土地各部別</span> <br/>
              　AI021-40 <br/>
              　　<span class="text-warning">AI02101 - 土地他項權利部</span> <br/>
              　　<span class="text-warning">AI02201 - 建物他項權利部</span> <br/>
              　　AI02901 - 各部別之其他登記事項【土地、建物各做一次】 <br/><br/>

              <span class="text-danger">※</span> 測量子系統/測量資料管理/資料輸出入 【請至地政系統WEB版產出】<br/>
              　地籍圖轉出(數值地籍) <br/>
              　　* 輸出DXF圖檔【含控制點】及 NEC重測輸出檔 <br/>
              　地籍圖轉出(圖解數化) <br/>
              　　* 同上兩種類皆輸出，並將【分幅管理者先接合】下選項皆勾選 <br/><br/>
                
              <span class="text-danger">※</span> 登記子系統/列印/清冊報表/土地建物地籍整理清冊【土地、建物各產一次存PDF，請至地政系統WEB版產出】 <br/>
            </blockquote>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset>
            <legend>使用者＆信差訊息</legend>
            <div class="float-clear">
            <div class="form-row">
              <div class="input-group input-group-sm col">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroup-msg_who">關鍵字</span>
                </div>
                <input type="text" id="msg_who" name="msg_who" class="form-control" placeholder="HB0541" value="HB054" title="ID、姓名、IP" />
              </div>
              <div class="filter-btn-group col">
                <button id="search_user_button" class="btn btn-sm btn-outline-primary">搜尋</button>
                <button id="msg_button" class="btn btn-sm btn-outline-secondary">傳送訊息</button>
                <span id="filter_info" class="text-muted small"><?php echo count($operators); ?>筆</span>
              </div>
            </div>
            <div class="form-row mt-1">
              <div class="input-group input-group-sm col">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroup-msg_title">訊息標題</span>
                </div>
                <input type="text" id="msg_title" name="msg_title" class="form-control" placeholder="訊息的標題" />
              </div>
            </div>
            <div class="form-row mt-1">
              <textarea class="form-control" id="msg_content" rows="5" placeholder="訊息內容(最多500字)"></textarea>
            </div>
            <div id="user_list">
            <?php
              foreach ($operators as $id => $name) {
                // prevent rare word issue
                $name = preg_replace("/[a-zA-Z?0-9+]+/", "", $name);
                echo "<div class='float-left m-2 user_tag hide' style='font-size: .875rem;' data-id='".$id."' data-name='".($name ?? "XXXXXX")."'>".$id.": ".($name ?? "XXXXXX")."</div>";
              }
            ?>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <fieldset>
            <legend>報表匯出</legend>
            <div class="form-row">
              <div class="input-group input-group-sm col">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-preload_sql_select">預載查詢</span>
                  </div>
                  <select id="preload_sql_select" name="preload_sql_select" class="form-control" required>
                    <optgroup label="==== 所內登記案件統計 ====">
                      <option value="01_reg_case_monthly.sql">每月案件統計</option>
                      <option value="11_reg_reason_query_monthly.sql">每月案件 by 登記原因</option>
                      <option value="02_reg_remote_case_monthly.sql">每月遠途先審案件</option>
                      <option value="03_reg_other_office_case_monthly.sql">每月跨所案件【本所代收】</option>
                      <option value="04_reg_other_office_case_2_monthly.sql">每月跨所案件【非本所收件】</option>
                      <option value="09_reg_other_office_case_3_monthly.sql">每月跨所子號案件【本所代收】</option>
                      <option value="10_reg_reason_stats_monthly.sql">每月跨所各登記原因案件統計 by 收件所</option>
                      <option value="07_reg_foreign_case_monthly.sql">每月權利人＆義務人為外國人案件</option>
                      <option value="07_regf_foreign_case_monthly.sql">每月外國人地權登記統計</option>
                      <option value="17_rega_case_stats_monthly.sql">每月土地建物登記統計檔</option>
                      <option value="08_reg_workstation_case.sql">外站人員謄本核發量</option>
                    </optgroup>
                    <optgroup label="==== 所內其他統計 ====">
                      <option value="16_sur_close_delay_case.sql">已結卻延期之複丈案件</option>
                      <option value="14_sur_rain_delay_case.sql">因雨延期測量案件數</option>
                      <option value="05_adm_area_size.sql">段小段面積統計</option>
                      <option value="06_adm_area_blow_count.sql">段小段土地標示部筆數</option>
                      <option value="12_prc_not_F_case.sql">未完成地價收件資料</option>
                      <option value="13_log_court_cert.sql">法院謄本申請LOG檔查詢 BY 段、地建號</option>
                      <option value="15_reg_land_stats.sql">某段之土地所有權人清冊資料</option>
                      <option value="18_cross_county_crsms.sql">全國跨縣市收件資料</option>
                    </optgroup>
                    <optgroup label="==== 地籍資料 ====" class="bg-success text-white">
                      <option value="txt_AI00301.sql">AI00301 - 土地標示部資料</option>
                      <option value="txt_AI00401.sql">AI00401 - 土地所有權部資料</option>
                      <option value="txt_AI00601_B.sql">AI00601 - 土地管理者資料</option>
                      <option value="txt_AI00601_E.sql">AI00601 - 建物管理者資料</option>
                      <option value="txt_AI00701.sql">AI00701 - 建物標示部資料</option>
                      <option value="txt_AI00801.sql">AI00801 - 基地坐落資料</option>
                      <option value="txt_AI00901.sql">AI00901 - 建物分層及附屬資料</option>
                      <option value="txt_AI01001.sql">AI01001 - 主建物與共同使用部分資料</option>
                      <option value="txt_AI01101.sql">AI01101 - 建物所有權部資料</option>
                      <option value="txt_AI02901_B.sql">AI02901 - 土地各部別之其他登記事項列印</option>
                      <option value="txt_AI02901_E.sql">AI02901 - 建物各部別之其他登記事項列印</option>
                    </optgroup>
                  </select>
                </div>
                <div class="filter-btn-group col">
                  <button id="sql_export_button" class="btn btn-sm btn-outline-primary">匯出</button>
                  <button id="sql_csv_quote_button" class="btn btn-sm btn-outline-success">備註</button>
                </div>
            </div>
            <div class="form-row mt-1">
              <textarea id="sql_csv_text" class="form-control" rows="5" placeholder="輸入SELECT SQL ..."></textarea>
            </div>
            <blockquote id="sql_report_blockquote" class="hide" data-title="報表匯出">
              <p>輸入SELECT SQL指令匯出查詢結果。</p>
              <img src="assets/img/csv_export_method.jpg" class="w-auto" />
            </blockquote>
          </fieldset>
        </div>
        <!-- <div class="col">
        </div> -->
      </div>
    </div>
  </section><!-- /section -->
  
  <!-- Bootstrap core JavaScript -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script src="assets/js/jquery.min.js"></script>
  <script src="assets/js/popper.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>
  <!-- bs datepicker -->
  <script src="assets/js/bootstrap-datepicker.min.js"></script>
  <script src="assets/js/bootstrap-datepicker.zh-TW.min.js"></script>

  <script src="assets/js/vue.js"></script>
  <script src="assets/js/vuex.js"></script>
  <script src="assets/js/bootstrap-vue.min.js"></script>
  <script src="assets/js/bootstrap-vue-icons.min.js"></script>
  <script src="assets/js/axios.min.js"></script>
  <script src="assets/js/localforage.min.js"></script>
  <script src="assets/js/global.js"></script>
  <script src="assets/js/components/lah-vue.js"></script>
  <script src="assets/js/xhr_query.js"></script>
  
  <script src="assets/js/mark.jquery.min.js"></script>
  
  <script src="assets/js/components/case-reg-detail.js"></script>
  <script src="assets/js/components/case-input-group-ui.js"></script>
  <script src="assets/js/components/case-sur-mgt.js"></script>
  <script src="assets/js/components/case-reg-search.js"></script>
  <script src="assets/js/components/case-query-by-pid.js"></script>

  <script type="text/javascript">
    // place this variable in global to use this int for condition jufgement, e.g. 108
    let this_year = <?php echo $this_year; ?>;
    $(document).ready(e => {
      // query section data event
      $("#data_query_button").on("click", xhrGetSectionRALIDCount);
      bindPressEnterEvent("#data_query_text", xhrGetSectionRALIDCount);

      /**
       * For User Mapping
       */
      let prevVal = null;
      let total_ops = <?php echo count($operators); ?>;
      let filter_user = function(el) {
        let val = $(el).val();
        if (val == prevVal) {
          return;
        }
        // clean
        $(".user_tag").unmark(val, {
          "className": "highlight"
        }).addClass("hide");
        
        if (isEmpty(val)) {
          $(".user_tag").removeClass("hide");
          $("#filter_info").text(total_ops + "筆");
        } else {
          // Don't add 'g' because I only a line everytime.
          // If use 'g' flag regexp object will remember last found index, that will possibly case the subsequent test failure.
          val = val.replace("?", ""); // prevent out of memory
          let keyword = new RegExp(val, "i");
          $(".user_tag").each(function(idx, div) {
            if (keyword.test($(div).text())) {
              $(div).removeClass("hide");  
              // $("#msg_who").val($.trim(user_data[1]));
              $(div).mark(val, {
                "element" : "strong",
                "className": "highlight"
              });
            }
          });
          $("#filter_info").text((total_ops - $(".user_tag.hide").length) + "筆");
          if ((total_ops - $(".user_tag.hide").length) == 1) {
            let user_data = $(".user_tag:not(.hide)").text().split(":");
            $("#msg_who").val($.trim(user_data[1]));
          }
        }
        prevVal = val;
      };
      filter_user("#msg_who");

      let delayTimer = null;
      $("#msg_who").on("keyup", e => {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
          filter_user(e.target);
        }, 1000);
      });

      // sql csv export
      $("#sql_export_button").on("click", e => {
        let selected = $("#preload_sql_select").val();
        selected.startsWith("txt_") ? xhrExportSQLTxt(e) : xhrExportSQLCsv(e);
      });
      $("#preload_sql_select").on("change", xhrLoadSQL);

      // user info
      $(".user_tag").on("click", e => {
        let clicked_element = $(e.target);
        if (!clicked_element.hasClass("user_tag")) {
          clicked_element = $(clicked_element.closest(".user_tag"));
        }
        let user_data = clicked_element.text().split(":");
        $("#msg_who").val($.trim(user_data[1]).replace(/[\?A-Za-z0-9\+]/g, ""));
        window.vueApp.fetchUserInfo(e);
      });

      // message
      $("#msg_button").on("click", xhrSendMessage);

      // search users
      $("#search_user_button").on("click", xhrSearchUsers);
      bindPressEnterEvent("#msg_who", xhrSearchUsers);

      initBlockquoteModal();
    });
  </script>
</body>
</html>
