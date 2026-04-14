import { certificates, getCertStatus } from "@/data/mockData";
import { ShieldCheck, ShieldAlert, Clock, KeyRound } from "lucide-react";

export default function CertificadosTab() {
  const statuses = certificates.map(c => getCertStatus(c.not_after));
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

      {/* Certificates table */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Certificados digitais</small>
            <h3>Certificados A1/A3 vinculados</h3>
          </div>
          <div className="ec-chip">{certificates.length} registros</div>
        </div>

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
              {certificates.map(c => {
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

      {/* Timeline card */}
      <div className="ec-section-grid">
        <div className="ec-card">
          <div className="ec-section-head">
            <div>
              <small>Próximos vencimentos</small>
              <h3>Certificados que vencem em breve</h3>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {certificates
              .map(c => ({ ...c, ...getCertStatus(c.not_after) }))
              .sort((a, b) => a.not_after.localeCompare(b.not_after))
              .slice(0, 5)
              .map(c => (
                <div key={c.id} className="ec-saved-view">
                  <div>
                    <b>{c.company_name}</b>
                    <span>Vence em {c.not_after} · {c.issuer_cn}</span>
                  </div>
                  <div className={`ec-dot ${c.status === "ok" ? "ec-dot-green" : c.status === "warn" ? "ec-dot-amber" : "ec-dot-red"}`}></div>
                </div>
              ))}
          </div>
        </div>

        <div className="ec-card">
          <div className="ec-section-head">
            <div>
              <small>Distribuição</small>
              <h3>Por emissor</h3>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(
              certificates.reduce((acc, c) => {
                acc[c.issuer_cn] = (acc[c.issuer_cn] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([issuer, count]) => (
              <div key={issuer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8f9fb", borderRadius: 8 }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{issuer}</span>
                <span className="ec-chip">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
