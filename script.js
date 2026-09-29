// Dados fictícios padronizados do 9º Ano
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Frequência fictícia/demonstrativa para esta etapa (não calculada a partir das faltas)
const FREQUENCIA_DEMONSTRATIVA = "92%";

// Função para normalizar qualquer formato de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte vírgula para ponto se for string
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  // Se não for um número válido
  if (isNaN(numero)) {
    return null;
  }

  // Normaliza valores entre > 10 e <= 100 dividindo por 10
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  // Valida se está dentro da escala de 0 a 10
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  return null; // Fora da regra é inválido
}

// Função para formatar exibição das notas no HTML
function formatarExibicaoNota(notaNormalizada) {
  if (notaNormalizada === null) {
    return "—";
  }
  return notaNormalizada.toFixed(1).replace(".", ",");
}

// Função principal que constrói a tabela e atualiza os cards
function processarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let quantDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let bomDesempenhoCount = 0;
  let atencaoCount = 0;

  dadosBrutos.forEach((item) => {
    // Normalização das notas
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Cálculo da média ignorando notas ausentes/nulas
    const notasValidas = [n1, n2, n3].filter((n) => n !== null);
    
    let media = null;
    let situacaoTexto = "Nota ainda não disponível";
    let situacaoClasse = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;

      somaMediasGerais += media;
      quantDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        situacaoClasse = "situacao-bom";
        bomDesempenhoCount++;
      } else {
        situacaoTexto = "Atenção";
        situacaoClasse = "situacao-atencao";
        atencaoCount++;
      }
    }

    // Soma total das faltas da disciplina
    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Criar a linha na tabela HTML (DOM)
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarExibicaoNota(n1)}</td>
      <td>${formatarExibicaoNota(n2)}</td>
      <td>${formatarExibicaoNota(n3)}</td>
      <td><strong>${media !== null ? formatarExibicaoNota(media) : "—"}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td><span class="${situacaoClasse}">${situacaoTexto}</span></td>
    `;
    tabelaCorpo.appendChild(tr);
  });

  // Atualiza os Cards do Resumo no topo da página
  const mediaGeralFinal = quantDisciplinasComMedia > 0 
    ? (somaMediasGerais / quantDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("card-media-geral").textContent = mediaGeralFinal;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = bomDesempenhoCount;
  document.getElementById("card-atencao").textContent = atencaoCount;
  document.getElementById("card-frequencia").textContent = FREQUENCIA_DEMONSTRATIVA;
}

// Executa o processamento assim que a página carrega
document.addEventListener("DOMContentLoaded", processarBoletim);