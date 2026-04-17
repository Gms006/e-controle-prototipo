import { useState, useMemo } from "react";
import { processes } from "@/data/mockData";
import {
  FolderKanban, Clock, CheckCircle, FileSearch, SearchX,
  MapPin, Building2, Plus, Settings, AlertTriangle, ArrowUp, ArrowDown, Search, X,
} from "lucide-react";
import NewProcessModal from "@/components/NewProcessModal";

// ─── Tipos de processo disponíveis ──────────────────────────────────────────
const ALL_TYPES = ["Todos", "Alvará Sanitário", "CERCON", "Diversos", "Funcionamento", "Uso do Solo"];

// ─── Fila operacional ────────────────────────────────────────────────────────
type FilaKey = "todos" | "urgentes" | "vencidos" | "vence7d" | "ag_pagamento" | "em_analise" | "sem_protocolo";

const FILA_ITEMS: { key: FilaKey; label: string; urgent?: boolean }[] = [
  { key: "todos", label: "Todos" },
  { key: "urgentes", label: "Urgentes", urgent: true },
  { key: "vencidos", label: "Vencidos / fora do prazo" },
  { key: "vence7d", label: "Vence em até 7 dias" },
  { key: "ag_pagamento", label: "Aguardando pagamento" },
  { key: "em_analise", label: "Em análise" },
  { key: "sem_protocolo", label: "Sem protocolo / dados incompletos" },
];

// ─── Ordenação ───────────────────────────────────────────────────────────────
type SortKey = "urgencia" | "data_solicitacao" | "company_name" | "situacao";

const SORT_KEYS: { key: SortKey; label: string }[] = [
  { key: "urgencia", label: "Urgência" },
  { key: "data_solicitacao", label: "Data solicitação" },
  { key: "company_name", label: "Empresa" },
  { key: "situacao", label: "Situação" },
];

const SITUACAO_ORDER: Record<string, number> = {
  Pendente: 0,
  "Aguardando pagamento": 1,
  "Em análise": 2,
  "Em andamento": 3,
  Deferido: 4,
};

function SituacaoBadge({ value }: { value: string }) {
  const cls =
    value === "Deferido" ? "ec-s-ok" :
    value === "Em andamento" || value === "Em análise" ? "ec-s-neutral" :
    value === "Pendente" || value === "Aguardando pagamento" ? "ec-s-warn" :
    "ec-s-danger";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

function isUrgent(p: typeof processes[0]) {
  return p.situacao === "Pendente" || p.situacao === "Aguardando pagamento" || !p.protocolo;
}

function isVencido(p: typeof processes[0]) {
  // Simulate: processos sem protocolo ou pendentes há muito tempo
  return !p.protocolo || p.situacao === "Pendente";
}

function venceEm7d(p: typeof processes[0]) {
  // Simulate: processos em análise próximos do prazo
  return p.situacao === "Em análise";
}

export default function ProcessosTab() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeType, setActiveType] = useState("Todos");
  const [filaMode, setFilaMode] = useState<"todos" | "urgentes">("todos");
  const [filaFilter, setFilaFilter] = useState<FilaKey>("todos");
  const [sortKey, setSortKey] = useState<SortKey>("urgencia");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [showNewProcess, setShowNewProcess] = useState(false);

  // Count per type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: processes.length };
    processes.forEach(p => {
      counts[p.process_type] = (counts[p.process_type] || 0) + 1;
    });
    return counts;
  }, []);

  // Fila counts (from all processes, not filtered by type)
  const filaCounts = useMemo(() => ({
    todos: processes.length,
    urgentes: processes.filter(isUrgent).length,
    vencidos: processes.filter(isVencido).length,
    vence7d: processes.filter(venceEm7d).length,
    ag_pagamento: processes.filter(p => p.situacao === "Aguardando pagamento").length,
    em_analise: processes.filter(p => p.situacao === "Em análise").length,
    sem_protocolo: processes.filter(p => !p.protocolo).length,
  }), []);

  const filtered = useMemo(() => {
    let list = processes.filter(p => {
      if (activeType !== "Todos" && p.process_type !== activeType) return false;

      if (filaMode === "urgentes") {
        if (filaFilter === "vencidos" && !isVencido(p)) return false;
        if (filaFilter === "vence7d" && !venceEm7d(p)) return false;
        if (filaFilter === "ag_pagamento" && p.situacao !== "Aguardando pagamento") return false;
        if (filaFilter === "em_analise" && p.situacao !== "Em análise") return false;
        if (filaFilter === "sem_protocolo" && p.protocolo) return false;
        if (filaFilter === "urgentes" && !isUrgent(p)) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        if (
          !p.company_name.toLowerCase().includes(q) &&
          !p.protocolo.toLowerCase().includes(q) &&
          !p.process_type.toLowerCase().includes(q) &&
          !p.orgao.toLowerCase().includes(q)
        ) return false;
      }

      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "urgencia") cmp = (SITUACAO_ORDER[a.situacao] ?? 9) - (SITUACAO_ORDER[b.situacao] ?? 9);
      else if (sortKey === "data_solicitacao") cmp = a.data_solicitacao.localeCompare(b.data_solicitacao);
      else if (sortKey === "company_name") cmp = a.company_name.localeCompare(b.company_name);
      else if (sortKey === "situacao") cmp = (SITUACAO_ORDER[a.situacao] ?? 9) - (SITUACAO_ORDER[b.situacao] ?? 9);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [activeType, filaMode, filaFilter, search, sortKey, sortDir]);

  const situacoes = useMemo(() => processes.reduce((acc, p) => {
    acc[p.situacao] = (acc[p.situacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>), []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  return (
    <div className="ec-tab-content">
      {/* KPIs */}
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Total de processos</label><div className="ec-value">{processes.length}</div></div>
            <div className="ec-kpi-icon"><FolderKanban size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Em análise</label><div className="ec-value">{(situacoes["Em análise"] || 0) + (situacoes["Em andamento"] || 0)}</div></div>
            <div className="ec-kpi-icon"><FileSearch size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Pendentes</label><div className="ec-value">{(situacoes["Pendente"] || 0) + (situacoes["Aguardando pagamento"] || 0)}</div><div className="ec-trend warn">Requer ação</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Deferidos</label><div className="ec-value">{situacoes["Deferido"] || 0}</div></div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><CheckCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* ─── Filtros contextuais ─── */}
      <div className="ec-proc-filters">

        {/* Linha 1: Tipos + View toggle + Busca + Novo */}
        <div className="ec-proc-types-row">
          <div className="ec-proc-types">
            {ALL_TYPES.map(t => (
              <button
                key={t}
                className={`ec-proc-type-btn${activeType === t ? " active" : ""}`}
                onClick={() => setActiveType(t)}
              >
                {t !== "Todos" && <Settings size={12} strokeWidth={1.6} />}
                {t !== "Todos" && t !== "Uso do Solo" ? t : t}
                <span className="ec-proc-type-count">{typeCounts[t] ?? 0}</span>
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div className="ec-proc-search">
            <Search size={13} strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar empresa, protocolo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={11} strokeWidth={2.5} /></button>
            )}
          </div>

          {/* View toggle */}
          <div className="ec-view-toggle">
            <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} title="Tabela">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="13" height="2.5" rx="0.5" fill="currentColor"/><rect x="1" y="5.5" width="13" height="2.5" rx="0.5" fill="currentColor"/><rect x="1" y="10" width="13" height="2.5" rx="0.5" fill="currentColor"/></svg>
            </button>
            <button className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")} title="Cards">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg>
            </button>
          </div>

          <button className="ec-btn-primary" onClick={() => setShowNewProcess(true)}>
            <Plus size={14} strokeWidth={1.6} /> Novo Processo
          </button>
        </div>

        {/* Linha 2: Fila operacional */}
        <div className="ec-proc-fila-row">
          <span className="ec-proc-fila-label">FILA OPERACIONAL</span>
          <button
            className={`ec-proc-fila-mode${filaMode === "todos" ? " active" : ""}`}
            onClick={() => { setFilaMode("todos"); setFilaFilter("todos"); }}
          >
            Todos
          </button>
          <button
            className={`ec-proc-fila-mode ec-proc-fila-urgente${filaMode === "urgentes" ? " active" : ""}`}
            onClick={() => { setFilaMode("urgentes"); setFilaFilter("urgentes"); }}
          >
            <AlertTriangle size={12} strokeWidth={2} />
            Urgentes
            <span className="ec-proc-fila-badge">{filaCounts.urgentes}</span>
          </button>
        </div>

        {/* Linha 3: Sub-filtros de urgência (só quando fila = urgentes) */}
        {filaMode === "urgentes" && (
          <div className="ec-proc-subfila-row">
            {FILA_ITEMS.filter(f => f.key !== "todos").map(f => (
              <button
                key={f.key}
                className={`ec-proc-subfila-btn${filaFilter === f.key ? " active" : ""}`}
                onClick={() => setFilaFilter(f.key)}
              >
                {f.label}
                <span className="ec-proc-subfila-count">{filaCounts[f.key]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Linha 4: Ordenar por */}
        <div className="ec-proc-sort-row">
          <span className="ec-proc-sort-label">ORDENAR POR</span>
          {SORT_KEYS.map(s => (
            <button
              key={s.key}
              className={`ec-proc-sort-btn${sortKey === s.key ? " active" : ""}`}
              onClick={() => toggleSort(s.key)}
            >
              {s.label}
              {sortKey === s.key && (
                sortDir === "asc"
                  ? <ArrowUp size={11} strokeWidth={2.5} />
                  : <ArrowDown size={11} strokeWidth={2.5} />
              )}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ─── Conteúdo ─── */}
      {filtered.length === 0 ? (
        <div className="ec-card ec-empty-state"><SearchX size={32} /><p>Nenhum processo encontrado.</p></div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-urgency-table">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th><th>Tipo</th><th>Protocolo</th><th>Órgão</th><th>Solicitação</th><th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.company_name}</td>
                    <td>{p.process_type}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.protocolo || <span style={{ color: "#f59e0b", fontSize: 11 }}>Sem protocolo</span>}</td>
                    <td style={{ fontSize: 12 }}>{p.orgao}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.data_solicitacao}</td>
                    <td><SituacaoBadge value={p.situacao} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(p => (
            <div key={p.id} className="ec-process-card">
              <div className="ec-process-card-head">
                <div className="ec-process-card-title">
                  <b>{p.company_name}</b>
                  <span>{p.process_type} · {p.operacao}</span>
                </div>
                <SituacaoBadge value={p.situacao} />
              </div>
              <div className="ec-process-card-meta">
                <div className="ec-process-card-row">
                  <label>Protocolo</label>
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>
                    {p.protocolo || <span style={{ color: "#f59e0b" }}>Sem protocolo</span>}
                  </span>
                </div>
                <div className="ec-process-card-row">
                  <label><Building2 size={11} style={{ display: "inline", marginRight: 3 }} />{p.orgao}</label>
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>{p.data_solicitacao}</span>
                </div>
                <div className="ec-process-card-row">
                  <label><MapPin size={11} style={{ display: "inline", marginRight: 3 }} />Município</label>
                  <span>{p.municipio}</span>
                </div>
              </div>
              {p.obs && <div className="ec-process-card-obs">{p.obs}</div>}
            </div>
          ))}
        </div>
      )}

      {showNewProcess && (
        <NewProcessModal onClose={() => setShowNewProcess(false)} />
      )}
    </div>
  );
}
