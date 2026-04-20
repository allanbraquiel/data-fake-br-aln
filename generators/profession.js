const profissoes = [
  "Administrador",
  "Advogado",
  "Analista de Sistemas",
  "Arquiteto",
  "Assistente Social",
  "Autônomo",
  "Biólogo",
  "Contador",
  "Dentista",
  "Designer Gráfico",
  "Economista",
  "Educador Físico",
  "Enfermeiro",
  "Engenheiro Civil",
  "Engenheiro Elétrico",
  "Engenheiro de Software",
  "Farmacêutico",
  "Fisioterapeuta",
  "Fotógrafo",
  "Geógrafo",
  "Jornalista",
  "Médico",
  "Nutricionista",
  "Pedagogo",
  "Policial Civil",
  "Professor",
  "Psicólogo",
  "Publicitário",
  "Químico",
  "Sociólogo",
  "Técnico em Informática",
  "Tecnólogo",
  "Veterinário"
];

function gerarProfissao() {
  return profissoes[Math.floor(Math.random() * profissoes.length)];
}
