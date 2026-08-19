import type { Product } from '../types';

interface OrderCalcItem {
  product: Product;
  salePrice: number;
  qty: number;
}

interface OrderCalcParams {
  items: OrderCalcItem[];
  exchangeRate: number;
  costRate: number;       // 인셀덤 전체 매입률 (%)
  vatRate: number;        // 부가세 환급률 (%)
  feeRate: number;        // 수수료율 (%)
  settlementLocal: number;
}

export interface OrderCalcResult {
  totalSalePriceKRW: number;
  totalCostPrice: number;
  totalVatRefund: number;
  totalEffectiveCost: number;
  totalFee: number;
  predictedSettlement: number;
  predictedMarginNoVat: number;
  predictedMarginNoVatRate: number;
  predictedMargin: number;
  predictedMarginRate: number;
  actualSettlementKRW: number;
  actualMarginNoVat: number;
  actualMarginNoVatRate: number;
  actualMargin: number;
  actualMarginRate: number;
}

function getUnitCost(product: Product, costRate: number): number {
  if (product.brand === '인셀덤') {
    return (product.refPrice || 0) * (costRate / 100);
  }
  // 애터미: 당사공급가 ÷ 분할수
  return (product.purchasePrice || 0) / (product.splitCount || 1);
}

export function calculateOrder(p: OrderCalcParams): OrderCalcResult {
  let totalSalePriceKRW = 0;
  let totalCostPrice = 0;
  let totalVatRefund = 0;

  for (const item of p.items) {
    const unitCost = getUnitCost(item.product, p.costRate);
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
    totalSalePriceKRW, totalCostPrice, totalVatRefund, totalEffectiveCost,
    totalFee, predictedSettlement,
    predictedMarginNoVat, predictedMarginNoVatRate, predictedMargin, predictedMarginRate,
    actualSettlementKRW, actualMarginNoVat, actualMarginNoVatRate, actualMargin, actualMarginRate,
  };
}
