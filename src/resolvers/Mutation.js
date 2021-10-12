const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 16);
    const user = await context.prisma.user.create({
        data: { ...args, password },
    });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return { token, user };
}

async function login(parents, args, context, info) {
    const user = await context.prisma.user.findUnique({
        where: { email: args.email },
    });
    if (!user) {
        throw new Error('Incorrect username or password.');
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password.');
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return { token, user };
}
async function post(parent, args, context, info) {
    const { userId } = context;
    const link = await context.prisma.link.create({
        data: {
            postedBy: { connect: { id: userId } },
            description: args.description,
            url: args.url,
        },
    });
    return link;
}
module.exports = {
    signup,
    login,
    post,
};
