import zod from 'zod'

const userSchemaSignUp = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    number: zod.number().nonnegative(),
});
const userSchemaLogin = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});

const transactionsSchema = zod.object({
    received: zod.number().nonnegative()
});

const giveMoneySchema=zod.object({
    email:zod.string().email(),
    amount:zod.number().nonnegative()
})

export {
    userSchemaLogin,
    transactionsSchema,
    userSchemaSignUp,
    giveMoneySchema
};
