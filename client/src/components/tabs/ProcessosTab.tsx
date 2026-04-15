import { useState, useMemo } from "react";
import { processes } from "@/data/mockData";
import { FolderKanban, Clock, CheckCircle, FileSearch, SearchX, MapPin, Building2 } from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters, SortDir } from "@/components/TabFilters";

const FILTERS = [
  {
    key: "situacao",
    label: "Situação",
    multi: true,
    options: [
      { label: "Pendente", value: "Pendente" },
      { label: "Em análise", value: "Em análise" },
      { label: "Em andamento", value: "Em andamento" },
      { label: "Aguardando pagamento", value: "Aguardando pagamento" },
      { label: "Deferido", value: "Deferido" },
    ],
  },
  {
    key: "tipo",
    label: "Tipo",
    multi: true,
    options: [
      { label: "CERCON", value: "CERCON" },
      { label: "Funcionamento", value: "Funcionamento" },
      { label: "Uso do Solo", value: "Uso do Solo" },
      { label: "Vigilância Sanitária", value: "Vigilância Sanitária" },
      { label: "Bombeiros", value: "Bombeiros" },
    ],
  },
  {
    key: "municipio",
    label: "Município",
    multi: true,
    options: [
      { label: "Anápolis", value: "Anápolis" },
      { label: "Goiânia", value: "Goiânia" },
      { label: "Aparecida de Goiânia", value: "Aparecida de Goiânia" },
    ],
  },
];

const SORT_OPTIONS = [
  { label: "Empresa (A→Z)", value: "company_name" },
  { label: "Situação", value: "situacao" },
  { label: "Tipo de processo", value: "tipo" },
  { label: "Data de solicitação", value: "data_solicitacao" },
  { label: "Município", value: "municipio" },
  { label: "Órgão", value: "orgao" },
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

export default function ProcessosTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortBy, setSortBy] = useState("situacao");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  function handleSortChange(value: string, dir: SortDir) {
    setSortBy(value);
    setSortDir(dir);
  }

  const filtered = useMemo(() => {
    let list = processes.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.company_name.toLowerCase().includes(q) &&
          !p.protocolo.toLowerCase().includes(q) &&
          !p.process_type.toLowerCase().includes(q) &&
          !p.orgao.toLowerCase().includes(q)
        )
          return false;
      }
      if (activeFilters.situacao?.length && !activeFilters.situacao.includes(p.situacao)) return false;
      if (activeFilters.tipo?.length && !activeFilters.tipo.includes(p.process_type)) return false;
      if (activeFilters.municipio?.length && !activeFilters.municipio.includes(p.municipio)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "company_name") cmp = a.company_name.localeCompare(b.company_name);
      else if (sortBy === "situacao") cmp = (SITUACAO_ORDER[a.situacao] ?? 9) - (SITUACAO_ORDER[b.situacao] ?? 9);
      else if (sortBy === "tipo") cmp = a.process_type.localeCompare(b.process_type);
      else if (sortBy === "data_solicitacao") cmp = a.data_solicitacao.localeCompare(b.data_solicitacao);
      else if (sortBy === "municipio") cmp = a.municipio.localeCompare(b.municipio);
      else if (sortBy === "orgao") cmp = a.orgao.localeCompare(b.orgao);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, activeFilters, sortBy, sortDir]);

  const situacoes = filtered.reduce((acc, p) => {
    acc[p.situacao] = (acc[p.situacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="ec-tab-content">
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

      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por empresa, protocolo, órgão…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        resultCount={filtered.length}
      />

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
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.protocolo}</td>
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
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>{p.protocolo}</span>
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
    </div>
  );
}
