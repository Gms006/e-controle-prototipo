import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface LicenseEditModalProps {
  company: string;
  licenseType: string;
  licenseId: string;
  onClose: () => void;
}

export default function LicenseEditModal({
  company,
  licenseType,
  licenseId,
  onClose,
}: LicenseEditModalProps) {
  const [status, setStatus] = useState("Vencido");
  const [vencimento, setVencimento] = useState("01/08/2024");
  const [tipoLicenca, setTipoLicenca] = useState("Definitivo");
  const [observacao, setObservacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [proximaAcao, setProximaAcao] = useState("");
  const [expandDetails, setExpandDetails] = useState(false);

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log({
      company,
      licenseType,
      status,
      vencimento,
      tipoLicenca,
      observacao,
      responsavel,
      proximaAcao,
    });
    onClose();
  };

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-modal-content ec-license-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ec-modal-header">
          <div className="ec-modal-breadcrumb">
            <span className="ec-modal-breadcrumb-item">{company}</span>
          </div>
          <button className="ec-modal-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <div className="ec-modal-title-section">
          <h2>{licenseType}</h2>
          <p className="ec-modal-subtitle">ID: {licenseId}</p>
        </div>

        {/* Form */}
        <div className="ec-modal-form">
          {/* Status */}
          <div className="ec-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="ec-form-select"
            >
              <option>Vencido</option>
              <option>Válido</option>
              <option>Vencendo</option>
              <option>Aguardando renovação</option>
            </select>
          </div>

          {/* Vencimento */}
          <div className="ec-form-group">
            <label htmlFor="vencimento">Vencimento</label>
            <div className="ec-form-date-wrapper">
              <input
                id="vencimento"
                type="text"
                placeholder="dd/mm/yyyy"
                value={vencimento}
                onChange={e => setVencimento(e.target.value)}
                className="ec-form-input"
              />
              <button className="ec-form-date-btn" type="button">
                📅
              </button>
            </div>
          </div>

          {/* Tipo de Licença */}
          <div className="ec-form-group">
            <label htmlFor="tipoLicenca">Tipo de Licença</label>
            <div className="ec-form-select-wrapper">
              <select
                id="tipoLicenca"
                value={tipoLicenca}
                onChange={e => setTipoLicenca(e.target.value)}
                className="ec-form-select"
              >
                <option>Definitivo</option>
                <option>Condicionado</option>
                <option>Provisório</option>
              </select>
              <ChevronDown size={14} className="ec-form-select-icon" />
            </div>
          </div>

          {/* Observação */}
          <div className="ec-form-group ec-form-group-full">
            <label htmlFor="observacao">Observação</label>
            <textarea
              id="observacao"
              placeholder="Notas internas sobre a licença"
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              className="ec-form-textarea"
              rows={4}
            />
          </div>

          {/* Responsável */}
          <div className="ec-form-group">
            <label htmlFor="responsavel">Responsável</label>
            <input
              id="responsavel"
              type="text"
              placeholder="Nome do responsável"
              value={responsavel}
              onChange={e => setResponsavel(e.target.value)}
              className="ec-form-input"
            />
          </div>

          {/* Próxima ação */}
          <div className="ec-form-group">
            <label htmlFor="proximaAcao">Próxima ação</label>
            <input
              id="proximaAcao"
              type="text"
              placeholder="Descrição da próxima ação"
              value={proximaAcao}
              onChange={e => setProximaAcao(e.target.value)}
              className="ec-form-input"
            />
          </div>

          {/* Detalhes sob demanda */}
          <div className="ec-form-group ec-form-group-full">
            <button
              type="button"
              className="ec-form-collapsible"
              onClick={() => setExpandDetails(!expandDetails)}
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                style={{
                  transform: expandDetails ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
              Detalhes sob demanda
            </button>
            {expandDetails && (
              <div className="ec-form-collapsible-content">
                <div className="ec-form-detail-row">
                  <span>Protocolo:</span>
                  <span>—</span>
                </div>
                <div className="ec-form-detail-row">
                  <span>Data de emissão:</span>
                  <span>—</span>
                </div>
                <div className="ec-form-detail-row">
                  <span>Órgão emissor:</span>
                  <span>—</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="ec-modal-footer">
          <button className="ec-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ec-btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
