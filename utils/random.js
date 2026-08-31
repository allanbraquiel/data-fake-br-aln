const RANDOM_ORIGINAL = Math.random;
let prngAtivo = null;

function criarPRNG(seed) {
  let a = seed >>> 0;

  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function definirSeed(seed) {
  const numero = Number(seed);
  if (!Number.isFinite(numero))
    throw new Error("Seed invalida. Informe um numero.");

  prngAtivo = criarPRNG(numero);
  Math.random = prngAtivo;
}

function limparSeed() {
  prngAtivo = null;
  Math.random = RANDOM_ORIGINAL;
}

function temSeedAtiva() {
  return prngAtivo !== null;
}
