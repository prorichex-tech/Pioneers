export const FACTORS = {
  R1: { title: 'Нет применимого законного основания', weight: 35 },
  R2: { title: 'Прямое предложение внести деньги', weight: 25 },
  R3: { title: 'Активная реклама строящегося жилья', weight: 10 },
  R4: { title: 'Подтверждённое коллективное обращение', weight: 15 },
  R5: { title: 'Расхождение готовности ≥ 20 п.п.', weight: 10 },
  R6: { title: 'Подтверждённый простой или просрочка', weight: 5 }
};
export function calculateRisk(factors = {}) {
  const confirmed = Object.entries(factors).filter(([, f]) => f.status === 'confirmed');
  const score = Math.min(100, confirmed.reduce((sum, [code]) => sum + (FACTORS[code]?.weight ?? 0), 0));
  const hasR1 = factors.R1?.status === 'confirmed';
  const hasR2 = factors.R2?.status === 'confirmed';
  const zone = score < 25 ? 'green' : score >= 60 && hasR1 && hasR2 ? 'red' : score >= 25 ? 'yellow' : 'green';
  return { score, zone, confirmed: confirmed.map(([code]) => code) };
}
