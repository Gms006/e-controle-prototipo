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
import TabFilters, { ViewMode, ActiveFilters } from "@/components/TabFilters";

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

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  const filtered = useMemo(() => {
    return companies.filter(c => {
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
  }, [search, activeFilters]);

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

      {/* Filters + View Toggle */}
      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome, CNPJ, município…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        resultCount={filtered.length}
      />

      {/* Content */}
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
                  <tr key={c.id}>
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
                    <td><ChevronRight size={14} style={{ color: "#94a3b8" }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(c => (
            <div key={c.id} className="ec-company-card">
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
    </div>
  );
}
