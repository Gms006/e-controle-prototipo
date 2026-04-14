import { companies } from "@/data/mockData";
import { Building, MapPin, Phone, Mail, AlertTriangle, ChevronRight } from "lucide-react";

export default function EmpresasTab() {
  return (
    <div className="ec-tab-content">
      {/* Summary row */}
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
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><Building size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Risco alto</label>
              <div className="ec-value">{companies.filter(c => c.profile.risco_consolidado === "Alto").length}</div>
              <div className="ec-trend warn">Requer atenção</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Score médio</label>
              <div className="ec-value">{Math.round(companies.reduce((s, c) => s + c.profile.score_urgencia, 0) / companies.length)}</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Cadastro</small>
            <h3>Empresas cadastradas</h3>
          </div>
          <div className="ec-chip">{companies.length} registros</div>
        </div>

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
              {companies.map(c => (
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

      {/* Detail cards */}
      <div className="ec-section-grid">
        <div className="ec-card">
          <div className="ec-section-head">
            <div>
              <small>Contatos</small>
              <h3>Responsáveis por empresa</h3>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {companies.filter(c => c.is_active).slice(0, 5).map(c => (
              <div key={c.id} className="ec-saved-view">
                <div>
                  <b>{c.nome_fantasia}</b>
                  <span>{c.profile.proprietario_principal}</span>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                      <Phone size={10} strokeWidth={1.6} /> {c.profile.telefone}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                      <Mail size={10} strokeWidth={1.6} /> {c.profile.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ec-card">
          <div className="ec-section-head">
            <div>
              <small>Distribuição</small>
              <h3>Por município</h3>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(
              companies.reduce((acc, c) => {
                acc[c.municipio] = (acc[c.municipio] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([mun, count]) => (
              <div key={mun} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8f9fb", borderRadius: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{mun}</span>
                <span className="ec-chip">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
