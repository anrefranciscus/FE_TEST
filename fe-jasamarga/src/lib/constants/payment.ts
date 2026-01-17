export const paymentClusters = {
  KTP: ['DinasOpr', 'DinasMitra', 'DinasKary'],
  E_TOLL: ['eBca', 'eBri', 'eBni', 'eMandiri', 'eDKI', 'eMega', 'eNobu'],
  FLO: ['eFlo'],
  TUNAI: ['Tunai'],
};

export const paymentMethodColors: Record<string, string> = {
  Tunai: '#228be6',
  eBca: '#40c057',
  eBri: '#fd7e14',
  eBni: '#e64980',
  eMandiri: '#12b886',
  eDKI: '#fab005',
  eMega: '#7950f2',
  eNobu: '#15aabf',
  eFlo: '#fa5252',
  DinasOpr: '#868e96',
  DinasMitra: '#be4bdb',
  DinasKary: '#82c91e',
};

export const paymentMethodLabels: Record<string, string> = {
  Tunai: 'Tunai',
  eBca: 'BCA',
  eBri: 'BRI',
  eBni: 'BNI',
  eMandiri: 'Mandiri',
  eDKI: 'DKI',
  eMega: 'Mega',
  eNobu: 'Nobu',
  eFlo: 'Flo',
  DinasOpr: 'Dinas Operator',
  DinasMitra: 'Dinas Mitra',
  DinasKary: 'Dinas Karyawan',
};

export const shiftLabels: Record<number, string> = {
  1: 'Shift 1 (00:00 - 08:00)',
  2: 'Shift 2 (08:00 - 16:00)',
  3: 'Shift 3 (16:00 - 24:00)',
};

export const golonganLabels: Record<number, string> = {
  1: 'Golongan I',
  2: 'Golongan II',
  3: 'Golongan III',
  4: 'Golongan IV',
  5: 'Golongan V',
};