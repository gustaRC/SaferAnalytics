import { SweetAlert } from './../../../shared/util/sweet-alert';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DatasetSetores } from 'src/app/shared/dto/graficos/datasetSetores.dto';
import { FuncionarioDto } from 'src/app/shared/dto/setores/funcionario.dto';
import { SetorDto } from 'src/app/shared/dto/setores/setor.dto';
import { TarefasDto } from 'src/app/shared/dto/setores/tarefas.dto';
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
  setoresDisponiveis!: string[];

  datasetEnviadoTeste!: number[];
  datasetErroTeste!: number[];
  datasetTarefasFechadas!: number[];
  datasetTarefasAbertas!: number[];
  datasetNovasTarefas!: number[];
  datasetBaixaTarefas!: number[];
  datasetMediaTarefas!: number[];
  datasetAltaTarefas!: number[];
  datasetProjetoTarefas!: number[];
  datasetHorasFechadas!: string[];
  datasetSetores!: DatasetSetores[];

  dataGraficoTarefasTesteErroFechada!: ChartData;
  optionsGraficoTarefasTesteErroFechada!: ChartOptions;

  dataGraficoTarefasAbertasFechadas!: ChartData;
  optionsGraficoTarefasAbertasFechadas!: ChartOptions;

  dataGraficoHorasTrabalhadas!: ChartData;
  optionsGraficoHorasTrabalhadas!: ChartOptions;

  dataGraficoNivelTarefas!: ChartData;
  optionsGraficoNivelTarefas!: ChartOptions;

  dataGraficoSetoresRadar!: ChartData;
  optionsGraficoSetoresRadar!: ChartOptions;

  constructor(
    private util: GlobalUtil
  ) { }

  ngOnInit(): void {
    this.redefinirVariaveis();
  }

  redefinirVariaveis() {
    this.infoGeral = new TarefasDto;
    this.datasetSetores = [];
    this.listaFuncionarios = [];
    this.mesesDisponiveis = [];
    this.setoresDisponiveis = [];
    this.datasetEnviadoTeste = [];
    this.datasetErroTeste = [];
    this.datasetTarefasFechadas = [];
    this.datasetTarefasAbertas = [];
    this.datasetHorasFechadas = [];
    this.datasetNovasTarefas = [];
    this.datasetBaixaTarefas = [];
    this.datasetMediaTarefas = [];
    this.datasetAltaTarefas = [];
    this.datasetProjetoTarefas = [];
  }

  tratamentoDados(event: SetorDto[]) {
    this.listaDados = event
    console.log('lista crua', this.listaDados)

    this.atribuirVariaveisData();

    this.definirGraficoTarefasTesteErrosFechada();
    this.definirGraficoTarefasAbertasFechadas();
    this.definirGraficoHorasTrabalhadas();
    this.definirGraficoNivelTarefas();
    this.definirGraficoSetoresRadar();
  }

  atribuirVariaveisData() {
    this.redefinirVariaveis();

    this.listaDados.forEach(set => {
      this.listaFuncionarios.push(...set.funcionarios);
      !this.setoresDisponiveis.find(el => el === set.setor) && this.setoresDisponiveis.push(set.setor);
    })

    const arrTeste: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrErro: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrFechada: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrAbertas: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrNovas: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrBaixas: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrMedias: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrAltas: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
    const arrProjetos: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
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
              arrNovas[index].push(mes.tarefas.novasTarefas);
              arrBaixas[index].push(mes.tarefas.qtdeNivelBaixoFechadas);
              arrMedias[index].push(mes.tarefas.qtdeNivelMedioFechadas);
              arrAltas[index].push(mes.tarefas.qtdeNivelAltoFechadas);
              arrProjetos[index].push(mes.tarefas.qtdeNivelProjetoFechadas);
              arrHoras[index].push(mes.tarefas.horasTarefasFechadas);
            }
          }

        })
      })
    })

    arrTeste.map(qtdeTarefas => {
      const valorTotal = qtdeTarefas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeTarefas.length > 0 && this.datasetEnviadoTeste.push(valorTotal);
    });
    arrErro.map(qtdeErros => {
      const valorTotal = qtdeErros.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeErros.length > 0 && this.datasetErroTeste.push(valorTotal);
    });
    arrFechada.map(qtdeFechadas => {
      const valorTotal = qtdeFechadas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeFechadas.length > 0 && this.datasetTarefasFechadas.push(valorTotal);
    });
    arrAbertas.map(qtdeAbertas => {
      const valorTotal = qtdeAbertas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeAbertas.length > 0 && this.datasetTarefasAbertas.push(valorTotal);
    });
    arrNovas.map(qtdeNovas => {
      const valorTotal = qtdeNovas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeNovas.length > 0 && this.datasetNovasTarefas.push(valorTotal);
    });
    arrBaixas.map(qtdeBaixas => {
      const valorTotal = qtdeBaixas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeBaixas.length > 0 && this.datasetBaixaTarefas.push(valorTotal);
    });
    arrMedias.map(qtdeMedias => {
      const valorTotal = qtdeMedias.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeMedias.length > 0 && this.datasetMediaTarefas.push(valorTotal);
    });
    arrAltas.map(qtdeAltas => {
      const valorTotal = qtdeAltas.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeAltas.length > 0 && this.datasetAltaTarefas.push(valorTotal);
    });
    arrProjetos.map(qtdeProjeto => {
      const valorTotal = qtdeProjeto.reduce((acumulador, tarefaAtual) => acumulador + (tarefaAtual == null || tarefaAtual == undefined ? 0 : tarefaAtual), 0);
      qtdeProjeto.length > 0 && this.datasetProjetoTarefas.push(valorTotal);
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
    this.infoGeral.enviadasTeste = this.datasetEnviadoTeste.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.erroTeste = this.datasetErroTeste.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.tarefasFechadas = this.datasetTarefasFechadas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.tarefasAbertas = this.datasetTarefasAbertas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.porcentagemErroTeste = `${(this.infoGeral.erroTeste * this.infoGeral.enviadasTeste) / 100}%`
    this.infoGeral.novasTarefas = this.datasetNovasTarefas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.qtdeNivelBaixoFechadas = this.datasetBaixaTarefas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.qtdeNivelMedioFechadas = this.datasetMediaTarefas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.qtdeNivelAltoFechadas = this.datasetAltaTarefas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    this.infoGeral.qtdeNivelProjetoFechadas = this.datasetProjetoTarefas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

    const totalHoras = this.datasetHorasFechadas.reduce((acumulado, hora) => {
      const [h, m] = hora.split(":").map(Number);
      return acumulado + h + (m / 60);
    }, 0);
    const horasInt = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horasInt) * 60);
    this.infoGeral.horasTarefasFechadas = `${String(horasInt).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
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
            }
          },
          y: {
            grid: {
              color: CoresEnum.CINZA1,
            }
          }
      }
    }

  }

  definirGraficoTarefasAbertasFechadas() {
    this.dataGraficoTarefasAbertasFechadas = {
      labels: ['Novas', 'Fechadas'],
      datasets: [
        {
          data: [this.infoGeral.novasTarefas, this.infoGeral.tarefasFechadas],
          backgroundColor: [CoresEnum.LARANJA1, CoresEnum.VERDE1]
        }
      ]
    }

    this.optionsGraficoTarefasAbertasFechadas = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
    }
  }

  definirGraficoHorasTrabalhadas() {
    const datasetHorasDecimais = this.datasetHorasFechadas.map(el => this.util.converterHoraDecimal(el))
    this.dataGraficoHorasTrabalhadas = {
      labels: [...this.mesesDisponiveis],
      datasets: [
        {
          type: 'line',
          label: 'Horas',
          data: [...datasetHorasDecimais],
          borderColor: CoresEnum.AZUL2,
          borderWidth: 3,
          pointRadius: 5,
          pointBorderWidth: 2,
          fill: false,
        },
        {
          type: 'bar',
          label: 'Tarefas Fechadas',
          data: this.datasetTarefasFechadas,
          backgroundColor: CoresEnum.VERDE1,
          borderColor: CoresEnum.VERDE2,
        }
      ]
    }

    const arrHorasFechadas = [...this.datasetHorasFechadas];
    this.optionsGraficoHorasTrabalhadas = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        tooltip: {
          callbacks: {
            label(tooltipItem) {
              const value = tooltipItem.parsed.y;
              if (tooltipItem.dataset.label == "Horas") {
                const data = tooltipItem.dataset.data;
                const index = data.indexOf(value);
                const dataHora = arrHorasFechadas[index];
                return ` Horas: ${dataHora}`
              } else {
                return `${tooltipItem.dataset.label}: ${value}`
              }
            },
          }
        }
      }
    }

  }

  definirGraficoNivelTarefas() {
    this.dataGraficoNivelTarefas = {
      labels: [...this.mesesDisponiveis],
      datasets: [
        {
          label: 'Baixo',
          data: this.datasetBaixaTarefas,
          backgroundColor: CoresEnum.AZUL1,
          borderColor: CoresEnum.AZUL2,
        },
        {
          label: 'Média',
          data: this.datasetMediaTarefas,
          backgroundColor: CoresEnum.AMARELO1,
          borderColor: CoresEnum.AMARELO2,
        },
        {
          label: 'Alta',
          data: this.datasetAltaTarefas,
          backgroundColor: CoresEnum.VERM1,
          borderColor: CoresEnum.VERM2,
        },
        {
          label: 'Projeto',
          data: this.datasetProjetoTarefas,
          backgroundColor: CoresEnum.AZULADO1,
          borderColor: CoresEnum.AZULADO2,
        },
      ]
    }

    this.optionsGraficoNivelTarefas = {
      indexAxis: 'y',
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
            }
          },
          y: {
            grid: {
              color: CoresEnum.CINZA1,
            }
          }
      }
    }

  }

  definirGraficoSetoresRadar() {
    this.dataGraficoSetoresRadar = {
      labels: ['Novas', 'Erros no Teste', 'Enviadas para Teste', 'Tarefas Fechadas'],
      datasets: [
        {
          data: this.datasetNovasTarefas
        }
      ]
    }

    for(let i of this.datasetSetores) {
      this.dataGraficoSetoresRadar.datasets.push({
        label: "",
        data: []
      })
    }



  }


}
