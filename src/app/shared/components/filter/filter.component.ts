import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SetorDto } from '../../dto/usuario/setores/setor.dto';
import { FuncionarioDto } from '../../dto/usuario/setores/funcionario.dto';
import { SetoresService } from '../../services/setores.service';
import { SweetAlert } from '../../util/sweet-alert';
import { TipoGenericoDto } from '../../dto/usuario/setores/tipoGenerico.dto';
import { TarefasPeriodoDto } from '../../dto/usuario/setores/tarefasPeriodo.dto';
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
        this.dataSetores = resp; //VARIAVEL BACKUP
        this.listaSetores$.next(resp)

        this.dataOutput.emit(this.dataSetores)

        this.definirSetoresInput();
        this.definirFuncionariosInput();
      },
      error: err => this.sweetAlert.error(err),
      complete: () => this.sweetAlert.close()
    })
  }

  definirSetoresInput() {
    this.listaSetorInput = [];
    this.setoresSelecionados = [];

    this.dataSetores.forEach(set => {
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

    this.definirFuncionariosInput();
  }

  definirFuncionariosInput() {
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
    this.listaSetores$.subscribe(
      resp => {
        console.log('funcionario selecionados', this.funcionariosSelecionados);
        this.funcionariosSelecionados.forEach(funcS => {

        resp.forEach(set => {
          const arrFunc: FuncionarioDto[] = [];

          set.funcionarios.map(func => {

              funcS.id == func.id && arrFunc.push(func);
              console.log('aoo', arrFunc)
            })
            console.log('funcionario', arrFunc)
            this.dataSetores.forEach(dataSet => {
              dataSet.funcionarios = arrFunc
            })
          })

        })
        console.log('datasetores', this.dataSetores)

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


}
