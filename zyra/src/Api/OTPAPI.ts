import { api } from "../global/api";

export async function OTPApi(
  email: string,
  code: string,
  typeSubmit: string
): Promise<boolean | string> {
  try {
    await api.post("/auth/otp", {
      email,
      code,
      typeSubmit,
    });
    return true;
  } catch (e: any) {
    console.log(e);
    return e.response?.data?.message;
  }
}
