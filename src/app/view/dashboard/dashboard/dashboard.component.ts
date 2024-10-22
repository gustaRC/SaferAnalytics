import { SweetAlert } from './../../../shared/util/sweet-alert';
import { SetoresService } from './../../../shared/services/setores.service';
import { Component, OnInit } from '@angular/core';
import { SetorDto } from 'src/app/shared/dto/usuario/setores/setor.dto';
import { FuncionarioDto } from 'src/app/shared/dto/usuario/setores/funcionario.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  constructor(
    private setoresService: SetoresService,
    private sweetAlert: SweetAlert
  ) { }

  ngOnInit(): void {
  }

}
