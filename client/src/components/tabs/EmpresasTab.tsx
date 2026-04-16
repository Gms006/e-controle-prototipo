import { useState, useMemo } from "react";
import { companies } from "@/data/mockData";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  ChevronRight,
  SearchX,
} from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters, SortDir } from "@/components/TabFilters";
import CompanyModal from "@/components/CompanyModal";
import NewCompanyModal from "@/components/NewCompanyModal";
import { Plus } from "lucide-react";

const FILTERS = [
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
  {
    key: "risco",
    label: "Risco CNAE",
    multi: true,
    options: [
      { label: "Alto", value: "Alto" },
      { label: "Médio", value: "Médio" },
      { label: "Baixo", value: "Baixo" },
    ],
  },
  {
    key: "status",
    label: "Status",
    multi: false,
    options: [
      { label: "Ativas", value: "ativa" },
      { label: "Inativas", value: "inativa" },
    ],
  },
  {
    key: "porte",
    label: "Porte",
    multi: true,
    options: [
      { label: "Micro", value: "Micro" },
      { label: "Pequeno", value: "Pequeno" },
      { label: "Médio", value: "Médio" },
      { label: "Grande", value: "Grande" },
    ],
  },
];

const SORT_OPTIONS = [
  { label: "Nome fantasia", value: "nome_fantasia" },
  { label: "Score de urgência", value: "score" },
  { label: "Município", value: "municipio" },
  { label: "Porte", value: "porte" },
  { label: "Risco CNAE", value: "risco" },
];

const RISCO_ORDER: Record<string, number> = { Alto: 0, Médio: 1, Baixo: 2 };
const PORTE_ORDER: Record<string, number> = { Grande: 0, Médio: 1, Pequeno: 2, Micro: 3 };

function initials(name: string) {
  return name
    .split(" ")
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}

export default function EmpresasTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortBy, setSortBy] = useState("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showNewCompany, setShowNewCompany] = useState(false);

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  function handleSortChange(value: string, dir: SortDir) {
    setSortBy(value);
    setSortDir(dir);
  }

  const filtered = useMemo(() => {
    let list = companies.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.razao_social.toLowerCase().includes(q) &&
          !c.nome_fantasia.toLowerCase().includes(q) &&
          !c.cnpj.includes(q) &&
          !c.municipio.toLowerCase().includes(q)
        )
          return false;
      }
      if (activeFilters.municipio?.length && !activeFilters.municipio.includes(c.municipio)) return false;
      if (activeFilters.risco?.length && !activeFilters.risco.includes(c.profile.risco_consolidado)) return false;
      if (activeFilters.status?.length) {
        const isAtiva = c.is_active ? "ativa" : "inativa";
        if (!activeFilters.status.includes(isAtiva)) return false;
      }
      if (activeFilters.porte?.length && !activeFilters.porte.includes(c.profile.porte)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "nome_fantasia") cmp = a.nome_fantasia.localeCompare(b.nome_fantasia);
      else if (sortBy === "score") cmp = a.profile.score_urgencia - b.profile.score_urgencia;
      else if (sortBy === "municipio") cmp = a.municipio.localeCompare(b.municipio);
      else if (sortBy === "porte") cmp = (PORTE_ORDER[a.profile.porte] ?? 9) - (PORTE_ORDER[b.profile.porte] ?? 9);
      else if (sortBy === "risco") cmp = (RISCO_ORDER[a.profile.risco_consolidado] ?? 9) - (RISCO_ORDER[b.profile.risco_consolidado] ?? 9);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, activeFilters, sortBy, sortDir]);

  const riskAlto = filtered.filter(c => c.profile.risco_consolidado === "Alto").length;
  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, c) => s + c.profile.score_urgencia, 0) / filtered.length)
    : 0;

  return (
    <div className="ec-tab-content">
      {/* KPIs */}
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de empresas</label>
              <div className="ec-value">{companies.length}</div>
            </div>
            <div className="ec-kpi-icon"><Building size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Ativas</label>
              <div className="ec-value">{companies.filter(c => c.is_active).length}</div>
            </div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              <Building size={20} strokeWidth={1.6} />
            </div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Risco alto</label>
              <div className="ec-value">{riskAlto}</div>
              <div className="ec-trend warn">Requer atenção</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Score médio</label>
              <div className="ec-value">{avgScore}</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <TabFilters
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome, CNPJ, município…"
            filters={FILTERS}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={handleSortChange}
            resultCount={filtered.length}
          />
        </div>
        <button className="ec-btn-primary" style={{ flexShrink: 0 }} onClick={() => setShowNewCompany(true)}>
          <Plus size={14} strokeWidth={1.6} /> Nova Empresa
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="ec-card ec-empty-state">
          <SearchX size={32} />
          <p>Nenhuma empresa encontrada com os filtros aplicados.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-urgency-table">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>CNPJ</th>
                  <th>Município</th>
                  <th>Porte</th>
                  <th>Risco</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCompanyId(c.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.nome_fantasia}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{c.razao_social}</div>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.cnpj}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} strokeWidth={1.6} style={{ color: "#94a3b8" }} />
                        {c.municipio}
                      </div>
                    </td>
                    <td>{c.profile.porte}</td>
                    <td>
                      <span className={`ec-status ${c.profile.risco_consolidado === "Alto" ? "ec-s-danger" : c.profile.risco_consolidado === "Médio" ? "ec-s-warn" : "ec-s-ok"}`}>
                        {c.profile.risco_consolidado}
                      </span>
                    </td>
                    <td><div className="ec-score">{c.profile.score_urgencia}</div></td>
                    <td>
                      <span className={`ec-status ${c.is_active ? "ec-s-ok" : "ec-s-neutral"}`}>
                        {c.is_active ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td>
                      <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(c => (
            <div
              key={c.id}
              className="ec-company-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCompanyId(c.id)}
            >
              <div className="ec-company-card-head">
                <div className="ec-company-card-avatar">{initials(c.nome_fantasia)}</div>
                <div className="ec-company-card-title">
                  <b>{c.nome_fantasia}</b>
                  <span>{c.razao_social}</span>
                </div>
                <div className="ec-company-card-score">{c.profile.score_urgencia}</div>
              </div>
              <div className="ec-company-card-meta">
                <div className="ec-company-card-meta-item">
                  <label>CNPJ</label>
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>{c.cnpj}</span>
                </div>
                <div className="ec-company-card-meta-item">
                  <label>Município</label>
                  <span>{c.municipio}</span>
                </div>
                <div className="ec-company-card-meta-item">
                  <label>Porte</label>
                  <span>{c.profile.porte}</span>
                </div>
                <div className="ec-company-card-meta-item">
                  <label>Responsável fiscal</label>
                  <span style={{ fontSize: 11 }}>{c.profile.responsavel_fiscal}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                  <Phone size={11} strokeWidth={1.6} /> {c.profile.telefone}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                  <Mail size={11} strokeWidth={1.6} /> {c.profile.email}
                </span>
              </div>
              <div className="ec-company-card-footer">
                <span className={`ec-status ${c.profile.risco_consolidado === "Alto" ? "ec-s-danger" : c.profile.risco_consolidado === "Médio" ? "ec-s-warn" : "ec-s-ok"}`}>
                  Risco {c.profile.risco_consolidado}
                </span>
                <span className={`ec-status ${c.is_active ? "ec-s-ok" : "ec-s-neutral"}`}>
                  {c.is_active ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Modal */}
      {selectedCompanyId && (
        <CompanyModal
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}

      {/* New Company Modal */}
      {showNewCompany && (
        <NewCompanyModal onClose={() => setShowNewCompany(false)} />
      )}
    </div>
  );
}
