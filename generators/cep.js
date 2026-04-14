const cepsCuritiba = [
  "80010-000",
  "80020-310",
  "80030-150",
  "80035-000",
  "80045-000",
  "80050-000",
  "80060-070",
  "80110-000",
  "80210-170",
  "80240-000",
  "80310-000",
  "80420-000",
  "80430-000",
  "80520-000",
  "80610-000",
  "81020-000",
  "81510-000",
  "81630-000",
  "82010-000",
  "82590-100"
];

const cepsGoiania = [
  "74672-410",
  "74883-005",
  "74334-002",
  "74370-525",
  "74690-601",
  "74435-010",
  "74815-700",
  "74484-010",
  "74591-100",
  "74480-010",
  "74723-010",
  "74335-010",
  "74899-899",
  "74477-401",
  "74870-020",
  "74691-300",
  "74413-030",
  "74445-500",
  "74461-482",
  "74445-350",
  "74663-010",
  "74250-010",
  "74343-010"
];

function gerarCEPCuritiba() {
  return cepsCuritiba[Math.floor(Math.random() * cepsCuritiba.length)];
}

function gerarCEPGoiania() {
  return cepsGoiania[Math.floor(Math.random() * cepsGoiania.length)];
}

function gerarCEP() {
  const geradores = [gerarCEPCuritiba, gerarCEPGoiania];
  const gerador = geradores[Math.floor(Math.random() * geradores.length)];
  return gerador();
}