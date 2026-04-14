import { licences, getLicenceStatus } from "@/data/mockData";
import { ScrollText, ShieldAlert, ShieldCheck, Clock } from "lucide-react";

function StatusBadge({ value }: { value: string }) {
  const s = getLicenceStatus(value);
  const cls = s === "ok" ? "ec-s-ok" : s === "warn" ? "ec-s-warn" : s === "danger" ? "ec-s-danger" : "ec-s-neutral";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

export default function LicencasTab() {
  const vencidas = licences.filter(l =>
    [l.alvara_vig_sanitaria, l.cercon, l.alvara_funcionamento, l.licenca_ambiental, l.certidao_uso_solo]
      .some(v => v === "Vencido")
  ).length;
  const vencendo = licences.filter(l =>
    [l.alvara_vig_sanitaria, l.cercon, l.alvara_funcionamento, l.licenca_ambiental, l.certidao_uso_solo]
      .some(v => v === "Vencendo")
  ).length;
  const pendentes = licences.filter(l =>
    [l.alvara_vig_sanitaria, l.cercon, l.alvara_funcionamento, l.licenca_ambiental, l.certidao_uso_solo]
      .some(v => v === "Pendente" || v === "Em andamento")
  ).length;

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de licenças</label>
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

      {/* Licence matrix */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Licenças</small>
            <h3>Matriz de licenças por empresa</h3>
          </div>
          <div className="ec-chip">{licences.length} empresas</div>
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
              {licences.map(l => (
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

      {/* Validity details */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Validade</small>
            <h3>Próximos vencimentos</h3>
          </div>
        </div>

        <div className="ec-urgency-table">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Tipo de licença</th>
                <th>Validade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {licences.flatMap(l => {
                const items: { company: string; tipo: string; date: string | null; status: string }[] = [];
                if (l.alvara_vig_sanitaria_valid_until) items.push({ company: l.company_name, tipo: "Vigilância Sanitária", date: l.alvara_vig_sanitaria_valid_until, status: l.alvara_vig_sanitaria });
                if (l.cercon_valid_until) items.push({ company: l.company_name, tipo: "CERCON", date: l.cercon_valid_until, status: l.cercon });
                if (l.alvara_funcionamento_valid_until) items.push({ company: l.company_name, tipo: "Funcionamento", date: l.alvara_funcionamento_valid_until, status: l.alvara_funcionamento });
                if (l.licenca_ambiental_valid_until) items.push({ company: l.company_name, tipo: "Ambiental", date: l.licenca_ambiental_valid_until, status: l.licenca_ambiental });
                if (l.certidao_uso_solo_valid_until) items.push({ company: l.company_name, tipo: "Uso do Solo", date: l.certidao_uso_solo_valid_until, status: l.certidao_uso_solo });
                return items;
              }).sort((a, b) => (a.date || "").localeCompare(b.date || "")).slice(0, 10).map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.company}</td>
                  <td>{item.tipo}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{item.date}</td>
                  <td><StatusBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
