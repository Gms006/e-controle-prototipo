import { useState } from "react";
import { X, Download } from "lucide-react";

interface NewCompanyModalProps {
  onClose: () => void;
}

export default function NewCompanyModal({ onClose }: NewCompanyModalProps) {
  const [docType, setDocType] = useState("CNPJ");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [apelido, setApelido] = useState("");
  const [situacao, setSituacao] = useState("Ativa");
  const [porte, setPorte] = useState("");
  const [im, setIm] = useState("");
  const [imNaoPossui, setImNaoPossui] = useState(false);
  const [ie, setIe] = useState("");
  const [ieNaoPossui, setIeNaoPossui] = useState(false);
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mei, setMei] = useState(false);
  const [endFiscal, setEndFiscal] = useState(false);
  const [representante, setRepresentante] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [responsavelFiscal, setResponsavelFiscal] = useState("");
  const [telefone, setTelefone] = useState("");
  const [obs, setObs] = useState("");
  const [addLicencas, setAddLicencas] = useState(false);
  const [addTaxas, setAddTaxas] = useState(false);

  return (
    <div className="ec-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ec-form-modal">
        {/* Header */}
        <div className="ec-form-modal-header">
          <div>
            <div className="ec-form-modal-breadcrumb">CADASTRO</div>
            <h2 className="ec-form-modal-title">Nova Empresa</h2>
          </div>
          <button className="ec-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="ec-form-modal-body">

          {/* Dados principais */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Dados principais</h3>
              <p>Identificação e situação da empresa</p>
            </div>

            <div className="ec-form-field">
              <label>Documento</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className="ec-form-select">
                <option>CNPJ</option>
                <option>CPF</option>
              </select>
            </div>

            <div className="ec-form-row-action">
              <input
                className="ec-form-input"
                placeholder=""
                value={cnpj}
                onChange={e => setCnpj(e.target.value)}
              />
              <button className="ec-btn-primary" style={{ whiteSpace: "nowrap" }}>
                <Download size={14} strokeWidth={1.6} /> Importar
              </button>
            </div>

            <div className="ec-form-field">
              <label>Razão Social</label>
              <input className="ec-form-input" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} />
            </div>

            <div className="ec-form-field">
              <label>Apelido (Pasta)</label>
              <input className="ec-form-input" value={apelido} onChange={e => setApelido(e.target.value)} />
              <small className="ec-form-hint">Nome exato da pasta em G:/EMPRESAS/&lt;PASTA&gt;</small>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Situação</label>
                <select className="ec-form-select" value={situacao} onChange={e => setSituacao(e.target.value)}>
                  <option>Ativa</option>
                  <option>Inativa</option>
                  <option>Suspensa</option>
                  <option>Baixada</option>
                </select>
              </div>
              <div className="ec-form-field">
                <label>Porte</label>
                <input className="ec-form-input" value={porte} onChange={e => setPorte(e.target.value)} placeholder="Ex: Micro, Pequeno…" />
              </div>
            </div>
          </div>

          {/* Cadastro */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Cadastro</h3>
              <p>Dados cadastrais da empresa</p>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Inscrição Municipal</label>
                <div className="ec-form-input-with-toggle">
                  <input
                    className="ec-form-input"
                    value={im}
                    onChange={e => setIm(e.target.value)}
                    disabled={imNaoPossui}
                  />
                  <label className="ec-form-toggle-label">
                    <input type="radio" checked={imNaoPossui} onChange={() => setImNaoPossui(!imNaoPossui)} />
                    Não possui
                  </label>
                </div>
              </div>
              <div className="ec-form-field">
                <label>Inscrição Estadual</label>
                <div className="ec-form-input-with-toggle">
                  <input
                    className="ec-form-input"
                    value={ie}
                    onChange={e => setIe(e.target.value)}
                    disabled={ieNaoPossui}
                  />
                  <label className="ec-form-toggle-label">
                    <input type="radio" checked={ieNaoPossui} onChange={() => setIeNaoPossui(!ieNaoPossui)} />
                    Não possui
                  </label>
                </div>
              </div>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Município</label>
                <input className="ec-form-input" value={municipio} onChange={e => setMunicipio(e.target.value)} />
              </div>
              <div className="ec-form-field">
                <label>UF</label>
                <input className="ec-form-input" value={uf} onChange={e => setUf(e.target.value)} placeholder="GO" />
              </div>
            </div>

            <div className="ec-form-field">
              <label>Categoria</label>
              <input className="ec-form-input" value={categoria} onChange={e => setCategoria(e.target.value)} />
            </div>

            <div className="ec-form-checkboxes">
              <label className="ec-form-checkbox-label">
                <input type="checkbox" checked={mei} onChange={e => setMei(e.target.checked)} />
                MEI?
              </label>
              <label className="ec-form-checkbox-label">
                <input type="checkbox" checked={endFiscal} onChange={e => setEndFiscal(e.target.checked)} />
                Endereço Fiscal/Holding?
              </label>
            </div>
          </div>

          {/* Contato */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Contato</h3>
              <p>Responsáveis e canais de contato</p>
            </div>

            <div className="ec-form-field">
              <label>Representante Legal</label>
              <input className="ec-form-input" value={representante} onChange={e => setRepresentante(e.target.value)} />
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>CPF</label>
                <input className="ec-form-input" value={cpf} onChange={e => setCpf(e.target.value)} />
              </div>
              <div className="ec-form-field">
                <label>E-mail</label>
                <input className="ec-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="ec-form-grid-2">
              <div className="ec-form-field">
                <label>Responsável Fiscal</label>
                <select className="ec-form-select" value={responsavelFiscal} onChange={e => setResponsavelFiscal(e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Ana Lima</option>
                  <option>Carlos Souza</option>
                  <option>Fernanda Costa</option>
                </select>
              </div>
              <div className="ec-form-field">
                <label>Telefone</label>
                <input className="ec-form-input" value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Observação */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Observação</h3>
              <p>Notas internas da empresa</p>
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

          {/* Licenças */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Licenças</h3>
              <p>Pré-cadastro opcional para nova empresa</p>
            </div>
            <label className="ec-form-checkbox-label">
              <input type="checkbox" checked={addLicencas} onChange={e => setAddLicencas(e.target.checked)} />
              Adicionar Licenças
            </label>
          </div>

          {/* Taxas */}
          <div className="ec-form-section">
            <div className="ec-form-section-head">
              <h3>Taxas</h3>
              <p>Pré-cadastro opcional para nova empresa</p>
            </div>
            <label className="ec-form-checkbox-label">
              <input type="checkbox" checked={addTaxas} onChange={e => setAddTaxas(e.target.checked)} />
              Adicionar Taxas
            </label>
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
