const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const RAIZ = path.join(__dirname, "..");

function carregar(arquivo) {
  const codigo = fs.readFileSync(path.join(RAIZ, arquivo), "utf8");
  vm.runInThisContext(codigo, { filename: arquivo });
}

carregar("utils/random.js");
carregar("utils/profiles.js");

test("definirSeed torna Math.random determinístico", () => {
  limparSeed();
  definirSeed(12345);
  const seq1 = [Math.random(), Math.random(), Math.random()];

  definirSeed(12345);
  const seq2 = [Math.random(), Math.random(), Math.random()];

  assert.deepStrictEqual(seq1, seq2, "Mesma seed deve gerar a mesma sequência");
  limparSeed();
});

test("seeds diferentes geram sequências diferentes", () => {
  limparSeed();
  definirSeed(1);
  const seq1 = [Math.random(), Math.random(), Math.random()];

  definirSeed(2);
  const seq2 = [Math.random(), Math.random(), Math.random()];

  assert.notDeepStrictEqual(seq1, seq2, "Seeds diferentes devem gerar sequências diferentes");
  limparSeed();
});

test("limparSeed restaura Math.random original", () => {
  limparSeed();
  const original = Math.random;
  definirSeed(42);
  assert.notStrictEqual(Math.random, original, "Com seed, Math.random deve ser substituído");
  limparSeed();
  assert.strictEqual(Math.random, original, "Após limpar, Math.random deve ser restaurado");
});

test("definirSeed rejeita seed inválida", () => {
  assert.throws(() => definirSeed("abc"), /Seed invalida/);
});

test("obterPerfil retorna perfil completo por padrão", () => {
  const perfil = obterPerfil();
  assert.strictEqual(perfil.label, "Completo");
  assert.strictEqual(perfil.campos, null);
});

test("obterPerfil retorna perfil desconhecido como completo", () => {
  const perfil = obterPerfil("naoExiste");
  assert.strictEqual(perfil.label, "Completo");
});

test("perfilPermiteCampo respeita os campos do perfil", () => {
  const pf = obterPerfil("pessoaFisica");
  assert.ok(perfilPermiteCampo(pf, "cpf"), "Pessoa Física deve permitir CPF");
  assert.ok(!perfilPermiteCampo(pf, "cnpj"), "Pessoa Física não deve permitir CNPJ");

  const pj = obterPerfil("pessoaJuridica");
  assert.ok(perfilPermiteCampo(pj, "cnpj"), "Pessoa Jurídica deve permitir CNPJ");
  assert.ok(!perfilPermiteCampo(pj, "cpf"), "Pessoa Jurídica não deve permitir CPF");
});

test("perfil completo permite todos os campos", () => {
  const completo = obterPerfil("completo");
  assert.ok(perfilPermiteCampo(completo, "cpf"));
  assert.ok(perfilPermiteCampo(completo, "cnpj"));
  assert.ok(perfilPermiteCampo(completo, "cns"));
});

test("todos os perfis definidos possuem label e descricao", () => {
  Object.values(PERFIS).forEach((perfil) => {
    assert.ok(perfil.label, "Perfil deve ter label");
    assert.ok(perfil.descricao, "Perfil deve ter descricao");
  });
});
