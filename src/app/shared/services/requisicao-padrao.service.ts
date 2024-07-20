import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoPadraoService {

  //$ npx json-server db.json
  private endpointDefault = 'http://localhost:3000/';

  constructor() {}

  protected getEndpoint(endpointExtra?: string) {
    return endpointExtra ? (this.endpointDefault + endpointExtra) : this.endpointDefault
  }

}
