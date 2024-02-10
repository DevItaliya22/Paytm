import zod from 'zod'

const userSchemaSignUp = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
    number: zod.number().nonnegative(),
});
const userSchemaLogin = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
});

const transactionsSchema = zod.object({
    received: zod.number().nonnegative()
});

const giveMoneySchema=zod.object({
    email:zod.string().email(),
    amount:zod.number().nonnegative()
})
const creditDebitSchema=zod.object({
    amount:zod.number().nonnegative()
})
const updatePassword=zod.object({
    old_password:zod.string().min(8),
    new_password1:zod.string().min(8),
    new_password2:zod.string().min(8)
})
const friendsSchema=zod.object({
    email:zod.string().email()
})

export {
    userSchemaLogin,
    transactionsSchema,
    userSchemaSignUp,
    giveMoneySchema,
    creditDebitSchema,
    updatePassword,
    friendsSchema
};
