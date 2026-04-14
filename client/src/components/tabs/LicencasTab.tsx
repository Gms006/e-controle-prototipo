import { useState, useMemo } from "react";
import { licences, getLicenceStatus } from "@/data/mockData";
import { ScrollText, ShieldAlert, ShieldCheck, Clock, SearchX } from "lucide-react";
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

function StatusBadge({ value }: { value: string }) {
  const s = getLicenceStatus(value);
  const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

const LICENCE_TYPES = [
  { key: "alvara_vig_sanitaria" as const, label: "Vig. Sanitária", dateKey: "alvara_vig_sanitaria_valid_until" as const },
  { key: "cercon" as const, label: "CERCON", dateKey: "cercon_valid_until" as const },
  { key: "alvara_funcionamento" as const, label: "Funcionamento", dateKey: "alvara_funcionamento_valid_until" as const },
  { key: "licenca_ambiental" as const, label: "Ambiental", dateKey: "licenca_ambiental_valid_until" as const },
  { key: "certidao_uso_solo" as const, label: "Uso do Solo", dateKey: "certidao_uso_solo_valid_until" as const },
];

export default function LicencasTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  const filtered = useMemo(() => {
    return licences.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.company_name.toLowerCase().includes(q) && !l.municipio.toLowerCase().includes(q)) return false;
      }
      if (activeFilters.municipio?.length && !activeFilters.municipio.includes(l.municipio)) return false;
      if (activeFilters.funcionamento?.length && !activeFilters.funcionamento.includes(l.alvara_funcionamento)) return false;
      if (activeFilters.vig_sanitaria?.length && !activeFilters.vig_sanitaria.includes(l.alvara_vig_sanitaria)) return false;
      return true;
    });
  }, [search, activeFilters]);

  const vencidas = filtered.filter(l =>
    LICENCE_TYPES.some(t => l[t.key] === "Vencido")
  ).length;
  const vencendo = filtered.filter(l =>
    LICENCE_TYPES.some(t => l[t.key] === "Vencendo")
  ).length;
  const pendentes = filtered.filter(l =>
    LICENCE_TYPES.some(t => l[t.key] === "Pendente" || l[t.key] === "Em andamento")
  ).length;

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de registros</label>
              <div className="ec-value">{licences.length}</div>
            </div>
            <div className="ec-kpi-icon"><ScrollText size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Vencidas</label>
              <div className="ec-value">{vencidas}</div>
              <div className="ec-trend warn">Ação imediata</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><ShieldAlert size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Vencendo</label>
              <div className="ec-value">{vencendo}</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Pendentes / Em andamento</label>
              <div className="ec-value">{pendentes}</div>
            </div>
            <div className="ec-kpi-icon"><ShieldCheck size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por empresa ou município…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="ec-card ec-empty-state">
          <SearchX size={32} />
          <p>Nenhuma licença encontrada com os filtros aplicados.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-section-head">
            <div>
              <small>Matriz</small>
              <h3>Licenças por empresa</h3>
            </div>
          </div>
          <div className="ec-urgency-table">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Município</th>
                  <th>Vig. Sanitária</th>
                  <th>CERCON</th>
                  <th>Funcionamento</th>
                  <th>Ambiental</th>
                  <th>Uso do Solo</th>
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
                {/* Overall status indicator */}
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
                  const val = l[t.key];
                  if (val === "Não exigido") return null;
                  const s = getLicenceStatus(val);
                  const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
                  return (
                    <div key={t.key} className="ec-licence-pill">
                      <span className="ec-licence-pill-name">{t.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {l[t.dateKey] && (
                          <span className="ec-licence-pill-date">{l[t.dateKey]}</span>
                        )}
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
    </div>
  );
}
