import axios from "axios";
import prismaClient from '../prisma'
import { sign } from 'jsonwebtoken'

/**
 * Receber o Code(string),
 * Recuperar o access_token no github
 * Verificar se o user existe no DB
 * --------- SIM = Gera um token,
 * --------- Não = Cria no DB, gera um token,
 * Retornar o token com as infos do user
 */
interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  login: string;
  avatar_url: string;
  id: number;
  name: string;
}

export default class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: "9a9956c6039a5ffb6328",
          client_secret: "83b36dd86b666d491c8c399e991fa3ba8f6322a7",
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    const { avatar_url, id, login, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where:{
        github_id: id
      }
    })

    if(!user) {
      user = await prismaClient.user.create({
        data:{
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    const token = sign(
      {
      user:{
        name:user.name,
        avatar_url: user.avatar_url,
        id:user.id
      }
    },
    process.env.JWT_SECRET,
    {
      subject:user.id,
      expiresIn: '1d'

    }
    )


    return { token, user };
  }
}
