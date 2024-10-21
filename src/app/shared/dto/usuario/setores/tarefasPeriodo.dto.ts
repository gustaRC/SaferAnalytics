import { TarefasDto } from "./tarefas.dto";

export class TarefasPeriodoDto {
  ano!: number;
  meses!: {
    mes: number;
    tarefas: TarefasDto
  }
}
