const UFS_PRIORITARIAS = ["GO"];
const PROBABILIDADE_UF_PRIORITARIA = 0.5;

const CEPS_POR_UF = {
  GO: [
    "74000-000", "74100-000", "74200-000", "74300-000", "74400-000",
    "74500-000", "74600-000", "74700-000", "74800-000", "74900-000",
    "74672-410", "74883-005", "74334-002", "74370-525", "74690-601",
    "74435-010", "74815-700", "74484-010", "74591-100", "74480-010",
    "74723-010", "74335-010", "74899-899", "74477-401", "74870-020",
    "74691-300", "74413-030", "74445-500", "74461-482", "74445-350",
    "74663-010", "74250-010", "74343-010"
  ],
  DF: ["70000-000", "70300-000", "70700-000", "71000-000", "72000-000", "73000-000", "73300-000"],
  SP: ["01000-000", "01310-100", "01414-001", "02000-000", "04000-000", "05000-000", "06000-000", "07000-000", "08000-000", "09000-000"],
  RJ: ["20000-000", "20040-020", "22000-000", "22250-040", "23000-000", "24000-000"],
  MG: ["30000-000", "30130-010", "31000-000", "32000-000", "33000-000"],
  ES: ["29000-000", "29010-000", "29100-000"],
  BA: ["40000-000", "40140-000", "40200-000", "41000-000", "41800-000"],
  SE: ["49000-000", "49010-000", "49020-000"],
  PE: ["50000-000", "50030-000", "51000-000", "52000-000"],
  AL: ["57000-000", "57010-000", "57020-000"],
  PB: ["58000-000", "58010-000", "58020-000"],
  RN: ["59000-000", "59010-000", "59020-000"],
  CE: ["60000-000", "60110-000", "60160-000", "60300-000", "60800-000"],
  PI: ["64000-000", "64001-000", "64002-000"],
  MA: ["65000-000", "65010-000", "65020-000"],
  PA: ["66000-000", "66010-000", "66020-000", "66600-000"],
  AP: ["68900-000", "68901-000", "68902-000"],
  AM: ["69000-000", "69010-000", "69020-000", "69030-000"],
  RR: ["69300-000", "69301-000", "69302-000"],
  AC: ["69900-000", "69901-000", "69902-000"],
  RO: ["78900-000", "78901-000", "78902-000"],
  TO: ["77000-000", "77001-000", "77002-000"],
  MT: ["78000-000", "78010-000", "78020-000"],
  MS: ["79000-000", "79010-000", "79020-000"],
  PR: [
    "80010-000", "80020-310", "80030-150", "80035-000", "80045-000",
    "80050-000", "80060-070", "80110-000", "80210-170", "80240-000",
    "80310-000", "80420-000", "80430-000", "80520-000", "80610-000",
    "81020-000", "81510-000", "81630-000", "82010-000", "82590-100"
  ],
  SC: ["88000-000", "88010-000", "88020-000", "88030-000"],
  RS: ["90000-000", "90010-000", "90020-000", "91000-000", "92000-000"]
};

const CIDADES_POR_UF = {
  GO: { cidade: "Goiania", estado: "GO" },
  DF: { cidade: "Brasilia", estado: "DF" },
  SP: { cidade: "Sao Paulo", estado: "SP" },
  RJ: { cidade: "Rio de Janeiro", estado: "RJ" },
  MG: { cidade: "Belo Horizonte", estado: "MG" },
  ES: { cidade: "Vitoria", estado: "ES" },
  BA: { cidade: "Salvador", estado: "BA" },
  SE: { cidade: "Aracaju", estado: "SE" },
  PE: { cidade: "Recife", estado: "PE" },
  AL: { cidade: "Maceio", estado: "AL" },
  PB: { cidade: "Joao Pessoa", estado: "PB" },
  RN: { cidade: "Natal", estado: "RN" },
  CE: { cidade: "Fortaleza", estado: "CE" },
  PI: { cidade: "Teresina", estado: "PI" },
  MA: { cidade: "Sao Luis", estado: "MA" },
  PA: { cidade: "Belem", estado: "PA" },
  AP: { cidade: "Macapa", estado: "AP" },
  AM: { cidade: "Manaus", estado: "AM" },
  RR: { cidade: "Boa Vista", estado: "RR" },
  AC: { cidade: "Rio Branco", estado: "AC" },
  RO: { cidade: "Porto Velho", estado: "RO" },
  TO: { cidade: "Palmas", estado: "TO" },
  MT: { cidade: "Cuiaba", estado: "MT" },
  MS: { cidade: "Campo Grande", estado: "MS" },
  PR: { cidade: "Curitiba", estado: "PR" },
  SC: { cidade: "Florianopolis", estado: "SC" },
  RS: { cidade: "Porto Alegre", estado: "RS" }
};

function escolherUF() {
  const ufs = Object.keys(CEPS_POR_UF);

  if (UFS_PRIORITARIAS.length && Math.random() < PROBABILIDADE_UF_PRIORITARIA) {
    const prioritaria = UFS_PRIORITARIAS[Math.floor(Math.random() * UFS_PRIORITARIAS.length)];
    if (CEPS_POR_UF[prioritaria])
      return prioritaria;
  }

  return ufs[Math.floor(Math.random() * ufs.length)];
}

function gerarCEP(uf) {
  const ufEscolhida = uf || escolherUF();
  const lista = CEPS_POR_UF[ufEscolhida];

  if (!lista || !lista.length)
    return gerarCEP();

  return lista[Math.floor(Math.random() * lista.length)];
}

function gerarEnderecoLocal() {
  const uf = escolherUF();
  const cidade = CIDADES_POR_UF[uf];

  return {
    cep: gerarCEP(uf),
    cidade: cidade.cidade,
    estado: cidade.estado
  };
}

function gerarCEPOutraUF() {
  const ufs = Object.keys(CEPS_POR_UF).filter((uf) => !UFS_PRIORITARIAS.includes(uf));
  const uf = ufs[Math.floor(Math.random() * ufs.length)];
  return gerarCEP(uf);
}

function gerarCEPCuritiba() {
  return gerarCEP("PR");
}

function gerarCEPGoiania() {
  return gerarCEP("GO");
}
