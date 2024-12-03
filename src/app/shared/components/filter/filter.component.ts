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
        this.dataSetores = resp;//MANIPULAR
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

    data.forEach(set => {
      set.funcionarios.forEach(func => {
        func.tarefasPeriodo.forEach(per => {
          totalAnos.push(per.ano)
        })
      })
    })

    this.listaAnosDisponiveis = [];
    totalAnos.map(ano => !this.listaAnosDisponiveis.includes(ano) && this.listaAnosDisponiveis.push(ano))

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
        const arrSet: SetorDto[] = [];

        resp.forEach(set => {
          this.setoresSelecionados.forEach(setS => {
            setS.id == set.id && arrSet.push(set);
          })
        })

        this.dataSetores = arrSet;
      }
    )
    // console.log('datasetores', this.dataSetores)
    // this.consoleListaSetor()

    this.definirFuncionariosInput(this.dataSetores);
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

    // console.log('datasetores', this.dataSetores)
    // this.consoleListaSetor()
  }

  tratarFuncionariosSelecionados() {
    // console.log('ANTES', this.dataSetores);
    // this.consoleListaSetor();

    this.listaSetores$.subscribe(
      resp => {
        // console.log('funcionario selecionados', this.funcionariosSelecionados);
        const dataSetoresCopia = [...resp];

        this.funcionariosSelecionados.forEach(funcSelec => {
          dataSetoresCopia.forEach(set => {
            const arrFunc: FuncionarioDto[] = [];

            set.funcionarios.map(func => {
              if (funcSelec.id == func.id) {
                arrFunc.push(func);
              }
              // console.log('aoo', arrFunc)
            })

            set.funcionarios = arrFunc; // Altera a cópia
          })
        })

        // console.log('datasetores', this.dataSetores)
        // this.consoleListaSetor()
      }
    )
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
