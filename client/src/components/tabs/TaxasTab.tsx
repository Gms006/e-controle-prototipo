import { taxes, getLicenceStatus } from "@/data/mockData";
import { Receipt, AlertTriangle, CheckCircle, Clock } from "lucide-react";

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
  const emDia = taxes.filter(t => t.status_taxas === "Em dia").length;
  const pendentes = taxes.filter(t => t.status_taxas === "Pendente").length;
  const irregulares = taxes.filter(t => t.status_taxas === "Irregular").length;

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de registros</label>
              <div className="ec-value">{taxes.length}</div>
            </div>
            <div className="ec-kpi-icon"><Receipt size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Em dia</label>
              <div className="ec-value">{emDia}</div>
            </div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><CheckCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Pendentes</label>
              <div className="ec-value">{pendentes}</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Irregulares</label>
              <div className="ec-value">{irregulares}</div>
              <div className="ec-trend warn">Ação necessária</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><AlertTriangle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* Tax matrix */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Taxas</small>
            <h3>Matriz semafórica por empresa</h3>
          </div>
          <div className="ec-chips">
            <div className="ec-chip active">Por empresa</div>
            <div className="ec-chip">Por tipo</div>
          </div>
        </div>

        <div className="ec-matrix">
          <div className="ec-m-head">Empresa</div>
          <div className="ec-m-head">FUNC</div>
          <div className="ec-m-head">PUB</div>
          <div className="ec-m-head">SAN</div>
          <div className="ec-m-head">LOC</div>
          <div className="ec-m-head">ÁREA</div>
          <div className="ec-m-head">BOMB</div>
          <div className="ec-m-head">TPI</div>

          {taxes.map(t => (
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

      {/* Detail table */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Detalhes</small>
            <h3>Taxas por empresa</h3>
          </div>
        </div>

        <div className="ec-urgency-table">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Data envio</th>
                <th>Status geral</th>
                <th>Venc. TPI</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.company_name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{t.data_envio}</td>
                  <td><StatusBadge value={t.status_taxas} /></td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{t.vencimento_tpi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
