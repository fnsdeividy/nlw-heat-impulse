import  prismaClient  from "../prisma";

export default class ProfileUserService {
    async execute(user_id:string){
        const user = prismaClient.user.findFirst({
            where: {
                id: user_id
            }
        })
        return user
    }
}