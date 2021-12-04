<?php

//The URL that we want to GET.
$url = 'https://app.sanabliss.dontfogettosayhi.com/api/transactions/automate/execute';
 
//Use file_get_contents to GET the URL in question.
$contents = file_get_contents($url);
 
$to = "aboayosam@gmail.com";
$subject = "PHP CRON JOB";

$message = "PHP CRON JOB RUNNING: ".date('Y-m-d H:i:s')."<br>"."Task Automation: ".$contents;

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <info@sanabliss.dontfogettosayhi.com>' . "\r\n";

mail($to,$subject,$message,$headers);
?>