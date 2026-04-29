import { Job, getJobTypeLabel, getJobStatusLabel, getJobStatusColor } from "@/data/mockData";
import { X, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const progress = job.total > 0 ? (job.processed / job.total) * 100 : 0;
  const successRate = job.processed > 0 ? ((job.ok_count / job.processed) * 100).toFixed(1) : "0.0";

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-modal-content" onClick={e => e.stopPropagation()}>
        <div className="ec-modal-header">
          <div>
            <div className="ec-breadcrumb">
              <span>AUTOMAÇÕES</span>
              <span>•</span>
              <span>{getJobTypeLabel(job.job_type)}</span>
            </div>
            <h2>Detalhes do Job</h2>
            <p>{job.id}</p>
          </div>
          <button className="ec-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="ec-modal-body">
          {/* Status & Timeline */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Status</h3>
            </div>
            <div className="ec-form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label>Status do Job</label>
                <div style={{ padding: "0.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getJobStatusColor(job.status) }}></div>
                  <span style={{ fontWeight: 500 }}>{getJobStatusLabel(job.status)}</span>
                </div>
              </div>
              <div>
                <label>Tipo de Job</label>
                <div style={{ padding: "0.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem" }}>
                  {getJobTypeLabel(job.job_type)}
                </div>
              </div>
              <div>
                <label>Iniciado em</label>
                <div style={{ padding: "0.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
                  {job.started_at ? new Date(job.started_at).toLocaleString("pt-BR") : "—"}
                </div>
              </div>
              <div>
                <label>Concluído em</label>
                <div style={{ padding: "0.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
                  {job.finished_at ? new Date(job.finished_at).toLocaleString("pt-BR") : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Progresso</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label>Progresso geral</label>
                <div style={{ marginTop: "0.5rem" }}>
                  <div className="ec-progress-bar" style={{ height: "8px" }}>
                    <div className="ec-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6B7280" }}>
                    {job.processed} / {job.total} ({progress.toFixed(1)}%)
                  </div>
                </div>
              </div>
              <div>
                <label>Taxa de sucesso</label>
                <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 600, color: "#10B981" }}>
                  {successRate}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.5rem" }}>OK</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#10B981" }}>{job.ok_count}</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.5rem" }}>Erros</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#EF4444" }}>{job.error_count}</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.5rem" }}>Ignorados</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#F59E0B" }}>{job.skipped_count}</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.5rem" }}>Total</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{job.total}</div>
              </div>
            </div>
          </div>

          {/* Current Processing */}
          {job.current_cnpj && (
            <div className="ec-form-section">
              <div className="ec-form-section-head">
                <h3>Processando</h3>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.25rem" }}>CNPJ</div>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{job.current_cnpj}</div>
                {job.current_company_id && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6B7280" }}>
                    ID: {job.current_company_id}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {job.errors.length > 0 && (
            <div className="ec-form-section">
              <div className="ec-form-section-head">
                <h3>Erros ({job.errors.length})</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {job.errors.map((err, idx) => (
                  <div key={idx} style={{ padding: "0.75rem", backgroundColor: "#FEF2F2", borderLeft: "3px solid #EF4444", borderRadius: "0.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                      <AlertCircle size={16} style={{ color: "#EF4444", marginTop: "0.125rem", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#DC2626" }}>{err.error}</div>
                        {err.cnpj && <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.25rem" }}>CNPJ: {err.cnpj}</div>}
                        {err.timestamp && <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.25rem" }}>{new Date(err.timestamp).toLocaleTimeString("pt-BR")}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {Object.keys(job.meta).length > 0 && (
            <div className="ec-form-section">
              <div className="ec-form-section-head">
                <h3>Metadados</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {Object.entries(job.meta).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</label>
                    <div style={{ padding: "0.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", fontSize: "0.875rem", wordBreak: "break-word" }}>
                      {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ec-modal-footer">
          <button className="ec-btn-secondary" onClick={onClose}>
            Fechar
          </button>
          {job.status === "running" && (
            <>
              <button className="ec-btn-secondary">Pausar</button>
              <button className="ec-btn-danger">Cancelar</button>
            </>
          )}
          {job.status === "failed" && (
            <button className="ec-btn-primary">Reexecutar</button>
          )}
        </div>
      </div>
    </div>
  );
}
