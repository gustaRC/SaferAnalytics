import { TarefasPeriodoDto } from "./tarefasPeriodo.dto";

export class FuncionarioDto {
  id!: number;
  nome!: string;
  tarefasPeriodo!: TarefasPeriodoDto[]
}
