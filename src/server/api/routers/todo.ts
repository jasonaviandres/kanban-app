import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
export const todoRouter = createTRPCRouter({
    getAllTodos: protectedProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ctx, input}) => {
            return await ctx.db.todo.findMany({
                select: {
                    indexNumber: true,
                    task: true,
                    createdAt: true,
                    id: true,
                    ownerId: true,
                    completed: true
                }, 
                orderBy: {
                    indexNumber: 'asc',
                },
                where: {
                    ownerId: input.userId
                }
            })
        }
    ),
    addTodo: protectedProcedure
    .input(z.object({task: z.string(), indexNumber: z.number(), ownerId: z.string()}))
    .mutation(async ({ctx, input}) => {
        return await ctx.db.todo.create({
            data: input
        })
    }),
    deleteTodo: protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({ ctx, input}) => {
        return await ctx.db.todo.delete({
            where: {id: input.id}
        })
    }),
    updateTodo: protectedProcedure
    .input(z.object({id: z.number(), data: z.object({
        task: z.string().min(1).optional(),
        completed: z.boolean().optional()
    })}))
    .mutation(async ({ctx, input}) => {
        return await ctx.db.todo.update({
            where: {
                id: input.id
            },
            data: input.data
        })
    })
})