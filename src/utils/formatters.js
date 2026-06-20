/**
 * Formatting utilities for clinical data.
 */

export const formatPercentage = (val) => {
  if (val === undefined || val === null) return '—';
  return `${Math.round(val)}%`;
};

export const formatNumber = (val, decimals = 1) => {
  if (val === undefined || val === null) return '—';
  return Number(val).toFixed(decimals);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

export const formatBmi = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return '—';
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};
