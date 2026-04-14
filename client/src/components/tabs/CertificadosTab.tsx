import { useState, useMemo } from "react";
import { certificates, getCertStatus } from "@/data/mockData";
import { ShieldCheck, ShieldAlert, Clock, KeyRound, SearchX } from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters } from "@/components/TabFilters";

const FILTERS = [
  {
    key: "status",
    label: "Status",
    multi: true,
    options: [
      { label: "Válido", value: "ok" },
      { label: "Vencendo (30d)", value: "warn" },
      { label: "Vencido", value: "danger" },
    ],
  },
  {
    key: "emissor",
    label: "Emissor",
    multi: true,
    options: [
      { label: "AC SOLUTI", value: "AC SOLUTI Múltipla v5" },
      { label: "AC SERASA RFB", value: "AC SERASA RFB v5" },
      { label: "AC VALID RFB", value: "AC VALID RFB v5" },
      { label: "AC CERTISIGN", value: "AC CERTISIGN RFB G5" },
    ],
  },
];

function validityPercent(notBefore: string, notAfter: string): number {
  const start = new Date(notBefore).getTime();
  const end = new Date(notAfter).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

export default function CertificadosTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  const filtered = useMemo(() => {
    return certificates.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.company_name.toLowerCase().includes(q) &&
          !c.document_masked.includes(q) &&
          !c.issuer_cn.toLowerCase().includes(q)
        )
          return false;
      }
      if (activeFilters.status?.length) {
        const st = getCertStatus(c.not_after).status;
        if (!activeFilters.status.includes(st)) return false;
      }
      if (activeFilters.emissor?.length && !activeFilters.emissor.includes(c.issuer_cn)) return false;
      return true;
    });
  }, [search, activeFilters]);

  const statuses = filtered.map(c => getCertStatus(c.not_after));
  const validos = statuses.filter(s => s.status === "ok").length;
  const vencendo = statuses.filter(s => s.status === "warn").length;
  const vencidos = statuses.filter(s => s.status === "danger").length;

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de certificados</label>
              <div className="ec-value">{certificates.length}</div>
            </div>
            <div className="ec-kpi-icon"><KeyRound size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Válidos</label>
              <div className="ec-value">{validos}</div>
            </div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><ShieldCheck size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Vencendo (30d)</label>
              <div className="ec-value">{vencendo}</div>
              <div className="ec-trend warn">Renovar em breve</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Vencidos</label>
              <div className="ec-value">{vencidos}</div>
              <div className="ec-trend warn">Ação imediata</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><ShieldAlert size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por empresa, CNPJ, emissor…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="ec-card ec-empty-state">
          <SearchX size={32} />
          <p>Nenhum certificado encontrado com os filtros aplicados.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="ec-card">
          <div className="ec-urgency-table">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>CNPJ</th>
                  <th>Emissor</th>
                  <th>Válido desde</th>
                  <th>Válido até</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const st = getCertStatus(c.not_after);
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.company_name}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.document_masked}</td>
                      <td style={{ fontSize: 12 }}>{c.issuer_cn}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.not_before}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{c.not_after}</td>
                      <td>
                        <span className={`ec-status ${st.status === "ok" ? "ec-s-ok" : st.status === "warn" ? "ec-s-warn" : "ec-s-danger"}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="ec-cards-grid">
          {filtered.map(c => {
            const st = getCertStatus(c.not_after);
            const pct = validityPercent(c.not_before, c.not_after);
            const barColor = st.status === "ok" ? "#16a34a" : st.status === "warn" ? "#d97706" : "#dc2626";
            const iconBg = st.status === "ok" ? "#f0fdf4" : st.status === "warn" ? "#fef9ee" : "#fef2f2";
            const iconColor = st.status === "ok" ? "#16a34a" : st.status === "warn" ? "#d97706" : "#dc2626";
            const Icon = st.status === "ok" ? ShieldCheck : st.status === "warn" ? Clock : ShieldAlert;

            return (
              <div key={c.id} className="ec-cert-card">
                <div className="ec-cert-card-head">
                  <div className="ec-cert-card-icon" style={{ background: iconBg, color: iconColor }}>
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <div className="ec-cert-card-title">
                    <b>{c.company_name}</b>
                    <span>{c.document_masked}</span>
                  </div>
                  <span className={`ec-status ${st.status === "ok" ? "ec-s-ok" : st.status === "warn" ? "ec-s-warn" : "ec-s-danger"}`}>
                    {st.label}
                  </span>
                </div>

                <div className="ec-cert-card-validity">
                  <label>Período de validade</label>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    <span style={{ fontFamily: "monospace" }}>{c.not_before}</span>
                    <span style={{ fontFamily: "monospace" }}>{c.not_after}</span>
                  </div>
                  <div className="ec-cert-card-validity-bar">
                    <div
                      className="ec-cert-card-validity-fill"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                </div>

                <div className="ec-cert-card-meta">
                  <div className="ec-cert-card-meta-item">
                    <label>Emissor</label>
                    <span>{c.issuer_cn}</span>
                  </div>
                  <div className="ec-cert-card-meta-item">
                    <label>Tipo documento</label>
                    <span>{c.document_type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
