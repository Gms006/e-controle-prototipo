import { useState } from "react";
import {
  X,
  FolderOpen,
  Pencil,
  RefreshCw,
  Search,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Receipt,
  FolderKanban,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Building2,
  KeyRound,
  FileText,
  CalendarClock,
} from "lucide-react";
import { companies, licences, taxes, processes, certificates, getLicenceStatus, getCertStatus } from "@/data/mockData";

type ModalTab = "overview" | "cadastro" | "taxas" | "licencas" | "processos" | "timeline";

interface CompanyModalProps {
  companyId: string;
  onClose: () => void;
}

const MODAL_TABS: { id: ModalTab; label: string }[] = [
  { id: "overview", label: "Visão geral" },
  { id: "cadastro", label: "Cadastro" },
  { id: "taxas", label: "Taxas" },
  { id: "licencas", label: "Licenças" },
  { id: "processos", label: "Processos" },
  { id: "timeline", label: "Timeline" },
];

function StatusBadge({ value, cls }: { value: string; cls: string }) {
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

export default function CompanyModal({ companyId, onClose }: CompanyModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [search, setSearch] = useState("");

  const company = companies.find(c => c.id === companyId);
  if (!company) return null;

  const compLicences = licences.filter(l => l.company_name === company.nome_fantasia);
  const compTaxes = taxes.filter(t => t.company_name === company.nome_fantasia);
  const compProcesses = processes.filter(p => p.company_name === company.nome_fantasia);
  const compCerts = certificates.filter(c => c.company_name === company.nome_fantasia);

  const riskCls =
    company.profile.risco_consolidado === "Alto" ? "ec-s-danger" :
    company.profile.risco_consolidado === "Médio" ? "ec-s-warn" : "ec-s-ok";

  const scoreCls =
    company.profile.score_urgencia >= 70 ? "ec-s-danger" :
    company.profile.score_urgencia >= 40 ? "ec-s-warn" : "ec-s-ok";

  const certStatus = compCerts.length > 0 ? getCertStatus(compCerts[0].not_after) : null;

  const taxasPendentes = compTaxes.filter(t => t.status_taxas !== "Em dia").length;
  const licencasCriticas = compLicences.filter(l =>
    [l.alvara_funcionamento, l.alvara_vig_sanitaria, l.cercon, l.licenca_ambiental, l.certidao_uso_solo]
      .some(v => v === "Vencido" || v === "Vencendo")
  ).length;
  const processosAbertos = compProcesses.filter(p => p.situacao !== "Deferido").length;
  const temAlertas = taxasPendentes > 0 || licencasCriticas > 0;

  // Timeline events (mock derived from data)
  const timelineEvents = [
    ...compProcesses.map(p => ({
      date: p.data_solicitacao,
      type: "processo" as const,
      title: p.process_type,
      desc: `Protocolo ${p.protocolo} — ${p.situacao}`,
    })),
    ...compCerts.map(c => ({
      date: c.not_before,
      type: "certificado" as const,
      title: "Certificado digital emitido",
      desc: `${c.issuer_cn} · válido até ${c.not_after}`,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="ec-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ec-modal">
        {/* ── Sidebar ── */}
        <aside className="ec-modal-sidebar">
          {/* Company identity */}
          <div className="ec-modal-company-id">
            <div className="ec-modal-company-avatar">
              {company.nome_fantasia.split(" ").filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join("").toUpperCase()}
            </div>
            <div className="ec-modal-company-name">
              <h3>{company.nome_fantasia}</h3>
              <span>{company.razao_social}</span>
            </div>
            <div className="ec-modal-company-badges">
              <span className={`ec-status ${company.is_active ? "ec-s-ok" : "ec-s-neutral"}`}>
                {company.is_active ? "Ativa" : "Inativa"}
              </span>
              <span className={`ec-status ${riskCls}`}>Risco: {company.profile.risco_consolidado}</span>
              <span className={`ec-status ${scoreCls}`}>Score: {company.profile.score_urgencia}</span>
            </div>
          </div>

          {/* Quick info */}
          <div className="ec-modal-info-section">
            <div className="ec-modal-info-row">
              <label>CNPJ</label>
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>{company.cnpj}</span>
            </div>
            <div className="ec-modal-info-row">
              <label>Certificado digital</label>
              {certStatus ? (
                <span className={`ec-status ${certStatus.status === "ok" ? "ec-s-ok" : certStatus.status === "warn" ? "ec-s-warn" : "ec-s-danger"}`}>
                  {certStatus.label}
                </span>
              ) : (
                <span className="ec-status ec-s-neutral">Sem certificado</span>
              )}
            </div>
          </div>

          {/* KPI grid */}
          <div className="ec-modal-kpi-grid">
            <div className={`ec-modal-kpi ${taxasPendentes > 0 ? "ec-modal-kpi-warn" : ""}`}>
              <div className="ec-modal-kpi-icon"><Receipt size={15} strokeWidth={1.6} /></div>
              <div>
                <label>Taxas pendentes</label>
                <div className="ec-modal-kpi-value">{taxasPendentes}</div>
                {taxasPendentes > 0 && <small>Exigem ação</small>}
              </div>
            </div>
            <div className={`ec-modal-kpi ${licencasCriticas > 0 ? "ec-modal-kpi-danger" : ""}`}>
              <div className="ec-modal-kpi-icon"><ShieldAlert size={15} strokeWidth={1.6} /></div>
              <div>
                <label>Licenças críticas</label>
                <div className="ec-modal-kpi-value">{licencasCriticas}</div>
                {licencasCriticas > 0 && <small>Risco alto</small>}
              </div>
            </div>
            <div className={`ec-modal-kpi ${processosAbertos > 0 ? "ec-modal-kpi-blue" : ""}`}>
              <div className="ec-modal-kpi-icon"><FolderKanban size={15} strokeWidth={1.6} /></div>
              <div>
                <label>Processos em aberto</label>
                <div className="ec-modal-kpi-value">{processosAbertos}</div>
                {processosAbertos > 0 && <small>Acompanhamento</small>}
              </div>
            </div>
            <div className={`ec-modal-kpi ${temAlertas ? "ec-modal-kpi-neutral" : ""}`}>
              <div className="ec-modal-kpi-icon"><Bell size={15} strokeWidth={1.6} /></div>
              <div>
                <label>Alertas ativos</label>
                <div className="ec-modal-kpi-value">{temAlertas ? "Sim" : "Não"}</div>
                <small>{temAlertas ? "Monitoramento" : "Tudo ok"}</small>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="ec-modal-contact">
            <label className="ec-modal-section-label">Contato principal</label>
            <div className="ec-modal-contact-row"><Phone size={12} strokeWidth={1.6} />{company.profile.telefone}</div>
            <div className="ec-modal-contact-row"><Mail size={12} strokeWidth={1.6} />{company.profile.email}</div>
            <div className="ec-modal-contact-row"><MapPin size={12} strokeWidth={1.6} />{company.municipio} / GO</div>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="ec-modal-main">
          {/* Header */}
          <div className="ec-modal-header">
            <div className="ec-modal-breadcrumb">
              <span>Empresas</span><ChevronRight size={12} /><span>{company.nome_fantasia}</span><ChevronRight size={12} /><span>Abrir</span>
            </div>
            <div className="ec-modal-title-row">
              <div>
                <h2>Central da empresa</h2>
                <p>Acompanhe cadastro, taxas, licenças e processos em um único painel.</p>
              </div>
              <button className="ec-modal-close" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="ec-modal-toolbar">
              <div className="ec-modal-search">
                <Search size={14} strokeWidth={1.6} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Pesquisar taxa, licença ou processo…"
                />
              </div>
              <div className="ec-modal-actions">
                <button className="ec-btn-ghost"><FolderOpen size={14} strokeWidth={1.6} />Abrir Pasta</button>
                <button className="ec-btn-primary"><Pencil size={14} strokeWidth={1.6} />Editar</button>
                <button className="ec-btn-ghost"><RefreshCw size={14} strokeWidth={1.6} />Atualizar</button>
              </div>
            </div>
            <div className="ec-modal-tabs">
              {MODAL_TABS.map(t => (
                <button
                  key={t.id}
                  className={`ec-modal-tab ${activeTab === t.id ? "active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="ec-modal-body">
            {activeTab === "overview" && (
              <OverviewTab company={company} compLicences={compLicences} taxasPendentes={taxasPendentes} licencasCriticas={licencasCriticas} processosAbertos={processosAbertos} temAlertas={temAlertas} certStatus={certStatus} />
            )}
            {activeTab === "cadastro" && <CadastroTab company={company} />}
            {activeTab === "taxas" && <TaxasTabModal compTaxes={compTaxes} />}
            {activeTab === "licencas" && <LicencasTabModal compLicences={compLicences} />}
            {activeTab === "processos" && <ProcessosTabModal compProcesses={compProcesses} />}
            {activeTab === "timeline" && <TimelineTab events={timelineEvents} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ company, compLicences, taxasPendentes, licencasCriticas, processosAbertos, temAlertas, certStatus }: any) {
  const upcomingLicences = [
    ...compLicences.flatMap((l: any) => {
      const items = [];
      if (l.alvara_funcionamento_valid_until) items.push({ name: "Alvará Funcionamento", date: l.alvara_funcionamento_valid_until, status: l.alvara_funcionamento });
      if (l.alvara_vig_sanitaria_valid_until) items.push({ name: "Vig. Sanitária", date: l.alvara_vig_sanitaria_valid_until, status: l.alvara_vig_sanitaria });
      if (l.cercon_valid_until) items.push({ name: "CERCON", date: l.cercon_valid_until, status: l.cercon });
      if (l.licenca_ambiental_valid_until) items.push({ name: "Licença Ambiental", date: l.licenca_ambiental_valid_until, status: l.licenca_ambiental });
      if (l.certidao_uso_solo_valid_until) items.push({ name: "Certidão Uso do Solo", date: l.certidao_uso_solo_valid_until, status: l.certidao_uso_solo });
      return items;
    }),
  ].sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <div className="ec-modal-overview">
      <div className="ec-modal-overview-kpis">
        {[
          { label: "Taxas pendentes", value: taxasPendentes, icon: <Receipt size={18} strokeWidth={1.6} />, cls: taxasPendentes > 0 ? "warn" : "ok" },
          { label: "Licenças críticas", value: licencasCriticas, icon: <ShieldAlert size={18} strokeWidth={1.6} />, cls: licencasCriticas > 0 ? "danger" : "ok" },
          { label: "Processos em aberto", value: processosAbertos, icon: <FolderKanban size={18} strokeWidth={1.6} />, cls: processosAbertos > 0 ? "neutral" : "ok" },
          { label: "Alertas ativos", value: temAlertas ? "Sim" : "Não", icon: <Bell size={18} strokeWidth={1.6} />, cls: temAlertas ? "warn" : "ok" },
        ].map((k, i) => (
          <div key={i} className={`ec-modal-overview-kpi ec-modal-overview-kpi-${k.cls}`}>
            <div className="ec-modal-overview-kpi-icon">{k.icon}</div>
            <div>
              <label>{k.label}</label>
              <div className="ec-modal-overview-kpi-value">{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ec-modal-overview-grid">
        <div className="ec-modal-section-card">
          <div className="ec-modal-section-card-head">
            <FileText size={14} strokeWidth={1.6} />
            <h4>Resumo executivo</h4>
          </div>
          <div className="ec-modal-exec-rows">
            <div className="ec-modal-exec-row">
              <span>Score de urgência</span>
              <strong>{company.profile.score_urgencia}</strong>
            </div>
            <div className="ec-modal-exec-row">
              <span>Status de risco</span>
              <strong>{company.profile.risco_consolidado.toUpperCase()}</strong>
            </div>
            <div className="ec-modal-exec-row">
              <span>Certificado digital</span>
              <strong>{certStatus ? certStatus.label.toUpperCase() : "SEM CERTIFICADO"}</strong>
            </div>
            <div className="ec-modal-exec-row">
              <span>Porte</span>
              <strong>{company.profile.porte}</strong>
            </div>
            <div className="ec-modal-exec-row">
              <span>Responsável fiscal</span>
              <strong>{company.profile.responsavel_fiscal}</strong>
            </div>
          </div>
        </div>

        <div className="ec-modal-section-card">
          <div className="ec-modal-section-card-head">
            <CalendarClock size={14} strokeWidth={1.6} />
            <h4>Próximos vencimentos</h4>
          </div>
          {upcomingLicences.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13, padding: "12px 0" }}>Sem vencimentos cadastrados.</div>
          ) : (
            <div className="ec-modal-upcoming">
              {upcomingLicences.map((item: any, i: number) => {
                const s = getLicenceStatus(item.status);
                const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : "ec-s-danger";
                return (
                  <div key={i} className="ec-modal-upcoming-row">
                    <div>
                      <div className="ec-modal-upcoming-name">{item.name}</div>
                      <div className="ec-modal-upcoming-sub">{item.status}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={`ec-status ${cls}`}>{item.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Cadastro Tab ─── */
function CadastroTab({ company }: any) {
  return (
    <div className="ec-modal-cadastro">
      <div className="ec-modal-section-card">
        <div className="ec-modal-section-card-head">
          <Building2 size={14} strokeWidth={1.6} />
          <h4>Dados cadastrais</h4>
        </div>
        <div className="ec-modal-field-grid">
          {[
            { label: "Razão social", value: company.razao_social },
            { label: "Nome fantasia", value: company.nome_fantasia },
            { label: "CNPJ", value: company.cnpj, mono: true },
            { label: "IE", value: company.profile.ie || "—" },
            { label: "IM", value: company.profile.im || "—" },
            { label: "CNAE principal", value: company.profile.cnae_principal },
            { label: "Grupo / Segmento", value: company.profile.grupo },
            { label: "Apelido de pasta", value: company.nome_fantasia.toUpperCase() },
          ].map((f, i) => (
            <div key={i} className="ec-modal-field-row">
              <label>{f.label}</label>
              <span style={f.mono ? { fontFamily: "monospace", fontSize: 12 } : {}}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ec-modal-section-card">
        <div className="ec-modal-section-card-head">
          <MapPin size={14} strokeWidth={1.6} />
          <h4>Localização e situação</h4>
        </div>
        <div className="ec-modal-field-grid">
          {[
            { label: "Município", value: company.municipio },
            { label: "UF", value: "GO" },
            { label: "Situação", value: company.profile.situacao_receita || "Regular" },
            { label: "Status score", value: company.profile.score_urgencia >= 70 ? "Crítico" : company.profile.score_urgencia >= 40 ? "Atenção" : "Ok" },
          ].map((f, i) => (
            <div key={i} className="ec-modal-field-row">
              <label>{f.label}</label>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
        <div className="ec-modal-section-card-head" style={{ marginTop: 20 }}>
          <FileText size={14} strokeWidth={1.6} />
          <h4>Atividades</h4>
        </div>
        <div className="ec-modal-field-grid">
          <div className="ec-modal-field-row">
            <label>Principal</label>
            <span>{company.profile.cnae_principal}</span>
          </div>
          {company.profile.cnaes_secundarios?.length > 0 && (
            <div className="ec-modal-field-row">
              <label>Secundárias</label>
              <span style={{ fontSize: 12, lineHeight: 1.6 }}>{company.profile.cnaes_secundarios.join(" | ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Taxas Tab (modal) ─── */
function TaxasTabModal({ compTaxes }: { compTaxes: typeof taxes }) {
  if (compTaxes.length === 0) {
    return <div className="ec-modal-empty"><Receipt size={28} /><p>Nenhuma taxa cadastrada para esta empresa.</p></div>;
  }
  const t = compTaxes[0];

  // Format TPI due date as dd/mm
  const tpiVenc = t.vencimento_tpi
    ? (() => { const d = new Date(t.vencimento_tpi); return isNaN(d.getTime()) ? t.vencimento_tpi : `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`; })()
    : null;

  const rows = [
    { label: "Funcionamento", value: t.taxa_funcionamento, isTpi: false },
    { label: "Publicidade", value: t.taxa_publicidade, isTpi: false },
    { label: "Sanitária", value: t.taxa_vig_sanitaria, isTpi: false },
    { label: "Localização/Instalação", value: t.taxa_localiz_instalacao, isTpi: false },
    { label: "Área Pública", value: t.taxa_ocup_area_publica, isTpi: false },
    { label: "Bombeiros", value: t.taxa_bombeiros, isTpi: false },
    { label: "TPI", value: t.tpi, isTpi: true },
  ];

  return (
    <div className="ec-modal-table-wrap">
      <table className="ec-modal-table">
        <thead>
          <tr>
            <th>Taxa</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const s = getLicenceStatus(r.value);
            const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{r.label}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                    {r.isTpi && tpiVenc && r.value !== 'Isento' && r.value !== 'Não exigido' && (
                      <span className="ec-tax-venc-chip">Venc.: {tpiVenc}</span>
                    )}
                    <span className={`ec-status ${cls}`}>{r.value}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Licenças Tab (modal) ─── */
function LicencasTabModal({ compLicences }: { compLicences: typeof licences }) {
  if (compLicences.length === 0) {
    return <div className="ec-modal-empty"><ShieldAlert size={28} /><p>Nenhuma licença cadastrada para esta empresa.</p></div>;
  }
  const l = compLicences[0];
  const cards = [
    { name: "Certidão de Uso do Solo", status: l.certidao_uso_solo, date: l.certidao_uso_solo_valid_until },
    { name: "Alvará Funcionamento", status: l.alvara_funcionamento, date: l.alvara_funcionamento_valid_until },
    { name: "Licença Ambiental", status: l.licenca_ambiental, date: l.licenca_ambiental_valid_until },
    { name: "CERCON", status: l.cercon, date: l.cercon_valid_until },
    { name: "Alvará Vigilância Sanitária", status: l.alvara_vig_sanitaria, date: l.alvara_vig_sanitaria_valid_until },
  ];

  return (
    <div className="ec-modal-licence-grid">
      {cards.map((c, i) => {
        if (c.status === "Não exigido") return null;
        const s = getLicenceStatus(c.status);
        const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
        const borderCls = s === "ok" ? "ec-licence-card-ok" : s === "warn" ? "ec-licence-card-warn" : s === "danger" ? "ec-licence-card-danger" : "";
        return (
          <div key={i} className={`ec-modal-licence-card ${borderCls}`}>
            <div className="ec-modal-licence-card-head">
              <span className="ec-modal-licence-card-name">{c.name}</span>
              <span className={`ec-status ${cls}`}>{c.status}</span>
            </div>
            <div className="ec-modal-licence-card-meta">
              <span>Origem: dated</span>
              {c.date && <span>Validade: {c.date}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Processos Tab (modal) ─── */
function ProcessosTabModal({ compProcesses }: { compProcesses: typeof processes }) {
  if (compProcesses.length === 0) {
    return <div className="ec-modal-empty"><FolderKanban size={28} /><p>Nenhum processo cadastrado para esta empresa.</p></div>;
  }

  return (
    <div className="ec-modal-process-list">
      {compProcesses.map(p => {
        const cls =
          p.situacao === "Deferido" ? "ec-s-ok" :
          p.situacao === "Em andamento" || p.situacao === "Em análise" ? "ec-s-neutral" :
          "ec-s-warn";
        return (
          <div key={p.id} className="ec-modal-process-row">
            <div className="ec-modal-process-row-main">
              <div>
                <div className="ec-modal-process-type">{p.process_type.toUpperCase()}</div>
                <div className="ec-modal-process-meta">
                  Protocolo: {p.protocolo} · Atualização: {p.data_solicitacao} · Responsável: —
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`ec-status ${cls}`}>{p.situacao}</span>
                <button className="ec-btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>
                  Abrir processo
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Timeline Tab ─── */
function TimelineTab({ events }: { events: { date: string; type: string; title: string; desc: string }[] }) {
  if (events.length === 0) {
    return <div className="ec-modal-empty"><CalendarClock size={28} /><p>Nenhum evento na timeline.</p></div>;
  }

  const iconMap: Record<string, React.ReactNode> = {
    processo: <FolderKanban size={14} strokeWidth={1.6} />,
    certificado: <KeyRound size={14} strokeWidth={1.6} />,
  };

  return (
    <div className="ec-modal-timeline">
      {events.map((e, i) => (
        <div key={i} className="ec-modal-timeline-item">
          <div className="ec-modal-timeline-dot">
            {iconMap[e.type] ?? <Clock size={14} strokeWidth={1.6} />}
          </div>
          <div className="ec-modal-timeline-content">
            <div className="ec-modal-timeline-title">{e.title}</div>
            <div className="ec-modal-timeline-desc">{e.desc}</div>
            <div className="ec-modal-timeline-date">{e.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
