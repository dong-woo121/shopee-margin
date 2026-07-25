import type { Product } from '../types';

interface OrderCalcItem {
  product: Product;
  salePrice: number;
  qty: number;
}

interface OrderCalcParams {
  items: OrderCalcItem[];
  exchangeRate: number;
  costRate: number;
  vatRate: number;
  feeRate: number;
  settlementLocal: number;
}

export interface OrderCalcResult {
  totalSalePriceKRW: number;
  totalCostPrice: number;
  totalVatRefund: number;
  totalEffectiveCost: number;
  totalFee: number;
  // 예측 모드
  predictedSettlement: number;
  predictedMarginNoVat: number;
  predictedMarginNoVatRate: number;
  predictedMargin: number;
  predictedMarginRate: number;
  // 정산 모드
  actualSettlementKRW: number;
  actualMarginNoVat: number;
  actualMarginNoVatRate: number;
  actualMargin: number;
  actualMarginRate: number;
}

export function calculateOrder(p: OrderCalcParams): OrderCalcResult {
  let totalSalePriceKRW = 0;
  let totalCostPrice = 0;
  let totalVatRefund = 0;

  for (const item of p.items) {
    const unitCost = item.product.refPrice * (p.costRate / 100);
    totalSalePriceKRW += item.salePrice * p.exchangeRate * item.qty;
    totalCostPrice += unitCost * item.qty;
    totalVatRefund += unitCost * item.qty * (p.vatRate / 100);
  }

  const totalEffectiveCost = totalCostPrice - totalVatRefund;
  const totalFee = totalSalePriceKRW * (p.feeRate / 100);

  const predictedSettlement = totalSalePriceKRW - totalFee;
  const predictedMarginNoVat = predictedSettlement - totalCostPrice;
  const predictedMarginNoVatRate = predictedSettlement > 0 ? (predictedMarginNoVat / predictedSettlement) * 100 : 0;
  const predictedMargin = predictedSettlement - totalEffectiveCost;
  const predictedMarginRate = predictedSettlement > 0 ? (predictedMargin / predictedSettlement) * 100 : 0;

  const actualSettlementKRW = p.settlementLocal * p.exchangeRate;
  const actualMarginNoVat = actualSettlementKRW - totalCostPrice;
  const actualMarginNoVatRate = actualSettlementKRW > 0 ? (actualMarginNoVat / actualSettlementKRW) * 100 : 0;
  const actualMargin = actualSettlementKRW - totalEffectiveCost;
  const actualMarginRate = actualSettlementKRW > 0 ? (actualMargin / actualSettlementKRW) * 100 : 0;

  return {
    totalSalePriceKRW,
    totalCostPrice,
    totalVatRefund,
    totalEffectiveCost,
    totalFee,
    predictedSettlement,
    predictedMarginNoVat,
    predictedMarginNoVatRate,
    predictedMargin,
    predictedMarginRate,
    actualSettlementKRW,
    actualMarginNoVat,
    actualMarginNoVatRate,
    actualMargin,
    actualMarginRate,
  };
}
