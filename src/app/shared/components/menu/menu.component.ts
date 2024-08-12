import { Component } from '@angular/core';
import { GlobalUtil } from '../../util/global-util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isMobile!: boolean;
  menuExpandido!: boolean;

  constructor(
    private util: GlobalUtil
  ) { }

  ngOnInit(): void {
    this.menuExpandido = false;
    this.isMobile = this.util.isMobile();
  }

  mouseEventMenu() {
    setTimeout(() => {
      this.menuExpandido = !this.menuExpandido
    }, 200);
  }
}
