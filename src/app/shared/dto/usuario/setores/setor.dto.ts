import { FuncionarioDto } from "./funcionario.dto";

export class SetorDto {
  id!: number;
  setor!: string;
  funcionarios!: FuncionarioDto[];
}
