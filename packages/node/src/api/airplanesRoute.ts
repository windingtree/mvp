import { TRPCError } from '@trpc/server';
import { Storage } from '@windingtree/sdk-storage';
import { createLogger } from '@windingtree/sdk-logger';
import { simpleUid } from '@windingtree/contracts';
import {
  authProcedure,
  authAdminProcedure,
  router,
} from '@windingtree/sdk-node-api/server';
import { z } from 'zod';

const logger = createLogger('AirplanesRouter');

export interface CreateAirplanesRouterOptions {
  airplanesStorage: Storage;
}

export const AirplaneInputSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  capacity: z.number().int().gte(1),
  minTime: z.number().nonnegative(),
  maxTime: z.number().nonnegative(),
  media: z.array(
    z.object({
      type: z.enum(['image', 'video']),
      uri: z.string().min(1),
      thumbnail: z.string().min(1),
      description: z.string(),
    }),
  ),
  price: z.array(
    z.object({
      token: z.string().length(42).startsWith('0x'),
      value: z.string().min(1),
    }),
  ),
});

export type AirplaneInput = z.infer<typeof AirplaneInputSchema>;

export const AirplaneUpdateSchema = z.object({
  id: z.string(),
  data: AirplaneInputSchema,
});

export type AirplaneUpdate = z.infer<typeof AirplaneUpdateSchema>;

export const airplanesRouter = router({
  /**
   * Adds new airplane to the database
   */
  add: authAdminProcedure
    .input(AirplaneInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const id = simpleUid();
        await ctx.storage['airplanes'].set(id, input);
        logger.trace(`Airplane ${input.name} registered with id ${id}`);
      } catch (error) {
        logger.error('airplanes.add', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }
    }),
  /**
   * Updates airplane to the database
   */
  update: authAdminProcedure
    .input(AirplaneUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.storage['airplanes'].set(input.id, input.data);
        logger.trace(`Airplane ${input.data.name} updated`);
      } catch (error) {
        logger.error('airplanes.update', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }
    }),
  /**
   * Deletes airplane from the database
   */
  delete: authAdminProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.storage['airplanes'].delete(input);
        logger.trace(`Airplane with id ${input} deleted`);
      } catch (error) {
        logger.error('airplanes.delete', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }
    }),
  /**
   * Returns array of airplanes objects
   */
  get: authProcedure
    .input(z.string())
    .output(AirplaneInputSchema)
    .query(async ({ input, ctx }) => {
      let record: AirplaneInput | undefined;

      try {
        record = await ctx.storage['airplanes'].get<AirplaneInput>(input);

        if (record) {
          return record;
        }
      } catch (error) {
        logger.error('airplanes.get', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }

      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Airplane with id ${input} not found`,
      });
    }),
  /**
   * Returns array of airplanes objects
   */
  getAll: authProcedure
    .output(z.array(AirplaneInputSchema))
    .query(async ({ ctx }) => {
      try {
        const response = [];
        for (const record of await ctx.storage[
          'airplanes'
        ].entries<AirplaneInput>()) {
          response.push(record[1]);
        }
        return response;
      } catch (error) {
        logger.error('airplanes.add', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }
    }),
});
