<?php
  header("content-type:text/html;charset=utf8");
  echo $response=file_get_contents($_GET['url']);
?>