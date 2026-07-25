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
  predictedSettlement: number;
  predictedMargin: number;
  predictedMarginRate: number;
  actualSettlementKRW: number;
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
  const predictedMargin = predictedSettlement - totalEffectiveCost;
  const predictedMarginRate = predictedSettlement > 0 ? (predictedMargin / predictedSettlement) * 100 : 0;

  const actualSettlementKRW = p.settlementLocal * p.exchangeRate;
  const actualMargin = actualSettlementKRW - totalEffectiveCost;
  const actualMarginRate = actualSettlementKRW > 0 ? (actualMargin / actualSettlementKRW) * 100 : 0;

  return {
    totalSalePriceKRW,
    totalCostPrice,
    totalVatRefund,
    totalEffectiveCost,
    totalFee,
    predictedSettlement,
    predictedMargin,
    predictedMarginRate,
    actualSettlementKRW,
    actualMargin,
    actualMarginRate,
  };
}
