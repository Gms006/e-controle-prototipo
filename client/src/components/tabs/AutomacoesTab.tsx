import { useState, useMemo } from "react";
import { jobs, getJobTypeLabel, getJobStatusLabel, getJobStatusColor, Job } from "@/data/mockData";
import { Activity, Clock, CheckCircle, AlertCircle, Zap, Play, Pause, RotateCcw, X } from "lucide-react";
import TabFilters, { ViewMode, ActiveFilters, SortDir } from "@/components/TabFilters";
import JobDetailModal from "@/components/JobDetailModal";

const FILTERS = [
  {
    key: "job_type",
    label: "Tipo de Job",
    options: [
      { value: "receitaws_bulk_sync", label: "Receita WS Bulk Sync" },
      { value: "tax_portal_sync", label: "Tax Portal Sync" },
      { value: "licence_scan_full", label: "Licence Scan Full" },
      { value: "notification_operational_scan", label: "Notification Operational Scan" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "running", label: "Em execução" },
      { value: "completed", label: "Concluído" },
      { value: "failed", label: "Falhou" },
      { value: "queued", label: "Aguardando" },
      { value: "paused", label: "Pausado" },
    ],
  },
];

const SORT_OPTIONS = [
  { value: "started_at", label: "Data de início" },
  { value: "job_type", label: "Tipo de job" },
  { value: "status", label: "Status" },
  { value: "progress", label: "Progresso" },
];

export default function AutomacoesTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortBy, setSortBy] = useState("started_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  function handleFilterChange(key: string, values: string[]) {
    setActiveFilters(prev => ({ ...prev, [key]: values }));
  }

  function handleSortChange(value: string, dir: SortDir) {
    setSortBy(value);
    setSortDir(dir);
  }

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      if (search) {
        const q = search.toLowerCase();
        if (!j.id.toLowerCase().includes(q) && !getJobTypeLabel(j.job_type).toLowerCase().includes(q)) return false;
      }
      if (activeFilters.job_type?.length && !activeFilters.job_type.includes(j.job_type)) return false;
      if (activeFilters.status?.length && !activeFilters.status.includes(j.status)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "started_at") {
        const aTime = new Date(a.started_at || 0).getTime();
        const bTime = new Date(b.started_at || 0).getTime();
        cmp = aTime - bTime;
      } else if (sortBy === "job_type") {
        cmp = a.job_type.localeCompare(b.job_type);
      } else if (sortBy === "status") {
        const statusOrder = { running: 0, queued: 1, paused: 2, completed: 3, failed: 4 };
        cmp = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
      } else if (sortBy === "progress") {
        const aProgress = a.total > 0 ? a.processed / a.total : 0;
        const bProgress = b.total > 0 ? b.processed / b.total : 0;
        cmp = aProgress - bProgress;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, activeFilters, sortBy, sortDir]);

  const running = jobs.filter(j => j.status === "running").length;
  const completed = jobs.filter(j => j.status === "completed").length;
  const failed = jobs.filter(j => j.status === "failed").length;
  const totalProcessed = jobs.reduce((acc, j) => acc + j.processed, 0);
  const totalJobs = jobs.reduce((acc, j) => acc + j.total, 0);

  return (
    <div className="ec-tab-content">
      {/* KPIs */}
      <div className="ec-grid-hero">
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Jobs em execução</label><div className="ec-value">{running}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-blue"><Activity size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Concluídos</label><div className="ec-value">{completed}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-green"><CheckCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Falhados</label><div className="ec-value">{failed}</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-red"><AlertCircle size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
        <div className="ec-kpi">
          <div className="ec-kpi-top">
            <div><label>Progresso geral</label><div className="ec-value">{totalJobs > 0 ? Math.round((totalProcessed / totalJobs) * 100) : 0}%</div></div>
            <div className="ec-kpi-icon ec-kpi-icon-amber"><Zap size={20} strokeWidth={1.6} /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TabFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por ID ou tipo de job…"
        filters={FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        resultCount={filtered.length}
      />

      {/* Jobs List */}
      <div className="ec-card">
        <div className="ec-section-head"><div><small>Automações</small><h3>Jobs em execução</h3></div></div>
        <div className="ec-jobs-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
              <p>Nenhum job encontrado.</p>
            </div>
          ) : (
            filtered.map(job => {
              const progress = job.total > 0 ? (job.processed / job.total) * 100 : 0;
              return (
                <div key={job.id} className="ec-job-item">
                  <div className="ec-job-header">
                    <div className="ec-job-info">
                      <div className="ec-job-title">
                        <span style={{ fontWeight: 600 }}>{getJobTypeLabel(job.job_type)}</span>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>ID: {job.id}</span>
                      </div>
                      <div className="ec-job-meta">
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          {job.started_at ? new Date(job.started_at).toLocaleString("pt-BR") : "—"}
                        </span>
                        {job.current_cnpj && <span style={{ fontSize: 12, color: "#9CA3AF" }}>CNPJ: {job.current_cnpj}</span>}
                      </div>
                    </div>
                    <div className="ec-job-status">
                      <span className="ec-status" style={{ backgroundColor: getJobStatusColor(job.status), color: "#FFF" }}>
                        {getJobStatusLabel(job.status)}
                      </span>
                    </div>
                  </div>

                  <div className="ec-job-progress">
                    <div className="ec-progress-bar">
                      <div className="ec-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="ec-progress-text">
                      <span>{job.processed} / {job.total}</span>
                      <span style={{ color: "#10B981" }}>✓ {job.ok_count}</span>
                      {job.error_count > 0 && <span style={{ color: "#EF4444" }}>✗ {job.error_count}</span>}
                    </div>
                  </div>

                  <div className="ec-job-actions">
                    <button className="ec-job-action-btn" onClick={() => setSelectedJob(job)}>
                      <Clock size={14} />
                      Detalhes
                    </button>
                    {job.status === "running" && (
                      <>
                        <button className="ec-job-action-btn">
                          <Pause size={14} />
                          Pausar
                        </button>
                        <button className="ec-job-action-btn">
                          <X size={14} />
                          Cancelar
                        </button>
                      </>
                    )}
                    {job.status === "failed" && (
                      <button className="ec-job-action-btn">
                        <RotateCcw size={14} />
                        Reexecutar
                      </button>
                    )}
                    {job.status === "paused" && (
                      <button className="ec-job-action-btn">
                        <Play size={14} />
                        Retomar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
