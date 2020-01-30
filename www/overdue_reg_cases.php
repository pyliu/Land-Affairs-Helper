<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="For tracking taoyuan land registration cases">
<meta name="author" content="LIU, PANG-YU">
<title>15天內逾期案件列表-桃園市中壢地政事務所</title>

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
</head>

<body>

  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <i class="my-auto fas fa-th-list fa-2x text-light"></i>&ensp;
    <a class="navbar-brand" href="javascript:location.reload()">15天內逾期案件列表 - 地政輔助系統 <span class="small">(α)</span></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
  <section id="main_content_section" class="mb-5">
    <div class="container-fluid">
      <div class="row">
        <div id="overdue-reg-cases" class="col">
          <overdue-reg-cases></overdue-reg-cases>
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
  <!-- Vue -->
  <script src="assets/js/vue.js"></script>
  <script src="assets/js/bootstrap-vue.min.js"></script>
  <!-- Custom -->
  <script src="assets/js/global.js"></script>
  <!-- Vue components -->
  <script src="assets/js/components/overdue-reg-cases.js"></script>
  <script type="text/javascript">
    $(document).ready(e => {
      window.overdueRegCasesVue = new Vue({el: "#overdue-reg-cases"});
    });
  </script>
</body>
</html>
