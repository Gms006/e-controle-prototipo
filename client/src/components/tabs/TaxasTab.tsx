import { useState, useMemo } from "react";
import { taxes, getLicenceStatus } from "@/data/mockData";
import { Receipt, AlertTriangle, CheckCircle, Clock, SearchX } from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters, SortDir } from "@/components/TabFilters";

const FILTERS = [
  {
    key: "status",
    label: "Status geral",
    multi: true,
    options: [
      { label: "Em dia", value: "Em dia" },
      { label: "Pendente", value: "Pendente" },
      { label: "Irregular", value: "Irregular" },
    ],
  },
  {
    key: "tpi",
    label: "TPI",
    multi: true,
    options: [
      { label: "Pago", value: "Pago" },
      { label: "Pendente envio", value: "Pendente envio" },
      { label: "Em aberto", value: "Em aberto" },
    ],
  },
  {
    key: "bombeiros",
    label: "Bombeiros",
    multi: true,
    options: [
      { label: "Pago", value: "Pago" },
      { label: "Pendente", value: "Pendente" },
      { label: "Não exigido", value: "Não exigido" },
    ],
  },
];

const SORT_OPTIONS = [
  { label: "Empresa (A→Z)", value: "company_name" },
  { label: "Status geral", value: "status" },
  { label: "Data de envio", value: "data_envio" },
  { label: "Vencimento TPI", value: "vencimento_tpi" },
  { label: "TPI", value: "tpi" },
];

const STATUS_ORDER: Record<string, number> = { Irregular: 0, Pendente: 1, "Em dia": 2 };

const TAX_FIELDS: { key: keyof typeof taxes[0]; label: string }[] = [
  { key: "taxa_funcionamento", label: "Funcionamento" },
  { key: "taxa_publicidade", label: "Publicidade" },
  { key: "taxa_vig_sanitaria", label: "Vig. Sanitária" },
  { key: "taxa_localiz_instalacao", label: "Localização" },
  { key: "taxa_ocup_area_publica", label: "Área Pública" },
  { key: "taxa_bombeiros", label: "Bombeiros" },
  { key: "tpi", label: "TPI" },
];

function TaxCell({ value }: { value: string }) {
  const s = getLicenceStatus(value);
  const cls = s === "ok" ? "ec-green" : s === "warn" ? "ec-yellow" : s === "danger" ? "ec-red" : "ec-gray";
  const short = value === "Não exigido" ? "—" : value === "Pendente envio" ? "Envio" : value === "Em aberto" ? "AB" : value === "Pago" ? "OK" : value === "Vencido" ? "Venc." : value === "Vencendo" ? "Venc." : value === "Pendente" ? "Pend." : value;
  return <div className={`ec-m-cell ${cls}`}>{short}</div>;
}

function StatusBadge({ value }: { value: string }) {
  const cls = value === "Em dia" ? "ec-s-ok" : value === "Pendente" ? "ec-s-warn" : "ec-s-danger";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

export default function TaxasTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortBy, setSortBy] = useState("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  function handleSortChange(value: string, dir: SortDir) {
    setSortBy(value);
    setSortDir(dir);
  }

  const filtered = useMemo(() => {
    let list = taxes.filter(t => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.company_name.toLowerCase().includes(q)) return false;
      }
      if (activeFilters.status?.length && !activeFilters.status.includes(t.status_taxas)) return false;
      if (activeFilters.tpi?.length && !activeFilters.tpi.includes(t.tpi)) return false;
      if (activeFilters.bombeiros?.length && !activeFilters.bombeiros.includes(t.taxa_bombeiros)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "company_name") cmp = a.company_name.localeCompare(b.company_name);
      else if (sortBy === "status") cmp = (STATUS_ORDER[a.status_taxas] ?? 9) - (STATUS_ORDER[b.status_taxas] ?? 9);
      else if (sortBy === "data_envio") cmp = a.data_envio.localeCompare(b.data_envio);
      else if (sortBy === "vencimento_tpi") cmp = a.vencimento_tpi.localeCompare(b.vencimento_tpi);
      else if (sortBy === "tpi") cmp = a.tpi.localeCompare(b.tpi);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, activeFilters, sortBy, sortDir]);

  const emDia = filtered.filter(t => t.status_taxas === "Em dia").length;
  const pendentes = filtered.filter(t => t.status_taxas === "Pendente").length;
  const irregulares = filtered.filter(t => t.status_taxas === "Irregular").length;

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Total de registros</label><div className="ec-value">{taxes.length}</div></div>
            <div className="ec-kpi-icon"><Receipt size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Em dia</label><div className="ec-value">{emDia}</div></div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><CheckCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Pendentes</label><div className="ec-value">{pendentes}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Irregulares</label><div className="ec-value">{irregulares}</div><div className="ec-trend warn">Ação necessária</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por empresa…"
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
        <div className="ec-card ec-empty-state"><SearchX size={32} /><p>Nenhum registro encontrado.</p></div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-section-head"><div><small>Taxas</small><h3>Matriz semafórica por empresa</h3></div></div>
          <div className="ec-matrix">
            <div className="ec-m-head">Empresa</div>
            <div className="ec-m-head">FUNC</div>
            <div className="ec-m-head">PUB</div>
            <div className="ec-m-head">SAN</div>
            <div className="ec-m-head">LOC</div>
            <div className="ec-m-head">ÁREA</div>
            <div className="ec-m-head">BOMB</div>
            <div className="ec-m-head">TPI</div>
            {filtered.map(t => (
              <div key={t.id} style={{ display: "contents" }}>
                <div className="ec-m-name">{t.company_name}</div>
                <TaxCell value={t.taxa_funcionamento} />
                <TaxCell value={t.taxa_publicidade} />
                <TaxCell value={t.taxa_vig_sanitaria} />
                <TaxCell value={t.taxa_localiz_instalacao} />
                <TaxCell value={t.taxa_ocup_area_publica} />
                <TaxCell value={t.taxa_bombeiros} />
                <TaxCell value={t.tpi} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(t => {
            // Format vencimento_tpi as dd/mm
            const tpiVenc = t.vencimento_tpi
              ? (() => { const d = new Date(t.vencimento_tpi); return isNaN(d.getTime()) ? t.vencimento_tpi : `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`; })()
              : null;
            return (
              <div key={t.id} className="ec-tax-card">
                <div className="ec-tax-card-head">
                  <div className="ec-tax-card-title">
                    <b>{t.company_name}</b>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <span className="ec-tax-meta-chip">CNPJ {t.company_id}</span>
                      <span className="ec-tax-meta-chip">Último envio: {t.data_envio}</span>
                      <span className="ec-tax-meta-chip" style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>Pessoal</span>
                    </div>
                  </div>
                  <StatusBadge value={t.status_taxas} />
                </div>
                <div className="ec-tax-list">
                  {TAX_FIELDS.map(f => {
                    const val = t[f.key as keyof typeof t] as string;
                    const isTpi = f.key === 'tpi';
                    const s = getLicenceStatus(val);
                    const cls = s === 'ok' ? 'ec-s-ok' : s === 'warn' ? 'ec-s-warn' : s === 'danger' ? 'ec-s-danger' : 'ec-s-neutral';
                    return (
                      <div key={f.key} className="ec-tax-list-row">
                        <span className="ec-tax-list-label">{f.label.toUpperCase()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isTpi && tpiVenc && val !== 'Isento' && val !== 'Não exigido' && (
                            <span className="ec-tax-venc-chip">Venc.: {tpiVenc}</span>
                          )}
                          <span className={`ec-status ${cls}`}>{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
