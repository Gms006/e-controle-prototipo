import { processes } from "@/data/mockData";
import { FolderKanban, Clock, CheckCircle, AlertTriangle, FileSearch } from "lucide-react";

function SituacaoBadge({ value }: { value: string }) {
  const cls =
    value === "Deferido" ? "ec-s-ok" :
    value === "Em andamento" || value === "Em análise" ? "ec-s-neutral" :
    value === "Pendente" || value === "Aguardando pagamento" ? "ec-s-warn" :
    "ec-s-danger";
  return <span className={`ec-status ${cls}`}>{value}</span>;
}

export default function ProcessosTab() {
  const situacoes = processes.reduce((acc, p) => {
    acc[p.situacao] = (acc[p.situacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const kanbanCols: { title: string; situacoes: string[] }[] = [
    { title: "Triagem / Pendente", situacoes: ["Pendente"] },
    { title: "Aguardando pagamento", situacoes: ["Aguardando pagamento"] },
    { title: "Em análise", situacoes: ["Em análise", "Em andamento"] },
    { title: "Concluído / Deferido", situacoes: ["Deferido"] },
  ];

  return (
    <div className="ec-tab-content">
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Total de processos</label>
              <div className="ec-value">{processes.length}</div>
            </div>
            <div className="ec-kpi-icon"><FolderKanban size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Em análise</label>
              <div className="ec-value">{(situacoes["Em análise"] || 0) + (situacoes["Em andamento"] || 0)}</div>
            </div>
            <div className="ec-kpi-icon"><FileSearch size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Pendentes</label>
              <div className="ec-value">{(situacoes["Pendente"] || 0) + (situacoes["Aguardando pagamento"] || 0)}</div>
              <div className="ec-trend warn">Requer ação</div>
            </div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Clock size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div>
              <label>Deferidos</label>
              <div className="ec-value">{situacoes["Deferido"] || 0}</div>
            </div>
            <div className="ec-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><CheckCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Processos</small>
            <h3>Kanban operacional</h3>
          </div>
          <div className="ec-chips">
            <div className="ec-chip active">Kanban</div>
            <div className="ec-chip">Tabela</div>
          </div>
        </div>

        <div className="ec-kanban">
          {kanbanCols.map(col => {
            const items = processes.filter(p => col.situacoes.includes(p.situacao));
            return (
              <div key={col.title} className="ec-kanban-col">
                <h4>{col.title} <span className="ec-chip">{items.length}</span></h4>
                {items.map(p => (
                  <div key={p.id} className="ec-k-card">
                    <b>{p.company_name}</b>
                    <span>{p.process_type} · {p.operacao}</span>
                    <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{p.protocolo}</div>
                    <div className="ec-mini-tags">
                      <i className={`ec-status ${p.situacao === "Deferido" ? "ec-s-ok" : p.situacao === "Pendente" || p.situacao === "Aguardando pagamento" ? "ec-s-warn" : "ec-s-neutral"}`}>
                        {p.situacao}
                      </i>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full table */}
      <div className="ec-card">
        <div className="ec-section-head">
          <div>
            <small>Detalhes</small>
            <h3>Todos os processos</h3>
          </div>
          <div className="ec-chip">{processes.length} registros</div>
        </div>

        <div className="ec-urgency-table">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Tipo</th>
                <th>Protocolo</th>
                <th>Órgão</th>
                <th>Solicitação</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.company_name}</td>
                  <td>{p.process_type}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.protocolo}</td>
                  <td style={{ fontSize: 12 }}>{p.orgao}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.data_solicitacao}</td>
                  <td><SituacaoBadge value={p.situacao} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
