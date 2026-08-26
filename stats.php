<?php
// Enkel visningssida för räknaren. Visar bara ett antal – ingen personlig
// data finns att visa. Sidan är inte länkad någonstans, bara nåbar direkt
// via /stats.php för den som vill se antalet.

$file = __DIR__ . "/counter-data.json";
$data = ["completed" => 0];
if (file_exists($file)) {
  $decoded = json_decode(file_get_contents($file), true);
  if (is_array($decoded) && isset($decoded["completed"])) {
    $data = $decoded;
  }
}
?>
<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <title>Statistik – Valkompassen</title>
  <style>
    body { font-family: sans-serif; background: #fdf8f0; color: #2c2320; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { text-align: center; }
    .number { font-size: 64px; font-weight: 800; }
    .label { color: #6b5c53; }
  </style>
</head>
<body>
  <div class="box">
    <div class="number"><?php echo (int) $data["completed"]; ?></div>
    <div class="label">genomförda test</div>
  </div>
</body>
</html>
