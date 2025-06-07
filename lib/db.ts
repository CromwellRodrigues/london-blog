
// import { PrismaClient } from "@prisma/client";

// const PrismaClientSingleton = () => {
//     return new PrismaClient()
// }


// declare const globalThis: {
//     prismaGlobal: ReturnType<typeof PrismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') {
//     globalThis.prismaGlobal = prisma;
// }

// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../src/generated/prisma'; 

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
prisma = globalForPrisma.prisma;

export default prisma;