import { useState, useMemo } from "react";
import { licences, companies, getLicenceStatus } from "@/data/mockData";
import { ScrollText, ShieldAlert, ShieldCheck, Clock, SearchX, RefreshCw, LayoutGrid } from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters, SortDir } from "@/components/TabFilters";
import LicenseEditModal from "@/components/LicenseEditModal";

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
    key: "funcionamento",
    label: "Funcionamento",
    multi: true,
    options: [
      { label: "Válido", value: "Válido" },
      { label: "Vencendo", value: "Vencendo" },
      { label: "Vencido", value: "Vencido" },
      { label: "Pendente", value: "Pendente" },
    ],
  },
  {
    key: "vig_sanitaria",
    label: "Vig. Sanitária",
    multi: true,
    options: [
      { label: "Válido", value: "Válido" },
      { label: "Vencido", value: "Vencido" },
      { label: "Não exigido", value: "Não exigido" },
    ],
  },
];

const SORT_OPTIONS = [
  { label: "Empresa (A→Z)", value: "company_name" },
  { label: "Município", value: "municipio" },
  { label: "Situação geral", value: "status" },
  { label: "Venc. Funcionamento", value: "venc_func" },
  { label: "Venc. Vig. Sanitária", value: "venc_san" },
];

const STATUS_ORDER: Record<string, number> = { danger: 0, warn: 1, neutral: 2, ok: 3 };

const LICENCE_TYPES: { key: keyof typeof licences[0]; label: string; dateKey: keyof typeof licences[0] }[] = [
  { key: "alvara_vig_sanitaria", label: "Vig. Sanitária", dateKey: "alvara_vig_sanitaria_valid_until" },
  { key: "cercon", label: "CERCON", dateKey: "cercon_valid_until" },
  { key: "alvara_funcionamento", label: "Funcionamento", dateKey: "alvara_funcionamento_valid_until" },
  { key: "licenca_ambiental", label: "Ambiental", dateKey: "licenca_ambiental_valid_until" },
  { key: "certidao_uso_solo", label: "Uso do Solo", dateKey: "certidao_uso_solo_valid_until" },
];

function overallStatus(l: typeof licences[0]): number {
  const vals = LICENCE_TYPES.map(t => STATUS_ORDER[getLicenceStatus(l[t.key] as string)] ?? 9);
  return Math.min(...vals);
}

function StatusBadge({ value }: { value: string }) {
  const s = getLicenceStatus(value);
  const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

// ─── Sub-aba: Por Tipo ───────────────────────────────────────────────────────
function PorTipoView({ filtered, setEditingLicense }: { filtered: typeof licences; setEditingLicense: (l: { company: string; licenseType: string; licenseId: string } | null) => void }) {
  const [activeTipo, setActiveTipo] = useState<string>("Funcionamento");

  const tipoData = useMemo(() => {
    const tipo = LICENCE_TYPES.find(t => t.label === activeTipo)!;
    return filtered
      .map(l => ({
        id: l.id,
        company_name: l.company_name,
        municipio: l.municipio,
        status: l[tipo.key] as string,
        valid_until: l[tipo.dateKey] as string | null,
      }))
      .filter(r => r.status !== "Não exigido")
      .sort((a, b) => (STATUS_ORDER[getLicenceStatus(a.status)] ?? 9) - (STATUS_ORDER[getLicenceStatus(b.status)] ?? 9));
  }, [filtered, activeTipo]);

  const counts = useMemo(() => {
    return LICENCE_TYPES.reduce((acc, t) => {
      const vals = filtered.map(l => l[t.key] as string).filter(v => v !== "Não exigido");
      acc[t.label] = {
        total: vals.length,
        danger: vals.filter(v => getLicenceStatus(v) === "danger").length,
        warn: vals.filter(v => getLicenceStatus(v) === "warn").length,
      };
      return acc;
    }, {} as Record<string, { total: number; danger: number; warn: number }>);
  }, [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tipo selector */}
      <div className="ec-tipo-bar">
        {LICENCE_TYPES.map(t => {
          const c = counts[t.label];
          const hasIssue = c.danger > 0 || c.warn > 0;
          return (
            <button
              key={t.label}
              className={`ec-tipo-btn${activeTipo === t.label ? " active" : ""}${c.danger > 0 ? " has-danger" : c.warn > 0 ? " has-warn" : ""}`}
              onClick={() => setActiveTipo(t.label)}
            >
              <span className="ec-tipo-btn-label">{t.label}</span>
              <span className="ec-tipo-btn-count">{c.total}</span>
              {hasIssue && (
                <span className={`ec-tipo-btn-alert ${c.danger > 0 ? "danger" : "warn"}`}>
                  {c.danger > 0 ? c.danger : c.warn}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary chips */}
      <div className="ec-tipo-summary">
        {(["Válido", "Vencendo", "Vencido", "Pendente", "Em andamento"] as const).map(status => {
          const count = tipoData.filter(r => r.status === status).length;
          if (count === 0) return null;
          const s = getLicenceStatus(status);
          const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
          return (
            <span key={status} className={`ec-tipo-chip ec-status ${cls}`}>
              {status} <b>{count}</b>
            </span>
          );
        })}
      </div>

      {/* Table */}
      <div className="ec-card">
        <div className="ec-urgency-table">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Município</th>
                <th>Validade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tipoData.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.company_name}</td>
                  <td>{r.municipio}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.valid_until ?? "—"}</td>
                  <td><button style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} onClick={() => setEditingLicense({ company: r.company_name, licenseType: activeTipo, licenseId: r.id })}><StatusBadge value={r.status} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-aba: Renovações ─────────────────────────────────────────────────────
function RenovacoesView({ filtered, setEditingLicense }: { filtered: typeof licences; setEditingLicense: (l: { company: string; licenseType: string; licenseId: string } | null) => void }) {
  // Flatten all licences with issues into renewal items, sorted by urgency score
  const items = useMemo(() => {
    const companyScores = Object.fromEntries(
      companies.map(c => [c.id, c.profile.score_urgencia])
    );

    const rows: {
      id: string;
      company_id: string;
      company_name: string;
      municipio: string;
      tipo: string;
      status: string;
      valid_until: string | null;
      score: number;
    }[] = [];

    filtered.forEach(l => {
      LICENCE_TYPES.forEach(t => {
        const val = l[t.key] as string;
        const s = getLicenceStatus(val);
        if (val === "Não exigido") return;
        if (s === "danger" || s === "warn") {
          rows.push({
            id: `${l.id}-${String(t.key)}`,
            company_id: l.company_id,
            company_name: l.company_name,
            municipio: l.municipio,
            tipo: t.label,
            status: val,
            valid_until: l[t.dateKey] as string | null,
            score: companyScores[l.company_id] ?? 0,
          });
        }
      });
    });

    return rows.sort((a, b) => {
      // danger first, then by score desc
      const sa = getLicenceStatus(a.status) === "danger" ? 0 : 1;
      const sb = getLicenceStatus(b.status) === "danger" ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return b.score - a.score;
    });
  }, [filtered]);

  if (items.length === 0) {
    return (
      <div className="ec-card ec-empty-state">
        <ShieldCheck size={32} />
        <p>Nenhuma renovação urgente no momento.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary */}
      <div className="ec-tipo-summary">
        <span className="ec-tipo-chip ec-status ec-s-danger">
          Vencidas <b>{items.filter(i => getLicenceStatus(i.status) === "danger").length}</b>
        </span>
        <span className="ec-tipo-chip ec-status ec-s-warn">
          Vencendo <b>{items.filter(i => getLicenceStatus(i.status) === "warn").length}</b>
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
          Ordenado por score de urgência
        </span>
      </div>

      <div className="ec-card">
        <div className="ec-urgency-table">
          <table>
            <thead>
              <tr>
                <th>Score</th>
                <th>Empresa</th>
                <th>Município</th>
                <th>Tipo de Licença</th>
                <th>Validade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className={`ec-score-badge ${r.score >= 80 ? "high" : r.score >= 50 ? "mid" : "low"}`}>
                      {r.score}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.company_name}</td>
                  <td>{r.municipio}</td>
                  <td>
                    <span className="ec-tipo-tag">{r.tipo}</span>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.valid_until ?? "—"}</td>
                  <td><button style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} onClick={() => setEditingLicense({ company: r.company_name, licenseType: r.tipo, licenseId: r.id })}><StatusBadge value={r.status} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
type SubTab = "geral" | "por-tipo" | "renovacoes";

export default function LicencasTab() {
  const [subTab, setSubTab] = useState<SubTab>("geral");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortBy, setSortBy] = useState("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editingLicense, setEditingLicense] = useState<{ company: string; licenseType: string; licenseId: string } | null>(null);

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  function handleSortChange(value: string, dir: SortDir) {
    setSortBy(value);
    setSortDir(dir);
  }

  const filtered = useMemo(() => {
    let list = licences.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.company_name.toLowerCase().includes(q) && !l.municipio.toLowerCase().includes(q)) return false;
      }
      if (activeFilters.municipio?.length && !activeFilters.municipio.includes(l.municipio)) return false;
      if (activeFilters.funcionamento?.length && !activeFilters.funcionamento.includes(l.alvara_funcionamento)) return false;
      if (activeFilters.vig_sanitaria?.length && !activeFilters.vig_sanitaria.includes(l.alvara_vig_sanitaria)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "company_name") cmp = a.company_name.localeCompare(b.company_name);
      else if (sortBy === "municipio") cmp = a.municipio.localeCompare(b.municipio);
      else if (sortBy === "status") cmp = overallStatus(a) - overallStatus(b);
      else if (sortBy === "venc_func") {
        cmp = (a.alvara_funcionamento_valid_until ?? "9999").localeCompare(b.alvara_funcionamento_valid_until ?? "9999");
      } else if (sortBy === "venc_san") {
        cmp = (a.alvara_vig_sanitaria_valid_until ?? "9999").localeCompare(b.alvara_vig_sanitaria_valid_until ?? "9999");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, activeFilters, sortBy, sortDir]);

  const vencidas = filtered.filter(l => LICENCE_TYPES.some(t => l[t.key] === "Vencido")).length;
  const vencendo = filtered.filter(l => LICENCE_TYPES.some(t => l[t.key] === "Vencendo")).length;
  const pendentes = filtered.filter(l => LICENCE_TYPES.some(t => l[t.key] === "Pendente" || l[t.key] === "Em andamento")).length;
  const renovacoesUrgentes = filtered.reduce((acc, l) => {
    LICENCE_TYPES.forEach(t => {
      const s = getLicenceStatus(l[t.key] as string);
      if (s === "danger" || s === "warn") acc++;
    });
    return acc;
  }, 0);

  return (
    <div className="ec-tab-content">
      {/* KPIs */}
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Total de registros</label><div className="ec-value">{licences.length}</div></div>
            <div className="ec-kpi-icon"><ScrollText size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Vencidas</label><div className="ec-value">{vencidas}</div><div className="ec-trend warn">Ação imediata</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><ShieldAlert size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Vencendo</label><div className="ec-value">{vencendo}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Renovações urgentes</label><div className="ec-value">{renovacoesUrgentes}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><RefreshCw size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="ec-subtab-bar">
        <button
          className={`ec-subtab-btn${subTab === "geral" ? " active" : ""}`}
          onClick={() => setSubTab("geral")}
        >
          <LayoutGrid size={13} strokeWidth={1.6} />
          Visão Geral
        </button>
        <button
          className={`ec-subtab-btn${subTab === "por-tipo" ? " active" : ""}`}
          onClick={() => setSubTab("por-tipo")}
        >
          <ShieldCheck size={13} strokeWidth={1.6} />
          Por Tipo
        </button>
        <button
          className={`ec-subtab-btn${subTab === "renovacoes" ? " active" : ""}`}
          onClick={() => setSubTab("renovacoes")}
        >
          <RefreshCw size={13} strokeWidth={1.6} />
          Renovações
          {renovacoesUrgentes > 0 && (
            <span className="ec-subtab-badge">{renovacoesUrgentes}</span>
          )}
        </button>
      </div>

      {/* Filters (shared across sub-tabs) */}
      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por empresa ou município…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        resultCount={filtered.length}
        hideViewToggle={subTab !== "geral"}
      />

      {/* Content */}
      {subTab === "por-tipo" ? (
        <PorTipoView filtered={filtered} setEditingLicense={setEditingLicense} />
      ) : subTab === "renovacoes" ? (
        <RenovacoesView filtered={filtered} setEditingLicense={setEditingLicense} />
      ) : filtered.length === 0 ? (
        <div className="ec-card ec-empty-state"><SearchX size={32} /><p>Nenhuma licença encontrada.</p></div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-section-head"><div><small>Matriz</small><h3>Licenças por empresa</h3></div></div>
          <div className="ec-urgency-table">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th><th>Município</th><th>Vig. Sanitária</th><th>CERCON</th><th>Funcionamento</th><th>Ambiental</th><th>Uso do Solo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.company_name}</td>
                    <td>{l.municipio}</td>
                    <td><StatusBadge value={l.alvara_vig_sanitaria} /></td>
                    <td><StatusBadge value={l.cercon} /></td>
                    <td><StatusBadge value={l.alvara_funcionamento} /></td>
                    <td><StatusBadge value={l.licenca_ambiental} /></td>
                    <td><StatusBadge value={l.certidao_uso_solo} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(l => (
            <div key={l.id} className="ec-licence-card">
              <div className="ec-licence-card-head">
                <div className="ec-licence-card-title">
                  <b>{l.company_name}</b>
                  <span>{l.municipio}</span>
                </div>
                {LICENCE_TYPES.some(t => l[t.key] === "Vencido") ? (
                  <span className="ec-status ec-s-danger">Irregular</span>
                ) : LICENCE_TYPES.some(t => l[t.key] === "Vencendo" || l[t.key] === "Pendente") ? (
                  <span className="ec-status ec-s-warn">Atenção</span>
                ) : (
                  <span className="ec-status ec-s-ok">Regular</span>
                )}
              </div>
              <div className="ec-licence-pills">
                {LICENCE_TYPES.map(t => {
                  const val = l[t.key] as string;
                  if (val === "Não exigido") return null;
                  const s = getLicenceStatus(val);
                  const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
                  return (
                    <div key={String(t.key)} className="ec-licence-pill">
                      <span className="ec-licence-pill-name">{t.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {l[t.dateKey] && <span className="ec-licence-pill-date">{l[t.dateKey] as string}</span>}
                        <span className={`ec-status ${cls}`}>{val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingLicense && (
        <LicenseEditModal
          company={editingLicense.company}
          licenseType={editingLicense.licenseType}
          licenseId={editingLicense.licenseId}
          onClose={() => setEditingLicense(null)}
        />
      )}
    </div>
  );
}
