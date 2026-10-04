import { Institution, InstitutionType } from './types';

// Pre-configured Mozambican Banks and Wallets
export const PREDEFINED_INSTITUTIONS: Institution[] = [
  { id: 'inst_bim', name: 'Millennium BIM', code: 'BIM', type: InstitutionType.BANK, isActive: true, logoColor: '#9c1f60' },
  { id: 'inst_bci', name: 'BCI', code: 'BCI', type: InstitutionType.BANK, isActive: true, logoColor: '#005f7f' },
  { id: 'inst_sb', name: 'Standard Bank', code: 'SB', type: InstitutionType.BANK, isActive: true, logoColor: '#0033a1' },
  { id: 'inst_absa', name: 'Absa Moçambique', code: 'ABSA', type: InstitutionType.BANK, isActive: true, logoColor: '#be0028' },
  { id: 'inst_moza', name: 'Moza Banco', code: 'MOZA', type: InstitutionType.BANK, isActive: true, logoColor: '#f7941d' },
  { id: 'inst_unico', name: 'Banco Único', code: 'UNICO', type: InstitutionType.BANK, isActive: true, logoColor: '#000000' },
  { id: 'inst_mpesa', name: 'M-Pesa (Vodacom)', code: 'MPESA', type: InstitutionType.MOBILE_MONEY, isActive: true, logoColor: '#e60000' },
  { id: 'inst_emola', name: 'e-Mola (Movitel)', code: 'EMOLA', type: InstitutionType.MOBILE_MONEY, isActive: true, logoColor: '#ff6600' },
  { id: 'inst_cash', name: 'Caixa / Carteira', code: 'CASH', type: InstitutionType.CASH, isActive: true, logoColor: '#10b981' },
  { id: 'inst_access', name: 'Access Bank', code: 'ACCESS', type: InstitutionType.BANK, isActive: true, logoColor: '#004c8c' },
  { id: 'inst_fnb', name: 'FNB Moçambique', code: 'FNB', type: InstitutionType.BANK, isActive: true, logoColor: '#009597' },
  { id: 'inst_terra', name: 'Banco Terra', code: 'TERRA', type: InstitutionType.BANK, isActive: true, logoColor: '#5c3a21' },
  { id: 'inst_eco', name: 'Ecobank', code: 'ECO', type: InstitutionType.BANK, isActive: true, logoColor: '#005b82' },
  { id: 'inst_socremo', name: 'Socremo', code: 'SOC', type: InstitutionType.MICRO_BANK, isActive: true, logoColor: '#e31e24' },
  { id: 'inst_letshego', name: 'Letshego', code: 'LET', type: InstitutionType.MICRO_BANK, isActive: true, logoColor: '#ffcc00' },
];

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Energia (EDM)',
  'Água (FIPAG)',
  'Comunicação',
  'Educação',
  'Saúde',
  'Aluguer',
  'Negócios',
  'Apoio Familiar',
  'Igreja / Contribuições',
  'Lazer',
  'Outros'
];

export const EXCHANGE_RATES = {
  // Hardcoded for demo purposes. In production, fetch from an API.
  USD_TO_MZN: 63.5,
  ZAR_TO_MZN: 3.4,
  MZN_TO_MZN: 1
};