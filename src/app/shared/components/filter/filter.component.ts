import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SetorDto } from '../../dto/setores/setor.dto';
import { FuncionarioDto } from '../../dto/setores/funcionario.dto';
import { SetoresService } from '../../services/setores.service';
import { SweetAlert } from '../../util/sweet-alert';
import { TipoGenericoDto } from '../../dto/setores/tipoGenerico.dto';
import { TarefasPeriodoDto } from '../../dto/setores/tarefasPeriodo.dto';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{

  @Output() dataOutput = new EventEmitter<any>()
  private listaSetores$ = new BehaviorSubject<SetorDto[]>([]);

  dataSetores: SetorDto[] = [];
  listaSetorInput: TipoGenericoDto[] = [];
  setoresSelecionados: TipoGenericoDto[] = [];

  listaFuncionarios: FuncionarioDto[] = [];
  listaFuncionarioInput: TipoGenericoDto[] = []
  funcionariosSelecionados: TipoGenericoDto[] = [];

  listaAnosDisponiveis: number[] = [];
  anosSelecionados: number[] = [];

  constructor(
    private setoresService: SetoresService,
    private sweetAlert: SweetAlert
  ) { }

  ngOnInit(): void {
    this.buscarSetores();
  }

  buscarSetores() {
    this.sweetAlert.loader('Carregando setores...')
    this.setoresService.getSetores()
    .subscribe({
      next: resp => {
        this.dataSetores = JSON.parse(JSON.stringify(resp));//MANIPULAR
        this.listaSetores$.next([...resp])//BACKUP

        this.emitirDados();

        this.definirSetoresInput(this.dataSetores);
        this.definirFuncionariosInput(this.dataSetores);
        this.definirAnosDisponiveis(this.dataSetores);
      },
      error: err => this.sweetAlert.error(err),
      complete: () => this.sweetAlert.close()
    })
  }

  definirAnosDisponiveis(data: SetorDto[]) {
    const totalAnos: number[] = [];
    this.listaAnosDisponiveis = [];

    data.forEach(set => {
      set.funcionarios.forEach(func => {
        func.tarefasPeriodo.forEach(per => {
          totalAnos.push(per.ano)
        })
      })
    })

    this.listaAnosDisponiveis = [];
    totalAnos.map(ano => !this.listaAnosDisponiveis.includes(ano) && this.listaAnosDisponiveis.push(ano))
    this.anosSelecionados = this.listaAnosDisponiveis;
  }

  tratarAnosSelecionados() {
    this.listaSetores$.subscribe(
      resp => {
        this.dataSetores.map(set => {
          set.funcionarios.forEach(func => {
            func.tarefasPeriodo = [];
          })
        })

        console.log('resp',resp)
        console.log('datasetores',this.dataSetores)

        resp.forEach(set => {

          set.funcionarios.forEach(func => {
            func.tarefasPeriodo.forEach(tarPeriodo => {

              this.anosSelecionados.forEach(ano => {
                ano == tarPeriodo.ano
              })

            })
          })

        })

        // this.dataSetores = resp;
      }
    )

    // this.definirFuncionariosInput(this.dataSetores);
    // this.emitirDados();



  }


  definirSetoresInput(data: SetorDto[]) {
    this.listaSetorInput = [];
    this.setoresSelecionados = [];

    data.forEach(set => {
      this.listaSetorInput.push({nome: set.setor, id: set.id})
    })
    this.setoresSelecionados = this.listaSetorInput;
  }

  tratarSetoresSelecionados() {
    this.listaSetores$.subscribe(
      resp => {
        this.dataSetores = [];

        resp.forEach(set => {
          this.setoresSelecionados.forEach(setS => {
            setS.id == set.id && this.dataSetores.push(set);
          })
        })

      }
    )

    this.definirFuncionariosInput(this.dataSetores);
    this.definirAnosDisponiveis(this.dataSetores);
    this.emitirDados();
  }

  definirFuncionariosInput(data: SetorDto[]) {
    this.listaFuncionarioInput = [];
    this.funcionariosSelecionados = [];

    this.dataSetores.forEach(set => {
      set.funcionarios.map(func => {
        this.listaFuncionarioInput.push({nome: func.nome, id: func.id});
      })
    })
    this.funcionariosSelecionados = this.listaFuncionarioInput;

  }

  tratarFuncionariosSelecionados() {
    const dadosSetores: SetorDto[] = [];
  }

  consoleListaSetor() {
    this.listaSetores$.subscribe({
      next: resp => console.log('listaSetores$ value',resp)
    })
  }

  selecionarTodosAnos() {
    this.anosSelecionados = [...this.listaAnosDisponiveis];
  }

  emitirDados() {
    this.dataOutput.emit(this.dataSetores);
  }

}
