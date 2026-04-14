// ─── Mock data based on real eControle models ───

export interface Company {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  municipio: string;
  uf: string;
  is_active: boolean;
  profile: {
    porte: string;
    status_empresa: string;
    inscricao_municipal: string;
    situacao: string;
    proprietario_principal: string;
    telefone: string;
    email: string;
    responsavel_fiscal: string;
    risco_consolidado: string;
    score_urgencia: number;
    cnaes_principal: { code: string; description: string }[];
  };
}

export interface Licence {
  id: string;
  company_id: string;
  company_name: string;
  municipio: string;
  alvara_vig_sanitaria: string;
  alvara_vig_sanitaria_valid_until: string | null;
  cercon: string;
  cercon_valid_until: string | null;
  alvara_funcionamento: string;
  alvara_funcionamento_valid_until: string | null;
  licenca_ambiental: string;
  licenca_ambiental_valid_until: string | null;
  certidao_uso_solo: string;
  certidao_uso_solo_valid_until: string | null;
}

export interface Tax {
  id: string;
  company_id: string;
  company_name: string;
  data_envio: string;
  status_taxas: string;
  taxa_funcionamento: string;
  taxa_publicidade: string;
  taxa_vig_sanitaria: string;
  taxa_bombeiros: string;
  tpi: string;
  vencimento_tpi: string;
  taxa_localiz_instalacao: string;
  taxa_ocup_area_publica: string;
}

export interface Process {
  id: string;
  company_id: string;
  company_name: string;
  process_type: string;
  protocolo: string;
  municipio: string;
  orgao: string;
  operacao: string;
  data_solicitacao: string;
  situacao: string;
  obs: string;
}

export interface Certificate {
  id: string;
  company_id: string;
  company_name: string;
  name: string;
  cn: string;
  issuer_cn: string;
  document_type: string;
  document_masked: string;
  not_before: string;
  not_after: string;
  parse_ok: boolean;
}

// ─── Companies ───
export const companies: Company[] = [
  {
    id: "c1",
    cnpj: "12.345.678/0001-90",
    razao_social: "GH Sistemas e Tecnologia Ltda",
    nome_fantasia: "GH Sistemas",
    municipio: "Anápolis",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Pequeno",
      status_empresa: "Ativa",
      inscricao_municipal: "123456",
      situacao: "Regular",
      proprietario_principal: "Gustavo Henrique Silva",
      telefone: "(62) 3333-4444",
      email: "contato@ghsistemas.com.br",
      responsavel_fiscal: "Maria Fernanda Costa",
      risco_consolidado: "Médio",
      score_urgencia: 86,
      cnaes_principal: [{ code: "62.01-5-01", description: "Desenvolvimento de programas de computador sob encomenda" }],
    },
  },
  {
    id: "c2",
    cnpj: "23.456.789/0001-01",
    razao_social: "Clínica Santa Helena Saúde Ltda",
    nome_fantasia: "Clínica Santa Helena",
    municipio: "Anápolis",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Médio",
      status_empresa: "Ativa",
      inscricao_municipal: "234567",
      situacao: "Regular",
      proprietario_principal: "Dr. Roberto Almeida",
      telefone: "(62) 3555-6666",
      email: "adm@clinicasantahelena.com.br",
      responsavel_fiscal: "Ana Paula Ribeiro",
      risco_consolidado: "Alto",
      score_urgencia: 94,
      cnaes_principal: [{ code: "86.30-5-03", description: "Atividade médica ambulatorial restrita a consultas" }],
    },
  },
  {
    id: "c3",
    cnpj: "34.567.890/0001-12",
    razao_social: "Mercado Vitória Comércio de Alimentos Ltda",
    nome_fantasia: "Mercado Vitória",
    municipio: "Goiânia",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Médio",
      status_empresa: "Ativa",
      inscricao_municipal: "345678",
      situacao: "Regular",
      proprietario_principal: "José Carlos Mendes",
      telefone: "(62) 3777-8888",
      email: "financeiro@mercadovitoria.com.br",
      responsavel_fiscal: "Luciana Ferreira",
      risco_consolidado: "Alto",
      score_urgencia: 88,
      cnaes_principal: [{ code: "47.11-3-02", description: "Comércio varejista de mercadorias em geral" }],
    },
  },
  {
    id: "c4",
    cnpj: "45.678.901/0001-23",
    razao_social: "Construtora Araguaia Engenharia Ltda",
    nome_fantasia: "Construtora Araguaia",
    municipio: "Anápolis",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Grande",
      status_empresa: "Ativa",
      inscricao_municipal: "456789",
      situacao: "Regular",
      proprietario_principal: "Marcos Antônio Pereira",
      telefone: "(62) 3999-0000",
      email: "obras@araguaia.eng.br",
      responsavel_fiscal: "Patrícia Gomes",
      risco_consolidado: "Médio",
      score_urgencia: 79,
      cnaes_principal: [{ code: "41.20-4-00", description: "Construção de edifícios" }],
    },
  },
  {
    id: "c5",
    cnpj: "56.789.012/0001-34",
    razao_social: "Auto Peças Primavera Comércio Ltda",
    nome_fantasia: "Auto Peças Primavera",
    municipio: "Aparecida de Goiânia",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Pequeno",
      status_empresa: "Ativa",
      inscricao_municipal: "567890",
      situacao: "Regular",
      proprietario_principal: "Fernando Oliveira",
      telefone: "(62) 3111-2222",
      email: "vendas@autoprimavera.com.br",
      responsavel_fiscal: "Carla Souza",
      risco_consolidado: "Alto",
      score_urgencia: 98,
      cnaes_principal: [{ code: "45.30-7-03", description: "Comércio a varejo de peças e acessórios novos para veículos" }],
    },
  },
  {
    id: "c6",
    cnpj: "67.890.123/0001-45",
    razao_social: "Padaria Pão Dourado Ltda",
    nome_fantasia: "Padaria Pão Dourado",
    municipio: "Anápolis",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Micro",
      status_empresa: "Ativa",
      inscricao_municipal: "678901",
      situacao: "Regular",
      proprietario_principal: "Maria das Graças Lima",
      telefone: "(62) 3222-3333",
      email: "contato@paodourado.com.br",
      responsavel_fiscal: "João Pedro Lima",
      risco_consolidado: "Baixo",
      score_urgencia: 32,
      cnaes_principal: [{ code: "10.91-1-01", description: "Fabricação de produtos de panificação industrial" }],
    },
  },
  {
    id: "c7",
    cnpj: "78.901.234/0001-56",
    razao_social: "Farmácia Popular Saúde Ltda",
    nome_fantasia: "Farmácia Popular",
    municipio: "Goiânia",
    uf: "GO",
    is_active: false,
    profile: {
      porte: "Pequeno",
      status_empresa: "Inativa",
      inscricao_municipal: "789012",
      situacao: "Baixada",
      proprietario_principal: "Sandra Melo",
      telefone: "(62) 3444-5555",
      email: "adm@farmaciapopular.com.br",
      responsavel_fiscal: "Ricardo Melo",
      risco_consolidado: "Baixo",
      score_urgencia: 15,
      cnaes_principal: [{ code: "47.71-7-01", description: "Comércio varejista de produtos farmacêuticos" }],
    },
  },
  {
    id: "c8",
    cnpj: "89.012.345/0001-67",
    razao_social: "Escola Futuro Brilhante Ltda",
    nome_fantasia: "Escola Futuro Brilhante",
    municipio: "Aparecida de Goiânia",
    uf: "GO",
    is_active: true,
    profile: {
      porte: "Médio",
      status_empresa: "Ativa",
      inscricao_municipal: "890123",
      situacao: "Regular",
      proprietario_principal: "Cláudia Batista",
      telefone: "(62) 3666-7777",
      email: "secretaria@futurobrilhante.edu.br",
      responsavel_fiscal: "Eduardo Batista",
      risco_consolidado: "Médio",
      score_urgencia: 55,
      cnaes_principal: [{ code: "85.13-9-00", description: "Ensino fundamental" }],
    },
  },
];

// ─── Licences ───
export const licences: Licence[] = [
  {
    id: "l1", company_id: "c1", company_name: "GH Sistemas", municipio: "Anápolis",
    alvara_vig_sanitaria: "Não exigido", alvara_vig_sanitaria_valid_until: null,
    cercon: "Válido", cercon_valid_until: "2026-11-15",
    alvara_funcionamento: "Válido", alvara_funcionamento_valid_until: "2026-12-31",
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Válido", certidao_uso_solo_valid_until: "2027-03-20",
  },
  {
    id: "l2", company_id: "c2", company_name: "Clínica Santa Helena", municipio: "Anápolis",
    alvara_vig_sanitaria: "Vencido", alvara_vig_sanitaria_valid_until: "2026-02-10",
    cercon: "Em andamento", cercon_valid_until: null,
    alvara_funcionamento: "Pendente", alvara_funcionamento_valid_until: null,
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Válido", certidao_uso_solo_valid_until: "2027-01-15",
  },
  {
    id: "l3", company_id: "c3", company_name: "Mercado Vitória", municipio: "Goiânia",
    alvara_vig_sanitaria: "Válido", alvara_vig_sanitaria_valid_until: "2026-09-30",
    cercon: "Não exigido", cercon_valid_until: null,
    alvara_funcionamento: "Válido", alvara_funcionamento_valid_until: "2026-12-31",
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Pendente", certidao_uso_solo_valid_until: null,
  },
  {
    id: "l4", company_id: "c4", company_name: "Construtora Araguaia", municipio: "Anápolis",
    alvara_vig_sanitaria: "Não exigido", alvara_vig_sanitaria_valid_until: null,
    cercon: "Válido", cercon_valid_until: "2026-08-20",
    alvara_funcionamento: "Vencendo", alvara_funcionamento_valid_until: "2026-04-25",
    licenca_ambiental: "Válido", licenca_ambiental_valid_until: "2027-06-10",
    certidao_uso_solo: "Pendente", certidao_uso_solo_valid_until: null,
  },
  {
    id: "l5", company_id: "c5", company_name: "Auto Peças Primavera", municipio: "Aparecida de Goiânia",
    alvara_vig_sanitaria: "Vencido", alvara_vig_sanitaria_valid_until: "2026-01-05",
    cercon: "Não exigido", cercon_valid_until: null,
    alvara_funcionamento: "Válido", alvara_funcionamento_valid_until: "2026-12-31",
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Válido", certidao_uso_solo_valid_until: "2027-02-28",
  },
  {
    id: "l6", company_id: "c6", company_name: "Padaria Pão Dourado", municipio: "Anápolis",
    alvara_vig_sanitaria: "Válido", alvara_vig_sanitaria_valid_until: "2027-03-15",
    cercon: "Não exigido", cercon_valid_until: null,
    alvara_funcionamento: "Válido", alvara_funcionamento_valid_until: "2026-12-31",
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Válido", certidao_uso_solo_valid_until: "2027-05-10",
  },
  {
    id: "l7", company_id: "c8", company_name: "Escola Futuro Brilhante", municipio: "Aparecida de Goiânia",
    alvara_vig_sanitaria: "Não exigido", alvara_vig_sanitaria_valid_until: null,
    cercon: "Válido", cercon_valid_until: "2026-10-30",
    alvara_funcionamento: "Válido", alvara_funcionamento_valid_until: "2026-12-31",
    licenca_ambiental: "Não exigido", licenca_ambiental_valid_until: null,
    certidao_uso_solo: "Válido", certidao_uso_solo_valid_until: "2027-04-20",
  },
];

// ─── Taxes ───
export const taxes: Tax[] = [
  {
    id: "t1", company_id: "c1", company_name: "GH Sistemas", data_envio: "2026-03-15", status_taxas: "Em dia",
    taxa_funcionamento: "Pago", taxa_publicidade: "Não exigido", taxa_vig_sanitaria: "Não exigido",
    taxa_bombeiros: "Em aberto", tpi: "Pendente envio", vencimento_tpi: "2026-05-30",
    taxa_localiz_instalacao: "Pago", taxa_ocup_area_publica: "Não exigido",
  },
  {
    id: "t2", company_id: "c2", company_name: "Clínica Santa Helena", data_envio: "2026-02-20", status_taxas: "Pendente",
    taxa_funcionamento: "Pendente", taxa_publicidade: "Não exigido", taxa_vig_sanitaria: "Vencido",
    taxa_bombeiros: "Pago", tpi: "Pago", vencimento_tpi: "2026-04-15",
    taxa_localiz_instalacao: "Pago", taxa_ocup_area_publica: "Não exigido",
  },
  {
    id: "t3", company_id: "c3", company_name: "Mercado Vitória", data_envio: "2026-03-01", status_taxas: "Irregular",
    taxa_funcionamento: "Pago", taxa_publicidade: "Pendente", taxa_vig_sanitaria: "Pago",
    taxa_bombeiros: "Vencendo", tpi: "Em aberto", vencimento_tpi: "2026-04-20",
    taxa_localiz_instalacao: "Não exigido", taxa_ocup_area_publica: "Não exigido",
  },
  {
    id: "t4", company_id: "c4", company_name: "Construtora Araguaia", data_envio: "2026-01-10", status_taxas: "Irregular",
    taxa_funcionamento: "Em aberto", taxa_publicidade: "Não exigido", taxa_vig_sanitaria: "Não exigido",
    taxa_bombeiros: "Pago", tpi: "Pago", vencimento_tpi: "2026-06-30",
    taxa_localiz_instalacao: "Pendente", taxa_ocup_area_publica: "Pendente",
  },
  {
    id: "t5", company_id: "c5", company_name: "Auto Peças Primavera", data_envio: "2026-03-20", status_taxas: "Pendente",
    taxa_funcionamento: "Pago", taxa_publicidade: "Não exigido", taxa_vig_sanitaria: "Vencido",
    taxa_bombeiros: "Não exigido", tpi: "Pendente envio", vencimento_tpi: "2026-05-15",
    taxa_localiz_instalacao: "Pago", taxa_ocup_area_publica: "Não exigido",
  },
  {
    id: "t6", company_id: "c6", company_name: "Padaria Pão Dourado", data_envio: "2026-03-25", status_taxas: "Em dia",
    taxa_funcionamento: "Pago", taxa_publicidade: "Pago", taxa_vig_sanitaria: "Pago",
    taxa_bombeiros: "Não exigido", tpi: "Pago", vencimento_tpi: "2026-12-31",
    taxa_localiz_instalacao: "Pago", taxa_ocup_area_publica: "Não exigido",
  },
  {
    id: "t7", company_id: "c8", company_name: "Escola Futuro Brilhante", data_envio: "2026-02-28", status_taxas: "Pendente",
    taxa_funcionamento: "Pago", taxa_publicidade: "Não exigido", taxa_vig_sanitaria: "Não exigido",
    taxa_bombeiros: "Pendente", tpi: "Pago", vencimento_tpi: "2026-09-30",
    taxa_localiz_instalacao: "Pago", taxa_ocup_area_publica: "Não exigido",
  },
];

// ─── Processes ───
export const processes: Process[] = [
  {
    id: "p1", company_id: "c2", company_name: "Clínica Santa Helena",
    process_type: "CERCON", protocolo: "CERC-2026-001234", municipio: "Anápolis",
    orgao: "Prefeitura de Anápolis", operacao: "Renovação", data_solicitacao: "2026-02-15",
    situacao: "Pendente", obs: "Protocolo pendente de documentação complementar",
  },
  {
    id: "p2", company_id: "c3", company_name: "Mercado Vitória",
    process_type: "Funcionamento", protocolo: "FUNC-2026-005678", municipio: "Goiânia",
    orgao: "Prefeitura de Goiânia", operacao: "Renovação", data_solicitacao: "2026-03-01",
    situacao: "Em análise", obs: "Documentação completa, aguardando vistoria",
  },
  {
    id: "p3", company_id: "c4", company_name: "Construtora Araguaia",
    process_type: "Uso do Solo", protocolo: "SOLO-2026-003456", municipio: "Anápolis",
    orgao: "Prefeitura de Anápolis", operacao: "Nova solicitação", data_solicitacao: "2026-01-20",
    situacao: "Aguardando pagamento", obs: "Taxa emitida, aguardando comprovante",
  },
  {
    id: "p4", company_id: "c5", company_name: "Auto Peças Primavera",
    process_type: "Vigilância Sanitária", protocolo: "VISA-2026-007890", municipio: "Aparecida de Goiânia",
    orgao: "Vigilância Sanitária Municipal", operacao: "Renovação de alvará", data_solicitacao: "2026-02-28",
    situacao: "Em análise", obs: "Aguardando resultado de vistoria in loco",
  },
  {
    id: "p5", company_id: "c1", company_name: "GH Sistemas",
    process_type: "Bombeiros", protocolo: "BOMB-2026-002345", municipio: "Anápolis",
    orgao: "Corpo de Bombeiros GO", operacao: "Validação AVCB", data_solicitacao: "2026-03-10",
    situacao: "Em andamento", obs: "Laudo técnico em validação pelo corpo de bombeiros",
  },
  {
    id: "p6", company_id: "c3", company_name: "Mercado Vitória",
    process_type: "Funcionamento", protocolo: "FUNC-2026-009012", municipio: "Goiânia",
    orgao: "Prefeitura de Goiânia", operacao: "Deferimento", data_solicitacao: "2025-12-15",
    situacao: "Deferido", obs: "Pronto para fechamento e emissão do alvará",
  },
  {
    id: "p7", company_id: "c8", company_name: "Escola Futuro Brilhante",
    process_type: "CERCON", protocolo: "CERC-2026-004567", municipio: "Aparecida de Goiânia",
    orgao: "Prefeitura de Aparecida", operacao: "Renovação", data_solicitacao: "2026-03-05",
    situacao: "Em análise", obs: "Documentação entregue, aguardando parecer técnico",
  },
  {
    id: "p8", company_id: "c6", company_name: "Padaria Pão Dourado",
    process_type: "Vigilância Sanitária", protocolo: "VISA-2026-006789", municipio: "Anápolis",
    orgao: "Vigilância Sanitária Municipal", operacao: "Renovação de alvará", data_solicitacao: "2026-01-10",
    situacao: "Deferido", obs: "Alvará renovado com sucesso",
  },
];

// ─── Certificates ───
export const certificates: Certificate[] = [
  {
    id: "cert1", company_id: "c1", company_name: "GH Sistemas",
    name: "GH SISTEMAS E TECNOLOGIA LTDA:12345678000190", cn: "GH SISTEMAS E TECNOLOGIA LTDA:12345678000190",
    issuer_cn: "AC SOLUTI Múltipla v5", document_type: "CNPJ", document_masked: "12.345.678/0001-90",
    not_before: "2025-06-15", not_after: "2026-06-15", parse_ok: true,
  },
  {
    id: "cert2", company_id: "c2", company_name: "Clínica Santa Helena",
    name: "CLINICA SANTA HELENA SAUDE LTDA:23456789000101", cn: "CLINICA SANTA HELENA SAUDE LTDA:23456789000101",
    issuer_cn: "AC SERASA RFB v5", document_type: "CNPJ", document_masked: "23.456.789/0001-01",
    not_before: "2025-04-01", not_after: "2026-04-01", parse_ok: true,
  },
  {
    id: "cert3", company_id: "c3", company_name: "Mercado Vitória",
    name: "MERCADO VITORIA COMERCIO DE ALIMENTOS LTDA:34567890000112", cn: "MERCADO VITORIA COMERCIO DE ALIMENTOS LTDA:34567890000112",
    issuer_cn: "AC VALID RFB v5", document_type: "CNPJ", document_masked: "34.567.890/0001-12",
    not_before: "2025-09-20", not_after: "2026-09-20", parse_ok: true,
  },
  {
    id: "cert4", company_id: "c4", company_name: "Construtora Araguaia",
    name: "CONSTRUTORA ARAGUAIA ENGENHARIA LTDA:45678901000123", cn: "CONSTRUTORA ARAGUAIA ENGENHARIA LTDA:45678901000123",
    issuer_cn: "AC SOLUTI Múltipla v5", document_type: "CNPJ", document_masked: "45.678.901/0001-23",
    not_before: "2025-01-10", not_after: "2026-01-10", parse_ok: true,
  },
  {
    id: "cert5", company_id: "c5", company_name: "Auto Peças Primavera",
    name: "AUTO PECAS PRIMAVERA COMERCIO LTDA:56789012000134", cn: "AUTO PECAS PRIMAVERA COMERCIO LTDA:56789012000134",
    issuer_cn: "AC CERTISIGN RFB G5", document_type: "CNPJ", document_masked: "56.789.012/0001-34",
    not_before: "2025-11-01", not_after: "2026-11-01", parse_ok: true,
  },
  {
    id: "cert6", company_id: "c6", company_name: "Padaria Pão Dourado",
    name: "PADARIA PAO DOURADO LTDA:67890123000145", cn: "PADARIA PAO DOURADO LTDA:67890123000145",
    issuer_cn: "AC SOLUTI Múltipla v5", document_type: "CNPJ", document_masked: "67.890.123/0001-45",
    not_before: "2026-01-20", not_after: "2027-01-20", parse_ok: true,
  },
  {
    id: "cert7", company_id: "c8", company_name: "Escola Futuro Brilhante",
    name: "ESCOLA FUTURO BRILHANTE LTDA:89012345000167", cn: "ESCOLA FUTURO BRILHANTE LTDA:89012345000167",
    issuer_cn: "AC VALID RFB v5", document_type: "CNPJ", document_masked: "89.012.345/0001-67",
    not_before: "2025-08-10", not_after: "2026-08-10", parse_ok: true,
  },
];

// ─── Helpers ───
export function getLicenceStatus(value: string): "ok" | "warn" | "danger" | "neutral" {
  if (value === "Válido" || value === "Pago") return "ok";
  if (value === "Vencendo" || value === "Pendente" || value === "Em andamento" || value === "Pendente envio") return "warn";
  if (value === "Vencido" || value === "Em aberto") return "danger";
  return "neutral";
}

export function getCertStatus(notAfter: string): { label: string; status: "ok" | "warn" | "danger" } {
  const now = new Date();
  const expiry = new Date(notAfter);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: `Vencido há ${Math.abs(diffDays)}d`, status: "danger" };
  if (diffDays <= 30) return { label: `Vence em ${diffDays}d`, status: "warn" };
  return { label: "Válido", status: "ok" };
}
