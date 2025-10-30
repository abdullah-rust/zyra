import { api } from "../global/api";

export async function LoginApi(
  email: string,
  password: string
): Promise<boolean | string> {
  try {
    await api.post("/auth/login", {
      email,
      password,
    });
    return true;
  } catch (e: any) {
    console.log(e);
    return e.response?.data?.message;
  }
}
