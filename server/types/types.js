import zod from 'zod'

const userSchemaSignUp = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(56),
    number: zod.number().positive(),
    username:zod.string().min(4)
});
const userSchemaLogin = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(56),
});

const giveMoneySchema=zod.object({
    email:zod.string().email(),
    amount:zod.number().positive()
})
const creditDebitSchema=zod.object({
    amount:zod.number().positive()
})
const updatePassword=zod.object({
    old_password:zod.string().min(4).max(56),
    new_password1:zod.string().min(4).max(56),
    new_password2:zod.string().min(4).max(56)
})

const friendsSchema=zod.object({
    email:zod.string().email()
})

const reqMoneySchema=zod.object({
    id:zod.string()
})

export {
    userSchemaLogin,
    userSchemaSignUp,
    giveMoneySchema,
    creditDebitSchema,
    updatePassword,
    friendsSchema,
    reqMoneySchema
};
