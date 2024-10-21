import { SweetAlert } from './../../../shared/util/sweet-alert';
import { SetoresService } from './../../../shared/services/setores.service';
import { Component, OnInit } from '@angular/core';

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
    this.buscarSetores();
  }

  buscarSetores() {
    this.sweetAlert.loader('Carregando setores...')
    this.setoresService.getSetores()
    .subscribe({
      next: resp => console.log(resp),
      error: err => this.sweetAlert.error(err),
      complete: () => this.sweetAlert.close()
    })

  }


}
