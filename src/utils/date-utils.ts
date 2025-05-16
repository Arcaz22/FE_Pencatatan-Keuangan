export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  return months[monthIndex];
};

export const getCurrentMonth = (): number => new Date().getMonth();
export const getCurrentYear = (): number => new Date().getFullYear();
