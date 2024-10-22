import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SetorDto } from '../../dto/usuario/setores/setor.dto';
import { FuncionarioDto } from '../../dto/usuario/setores/funcionario.dto';
import { SetoresService } from '../../services/setores.service';
import { SweetAlert } from '../../util/sweet-alert';
import { TipoGenericoDto } from '../../dto/usuario/setores/tipoGenerico.dto';
import { TarefasPeriodoDto } from '../../dto/usuario/setores/tarefasPeriodo.dto';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{

  @Output() dataOutput = new EventEmitter<any>()
  dataGeral: SetorDto[] = [];

  listaSetores: SetorDto[] = [];
  listaSetoresInput: TipoGenericoDto[] = [];
  setoresSelecionados: TipoGenericoDto[] = [];

  listaFuncionarios: FuncionarioDto[][] = [];
  listaFuncionarioInput: TipoGenericoDto[] = []
  funcionariosSelecionados: number[] = [];

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
        this.listaSetores = resp; //VARIAVEL BACKUP
        this.dataGeral = this.listaSetores; //VARIAVEL REFERENCIA

        this.definirSetores();
        this.definirFuncionariosDisponiveis();
        this.definirAnosDisponiveis();
      },
      error: err => this.sweetAlert.error(err),
      complete: () => this.sweetAlert.close()
    })
  }

  definirSetores() {
    this.dataGeral.forEach(el => {
      this.listaSetoresInput.push({nome: el.setor, id: el.id})
    })
    this.setoresSelecionados = this.listaSetoresInput;
  }

  tratarDadosSetores() {
    this.dataGeral = []

    this.setoresSelecionados.forEach(set => {
      this.listaSetores.forEach(setor => {
        set.id == setor.id && this.dataGeral.push(setor)
      })
    });

    this.definirFuncionariosDisponiveis();
    this.definirAnosDisponiveis();
  }

  tratarDados() {

    console.log('datageral APOS manipulacao', this.dataGeral)
  }

  definirAnosDisponiveis() {
    this.listaAnosDisponiveis = []

    this.dataGeral.forEach(el => {
      el.funcionarios.map(ele => {
        ele.tarefasPeriodo.map(elem => !this.listaAnosDisponiveis.includes(elem.ano) && this.listaAnosDisponiveis.push(elem.ano))
      })
    })
    this.selecionarTodosAnos();
  }

  definirFuncionariosDisponiveis() {
    this.listaFuncionarioInput = []
    this.listaFuncionarios = []

    this.dataGeral.forEach(setor => {
      this.listaFuncionarios.push(setor.funcionarios)
    })

    this.listaFuncionarios.forEach(el => {
      el.forEach(ele => this.listaFuncionarioInput.push({nome: ele.nome, id: ele.id}))
    })
    this.funcionariosSelecionados = [...this.listaFuncionarioInput.map(el => el.id)]
  }

  selecionarTodosAnos() {
    this.anosSelecionados = this.listaAnosDisponiveis
  }

}
