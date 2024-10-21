import { SweetAlert } from './../../../shared/util/sweet-alert';
import { SetoresService } from './../../../shared/services/setores.service';
import { Component, OnInit } from '@angular/core';
import { SetorDto } from 'src/app/shared/dto/usuario/setores/setor.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  listaSetores: SetorDto[] = [];
  setoresSelecionados: SetorDto[] = [];

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
        console.log(resp)
        this.listaSetores = resp;
        this.setoresSelecionados = this.listaSetores;
        this.definirAnosDisponiveis();
      },
      error: err => this.sweetAlert.error(err),
      complete: () => this.sweetAlert.close()
    })
  }

  definirAnosDisponiveis() {
    this.listaSetores.forEach(el => {
      el.funcionarios.forEach(ele => {
        ele.tarefasPeriodo.forEach(elem => {
          !this.listaAnosDisponiveis.includes(elem.ano) && this.listaAnosDisponiveis.push(elem.ano)
        })
      })
    })
    this.selecionarTodosAnos();
  }

  selecionarTodosAnos() {
    this.anosSelecionados = this.listaAnosDisponiveis
  }

}
