import type { CalcResult } from '../types';

interface CalcParams {
  salePrice: number;
  exchangeRate: number;
  refPrice: number;
  costRate: number;
  vatRate: number;
  feeRate: number;
  settlementKRW: number;
}

export function calculate(p: CalcParams): CalcResult {
  const salePriceKRW = p.salePrice * p.exchangeRate;
  const costPrice = p.refPrice * (p.costRate / 100);
  const vatAmount = costPrice * (p.vatRate / 100);
  const totalCost = costPrice + vatAmount;

  const feeAmount = salePriceKRW * (p.feeRate / 100);
  const predictedSettlement = salePriceKRW - feeAmount;
  const predictedMargin = predictedSettlement - totalCost;
  const predictedMarginRate = predictedSettlement > 0 ? (predictedMargin / predictedSettlement) * 100 : 0;

  const actualMargin = p.settlementKRW - totalCost;
  const actualMarginRate = p.settlementKRW > 0 ? (actualMargin / p.settlementKRW) * 100 : 0;

  return {
    salePriceKRW,
    costPrice,
    vatAmount,
    totalCost,
    feeAmount,
    predictedSettlement,
    predictedMargin,
    predictedMarginRate,
    actualMargin,
    actualMarginRate,
  };
}
