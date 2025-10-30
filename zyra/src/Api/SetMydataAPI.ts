import { api } from "../global/api";

export async function SetMyDataApi(): Promise<any | string> {
  try {
    const res = await api.get(`/profile`);
    return res;
  } catch (e: any) {
    console.log(e);
    return e.response?.data?.message;
  }
}
