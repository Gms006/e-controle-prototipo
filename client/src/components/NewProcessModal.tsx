import { useState } from "react";
import { X } from "lucide-react";
import { companies } from "@/data/mockData";

interface NewProcessModalProps {
  onClose: () => void;
}

const PROCESS_TYPES = [
  "Diversos", "Renovação", "Cercon", "Cancel de Tributos", "Alteração",
  "Uso do Solo", "Licença Ambiental", "Alvará Sanitário", "Abertura",
];

const SITUACOES = [
  "Em andamento", "Aguardando vistoria", "Em análise",
  "Deferido", "Indeferido", "Concluído",
];

const OPERACOES = [
  "Abertura", "Renovação", "Alteração", "Baixa", "Outros",
];

const ORGAOS = [
  "Prefeitura Municipal", "Vigilância Sanitária", "Corpo de Bombeiros",
  "SEMARH", "JUCEG", "Receita Federal", "Outros",
];

export default function NewProcessModal({ onClose }: NewProcessModalProps) {
  const [empresaNaoCadastrada, setEmpresaNaoCadastrada] = useState(false);
  const [empresaId, setEmpresaId] = useState("");
  const [tipo, setTipo] = useState("Diversos");
  const [protocolo, setProtocolo] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [situacao, setSituacao] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [operacao, setOperacao] = useState("");
  const [orgao, setOrgao] = useState("");
  const [obs, setObs] = useState("");

  return (
    <div className="ec-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ec-form-modal">
        {/* Header */}
        <div className="ec-form-modal-header">
          <div>
            <div className="ec-form-modal-breadcrumb">CADASTRO</div>
            <h2 className="ec-form-modal-title">Novo Processo</h2>
          </div>
          <button className="ec-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="ec-form-modal-body">

          {/* Dados do Processo */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Dados do Processo</h3>
              <p>Dados principais e status</p>
            </div>

            <div className="ec-form-field">
              <label>
                Empresa <span className="ec-form-required">*</span>
              </label>
              <label className="ec-form-checkbox-label" style={{ marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={empresaNaoCadastrada}
                  onChange={e => setEmpresaNaoCadastrada(e.target.checked)}
                />
                Empresa não cadastrada
              </label>
              {!empresaNaoCadastrada ? (
                <select className="ec-form-select" value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
                  <option value="">Selecione</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
                  ))}
                </select>
              ) : (
                <input className="ec-form-input" placeholder="Nome da empresa" />
              )}
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Tipo</label>
                <select className="ec-form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                  {PROCESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="ec-form-field">
                <label>
                  Protocolo <span className="ec-form-required">*</span>
                </label>
                <input className="ec-form-input" value={protocolo} onChange={e => setProtocolo(e.target.value)} />
              </div>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Data solicitação</label>
                <input
                  className="ec-form-input"
                  type="date"
                  value={dataSolicitacao}
                  onChange={e => setDataSolicitacao(e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              <div className="ec-form-field">
                <label>Situação</label>
                <select className="ec-form-select" value={situacao} onChange={e => setSituacao(e.target.value)}>
                  <option value="">Selecione</option>
                  {SITUACOES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Detalhes</h3>
              <p>Campos por tipo de processo</p>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Município</label>
                <input className="ec-form-input" value={municipio} onChange={e => setMunicipio(e.target.value)} />
              </div>
              <div className="ec-form-field">
                <label>
                  Operação <span className="ec-form-required">*</span>
                </label>
                <select className="ec-form-select" value={operacao} onChange={e => setOperacao(e.target.value)}>
                  <option value="">Selecione</option>
                  {OPERACOES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="ec-form-field">
              <label>
                Órgão <span className="ec-form-required">*</span>
              </label>
              <select className="ec-form-select" value={orgao} onChange={e => setOrgao(e.target.value)}>
                <option value="">Selecione</option>
                {ORGAOS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Observação */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Observação</h3>
              <p>Notas internas do processo</p>
            </div>
            <div className="ec-form-field">
              <label>Observação</label>
              <textarea
                className="ec-form-textarea"
                rows={4}
                value={obs}
                onChange={e => setObs(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="ec-form-modal-footer">
          <button className="ec-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="ec-btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  );
}
