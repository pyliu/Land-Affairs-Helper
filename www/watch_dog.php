<?php
require_once("./include/init.php");
require_once("./include/authentication.php");
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
<link href="assets/css/animate.css" rel="stylesheet">
<link href="assets/css/awesome-font.css" rel="stylesheet">
<!-- Custom styles for this template -->
<link href="assets/css/starter-template.css" rel="stylesheet">
<link href="assets/css/bootstrap-vue.min.css" rel="stylesheet">
<link href="assets/css/basic.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
<style type="text/css">
#dropdown01 img {
  width: 32px;
  height: auto;
  vertical-align: middle;
}
</style>
</head>

<body>

  <section id="main_content_section" class="mb-5">
    <div class="container-fluid">
      <div class="row">
        <div id="case-state-mgt" class="col-6">
          <case-state-mgt></case-state-mgt>
        </div>
        <div id="case-sync-mgt"  class="col-6">
          <case-sync-mgt></case-sync-mgt>
        </div>
      </div>
      <div class="row">
        <div id="case-temp-mgt" class="col-6">
          <case-temp-mgt></case-temp-mgt>
        </div>
        <div id="announcement-mgt" class="col-6">
          <announcement-mgt></announcement-mgt>
        </div>
      </div>
      <div class="row">
        <div id="fee-query-board" class="col-6">
          <fee-query-board></fee-query-board>
        </div>
        <div id="xcase-check" class="col">
          <xcase-check></xcase-check>
        </div>
        <div id="easycard-payment-check" class="col">
          <easycard-payment-check></easycard-payment-check>
        </div>
      </div>
    </div>
  </section><!-- /section -->

  <!-- Bootstrap core JavaScript -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script src="assets/js/jquery.min.js"></script>
  <script src="assets/js/popper.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>
  <!-- Vue -->
  <script src="assets/js/vue.js"></script>
  <script src="assets/js/bootstrap-vue.min.js"></script>
  <script src="assets/js/bootstrap-vue-icons.min.js"></script>
  <!-- Custom -->
  <script src="assets/js/axios.min.js"></script>
  <script src="assets/js/global.js"></script>
  <script src="assets/js/xhr_query.js"></script>
  <script src="assets/js/cache.js"></script>
  <script src="assets/js/FileSaver.min.js"></script>
  <!-- Vue components -->
  <script src="assets/js/components/case-reg-detail.js"></script>
  <script src="assets/js/components/xcase-check.js"></script>
  <script src="assets/js/components/easycard-payment-check.js"></script>
  <script src="assets/js/components/announcement-mgt.js"></script>
  <script src="assets/js/components/case-input-group-ui.js"></script>
  <script src="assets/js/components/case-state-mgt.js"></script>
  <script src="assets/js/components/case-temp-mgt.js"></script>
  <script src="assets/js/components/case-sync-mgt.js"></script>
  <script src="assets/js/components/fee-query-board.js"></script>
  <script src="assets/js/components/lah-header.js"></script>
  <script src="assets/js/components/lah-footer.js"></script>
  <!-- Vue Chart Components -->
  <script src="assets/js/Chart.min.js"></script>
</body>
</html>
