import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { GlobalUtil } from './shared/util/global-util';
import { CookieEnum } from './shared/enum/cookie.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  permitirConteudo: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private util: GlobalUtil
  ) {}

  ngOnInit() {
    this.permitirConteudo = this.util.getCookie(CookieEnum.LOGIN) ? true : false;
    this.primengConfig.ripple = true;
  }
}
