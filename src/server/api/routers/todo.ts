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
    }),
    getTaskById: protectedProcedure.input(z.object({id: z.number()})).query(async ({ctx, input}) => {
        return await ctx.db.todo.findFirst({
            where: {id: input.id},
            select: {
                indexNumber: true,
            }

        })
    }),
    orderTodo: protectedProcedure.input(z.object({id: z.number(), prevTaskIndexNumber: z.number(), nextTaskIndexNumber: z.number()})).mutation(async ({ctx, input}) => {
        const id = input.id;
        const prevTaskIndexNumber = input.prevTaskIndexNumber;
        const nextTaskIndexNumber = input.nextTaskIndexNumber
        if (!prevTaskIndexNumber && !nextTaskIndexNumber) return;
        let currTaskIndexNumber = 0;
        if (!prevTaskIndexNumber) {
            currTaskIndexNumber = nextTaskIndexNumber - 512
        } else if (!nextTaskIndexNumber) {
            currTaskIndexNumber = prevTaskIndexNumber + 512
        } else  {
            currTaskIndexNumber = Math.floor((prevTaskIndexNumber + nextTaskIndexNumber)/2)
        }

        try {
            await ctx.db.todo.update({
                where: {
                    id,
                },
                data: {
                    indexNumber: currTaskIndexNumber
                }
            })
    
            if (Math.abs(currTaskIndexNumber - prevTaskIndexNumber) <= 1 || Math.abs(currTaskIndexNumber - nextTaskIndexNumber) <= 1) {
                await ctx.db.todo.updateMany({
                    data: {
                        indexNumber: {
                            increment: 1024
                        }
                    }
                })
            }
        } catch (error) {
            
        }

        


    })
})