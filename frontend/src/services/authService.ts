
import type { AxiosResponse } from "axios";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth";
import { api } from "./api";

export function useAuthService() {

  function login(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return api.post("/usuarios/login", data);
  }

  function register(data: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> {
    return api.post("/usuarios", data);
  }

function atualizarCadastro(id: string, dto: Record<string, string>) {
  return api.put(`/usuarios/${id}`, dto);
}

return { login, register, atualizarCadastro };
}
