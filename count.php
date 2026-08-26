<?php
// Enkel räknare för hur många som genomför valkompassen.
// Samlar INGEN personlig data: ingen IP, inga cookies, ingen user-agent –
// bara en siffra i en fil som räknas upp med ett anrop.

header("Content-Type: application/json");
header("Cache-Control: no-store");

// Endast POST tillåtet, annars gör inget.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["ok" => false]);
  exit;
}

$file = __DIR__ . "/counter-data.json";

$fp = fopen($file, "c+");
if ($fp === false) {
  http_response_code(500);
  echo json_encode(["ok" => false]);
  exit;
}

flock($fp, LOCK_EX);

$contents = stream_get_contents($fp);
$data = json_decode($contents, true);
if (!is_array($data)) {
  $data = ["completed" => 0];
}
if (!isset($data["completed"])) {
  $data["completed"] = 0;
}

$data["completed"] += 1;

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($data));
fflush($fp);

flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(["ok" => true]);
