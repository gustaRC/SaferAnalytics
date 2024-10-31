import { SweetAlert } from './../../../shared/util/sweet-alert';
import { Component, OnInit } from '@angular/core';
import { FuncionarioDto } from 'src/app/shared/dto/usuario/setores/funcionario.dto';
import { SetorDto } from 'src/app/shared/dto/usuario/setores/setor.dto';
import { TarefasDto } from 'src/app/shared/dto/usuario/setores/tarefas.dto';
import { CoresEnum } from 'src/app/shared/enum/coresGraficos.enum';
import { GlobalUtil } from 'src/app/shared/util/global-util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  listaDados: SetorDto[] = [];
  listaFuncionarios!: FuncionarioDto[];

  infoGeral!: TarefasDto;

  mesesDisponiveis!: any[];
  datasetEnviadoTeste!: number[];
  datasetErroTeste!: number[];
  datasetTarefasFechadas!: number[];
  datasetTarefasAbertas!: number[];
  datasetHorasFechadas!: string[];

  dataGraficoTarefasTesteErroFechada: any;
  optionsGraficoTarefasTesteErroFechada: any;

  constructor(
    private util: GlobalUtil
  ) { }

  ngOnInit(): void {
    this.redefinirVariaveis();
  }

  redefinirVariaveis() {
    this.infoGeral = new TarefasDto;
    this.listaFuncionarios = [];
    this.mesesDisponiveis = [];
    this.datasetEnviadoTeste = [];
    this.datasetErroTeste = [];
    this.datasetTarefasFechadas = [];
    this.datasetTarefasAbertas = [];
    this.datasetHorasFechadas = [];
  }

  tratamentoDados(event: SetorDto[]) {
    this.listaDados = event
    console.log('lista crua', this.listaDados)

    this.atribuirVariaveisData();

    this.definirGraficoTarefasTesteErrosFechada();
  }

  atribuirVariaveisData() {

    this.redefinirVariaveis();

    this.listaDados.forEach(set => {
      this.listaFuncionarios.push(...set.funcionarios);
    })

    const arrTeste: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrErro: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrFechada: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrAbertas: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrHoras: string[][] = [[], [], [], [], [], [], [], [], [], [], [], []];

    this.listaFuncionarios.forEach(func => {
      func.tarefasPeriodo.forEach(per => {
        // const anoCurto = this.util.getAnoCurto(per.ano) IMPLEMENTAR
        per.meses.forEach(mes => {
          const mesDate = this.util.getNomeMes(mes.mes)
          !this.mesesDisponiveis.find(el => el === mesDate) && this.mesesDisponiveis.push(mesDate)

          for (let index = 0; index < 12; index++) {
            if (index == (mes.mes - 1)) {
              arrTeste[index].push(mes.tarefas.enviadasTeste);
              arrErro[index].push(mes.tarefas.erroTeste);
              arrFechada[index].push(mes.tarefas.tarefasFechadas);
              arrAbertas[index].push(mes.tarefas.tarefasAbertas);
              arrHoras[index].push(mes.tarefas.horasTarefasFechadas);
            }
          }

        })
      })
    })

    arrTeste.map(qtdeTarefas => {
      const valorTotal = qtdeTarefas.reduce((acumulador, tarefaAtual) => acumulador + tarefaAtual, 0);
      qtdeTarefas.length > 0 && this.datasetEnviadoTeste.push(valorTotal);
    });
    arrErro.map(qtdeErros => {
      const valorTotal = qtdeErros.reduce((acumulador, tarefaAtual) => acumulador + tarefaAtual, 0);
      qtdeErros.length > 0 && this.datasetErroTeste.push(valorTotal);
    });
    arrFechada.map(qtdeFechadas => {
      const valorTotal = qtdeFechadas.reduce((acumulador, tarefaAtual) => acumulador + tarefaAtual, 0);
      qtdeFechadas.length > 0 && this.datasetTarefasFechadas.push(valorTotal);
    });
    arrAbertas.map(qtdeAbertas => {
      const valorTotal = qtdeAbertas.reduce((acumulador, tarefaAtual) => acumulador + tarefaAtual, 0);
      qtdeAbertas.length > 0 && this.datasetTarefasAbertas.push(valorTotal);
    });
    arrHoras.map(qtdeHoras => {
      const valorTotal = qtdeHoras.reduce((acumulador, hora) => {
        const [h, m] = hora.split(":").map(Number);
        return acumulador + h + (m / 60);
      }, 0);
      const horasInt = Math.floor(valorTotal);
      const minutos = Math.round((valorTotal - horasInt) * 60);
      const valorTotalHora = `${String(horasInt).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

      qtdeHoras.length > 0 && this.datasetHorasFechadas.push(valorTotalHora);
    });

    this.definirInfoGerais();
  }

  definirInfoGerais() {
    this.infoGeral.enviadasTeste = this.datasetEnviadoTeste.reduce((acumulador, valorAtual) => acumulador + valorAtual, 1);
    this.infoGeral.erroTeste = this.datasetErroTeste.reduce((acumulador, valorAtual) => acumulador + valorAtual, 1);
    this.infoGeral.tarefasFechadas = this.datasetTarefasFechadas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 1);
    this.infoGeral.tarefasAbertas = this.datasetTarefasAbertas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 1);
    this.infoGeral.porcentagemErroTeste = `${(this.infoGeral.erroTeste * this.infoGeral.enviadasTeste) / 100}%`

    const totalHoras = this.datasetHorasFechadas.reduce((acumulado, hora) => {
      const [h, m] = hora.split(":").map(Number);
      return acumulado + h + (m / 60);
    }, 0);
    const horasInt = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horasInt) * 60);
    this.infoGeral.horasTarefasFechadas = `${String(horasInt).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    // this.infoGeral.horasTarefasFechadas =

    console.log('infogeral', this.infoGeral)
  }

  definirGraficoTarefasTesteErrosFechada() {
    this.dataGraficoTarefasTesteErroFechada = {
      labels: [...this.mesesDisponiveis],
      datasets: [
        {
          label: 'Enviado para Testes',
          data: this.datasetEnviadoTeste,
          backgroundColor: CoresEnum.AZUL1,
          borderColor: CoresEnum.AZUL2,
        },
        {
          label: 'Erros no Teste',
          data: this.datasetErroTeste,
          backgroundColor: CoresEnum.VERM1,
          borderColor: CoresEnum.VERM2,
        },
        {
          label: 'Fechadas',
          data: this.datasetTarefasFechadas,
          backgroundColor: CoresEnum.VERDE1,
          borderColor: CoresEnum.VERDE2,
        },
      ]
    }

    this.optionsGraficoTarefasTesteErroFechada = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  color: CoresEnum.CINZA3
              }
          }
      },
      scales: {
          x: {
            ticks: {
              font: {
                weight: 500
              }
            },
            grid: {
              color: CoresEnum.CINZA1,
              drawBorder: false
            }
          },
          y: {
            grid: {
              color: CoresEnum.CINZA1,
              drawBorder: false
            }
          }
      }
    }

  }




}
