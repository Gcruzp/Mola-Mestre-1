import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida.");
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { erro: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return NextResponse.json(
        { erro: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return NextResponse.json(
        { erro: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const response = NextResponse.json({
      msg: "Login realizado com sucesso",
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { erro: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
