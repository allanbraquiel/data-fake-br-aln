const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const RAIZ = path.join(__dirname, "..");

const ARQUIVOS_GERADORES = [
  "generators/person.js",
  "generators/cpf.js",
  "generators/cnpj.js",
  "generators/cns.js",
  "generators/rg.js",
  "generators/phone.js",
  "generators/email.js",
  "generators/cep.js",
  "generators/company.js",
  "generators/profession.js"
];

function carregarGeradores() {
  ARQUIVOS_GERADORES.forEach((arquivo) => {
    const codigo = fs.readFileSync(path.join(RAIZ, arquivo), "utf8");
    vm.runInThisContext(codigo, { filename: arquivo });
  });
}

carregarGeradores();

function validarCPF(cpf) {
  if (!/^\d{11}$/.test(cpf))
    return false;

  const digitos = cpf.split("").map(Number);

  if (new Set(digitos).size === 1)
    return false;

  const calcDigito = (base) => {
    const soma = base.reduce((acc, d, i) => acc + d * (base.length + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const dig1 = calcDigito(digitos.slice(0, 9));
  const dig2 = calcDigito(digitos.slice(0, 10));

  return dig1 === digitos[9] && dig2 === digitos[10];
}

function validarCNPJ(cnpj) {
  if (!/^\d{14}$/.test(cnpj))
    return false;

  const digitos = cnpj.split("").map(Number);

  const calcDigito = (base) => {
    const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const inicio = pesos.length - base.length;
    const soma = base.reduce((acc, d, i) => acc + d * pesos[inicio + i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const dig1 = calcDigito(digitos.slice(0, 12));
  const dig2 = calcDigito(digitos.slice(0, 13));

  return dig1 === digitos[12] && dig2 === digitos[13];
}

function valorCaractereCNPJ(caractere) {
  if (/^\d$/.test(caractere))
    return Number(caractere);
  return caractere.charCodeAt(0) - 55;
}

function validarCNPJAlfanumerico(cnpj) {
  if (!/^[0-9A-Z]{14}$/.test(cnpj))
    return false;

  const calcDigito = (valores) => {
    let peso = 2;
    let soma = 0;
    for (let i = valores.length - 1; i >= 0; i--) {
      soma += valorCaractereCNPJ(valores[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cnpj.slice(0, 12).split("");
  const dig1 = calcDigito(base);
  const dig2 = calcDigito([...base, String(dig1)]);

  return dig1 === Number(cnpj[12]) && dig2 === Number(cnpj[13]);
}

function validarCNS(cns) {
  if (!/^\d{15}$/.test(cns))
    return false;

  const primeiro = Number(cns[0]);
  if (![1, 2, 7, 8, 9].includes(primeiro))
    return false;

  let soma = 0;
  for (let i = 0; i < 15; i++)
    soma += Number(cns[i]) * (15 - i);

  return soma % 11 === 0;
}

test("gerarCPF gera CPF válido", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(validarCPF(gerarCPF()), "CPF gerado deve ser válido");
});

test("gerarCNPJ gera CNPJ válido", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(validarCNPJ(gerarCNPJ()), "CNPJ gerado deve ser válido");
});

test("gerarCNPJAlfanumerico gera CNPJ alfanumérico válido", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(validarCNPJAlfanumerico(gerarCNPJAlfanumerico()), "CNPJ alfanumérico gerado deve ser válido");
});

test("gerarCNS gera CNS válido", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(validarCNS(gerarCNS()), "CNS gerado deve ser válido");
});

test("gerarRG gera 8 dígitos numéricos", () => {
  for (let i = 0; i < 1000; i++)
    assert.match(gerarRG(), /^\d{8}$/);
});

test("gerarTelefone segue o formato (DD) 9XXXXXXXX", () => {
  for (let i = 0; i < 1000; i++)
    assert.match(gerarTelefone(), /^\(\d{2}\) 9\d{8}$/);
});

test("gerarEmail gera e-mail válido", () => {
  for (let i = 0; i < 1000; i++)
    assert.match(gerarEmail(), /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/i);
});

test("gerarCEP gera CEP no formato XXXXX-XXX", () => {
  for (let i = 0; i < 1000; i++)
    assert.match(gerarCEP(), /^\d{5}-\d{3}$/);
});

test("gerarCEP aceita UF específica e retorna CEP daquela UF", () => {
  const cepsGo = CEPS_POR_UF.GO;
  for (let i = 0; i < 1000; i++)
    assert.ok(cepsGo.includes(gerarCEP("GO")), "CEP de GO deve pertencer à lista de GO");
});

test("gerarEnderecoLocal retorna CEP, cidade e estado consistentes", () => {
  for (let i = 0; i < 1000; i++) {
    const local = gerarEnderecoLocal();
    assert.match(local.cep, /^\d{5}-\d{3}$/);
    assert.ok(CIDADES_POR_UF[local.estado], "Estado deve ser uma UF válida");
    assert.strictEqual(CIDADES_POR_UF[local.estado].cidade, local.cidade, "Cidade deve corresponder ao estado");
  }
});

test("CEPS_POR_UF cobre todas as 27 UFs", () => {
  const ufs = Object.keys(CEPS_POR_UF);
  assert.strictEqual(ufs.length, 27, "Deve haver 27 UFs");
  ufs.forEach((uf) => {
    assert.ok(CEPS_POR_UF[uf].length > 0, `UF ${uf} deve ter ao menos um CEP`);
    assert.ok(CIDADES_POR_UF[uf], `UF ${uf} deve ter cidade/estado definidos`);
  });
});

test("gerarCEPCuritiba e gerarCEPGoiania continuam funcionando", () => {
  for (let i = 0; i < 1000; i++) {
    assert.match(gerarCEPCuritiba(), /^\d{5}-\d{3}$/);
    assert.match(gerarCEPGoiania(), /^\d{5}-\d{3}$/);
  }
});

test("gerarCEPOutraUF nunca retorna CEP de UF prioritária (GO)", () => {
  const cepsGo = CEPS_POR_UF.GO;
  for (let i = 0; i < 2000; i++)
    assert.ok(!cepsGo.includes(gerarCEPOutraUF()), "CEP de outra UF não deve pertencer a GO");
});

test("gerarNome retorna nome completo com pelo menos duas partes", () => {
  for (let i = 0; i < 1000; i++) {
    const nome = gerarNome();
    assert.ok(nome.split(" ").length >= 2, "Nome deve ter pelo menos nome e sobrenome");
  }
});

test("gerarNomeMae retorna nome completo", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(gerarNomeMae().split(" ").length >= 2);
});

test("gerarEmpresa retorna nome de empresa não vazio", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(gerarEmpresa().trim().length > 0);
});

test("gerarProfissao retorna profissão não vazia", () => {
  for (let i = 0; i < 1000; i++)
    assert.ok(gerarProfissao().trim().length > 0);
});
