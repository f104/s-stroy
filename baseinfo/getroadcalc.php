<?php
//require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
header('Content-type:application/json; charset=UTF-8');

if(!$_REQUEST['shipping_distance']) {
    $_REQUEST['shipping_distance'] = 1;
}
$json = [
  'price' => 1000*$_REQUEST['shipping_car']* $_REQUEST['shipping_distance']
];

echo json_encode($json);
