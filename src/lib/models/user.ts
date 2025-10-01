import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  nome: string;
  email: string;
  senha_hash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      unique: true,
      match: [/.+\@.+\..+/, "Por favor, insira um email válido."],
    },
    senha_hash: {
      type: String,
      required: [true, "A senha é obrigatória."],
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.Usuario || mongoose.model<IUser>("Usuario", UserSchema);

export default User;
