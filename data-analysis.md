# Análise dos Modelos de Dados — eControle

## Empresas (companies)
- id, cnpj, cpf, razao_social, nome_fantasia, municipio, uf, is_active
- Profile: porte, status_empresa, categoria, inscricao_estadual, inscricao_municipal, situacao, certificado_digital, observacoes, proprietario_principal, cpf, telefone, email, responsavel_fiscal, cnaes_principal, cnaes_secundarios, risco_consolidado, score_urgencia, score_status

## Licenças (company_licences)
- company_id, municipio
- alvara_vig_sanitaria + valid_until
- cercon + valid_until
- alvara_funcionamento + valid_until
- licenca_ambiental + valid_until
- certidao_uso_solo + valid_until
- motivo_nao_exigido, justificativa_nao_exigido

## Taxas (company_taxes)
- company_id
- data_envio, status_taxas
- taxa_funcionamento, taxa_publicidade, taxa_vig_sanitaria, iss
- taxa_localiz_instalacao, taxa_ocup_area_publica, taxa_bombeiros
- tpi, vencimento_tpi

## Processos (company_processes)
- company_id, process_type, protocolo, municipio, orgao, operacao
- data_solicitacao, situacao, obs, obs_history, extra

## Certificados (certificate_mirror)
- company_id, cert_id, sha1_fingerprint, serial_number
- name, cn, issuer_cn
- document_type, document_digits, document_masked
- parse_ok, not_before, not_after

## CNAE Risk
- cnae_code, description, risk_level, source, is_active
