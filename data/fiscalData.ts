import { FiscalObligation, Transaction, TransactionType, Currency, Account, AccountType, Material, Product } from '../types';

export const DEFAULT_FISCAL_OBLIGATIONS: FiscalObligation[] = [
  // --- DEFAULT (IDIGTEC - TECNOLOGIA) ---
  {
    id: 'fisc_tech_iva',
    companyId: 'default',
    title: 'IVA Mensal - Declaração Modelo A (Período 08/2026)',
    taxType: 'IVA',
    sector: 'Tecnologia',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 72000,
    status: 'PENDING',
    referenceNumber: 'DGI-IVA-202608-400928172',
    legalBasis: 'Art. 25 do Código do IVA (Decreto 32/2007) - Submissão até ao dia 20',
    notes: 'Submeter declaração electrónica no Portal e-Tributação da AT.'
  },
  {
    id: 'fisc_tech_inss',
    companyId: 'default',
    title: 'INSS - Guia de Pagamento & Folha de Remunerações (Agosto)',
    taxType: 'INSS',
    sector: 'Tecnologia',
    period: 'Agosto 2026',
    dueDate: '2026-09-15',
    estimatedAmount: 29400,
    status: 'SUBMITTED',
    referenceNumber: 'INSS-GUIA-8849102-MP',
    submissionDate: '2026-09-12',
    submissionProofName: 'Comprovativo_Submissao_INSS_Ago2026.pdf',
    submissionProofUrl: 'data:application/pdf;base64,JVBERi0xLjQKJVRlc3RlIENvbXByb3ZhdGl2byBJTlNT',
    submissionProofSize: '184 KB',
    legalBasis: 'Regulamento da Segurança Social Obrigatória (Decreto 51/2017) - 4% Patronal + 3% Trabalhador',
    notes: 'Guia validada na Delegação de KaMpfumo. Pagamento agendado para BIM.'
  },
  {
    id: 'fisc_tech_irps',
    companyId: 'default',
    title: 'IRPS 2ª Categoria (Trabalho Dependente) - Modelo 19',
    taxType: 'IRPS',
    sector: 'Tecnologia',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 38500,
    status: 'PENDING',
    referenceNumber: 'DGI-M19-400928172-08',
    legalBasis: 'Art. 56 e 67 do Código do IRPS - Retenções na fonte sobre salários da equipa de dev',
    notes: 'Inclui retenções de consultores seniores e desenvolvedores full-stack.'
  },
  {
    id: 'fisc_tech_wht',
    companyId: 'default',
    title: 'IRPC Retenção na Fonte (WHT 20%) - Serviços de Cloud Exterior',
    taxType: 'SECTORIAL',
    sector: 'Tecnologia',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 18000,
    status: 'PAID',
    paidDate: '2026-09-10',
    receiptNumber: 'REC-AT-901847-2026',
    submissionProofName: 'Guia_DGI_Paga_WHT_Cloud.pdf',
    submissionProofUrl: 'data:application/pdf;base64,JVBERi0xLjQKJVRlc3RlIENvbXByb3ZhdGl2byBXSFRfQVRQQUdB',
    submissionProofSize: '210 KB',
    legalBasis: 'Art. 73 do Código do IRPC (Decreto 70/2009) - Retenção de 20% sobre pagamentos a não residentes',
    notes: 'Liquidado via BCI para faturas de servidores AWS e licenças SaaS.'
  },

  // --- CONSTRUÇÃO ZAMBEZE ---
  {
    id: 'fisc_const_iva',
    companyId: 'comp_zambeze',
    title: 'IVA Mensal - Obras e Empreitadas (Período 08/2026)',
    taxType: 'IVA',
    sector: 'Construção Civil',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 616000,
    status: 'PENDING',
    referenceNumber: 'DGI-IVA-401823901-202608',
    legalBasis: 'Art. 25 do CIVA - Faturação do Auto de Medição nº 4 Obra EN1',
    notes: 'A deduzir crédito de IVA sobre aquisição de cimento e ferro a granel.'
  },
  {
    id: 'fisc_const_inss',
    companyId: 'comp_zambeze',
    title: 'INSS - Pessoal de Estaleiro & Obras (84 Trabalhadores)',
    taxType: 'INSS',
    sector: 'Construção Civil',
    period: 'Agosto 2026',
    dueDate: '2026-09-15',
    estimatedAmount: 114800,
    status: 'PENDING',
    referenceNumber: 'INSS-SF-204918-082026',
    legalBasis: 'Decreto 51/2017 INSS Sofala - Prazo impreterível dia 15',
    notes: 'Folha inclui encarregados de obra, pedreiros, armadores e operadores de máquina.'
  },
  {
    id: 'fisc_const_alvara',
    companyId: 'comp_zambeze',
    title: 'MOPHRH - Revalidação Anual de Alvará de Empreiteiro (4ª Classe)',
    taxType: 'ALVARA',
    sector: 'Construção Civil',
    period: 'Exercício 2026/2027',
    dueDate: '2026-10-31',
    estimatedAmount: 85000,
    status: 'PENDING',
    referenceNumber: 'MOPHRH-ALV-4C-9921/2026',
    legalBasis: 'Regulamento de Licenciamento de Empreiteiros de Obras Públicas (Decreto 48/2012)',
    notes: 'Necessário juntar certidão de quitação fiscal e comprovativo de quadro técnico residente.'
  },
  {
    id: 'fisc_const_seguro',
    companyId: 'comp_zambeze',
    title: 'Seguro Obrigatório de Acidentes de Trabalho & Doenças Profissionais',
    taxType: 'SECTORIAL',
    sector: 'Construção Civil',
    period: 'Trimestre 3/2026',
    dueDate: '2026-09-30',
    estimatedAmount: 95000,
    status: 'PAID',
    paidDate: '2026-09-01',
    receiptNumber: 'EMOSE-APOL-892182-2026',
    submissionProofName: 'Apolice_EMOSE_Acidentes_Trabalho.pdf',
    submissionProofUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUFwb2xpY2UgRU1PU0U=',
    submissionProofSize: '340 KB',
    legalBasis: 'Diploma Ministerial n.º 67/2016 e Lei do Trabalho Moçambicana (Lei 23/2007)',
    notes: 'Apólice coletiva estaleiros Beira e Dondo.'
  },

  // --- RESTAURANTE COSTA DO SOL ---
  {
    id: 'fisc_rest_iva',
    companyId: 'comp_costasol',
    title: 'IVA Facturação Restauração & Bar (Período 08/2026)',
    taxType: 'IVA',
    sector: 'Restauração',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 49600,
    status: 'PENDING',
    referenceNumber: 'DGI-IVA-400829104-082026',
    legalBasis: 'Art. 25 do CIVA - Taxa de 16% sobre serviços de mesa e bebidas',
    notes: 'Verificar conciliação de faturas do sistema POS com relatórios Z.'
  },
  {
    id: 'fisc_rest_inss',
    companyId: 'comp_costasol',
    title: 'INSS - Cozinha, Sala & Atendimento (22 Colaboradores)',
    taxType: 'INSS',
    sector: 'Restauração',
    period: 'Agosto 2026',
    dueDate: '2026-09-15',
    estimatedAmount: 31500,
    status: 'SUBMITTED',
    referenceNumber: 'INSS-MP-208192-082026',
    submissionDate: '2026-09-11',
    submissionProofName: 'Guia_INSS_CostaDoSol_Agosto.pdf',
    submissionProofUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUlOU1MgQ29zdGEgZG8gU29s',
    submissionProofSize: '155 KB',
    legalBasis: 'Decreto 51/2017 INSS',
    notes: 'Submissão efetuada online através da plataforma do INSS.'
  },
  {
    id: 'fisc_rest_inatur',
    companyId: 'comp_costasol',
    title: 'INATUR - Taxa de Turismo de 1.5% sobre Alojamento/Restauração',
    taxType: 'SECTORIAL',
    sector: 'Restauração',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 14250,
    status: 'PENDING',
    referenceNumber: 'INATUR-GUIA-2026-8912',
    legalBasis: 'Diploma Ministerial n.º 95/2017 - Taxa de promoção turística nacional',
    notes: 'Aplicável sobre o volume mensal apurado no salão restaurante e eventos.'
  },
  {
    id: 'fisc_rest_sanitaria',
    companyId: 'comp_costasol',
    title: 'Conselho Municipal de Maputo - Licença Higio-Sanitária & Vistoria',
    taxType: 'SECTORIAL',
    sector: 'Restauração',
    period: 'Semestre 2/2026',
    dueDate: '2026-09-28',
    estimatedAmount: 12000,
    status: 'PENDING',
    referenceNumber: 'CMM-DM-SAUDE-4412/2026',
    legalBasis: 'Postura Municipal de Saúde Pública do CMM - Vistoria semestral de cozinhas',
    notes: 'Agendada vistoria da equipa de saúde ambiental para verificação de câmaras frigoríficas.'
  },

  // --- FARMÁCIA CENTRAL ---
  {
    id: 'fisc_pharm_anarme',
    companyId: 'comp_farmacia',
    title: 'ANARME - Taxa de Registo e Inspeção Sanitária de Farmácia',
    taxType: 'SECTORIAL',
    sector: 'Farmácia & Saúde',
    period: 'Ano 2026',
    dueDate: '2026-09-30',
    estimatedAmount: 45000,
    status: 'SUBMITTED',
    referenceNumber: 'ANARME-LIC-FARM-3021/2026',
    submissionDate: '2026-09-08',
    submissionProofName: 'Recibo_ANARME_Inspecao_Farmacia.pdf',
    submissionProofUrl: 'data:application/pdf;base64,JVBERi0xLjQKJUFOUk1FIExpY2VuY2E=',
    submissionProofSize: '290 KB',
    legalBasis: 'Decreto 71/2019 da ANARME e Lei do Medicamento (Lei 12/2017)',
    notes: 'Relatório do Director Técnico Farmacêutico anexado com sucesso.'
  },
  {
    id: 'fisc_pharm_iva',
    companyId: 'comp_farmacia',
    title: 'IVA - Declaração Modelo A (Isenção Art. 9 Código IVA Medicamentos)',
    taxType: 'IVA',
    sector: 'Farmácia & Saúde',
    period: 'Agosto 2026',
    dueDate: '2026-09-20',
    estimatedAmount: 8500, // Apenas sobre cosmética e produtos de conveniência tributáveis
    status: 'PENDING',
    referenceNumber: 'DGI-IVA-400582918-08',
    legalBasis: 'Art. 9, n.º 1, alínea b) do CIVA (Isenção de medicamentos da Lista Nacional de Medicamentos Essenciais)',
    notes: 'IVA devido apenas sobre produtos de higiene, perfumaria e suplementos não isentos.'
  },
  {
    id: 'fisc_pharm_inss',
    companyId: 'comp_farmacia',
    title: 'INSS - Farmacêuticos Técnicos e Balconistas (14 Colaboradores)',
    taxType: 'INSS',
    sector: 'Farmácia & Saúde',
    period: 'Agosto 2026',
    dueDate: '2026-09-15',
    estimatedAmount: 22400,
    status: 'PENDING',
    referenceNumber: 'INSS-MP-192837-08',
    legalBasis: 'Decreto 51/2017 INSS',
    notes: 'Guia de KaMpfumo Baixa Maputo.'
  },

  // --- EXPRESS MOZ (DELIVERY) ---
  {
    id: 'fisc_deliv_circ',
    companyId: 'comp_express',
    title: 'INATRO / CMM - Taxa de Circulação e Inspecção Periódica de Frotas',
    taxType: 'SECTORIAL',
    sector: 'Delivery & Logística',
    period: '2º Semestre 2026',
    dueDate: '2026-09-30',
    estimatedAmount: 24000,
    status: 'PENDING',
    referenceNumber: 'INATRO-FROT-MOTA-5912',
    legalBasis: 'Regulamento do Código da Estrada Moçambicano e Posturas de Trânsito CMM',
    notes: '12 Motos e 2 Furgões de entrega urbana.'
  },
  {
    id: 'fisc_deliv_inss',
    companyId: 'comp_express',
    title: 'INSS - Estafetas, Operadores de Rota e Call Center (18 Colaboradores)',
    taxType: 'INSS',
    sector: 'Delivery & Logística',
    period: 'Agosto 2026',
    dueDate: '2026-09-15',
    estimatedAmount: 25200,
    status: 'PENDING',
    referenceNumber: 'INSS-MP-309182-DELIV',
    legalBasis: 'Decreto 51/2017 INSS Moçambique',
    notes: 'Validação de descontos de estafetas com contrato de prestação e quadro permanente.'
  },

  // --- SUPERMERCADO MARRACUENE (RETAIL) ---
  {
    id: 'fisc_ret_ispc',
    companyId: 'comp_marracuene',
    title: 'ISPC - Imposto Simplificado para Pequenos Contribuintes (3% Trimestral)',
    taxType: 'ISPC',
    sector: 'Retalho Alimentar',
    period: '3º Trimestre 2026',
    dueDate: '2026-10-31',
    estimatedAmount: 37500,
    status: 'PENDING',
    referenceNumber: 'DGI-ISPC-400192834-Q3',
    legalBasis: 'Lei n.º 5/2009 (Regime do ISPC) - 3% sobre o volume total de negócios a retalho',
    notes: 'Substitui IVA e IRPC para contribuintes enquadrados no limite de faturação.'
  }
];

export const SAMPLE_COMPANY_TRANSACTIONS: Transaction[] = [
  // --- TECH (IDIGTEC) ---
  {
    id: 'tx_tech_1',
    accountId: 'acc_bim_default',
    companyId: 'default',
    amount: 450000,
    type: TransactionType.INCOME,
    category: 'Vendas de Software',
    date: '2026-09-10',
    description: 'Factura FT-2026/041 - Licença de Software ERP Cloud (Cliente BCI)',
    currency: Currency.MZN
  },
  {
    id: 'tx_tech_2',
    accountId: 'acc_mpesa_default',
    companyId: 'default',
    amount: 120000,
    type: TransactionType.INCOME,
    category: 'Consultoria',
    date: '2026-09-08',
    description: 'Desenvolvimento de Módulos Web & API M-Pesa',
    currency: Currency.MZN
  },
  {
    id: 'tx_tech_3',
    accountId: 'acc_bim_default',
    companyId: 'default',
    amount: 38500,
    type: TransactionType.EXPENSE,
    category: 'Infraestrutura Cloud',
    date: '2026-09-05',
    description: 'AWS Cloud Services Hosting & Servidores Dedicados',
    currency: Currency.MZN
  },
  {
    id: 'tx_tech_4',
    accountId: 'acc_bim_default',
    companyId: 'default',
    amount: 185000,
    type: TransactionType.EXPENSE,
    category: 'Salários',
    date: '2026-09-01',
    description: 'Salários Equipa Dev Frontend & Backend KaMpfumo',
    currency: Currency.MZN
  },

  // --- CONSTRUÇÃO ZAMBEZE ---
  {
    id: 'tx_const_1',
    accountId: 'acc_sb_zambeze',
    companyId: 'comp_zambeze',
    amount: 3850000,
    type: TransactionType.INCOME,
    category: 'Empreitadas & Obras',
    date: '2026-09-11',
    description: 'Auto de Medição nº 4 - Obra de Pavimentação e Drenagem EN1 Beira',
    currency: Currency.MZN
  },
  {
    id: 'tx_const_2',
    accountId: 'acc_sb_zambeze',
    companyId: 'comp_zambeze',
    amount: 492000,
    type: TransactionType.EXPENSE,
    category: 'Materiais de Construção',
    date: '2026-09-09',
    description: 'Compra de 1.200 Sacos Cimento 42.5R - Cimentos de Moçambique',
    currency: Currency.MZN
  },
  {
    id: 'tx_const_3',
    accountId: 'acc_sb_zambeze',
    companyId: 'comp_zambeze',
    amount: 140000,
    type: TransactionType.EXPENSE,
    category: 'Combustível & Máquinas',
    date: '2026-09-06',
    description: 'Gasóleo para Pás Carregadoras e Camiões Basculantes - Petromoc',
    currency: Currency.MZN
  },
  {
    id: 'tx_const_4',
    accountId: 'acc_sb_zambeze',
    companyId: 'comp_zambeze',
    amount: 520000,
    type: TransactionType.EXPENSE,
    category: 'Salários Operacionais',
    date: '2026-09-02',
    description: 'Folha Quinzenal de Encarregados, Pedreiros e Armadores',
    currency: Currency.MZN
  },

  // --- RESTAURANTE COSTA DO SOL ---
  {
    id: 'tx_rest_1',
    accountId: 'acc_bim_costasol',
    companyId: 'comp_costasol',
    amount: 310000,
    type: TransactionType.INCOME,
    category: 'Vendas POS Restaurante',
    date: '2026-09-12',
    description: 'Facturação Diária Balcão & Esplanada (Semana 36 Mariscos)',
    currency: Currency.MZN
  },
  {
    id: 'tx_rest_2',
    accountId: 'acc_mpesa_costasol',
    companyId: 'comp_costasol',
    amount: 95000,
    type: TransactionType.INCOME,
    category: 'Vendas M-Pesa',
    date: '2026-09-10',
    description: 'Pagamentos QR M-Pesa & Takeaway Fins de Semana',
    currency: Currency.MZN
  },
  {
    id: 'tx_rest_3',
    accountId: 'acc_bim_costasol',
    companyId: 'comp_costasol',
    amount: 112000,
    type: TransactionType.EXPENSE,
    category: 'Fornecedores Alimentos',
    date: '2026-09-07',
    description: 'Fornecedor Camarão Tigre & Garoupa Fresca de Inhambane',
    currency: Currency.MZN
  },
  {
    id: 'tx_rest_4',
    accountId: 'acc_bim_costasol',
    companyId: 'comp_costasol',
    amount: 54000,
    type: TransactionType.EXPENSE,
    category: 'Bebidas & Stock',
    date: '2026-09-04',
    description: 'Distribuidora CDM Cervejas 2M, Laurentina e Águas Vumba',
    currency: Currency.MZN
  },

  // --- FARMÁCIA CENTRAL ---
  {
    id: 'tx_pharm_1',
    accountId: 'acc_bci_farmacia',
    companyId: 'comp_farmacia',
    amount: 320000,
    type: TransactionType.INCOME,
    category: 'Vendas Medicamentos',
    date: '2026-09-11',
    description: 'Vendas Balcão Receituário e Medicamentos Gerais',
    currency: Currency.MZN
  },
  {
    id: 'tx_pharm_2',
    accountId: 'acc_bci_farmacia',
    companyId: 'comp_farmacia',
    amount: 165000,
    type: TransactionType.EXPENSE,
    category: 'Fornecedor Farmacêutico',
    date: '2026-09-08',
    description: 'Distribuidora Medis Farmacêutica Lda - Lote Antibióticos e Analgésicos',
    currency: Currency.MZN
  },
  {
    id: 'tx_pharm_3',
    accountId: 'acc_emola_farmacia',
    companyId: 'comp_farmacia',
    amount: 45000,
    type: TransactionType.INCOME,
    category: 'Vendas e-Mola',
    date: '2026-09-06',
    description: 'Pagamentos de Clientes e-Mola Farmácia KaMpfumo',
    currency: Currency.MZN
  },

  // --- DELIVERY EXPRESS MOZ ---
  {
    id: 'tx_deliv_1',
    accountId: 'acc_bim_express',
    companyId: 'comp_express',
    amount: 185000,
    type: TransactionType.INCOME,
    category: 'Taxas de Entrega',
    date: '2026-09-12',
    description: 'Facturação Semanal de Entregas e Contratos Corporativos',
    currency: Currency.MZN
  },
  {
    id: 'tx_deliv_2',
    accountId: 'acc_bim_express',
    companyId: 'comp_express',
    amount: 42000,
    type: TransactionType.EXPENSE,
    category: 'Combustível Frotas',
    date: '2026-09-09',
    description: 'Abastecimento Frota de Motas - Cartões Frota TotalEnergies',
    currency: Currency.MZN
  },
  {
    id: 'tx_deliv_3',
    accountId: 'acc_bim_express',
    companyId: 'comp_express',
    amount: 38000,
    type: TransactionType.EXPENSE,
    category: 'Manutenção de Motos',
    date: '2026-09-04',
    description: 'Revisão Mecânica, Pneus e Óleo para 8 Motas Yamaha YBR',
    currency: Currency.MZN
  },

  // --- SUPERMERCADO MARRACUENE ---
  {
    id: 'tx_ret_1',
    accountId: 'acc_bci_marracuene',
    companyId: 'comp_marracuene',
    amount: 420000,
    type: TransactionType.INCOME,
    category: 'Vendas Mercearia',
    date: '2026-09-11',
    description: 'Vendas de Balcão e Caixas Supermercado Marracuene',
    currency: Currency.MZN
  },
  {
    id: 'tx_ret_2',
    accountId: 'acc_bci_marracuene',
    companyId: 'comp_marracuene',
    amount: 260000,
    type: TransactionType.EXPENSE,
    category: 'Fornecedor Grossista',
    date: '2026-09-07',
    description: 'Encomenda Grossista Arroz, Óleo, Farinha e Produtos de Limpeza',
    currency: Currency.MZN
  }
];

export const ADDITIONAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_bim_costasol',
    name: 'Millennium BIM (POS Restaurante)',
    institutionId: 'inst_bim',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 980000,
    companyId: 'comp_costasol'
  },
  {
    id: 'acc_mpesa_costasol',
    name: 'M-Pesa Balcão Costa do Sol',
    institutionId: 'inst_mpesa',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 240000,
    companyId: 'comp_costasol'
  },
  {
    id: 'acc_bci_farmacia',
    name: 'BCI Conta Farmacêutica',
    institutionId: 'inst_bci',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 1120000,
    companyId: 'comp_farmacia'
  },
  {
    id: 'acc_emola_farmacia',
    name: 'e-Mola Farmácia Central',
    institutionId: 'inst_emola',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 190000,
    companyId: 'comp_farmacia'
  },
  {
    id: 'acc_bim_express',
    name: 'Millennium BIM Frotas & Operações',
    institutionId: 'inst_bim',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 750000,
    companyId: 'comp_express'
  },
  {
    id: 'acc_mpesa_express',
    name: 'M-Pesa Entregadores & Clientes',
    institutionId: 'inst_mpesa',
    type: AccountType.CHECKING,
    currency: Currency.MZN,
    balance: 320000,
    companyId: 'comp_express'
  }
];

export const SAMPLE_MATERIALS: Material[] = [
  {
    id: 'mat_tech_lic',
    companyId: 'default',
    name: 'Licenças Servidor Cloud AWS',
    category: 'OUTRO',
    unit: 'UN',
    stock: 50,
    minStock: 10,
    costPrice: 1200,
    salePrice: 1600,
    createdAt: '2026-08-01'
  },
  {
    id: 'mat_const_cim',
    companyId: 'comp_zambeze',
    name: 'Cimento 42.5R Estrutural 50kg',
    category: 'MATERIA_PRIMA',
    unit: 'SC',
    stock: 850,
    minStock: 200,
    costPrice: 410,
    salePrice: 490,
    createdAt: '2026-08-05'
  },
  {
    id: 'mat_const_ferro',
    companyId: 'comp_zambeze',
    name: 'Varão de Aço Nervurado 12mm (6m)',
    category: 'MATERIA_PRIMA',
    unit: 'M',
    stock: 420,
    minStock: 100,
    costPrice: 780,
    salePrice: 920,
    createdAt: '2026-08-05'
  },
  {
    id: 'mat_rest_camarao',
    companyId: 'comp_costasol',
    name: 'Camarão Tigre Gigante Inhambane',
    category: 'MATERIA_PRIMA',
    unit: 'KG',
    stock: 45,
    minStock: 15,
    costPrice: 950,
    salePrice: 1400,
    isPerishable: true,
    expiryDate: '2026-09-30',
    createdAt: '2026-08-10'
  },
  {
    id: 'mat_pharm_parac',
    companyId: 'comp_farmacia',
    name: 'Paracetamol 500mg (Embalagem 100 comp)',
    category: 'MATERIA_PRIMA',
    unit: 'CX',
    stock: 230,
    minStock: 50,
    costPrice: 120,
    salePrice: 180,
    batchNumber: 'LOT-2026-99',
    expiryDate: '2027-12-31',
    createdAt: '2026-08-12'
  },
  {
    id: 'mat_deliv_capacete',
    companyId: 'comp_express',
    name: 'Capacete Integral de Segurança Estafeta',
    category: 'OUTRO',
    unit: 'UN',
    stock: 24,
    minStock: 5,
    costPrice: 2200,
    salePrice: 2800,
    createdAt: '2026-08-15'
  }
];
