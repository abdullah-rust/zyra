import { api } from "../global/api";

export async function SignupApi(
  name: string,
  username: string,
  email: string,
  password: string
): Promise<boolean | string> {
  try {
    await api.post("/auth/signup", {
      name,
      username,
      email,
      password,
    });
    return true;
  } catch (e: any) {
    console.log(e);
    return e.response?.data?.message;
  }
}
