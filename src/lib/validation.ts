import { z } from 'zod';

export const MarketDataSchema = z.object({
  symbol: z.string().min(1).max(10),
  price: z.number().positive(),
  timestamp: z.date(),
  volume: z.number().nonnegative(),
  high: z.number().positive(),
  low: z.number().positive(),
  open: z.number().positive()
});

export const validateMarketData = (data: unknown) => {
  try {
    return MarketDataSchema.parse(data);
  } catch (error) {
    throw new Error(`Invalid market data: ${error}`);
  }
};
