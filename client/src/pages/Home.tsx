export default function Home() {
  return (
    <div className="ec-page">
      {/* Hero */}
      <div className="ec-hero">
        <div>
          <h1>Protótipo visual — eControle com linguagem SaaS avançada</h1>
          <p>
            Conceito aplicado sobre a base atual do portal: topbar mais limpa com command palette, rail de filtros persistente por contexto,
            KPIs com leitura rápida, painel mais executivo, Taxas em matriz semafórica e Processos com visão kanban. A ideia foi elevar o nível visual
            sem sacrificar densidade operacional.
          </p>
          <div className="ec-pillbar">
            <div className="ec-pill">Base atual preservada</div>
            <div className="ec-pill">Filtros contextuais persistentes</div>
            <div className="ec-pill">Modo densidade</div>
            <div className="ec-pill">Command palette</div>
            <div className="ec-pill">Sem parecer carregado</div>
          </div>
        </div>
        <div className="ec-hero-actions">
          <div className="ec-btn primary">Visão "north-star"</div>
          <div className="ec-btn secondary">Foco em operação real</div>
        </div>
      </div>

      {/* Prototype Shell */}
      <div className="ec-prototype">
        <div className="ec-app-shell">
          {/* Sidebar */}
          <aside className="ec-sidebar">
            <div className="ec-brand">
              <div className="ec-logo"></div>
              <div>
                <b>eControle</b>
                <span>Neto Contabilidade · Console operacional</span>
              </div>
            </div>

            <div>
              <div className="ec-nav-group-title">Principal</div>
              <div className="ec-nav">
                <div className="ec-nav-item active">Painel Executivo <small>Live</small></div>
                <div className="ec-nav-item">Empresas <small>1.284</small></div>
                <div className="ec-nav-item">Licenças <small>312</small></div>
                <div className="ec-nav-item">Taxas <small>148</small></div>
                <div className="ec-nav-item">Processos <small>94</small></div>
                <div className="ec-nav-item">Certificados <small>126</small></div>
              </div>
            </div>

            <div>
              <div className="ec-nav-group-title">Operação</div>
              <div className="ec-nav">
                <div className="ec-nav-item">Notificações <small>27</small></div>
                <div className="ec-nav-item">Filas críticas <small>12</small></div>
                <div className="ec-nav-item">Views salvas <small>8</small></div>
                <div className="ec-nav-item">Automação / Jobs <small>3</small></div>
              </div>
            </div>

            <div className="ec-sidebar-card">
              <h4>Centro Operacional</h4>
              <p>
                Rail esquerdo mais "executivo", sem excesso visual, mas com contadores, atalhos e status útil de operação.
              </p>
              <div className="ec-mini">
                <span>Compacto</span>
                <span>Confortável</span>
                <span>Espaçoso</span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="ec-main">
            {/* Topbar */}
            <div className="ec-topbar">
              <div className="ec-breadcrumb">
                <div className="ec-k">Painel / Hoje</div>
                <h2>Operação tributária e regulatória</h2>
              </div>

              <div className="ec-command">
                <div>🔎 <strong>Pesquisar ou executar comando</strong> · empresa, CNPJ, protocolo, ação rápida…</div>
                <div className="ec-kbd">Ctrl + K</div>
              </div>

              <div className="ec-top-actions">
                <div className="ec-ghost">Densidade: Confortável</div>
                <div className="ec-ghost">Filtros globais · 4</div>
                <div className="ec-icon-btn">🔔<span className="ec-badge-dot">9</span></div>
                <div className="ec-icon-btn">☆</div>
                <div className="ec-icon-btn">👤</div>
              </div>
            </div>

            {/* Content */}
            <div className="ec-content">
              {/* Rail - Filtros */}
              <aside className="ec-rail">
                <div>
                  <div className="ec-section-head">
                    <div>
                      <small>Contexto</small>
                      <h3>Empresas — filtros persistentes</h3>
                    </div>
                    <div className="ec-chip active">14 ativos</div>
                  </div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Status da empresa</p>
                  <div className="ec-chips">
                    <div className="ec-chip active">Ativas</div>
                    <div className="ec-chip">Inativas</div>
                    <div className="ec-chip">Todas</div>
                  </div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Risco CNAE</p>
                  <div className="ec-chips">
                    <div className="ec-chip active">Alto</div>
                    <div className="ec-chip active">Médio</div>
                    <div className="ec-chip">Baixo</div>
                    <div className="ec-chip">Sem mapeamento</div>
                  </div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Certificado</p>
                  <div className="ec-chips">
                    <div className="ec-chip active">Vencendo</div>
                    <div className="ec-chip active">Vencido</div>
                    <div className="ec-chip">Válido</div>
                    <div className="ec-chip">Sem certificado</div>
                  </div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Município</p>
                  <div className="ec-chips">
                    <div className="ec-chip active">Anápolis</div>
                    <div className="ec-chip">Goiânia</div>
                    <div className="ec-chip">Aparecida</div>
                    <div className="ec-chip">+ 9</div>
                  </div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Score de urgência</p>
                  <div className="ec-slider"></div>
                  <div className="ec-legend"><span>0</span><span>100</span></div>
                </div>

                <div className="ec-filter-block">
                  <p className="ec-filter-label">Views salvas</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div className="ec-saved-view">
                      <div>
                        <b>Empresas críticas</b>
                        <span>Risco alto + cert. vencendo</span>
                      </div>
                      <div className="ec-dot"></div>
                    </div>
                    <div className="ec-saved-view">
                      <div>
                        <b>Taxas irregulares</b>
                        <span>Anápolis · envio pendente</span>
                      </div>
                      <div className="ec-dot" style={{ background: "#f59e0b" }}></div>
                    </div>
                    <div className="ec-saved-view">
                      <div>
                        <b>Processos sem resposta</b>
                        <span>7+ dias úteis</span>
                      </div>
                      <div className="ec-dot" style={{ background: "#ef4444" }}></div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Panel */}
              <section className="ec-panel">
                {/* Subnav */}
                <div className="ec-subnav">
                  <div className="ec-tab active">Painel</div>
                  <div className="ec-tab">Empresas</div>
                  <div className="ec-tab">Licenças</div>
                  <div className="ec-tab">Taxas</div>
                  <div className="ec-tab">Processos</div>
                  <div className="ec-tab">Certificados</div>
                </div>

                {/* Active Filters */}
                <div className="ec-active-filters">
                  <div className="ec-af">Município: Anápolis ✕</div>
                  <div className="ec-af">Risco: Alto, Médio ✕</div>
                  <div className="ec-af">Certificado: Vencendo, Vencido ✕</div>
                  <div className="ec-af">Status: Ativas ✕</div>
                  <div className="ec-af">Score: 42–100 ✕</div>
                </div>

                {/* KPI Grid */}
                <div className="ec-grid-hero">
                  <div className="ec-kpi">
                    <div className="ec-kpi-top">
                      <div>
                        <label>Empresas sob atenção</label>
                        <div className="ec-value">184</div>
                        <div className="ec-trend warn">+12 esta semana</div>
                      </div>
                      <div className="ec-kpi-icon">🏢</div>
                    </div>
                    <div className="ec-spark"></div>
                  </div>

                  <div className="ec-kpi">
                    <div className="ec-kpi-top">
                      <div>
                        <label>Licenças vencendo</label>
                        <div className="ec-value">39</div>
                        <div className="ec-trend warn">17 em até 7 dias</div>
                      </div>
                      <div className="ec-kpi-icon">📄</div>
                    </div>
                    <div className="ec-spark" style={{
                      background: `
                        linear-gradient(180deg, rgba(245,158,11,.14), rgba(245,158,11,.02)),
                        linear-gradient(90deg, transparent 0 8%, rgba(245,158,11,.72) 8% 10%, transparent 10% 18%, rgba(245,158,11,.55) 18% 20%, transparent 20% 34%, rgba(245,158,11,.82) 34% 36%, transparent 36% 49%, rgba(245,158,11,.65) 49% 51%, transparent 51% 70%, rgba(245,158,11,.92) 70% 72%, transparent 72% 80%)`,
                      borderColor: "#fff1c4"
                    }}></div>
                  </div>

                  <div className="ec-kpi">
                    <div className="ec-kpi-top">
                      <div>
                        <label>Taxas irregulares</label>
                        <div className="ec-value">61</div>
                        <div className="ec-trend warn">22 com envio pendente</div>
                      </div>
                      <div className="ec-kpi-icon">💰</div>
                    </div>
                    <div className="ec-spark"></div>
                  </div>

                  <div className="ec-kpi">
                    <div className="ec-kpi-top">
                      <div>
                        <label>Processos críticos</label>
                        <div className="ec-value">27</div>
                        <div className="ec-trend up">-8 vs. último ciclo</div>
                      </div>
                      <div className="ec-kpi-icon">⚡</div>
                    </div>
                    <div className="ec-spark" style={{
                      background: `
                        linear-gradient(180deg, rgba(239,68,68,.14), rgba(239,68,68,.02)),
                        linear-gradient(90deg, transparent 0 10%, rgba(239,68,68,.72) 10% 12%, transparent 12% 23%, rgba(239,68,68,.55) 23% 25%, transparent 25% 37%, rgba(239,68,68,.86) 37% 39%, transparent 39% 55%, rgba(239,68,68,.66) 55% 57%, transparent 57% 68%, rgba(239,68,68,.92) 68% 70%, transparent 70% 82%)`,
                      borderColor: "#ffd9d9"
                    }}></div>
                  </div>
                </div>

                {/* Wide Grid - Heatmap + Urgency Table */}
                <div className="ec-wide-grid">
                  <div className="ec-card">
                    <div className="ec-section-head">
                      <div>
                        <small>Painel</small>
                        <h3>Mapa de calor de vencimentos</h3>
                      </div>
                      <div className="ec-chip">Últimos 6 meses</div>
                    </div>

                    <div className="ec-heatmap">
                      <div></div>
                      <div className="ec-month">Abr</div>
                      <div className="ec-month">Mai</div>
                      <div className="ec-month">Jun</div>
                      <div className="ec-month">Jul</div>
                      <div className="ec-month">Ago</div>
                      <div className="ec-month">Set</div>

                      <div className="ec-label">Bombeiros / CERCON</div>
                      <div className="ec-cell ec-c2">7</div>
                      <div className="ec-cell ec-c4">14</div>
                      <div className="ec-cell ec-c1">3</div>
                      <div className="ec-cell ec-c2">8</div>
                      <div className="ec-cell ec-c3">10</div>
                      <div className="ec-cell ec-c1">2</div>

                      <div className="ec-label">Funcionamento</div>
                      <div className="ec-cell ec-c3">12</div>
                      <div className="ec-cell ec-c4">19</div>
                      <div className="ec-cell ec-c2">9</div>
                      <div className="ec-cell ec-c1">4</div>
                      <div className="ec-cell ec-c2">8</div>
                      <div className="ec-cell ec-c1">3</div>

                      <div className="ec-label">Sanitário</div>
                      <div className="ec-cell ec-c1">4</div>
                      <div className="ec-cell ec-c2">8</div>
                      <div className="ec-cell ec-c3">11</div>
                      <div className="ec-cell ec-c4">13</div>
                      <div className="ec-cell ec-c2">9</div>
                      <div className="ec-cell ec-c1">4</div>

                      <div className="ec-label">Ambiental</div>
                      <div className="ec-cell ec-c1">2</div>
                      <div className="ec-cell ec-c1">3</div>
                      <div className="ec-cell ec-c2">7</div>
                      <div className="ec-cell ec-c3">9</div>
                      <div className="ec-cell ec-c4">12</div>
                      <div className="ec-cell ec-c2">6</div>

                      <div className="ec-label">Certificados</div>
                      <div className="ec-cell ec-c4">17</div>
                      <div className="ec-cell ec-c2">8</div>
                      <div className="ec-cell ec-c1">4</div>
                      <div className="ec-cell ec-c1">2</div>
                      <div className="ec-cell ec-c2">6</div>
                      <div className="ec-cell ec-c3">10</div>
                    </div>
                  </div>

                  <div className="ec-card">
                    <div className="ec-section-head">
                      <div>
                        <small>Fila</small>
                        <h3>Ação urgente</h3>
                      </div>
                      <div className="ec-chip active">Top 5</div>
                    </div>

                    <div className="ec-urgency-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Score</th>
                            <th>Empresa</th>
                            <th>Tipo</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><div className="ec-score">98</div></td>
                            <td>Auto Peças Primavera</td>
                            <td>Licença Sanitária</td>
                            <td><span className="ec-status ec-s-danger">Vencida</span></td>
                          </tr>
                          <tr>
                            <td><div className="ec-score">94</div></td>
                            <td>Clínica Santa Helena</td>
                            <td>Processo CERCON</td>
                            <td><span className="ec-status ec-s-warn">15 dias sem atualização</span></td>
                          </tr>
                          <tr>
                            <td><div className="ec-score">91</div></td>
                            <td>GH Sistemas</td>
                            <td>TPI</td>
                            <td><span className="ec-status ec-s-danger">Em aberto</span></td>
                          </tr>
                          <tr>
                            <td><div className="ec-score">88</div></td>
                            <td>Mercado Vitória</td>
                            <td>Certificado</td>
                            <td><span className="ec-status ec-s-warn">Vence em 3 dias</span></td>
                          </tr>
                          <tr>
                            <td><div className="ec-score">84</div></td>
                            <td>Construtora Araguaia</td>
                            <td>Funcionamento</td>
                            <td><span className="ec-status ec-s-neutral">Condicionado</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section Grid - Matrix + Table */}
                <div className="ec-section-grid">
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

                      <div className="ec-m-name">GH Sistemas</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-yellow">7d</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-red">AB</div>
                      <div className="ec-m-cell ec-yellow">Envio</div>

                      <div className="ec-m-name">Clínica Santa Helena</div>
                      <div className="ec-m-cell ec-yellow">Pend.</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-red">Venc.</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-green">Pago</div>

                      <div className="ec-m-name">Mercado Vitória</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-yellow">Pend.</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-yellow">30d</div>
                      <div className="ec-m-cell ec-red">AB</div>

                      <div className="ec-m-name">Construtora Araguaia</div>
                      <div className="ec-m-cell ec-red">AB</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-gray">—</div>
                      <div className="ec-m-cell ec-yellow">Pend.</div>
                      <div className="ec-m-cell ec-yellow">Pend.</div>
                      <div className="ec-m-cell ec-green">OK</div>
                      <div className="ec-m-cell ec-green">Pago</div>
                    </div>

                    <div className="ec-hover-card">
                      <strong>Hover / popover da célula:</strong> ao passar em "AB", o usuário vê
                      status bruto, anos em aberto, último envio, método, observação e atalho para edição inline.
                    </div>
                  </div>

                  <div className="ec-card">
                    <div className="ec-section-head">
                      <div>
                        <small>Empresas</small>
                        <h3>Tabela densa sem ficar pesada</h3>
                      </div>
                      <div className="ec-chip active">Compacto</div>
                    </div>

                    <div className="ec-urgency-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Empresa</th>
                            <th>Score</th>
                            <th>Risco</th>
                            <th>Cert.</th>
                            <th>Pendências</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>GH Sistemas</td>
                            <td>86</td>
                            <td><span className="ec-status ec-s-warn">Médio</span></td>
                            <td><span className="ec-status ec-s-ok">Válido</span></td>
                            <td>4</td>
                          </tr>
                          <tr>
                            <td>Clínica Santa Helena</td>
                            <td>94</td>
                            <td><span className="ec-status ec-s-danger">Alto</span></td>
                            <td><span className="ec-status ec-s-warn">Vence 3d</span></td>
                            <td>7</td>
                          </tr>
                          <tr>
                            <td>Construtora Araguaia</td>
                            <td>79</td>
                            <td><span className="ec-status ec-s-warn">Médio</span></td>
                            <td><span className="ec-status ec-s-danger">Vencido</span></td>
                            <td>5</td>
                          </tr>
                          <tr>
                            <td>Mercado Vitória</td>
                            <td>88</td>
                            <td><span className="ec-status ec-s-danger">Alto</span></td>
                            <td><span className="ec-status ec-s-ok">Válido</span></td>
                            <td>6</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Kanban */}
                <div className="ec-card">
                  <div className="ec-section-head">
                    <div>
                      <small>Processos</small>
                      <h3>Kanban operacional com leitura executiva</h3>
                    </div>
                    <div className="ec-chips">
                      <div className="ec-chip active">Kanban</div>
                      <div className="ec-chip">Tabela</div>
                      <div className="ec-chip">Cards</div>
                    </div>
                  </div>

                  <div className="ec-kanban">
                    <div className="ec-kanban-col">
                      <h4>Triagem <span className="ec-chip">8</span></h4>
                      <div className="ec-k-card">
                        <b>Clínica Santa Helena</b>
                        <span>CERCON · protocolo pendente</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-danger">Sem protocolo</i>
                          <i className="ec-status ec-s-warn">Urgência 94</i>
                        </div>
                      </div>
                      <div className="ec-k-card">
                        <b>Mercado Vitória</b>
                        <span>Funcionamento · documentação</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-warn">OBS aberta</i>
                        </div>
                      </div>
                    </div>

                    <div className="ec-kanban-col">
                      <h4>Aguardando pagamento <span className="ec-chip">5</span></h4>
                      <div className="ec-k-card">
                        <b>Construtora Araguaia</b>
                        <span>Uso do Solo · taxa emitida</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-danger">7 dias úteis</i>
                        </div>
                      </div>
                    </div>

                    <div className="ec-kanban-col">
                      <h4>Em análise <span className="ec-chip">11</span></h4>
                      <div className="ec-k-card">
                        <b>Auto Peças Primavera</b>
                        <span>Alvará Sanitário · vistoria</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-warn">15 dias sem update</i>
                        </div>
                      </div>
                      <div className="ec-k-card">
                        <b>GH Sistemas</b>
                        <span>Bombeiros · validação</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-ok">Em andamento</i>
                        </div>
                      </div>
                    </div>

                    <div className="ec-kanban-col">
                      <h4>Concluir / Regularizar <span className="ec-chip">3</span></h4>
                      <div className="ec-k-card">
                        <b>Mercado Vitória</b>
                        <span>Funcionamento · deferido</span>
                        <div className="ec-mini-tags">
                          <i className="ec-status ec-s-ok">Pronto para fechamento</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer Note */}
      <div className="ec-footer-note">
        Este mockup combina o que já existe no portal com uma direção visual mais premium: shell mais estável, hierarquia mais clara,
        filtros laterais persistentes, menos drawers desnecessários e visualizações que ajudam a "varrer" o estado da operação mais rápido.
      </div>
    </div>
  );
}
