import type { CalcResult } from '../types';

interface CalcParams {
  salePrice: number;
  exchangeRate: number;
  refPrice: number;
  costRate: number;
  vatRate: number;
  feeRate: number;
  settlementLocal: number;
}

export function calculate(p: CalcParams): CalcResult {
  const salePriceKRW = p.salePrice * p.exchangeRate;
  const costPrice = p.refPrice * (p.costRate / 100);
  const vatRefund = costPrice * (p.vatRate / 100);
  const totalCost = costPrice - vatRefund;

  const feeAmount = salePriceKRW * (p.feeRate / 100);
  const predictedSettlement = salePriceKRW - feeAmount;
  const predictedMargin = predictedSettlement - totalCost;
  const predictedMarginRate = predictedSettlement > 0 ? (predictedMargin / predictedSettlement) * 100 : 0;

  const actualSettlementKRW = p.settlementLocal * p.exchangeRate;
  const actualMargin = actualSettlementKRW - totalCost;
  const actualMarginRate = actualSettlementKRW > 0 ? (actualMargin / actualSettlementKRW) * 100 : 0;

  return {
    salePriceKRW,
    costPrice,
    vatRefund,
    totalCost,
    feeAmount,
    predictedSettlement,
    predictedMargin,
    predictedMarginRate,
    actualSettlementKRW,
    actualMargin,
    actualMarginRate,
  };
}
