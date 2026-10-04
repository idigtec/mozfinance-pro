export type SectorType = 
  | 'RESTAURANT'
  | 'PHARMACY'
  | 'DELIVERY'
  | 'CONSTRUCTION'
  | 'RETAIL'
  | 'TECH'
  | 'SERVICES'
  | 'HOSPITALITY'
  | 'CUSTOMS'
  | 'OTHER';

export interface SystemModule {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: 'CORE' | 'OPERATIONAL' | 'SECTORIAL' | 'MANAGEMENT';
  route: string;
  iconName: string;
  badge?: string;
  recommendedFor: SectorType[];
}

export interface SectorDefinition {
  id: SectorType;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  bgLight: string;
  description: string;
  regulatoryInfo: string;
  defaultModules: string[];
  stockCategories: string[];
  suggestedUnits: string[];
  quickActions: { label: string; route: string; icon: string }[];
}

export const SYSTEM_MODULES: SystemModule[] = [
  // --- Módulos Principais / Core ---
  {
    id: 'finance',
    name: 'Gestão Financeira & Bancos',
    shortName: 'Finanças',
    description: 'Fluxo de caixa, tesouraria multimoeda (MZN, USD, ZAR), contas à ordem e conciliação bancária.',
    category: 'CORE',
    route: '/accounts',
    iconName: 'Wallet',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'SERVICES', 'HOSPITALITY', 'CUSTOMS', 'OTHER']
  },
  {
    id: 'fiscal',
    name: 'Facturação Fiscal & Cotações',
    shortName: 'Facturação',
    description: 'Emissão de cotações, faturas pró-forma, faturas definitivas e IVA 16% segundo a Autoridade Tributária.',
    category: 'CORE',
    route: '/quotes',
    iconName: 'FileText',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'SERVICES', 'HOSPITALITY', 'CUSTOMS', 'OTHER']
  },
  {
    id: 'expenses',
    name: 'Despesas PGC & Contabilidade',
    shortName: 'Despesas',
    description: 'Controlo de despesas operacionais, fornecedores, plano PGC-PE/NIRF e retenções na fonte.',
    category: 'CORE',
    route: '/financial-expenses',
    iconName: 'Receipt',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'SERVICES', 'HOSPITALITY', 'CUSTOMS', 'OTHER']
  },
  {
    id: 'inventory',
    name: 'Controlo de Estoque & Armazém',
    shortName: 'Estoque',
    description: 'Gestão de inventário categorizado, entradas, saídas, níveis críticos de ruptura e valor imobilizado.',
    category: 'OPERATIONAL',
    route: '/production',
    iconName: 'Package',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'HOSPITALITY', 'OTHER']
  },
  {
    id: 'pos',
    name: 'Ponto de Venda (POS / Caixa Rápido)',
    shortName: 'POS Caixa',
    description: 'Caixa de vendas diretas com suporte a pagamentos M-Pesa, e-Mola, Cartão POS e Dinheiro físico.',
    category: 'OPERATIONAL',
    route: '/pos',
    iconName: 'ShoppingBag',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'RETAIL', 'HOSPITALITY']
  },
  {
    id: 'hr',
    name: 'RH, Salários & Folha de Pagamento',
    shortName: 'RH & Salários',
    description: 'Gestão de colaboradores, tabela oficial de IRPS de Moçambique, INSS (3% + 4%) e adiantamentos.',
    category: 'MANAGEMENT',
    route: '/hr',
    iconName: 'UserCheck',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'SERVICES', 'HOSPITALITY', 'CUSTOMS', 'OTHER']
  },

  // --- Módulos Específicos de Restaurante ---
  {
    id: 'restaurant_tables',
    name: 'Mesas, Comandas & Atendimento',
    shortName: 'Mesas & Bar',
    description: 'Mapa visual de mesas do restaurante, abertura de comanda, adição de pratos e emissão de conta prévia.',
    category: 'SECTORIAL',
    route: '/restaurant',
    iconName: 'UtensilsCrossed',
    badge: 'Restaurante',
    recommendedFor: ['RESTAURANT', 'HOSPITALITY']
  },
  {
    id: 'kitchen_kds',
    name: 'Monitor de Cozinha (KDS)',
    shortName: 'Cozinha KDS',
    description: 'Fila de pedidos da cozinha em tempo real com estados de preparação e alerta de tempos de espera.',
    category: 'SECTORIAL',
    route: '/restaurant',
    iconName: 'ChefHat',
    badge: 'Restaurante',
    recommendedFor: ['RESTAURANT']
  },
  {
    id: 'recipes_bom',
    name: 'Fichas Técnicas & Custo por Prato',
    shortName: 'Fichas Técnicas',
    description: 'Engenharia do cardápio, explosão de ingredientes (BOM) por prato, margem de lucro e controlo de quebras.',
    category: 'SECTORIAL',
    route: '/restaurant',
    iconName: 'Calculator',
    badge: 'Restaurante',
    recommendedFor: ['RESTAURANT']
  },

  // --- Módulos Específicos de Farmácia ---
  {
    id: 'pharmacy_dispensary',
    name: 'Dispensação Farmacêutica & Balcão',
    shortName: 'Dispensação',
    description: 'Atendimento e venda de medicamentos com busca por substância ativa, laboratório e genéricos.',
    category: 'SECTORIAL',
    route: '/pharmacy',
    iconName: 'Pill',
    badge: 'Farmácia',
    recommendedFor: ['PHARMACY']
  },
  {
    id: 'pharmacy_batches',
    name: 'Gestão de Lotes & Validades (FEFO)',
    shortName: 'Lotes & FEFO',
    description: 'Rastreio rigoroso de lotes e datas de expiração (First Expired First Out) com semáforo de validades.',
    category: 'SECTORIAL',
    route: '/pharmacy',
    iconName: 'CalendarClock',
    badge: 'Farmácia',
    recommendedFor: ['PHARMACY']
  },
  {
    id: 'pharmacy_prescriptions',
    name: 'Receitas Médicas & ANARME',
    shortName: 'Receitas & ANARME',
    description: 'Registo de receitas médicas retidas, médico prescritor, psicotrópicos e conformidade com a ANARME.',
    category: 'SECTORIAL',
    route: '/pharmacy',
    iconName: 'ShieldAlert',
    badge: 'Farmácia',
    recommendedFor: ['PHARMACY']
  },

  // --- Módulos Específicos de Delivery ---
  {
    id: 'delivery_dispatch',
    name: 'Central de Despacho & Pedidos',
    shortName: 'Despacho Delivery',
    description: 'Gestão de encomendas para entrega ao domicílio, fluxo de preparação, saída para entrega e confirmação.',
    category: 'SECTORIAL',
    route: '/delivery',
    iconName: 'Truck',
    badge: 'Delivery',
    recommendedFor: ['DELIVERY', 'RESTAURANT', 'RETAIL', 'PHARMACY']
  },
  {
    id: 'delivery_couriers',
    name: 'Estafetas, Motas & Repasses',
    shortName: 'Estafetas & Motas',
    description: 'Cadastro de estafetas, matrículas das motos, atribuição de rotas e cálculo de comissões por entrega.',
    category: 'SECTORIAL',
    route: '/delivery',
    iconName: 'Bike',
    badge: 'Delivery',
    recommendedFor: ['DELIVERY', 'RESTAURANT']
  },
  {
    id: 'delivery_zones',
    name: 'Zonas de Entrega & Tarifas',
    shortName: 'Zonas & Tarifas',
    description: 'Tabela de preços de frete por bairro/província (ex: Polana, Sommerschield, Matola, Zimpeto, Beira).',
    category: 'SECTORIAL',
    route: '/delivery',
    iconName: 'MapPin',
    badge: 'Delivery',
    recommendedFor: ['DELIVERY']
  },

  // --- Módulos Específicos de Tecnologia & Software ---
  {
    id: 'tech_sprints',
    name: 'Sprints Ágeis & Backlog Dev',
    shortName: 'Sprints & Kanban',
    description: 'Quadro Kanban de desenvolvimento ágil (Scrum), sprints ativos, user stories, story points e pipeline de deploys.',
    category: 'SECTORIAL',
    route: '/tech',
    iconName: 'Laptop',
    badge: 'Tecnologia',
    recommendedFor: ['TECH']
  },
  {
    id: 'tech_saas_mrr',
    name: 'Subscrições SaaS & MRR/ARR',
    shortName: 'SaaS & Licenças',
    description: 'Gestão de planos recorrentes (MRR/ARR), churn rate, renovações automáticas, contratos e emissão de chaves API.',
    category: 'SECTORIAL',
    route: '/tech',
    iconName: 'Sparkles',
    badge: 'Tecnologia',
    recommendedFor: ['TECH']
  },
  {
    id: 'tech_sla_tickets',
    name: 'Suporte Técnico & Tickets SLA',
    shortName: 'Helpdesk & SLA',
    description: 'Gestão de incidentes técnicos P1 a P4, monitorização de tempo de resposta e cumprimento de acordos de nível de serviço.',
    category: 'SECTORIAL',
    route: '/tech',
    iconName: 'ShieldAlert',
    badge: 'Tecnologia',
    recommendedFor: ['TECH']
  },
  {
    id: 'tech_cloud_infra',
    name: 'Custos Cloud & Infraestrutura',
    shortName: 'Custos Cloud',
    description: 'Acompanhamento de custos mensais com servidores Google Cloud, AWS, Azure, domínios e banco de dados gerenciado.',
    category: 'SECTORIAL',
    route: '/tech',
    iconName: 'Globe',
    badge: 'Tecnologia',
    recommendedFor: ['TECH']
  },
  {
    id: 'tech_team_repos',
    name: 'Alocação de Devs & Repositórios',
    shortName: 'Devs & Repositórios',
    description: 'Alocação de engenheiros de software, controlo de branches/PRs, stack tecnológica e apontamento de horas (timesheet).',
    category: 'SECTORIAL',
    route: '/tech',
    iconName: 'Users',
    badge: 'Tecnologia',
    recommendedFor: ['TECH']
  },

  // --- Módulos Específicos de Construção Civil ---
  {
    id: 'construction_measurements',
    name: 'Autos de Medição & Avanço Físico',
    shortName: 'Autos de Medição',
    description: 'Controlo físico-financeiro por etapas de obra (estruturas, alvenarias, acabamentos) e faturamento por auto aprovado.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'HardHat',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },
  {
    id: 'construction_rdo',
    name: 'Diário de Obra Digital (RDO)',
    shortName: 'Diário de Obra',
    description: 'Registo diário das condições climáticas, efetivo no estaleiro, ocorrências técnicas e fotografias de avanço da obra.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'FileText',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },
  {
    id: 'construction_budget_cpu',
    name: 'Caderno de Encargos & Preços (CPU)',
    shortName: 'Orçamento & CPU',
    description: 'Composição de preços unitários (cimento, varão, areia, mão de obra), cálculo de BDI e margem de empreitada.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'Calculator',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },
  {
    id: 'construction_equipment',
    name: 'Maquinaria & Equipamentos Pesados',
    shortName: 'Máquinas & Betoneiras',
    description: 'Registo de escavadoras, camiões basculantes, betoneiras, controlo de horímetro e combustível de estaleiro.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'Truck',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },
  {
    id: 'construction_safety_hst',
    name: 'Segurança no Trabalho & HST',
    shortName: 'Segurança & EPIs',
    description: 'Registo de entrega de EPIs, DDS (Diálogo Diário de Segurança), conformidade com alvará MOPHRH e sinistralidade zero.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'ShieldCheck',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },

  // --- Módulos de Outros Sectores ---
  {
    id: 'construction_projects',
    name: 'Obras, Autos de Medição & Alvará',
    shortName: 'Obras & Medições',
    description: 'Gestão de empreitadas, diário de obra, orçamentação e autos de medição conforme alvará MOPHRH.',
    category: 'SECTORIAL',
    route: '/construction',
    iconName: 'HardHat',
    badge: 'Construção',
    recommendedFor: ['CONSTRUCTION']
  },
  {
    id: 'fleet',
    name: 'Gestão de Frotas & Viaturas',
    shortName: 'Frotas & Viaturas',
    description: 'Registo de viaturas, consumo de combustível, revisões preventivas, seguros e taxas de manifesto.',
    category: 'OPERATIONAL',
    route: '/fleet',
    iconName: 'Truck',
    recommendedFor: ['DELIVERY', 'CONSTRUCTION', 'SERVICES', 'CUSTOMS']
  },
  {
    id: 'crm',
    name: 'CRM & Pipeline de Clientes',
    shortName: 'CRM & Vendas',
    description: 'Gestão de leads comerciais, propostas abertas, taxa de fecho e histórico de negociações.',
    category: 'MANAGEMENT',
    route: '/erp',
    iconName: 'Users',
    recommendedFor: ['TECH', 'SERVICES', 'CONSTRUCTION', 'CUSTOMS']
  },
  {
    id: 'hospitality',
    name: 'Hotelaria, Quartos & Reservas',
    shortName: 'Hotelaria',
    description: 'Ocupação de quartos, check-in, check-out, frigobar e taxa de turismo (INATUR).',
    category: 'SECTORIAL',
    route: '/hospitality',
    iconName: 'Bed',
    badge: 'Hotelaria',
    recommendedFor: ['HOSPITALITY']
  },
  {
    id: 'customs',
    name: 'Despachos Aduaneiros & Trânsito',
    shortName: 'Aduaneiro',
    description: 'Processos de desalfandegamento, DU (Documento Único), pauta aduaneira e taxas de porto.',
    category: 'SECTORIAL',
    route: '/customs',
    iconName: 'Globe',
    badge: 'Aduaneiro',
    recommendedFor: ['CUSTOMS']
  },
  {
    id: 'ai_insights',
    name: 'Inteligência Financeira & Diagnósticos',
    shortName: 'Inteligência AI',
    description: 'Previsões de fluxo de caixa, deteção de anomalias e recomendações estratégicas empresariais.',
    category: 'MANAGEMENT',
    route: '/intelligence',
    iconName: 'Sparkles',
    recommendedFor: ['RESTAURANT', 'PHARMACY', 'DELIVERY', 'CONSTRUCTION', 'RETAIL', 'TECH', 'SERVICES', 'HOSPITALITY', 'CUSTOMS', 'OTHER']
  }
];

export const SECTOR_DEFINITIONS: Record<SectorType, SectorDefinition> = {
  RESTAURANT: {
    id: 'RESTAURANT',
    title: 'Restaurante / Bar / Takeaway',
    subtitle: 'Alimentação, Bebidas e Atendimento a Mesas',
    iconName: 'UtensilsCrossed',
    color: 'amber-600',
    bgLight: 'amber-50 dark:bg-amber-950/40',
    description: 'Gestão completa para restauração: controlo de mesas, envio de pedidos para cozinha (KDS), ficha técnica de pratos e estoque de alimentos perecíveis com controlo de quebras.',
    regulatoryInfo: 'Conformidade com normas de Higiene e Segurança Alimentar (HACCP) e Alvará de Restauração em Moçambique.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr',
      'restaurant_tables',
      'kitchen_kds',
      'recipes_bom',
      'delivery_dispatch'
    ],
    stockCategories: [
      'Carnes, Aves & Enchidos',
      'Frutos do Mar & Peixes Frescos',
      'Legumes, Hortaliças & Frutas',
      'Lacticínios & Queijos',
      'Mercearia Seca, Molhos & Óleos',
      'Bebidas Alcoólicas & Vinhos',
      'Refrigerantes, Águas & Sucos',
      'Padaria, Massas & Farinhas',
      'Sobremesas & Confeitaria',
      'Embalagens Takeaway & Descartáveis',
      'Produtos de Limpeza & Higiene HACCP'
    ],
    suggestedUnits: ['KG', 'L', 'UN', 'G', 'ML', 'CX', 'DOSE'],
    quickActions: [
      { label: 'Mesas & Atendimento', route: '/restaurant', icon: 'UtensilsCrossed' },
      { label: 'Monitor de Cozinha', route: '/restaurant', icon: 'ChefHat' },
      { label: 'Fichas Técnicas & Custo', route: '/restaurant', icon: 'Calculator' },
      { label: 'Caixa POS Balcão', route: '/pos', icon: 'ShoppingBag' },
      { label: 'Estoque de Alimentos', route: '/production', icon: 'Package' }
    ]
  },

  PHARMACY: {
    id: 'PHARMACY',
    title: 'Farmácia / Drogaria / Saúde',
    subtitle: 'Dispensação, Medicamentos e Saúde',
    iconName: 'Pill',
    color: 'emerald-600',
    bgLight: 'emerald-50 dark:bg-emerald-950/40',
    description: 'Gestão farmacêutica com rastreio de lotes e datas de validade (FEFO), dispensação orientada por receita médica (MSRM/MNSRM) e conformidade regulamentar com a ANARME.',
    regulatoryInfo: 'Adequado à regulamentação da ANARME (Agência Nacional Reguladora de Medicamentos de Moçambique).',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr',
      'pharmacy_dispensary',
      'pharmacy_batches',
      'pharmacy_prescriptions'
    ],
    stockCategories: [
      'Medicamentos Sujeitos a Receita (MSRM)',
      'Medicamentos Não Sujeitos a Receita (MNSRM / OTC)',
      'Antibióticos & Quimioterápicos',
      'Medicamentos Controlados / Psicotrópicos',
      'Soluções Injetáveis & Cadeia de Frio (2-8°C)',
      'Primeiros Socorros & Material de Curativo',
      'Dermocosmética & Higiene Corporal',
      'Suplementos, Vitaminas & Minerais',
      'Saúde Materno-Infantil & Puericultura',
      'Dispositivos Médicos & Termómetros'
    ],
    suggestedUnits: ['CX', 'UN', 'BLISTER', 'FRASCO', 'AMB'],
    quickActions: [
      { label: 'Dispensação Balcão', route: '/pharmacy', icon: 'Pill' },
      { label: 'Lotes & Validades FEFO', route: '/pharmacy', icon: 'CalendarClock' },
      { label: 'Registo ANARME & Receitas', route: '/pharmacy', icon: 'ShieldAlert' },
      { label: 'Caixa Rápido Farmácia', route: '/pos', icon: 'ShoppingBag' },
      { label: 'Stock Farmacêutico', route: '/production', icon: 'Package' }
    ]
  },

  DELIVERY: {
    id: 'DELIVERY',
    title: 'Delivery & Entregas Rápidas',
    subtitle: 'Logística de Última Milha e Despacho',
    iconName: 'Truck',
    color: 'blue-600',
    bgLight: 'blue-50 dark:bg-blue-950/40',
    description: 'Controlo total de entregas rápidas: central de despacho de encomendas, gestão de estafetas com motas, tabela de taxas por zona geográfica e controlo de cobranças na entrega.',
    regulatoryInfo: 'Registo de transportes urbanos, frotas de duas rodas e seguros de carga/estafetas.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr',
      'delivery_dispatch',
      'delivery_couriers',
      'delivery_zones',
      'fleet'
    ],
    stockCategories: [
      'Embalagens Térmicas & Mochilas de Entrega',
      'Caixas de Cartão & Sacos Kraft',
      'Selos de Segurança & Inviolabilidade',
      'Fitas Adesivas & Plástico Bolha',
      'Produtos Prontos / Pronta Entrega',
      'Bebidas para Entrega Imediata',
      'Acessórios de Moto & EPIs de Estafeta',
      'Combustível & Lubrificantes de Frotas'
    ],
    suggestedUnits: ['UN', 'CX', 'L', 'PCT'],
    quickActions: [
      { label: 'Central de Despacho', route: '/delivery', icon: 'Truck' },
      { label: 'Estafetas & Motas', route: '/delivery', icon: 'Bike' },
      { label: 'Tabela de Zonas & Preços', route: '/delivery', icon: 'MapPin' },
      { label: 'Gestão da Frota de Motas', route: '/fleet', icon: 'Truck' },
      { label: 'Stock de Embalagens', route: '/production', icon: 'Package' }
    ]
  },

  CONSTRUCTION: {
    id: 'CONSTRUCTION',
    title: 'Construção Civil & Obras',
    subtitle: 'Engenharia, Empreitadas e Medições',
    iconName: 'HardHat',
    color: 'orange-600',
    bgLight: 'orange-50 dark:bg-orange-950/40',
    description: 'Gestão de obras públicas e privadas: controlo orçamental, autos de medição, diário de obra, alvará de empreiteiro e parque de máquinas e viaturas pesadas.',
    regulatoryInfo: 'Alvará do Ministério das Obras Públicas, Habitação e Recursos Hídricos (MOPHRH).',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'hr',
      'construction_measurements',
      'construction_rdo',
      'construction_budget_cpu',
      'construction_equipment',
      'construction_safety_hst',
      'fleet',
      'crm'
    ],
    stockCategories: [
      'Cimentos, Cal & Argamassas',
      'Areia, Brita & Inertes',
      'Ferro, Varão Estrutural & Malhasul',
      'Tubagens PVC, PPR & Canalização',
      'Cabos Elétricos, Quadros & Disjuntores',
      'Tintas, Primários & Impermeabilizantes',
      'Madeiras, Pranchas & Cofragem',
      'Louças Sanitárias & Revestimentos',
      'Ferramentas Manuais & Máquinas de Obra',
      'EPIs & Equipamentos de Protecção'
    ],
    suggestedUnits: ['SC', 'KG', 'M', 'UN', 'M3', 'L'],
    quickActions: [
      { label: 'Autos de Medição', route: '/construction', icon: 'HardHat' },
      { label: 'Diário de Obra (RDO)', route: '/construction', icon: 'FileText' },
      { label: 'Orçamentos & CPU', route: '/construction', icon: 'Calculator' },
      { label: 'Máquinas & Betoneiras', route: '/construction', icon: 'Truck' },
      { label: 'Segurança & EPIs', route: '/construction', icon: 'ShieldCheck' }
    ]
  },

  RETAIL: {
    id: 'RETAIL',
    title: 'Retalho / Supermercado / Loja',
    subtitle: 'Comércio Geral, Grossista e Balcão',
    iconName: 'Store',
    color: 'purple-600',
    bgLight: 'purple-50 dark:bg-purple-950/40',
    description: 'Operações de retalho com múltiplos pontos de venda, leitor de código de barras, packs no atacado/retalho e promoções de stock.',
    regulatoryInfo: 'Alvará comercial do Ministério da Indústria e Comércio de Moçambique.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr',
      'delivery_dispatch'
    ],
    stockCategories: [
      'Mercearia Básica (Arroz, Óleo, Farinha, Açúcar)',
      'Laticínios & Charcutaria',
      'Bebidas, Refrigerantes & Cervejas',
      'Higiene Pessoal & Cosmética',
      'Limpeza Doméstica & Detergentes',
      'Congelados & Pré-cozinhados',
      'Bazar & Utilidades Domésticas',
      'Snacks, Biscoitos & Doces'
    ],
    suggestedUnits: ['UN', 'CX', 'KG', 'L', 'FARDO'],
    quickActions: [
      { label: 'Frente de Caixa POS', route: '/pos', icon: 'ShoppingBag' },
      { label: 'Gestão de Estoque', route: '/production', icon: 'Package' },
      { label: 'Facturação Comercial', route: '/quotes', icon: 'FileText' }
    ]
  },

  TECH: {
    id: 'TECH',
    title: 'Tecnologia & Serviços Digitais',
    subtitle: 'Software, Cloud e Telecomunicações',
    iconName: 'Laptop',
    color: 'cyan-600',
    bgLight: 'cyan-50 dark:bg-cyan-950/40',
    description: 'Gestão para empresas de TI: projetos ágeis, contratos de suporte recorrente (MRR), licenciamento e inventário de equipamentos informáticos.',
    regulatoryInfo: 'Registo comercial de serviços tecnológicos e propriedade intelectual.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'hr',
      'tech_sprints',
      'tech_saas_mrr',
      'tech_sla_tickets',
      'tech_cloud_infra',
      'tech_team_repos',
      'crm',
      'ai_insights'
    ],
    stockCategories: [
      'Computadores & Servidores',
      'Equipamentos de Rede & Roteadores',
      'Cabos Estruturados & Conectores',
      'Periféricos & Acessórios',
      'Licenças de Software & Certificados',
      'Peças de Substituição'
    ],
    suggestedUnits: ['UN', 'LIC', 'CX', 'HORA'],
    quickActions: [
      { label: 'Sprints & Kanban Dev', route: '/tech', icon: 'Laptop' },
      { label: 'Subscrições SaaS & MRR', route: '/tech', icon: 'Sparkles' },
      { label: 'Suporte & Tickets SLA', route: '/tech', icon: 'ShieldAlert' },
      { label: 'Custos Cloud & Servidores', route: '/tech', icon: 'Globe' },
      { label: 'Devs & Repositórios', route: '/tech', icon: 'Users' }
    ]
  },

  HOSPITALITY: {
    id: 'HOSPITALITY',
    title: 'Hotelaria & Alojamento',
    subtitle: 'Hotéis, Lodges, Resorts e Turismo',
    iconName: 'Bed',
    color: 'rose-600',
    bgLight: 'rose-50 dark:bg-rose-950/40',
    description: 'Gestão hoteleira com mapa de ocupação de quartos, reservas, consumos de hóspedes, restaurante integrado e taxas turísticas.',
    regulatoryInfo: 'Classificação hoteleira do INATUR (Instituto Nacional do Turismo de Moçambique).',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr',
      'hospitality',
      'restaurant_tables'
    ],
    stockCategories: [
      'Roupas de Cama & Banho',
      'Amenities & Higiene de Quartos',
      'Bebidas para Frigobar',
      'Alimentos de Pequeno-Almoço',
      'Produtos de Limpeza & Lavandaria'
    ],
    suggestedUnits: ['UN', 'CX', 'L', 'NOITE'],
    quickActions: [
      { label: 'Mapa de Quartos & Reservas', route: '/hospitality', icon: 'Bed' },
      { label: 'Consumos & POS', route: '/pos', icon: 'ShoppingBag' }
    ]
  },

  CUSTOMS: {
    id: 'CUSTOMS',
    title: 'Despachos Aduaneiros & Trânsito',
    subtitle: 'Comércio Internacional e Logística Portuária',
    iconName: 'Globe',
    color: 'teal-600',
    bgLight: 'teal-50 dark:bg-teal-950/40',
    description: 'Gestão de processos aduaneiros (Documento Único - DU), taxas alfandegárias, desalfandegamento em portos e aeroportos de Moçambique.',
    regulatoryInfo: 'Licenciamento pela Autoridade Tributária de Moçambique / Direcção Geral das Alfândegas.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'hr',
      'customs',
      'fleet',
      'crm'
    ],
    stockCategories: [
      'Documentos Oficiais & Selos',
      'Material de Arquivo Aduaneiro',
      'Consumíveis de Escritório'
    ],
    suggestedUnits: ['UN', 'PROC'],
    quickActions: [
      { label: 'Processos Aduaneiros', route: '/customs', icon: 'Globe' },
      { label: 'Facturação de Honorários', route: '/quotes', icon: 'FileText' }
    ]
  },

  SERVICES: {
    id: 'SERVICES',
    title: 'Consultoria & Serviços Gerais',
    subtitle: 'Prestação de Serviços Especializados',
    iconName: 'Briefcase',
    color: 'indigo-600',
    bgLight: 'indigo-50 dark:bg-indigo-950/40',
    description: 'Gestão de serviços baseados em tempo e honorários, propostas comerciais, contratos de avença e faturação por horas/etapas.',
    regulatoryInfo: 'Enquadramento geral fiscal com retenções de IRPC/IRPS de serviços em Moçambique.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'hr',
      'crm',
      'ai_insights'
    ],
    stockCategories: [
      'Materiais de Apoio & Escritório',
      'Consumíveis & Informática'
    ],
    suggestedUnits: ['HORA', 'UN', 'MES'],
    quickActions: [
      { label: 'CRM & Contratos', route: '/erp', icon: 'Briefcase' },
      { label: 'Cotações & Faturas', route: '/quotes', icon: 'FileText' }
    ]
  },

  OTHER: {
    id: 'OTHER',
    title: 'Outro Sector / Empresa Geral',
    subtitle: 'Configuração Personalizável do Grupo',
    iconName: 'Building2',
    color: 'slate-600',
    bgLight: 'slate-50 dark:bg-slate-900',
    description: 'Configuração flexível com todos os módulos essenciais disponíveis para ativação conforme a necessidade do negócio.',
    regulatoryInfo: 'Legislação comercial e fiscal geral da República de Moçambique.',
    defaultModules: [
      'finance',
      'fiscal',
      'expenses',
      'inventory',
      'pos',
      'hr'
    ],
    stockCategories: [
      'Mercadorias Gerais',
      'Insumos & Matérias-Primas',
      'Consumíveis & Embalagens'
    ],
    suggestedUnits: ['UN', 'KG', 'L', 'CX'],
    quickActions: [
      { label: 'Dashboard Geral', route: '/', icon: 'LayoutDashboard' },
      { label: 'Estoque & Produtos', route: '/production', icon: 'Package' }
    ]
  }
};

export const getDefaultModulesForSector = (sector: SectorType): string[] => {
  const def = SECTOR_DEFINITIONS[sector];
  return def ? def.defaultModules : SECTOR_DEFINITIONS.OTHER.defaultModules;
};

export const getDefaultStockCategoriesForSector = (sector: SectorType): string[] => {
  const def = SECTOR_DEFINITIONS[sector];
  return def ? def.stockCategories : SECTOR_DEFINITIONS.OTHER.stockCategories;
};
