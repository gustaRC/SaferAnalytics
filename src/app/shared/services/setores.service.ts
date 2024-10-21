import { Injectable } from '@angular/core';
import { RequisicaoPadraoService } from './requisicao-padrao.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SetorDto } from '../dto/usuario/setores/setor.dto';

@Injectable({
  providedIn: 'root'
})
export class SetoresService extends RequisicaoPadraoService{

  private setoresEndpoint = this.getEndpoint('setores');

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  getSetores(): Observable<SetorDto[]> {
    return this.http.get<SetorDto[]>(this.setoresEndpoint)
  }


}
