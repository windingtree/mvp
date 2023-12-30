import { z } from 'zod';
import { StableCoin } from '../../hooks/useProtocolConfig.js';

export const MediaTypeSchema = z.enum(['image', 'video']);

export const AirplaneMediaSchema = z.object({
  type: MediaTypeSchema,
  uri: z.string(), // Link to the media file
  thumbnail: z.string(), // Link to the medial file thumbnail
  description: z.string().optional(), // Description of the medial file
});

export type AirplaneMedia = z.infer<typeof AirplaneMediaSchema>;

export const AirplanePriceSchema = z.object({
  token: z.string().regex(/^0x[a-fA-F0-9]{40}$/), // ERC20 token address (stablecoin)
  value: z.string().regex(/^[1-9][0-9]*$/), // Price per one hour in tokens
});

export const AirplaneConfigurationSchema = z
  .object({
    name: z.string(), // Name/type of the airplane
    description: z.string(), // Detailed information about the airplane
    capacity: z.number().int().gt(0), // Maximum passengers capacity
    minTime: z.number().gt(0), // Minimum tour time in hours (decimal number allowed)
    maxTime: z.number().gt(0), // Maximum tour time in hours (decimal number allowed)
  })
  .refine((data) => data.maxTime > data.minTime, {
    message: 'maxTime must be greater than minTime',
    path: ['maxTime'],
  });

export type AirplaneConfiguration = z.infer<typeof AirplaneConfigurationSchema>;

export interface PriceOption {
  price: bigint;
  coin: StableCoin;
}
