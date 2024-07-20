import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class SweetAlert {

  constructor() { }

  sucess(titulo: string) {
    Swal.fire({
      title: titulo,
      icon: 'success',
      toast: true,
      width: '30rem',
      position: "top-end",
      showConfirmButton: false,
      timer: 3200,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInRightBig
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutRightBig
        `
      },
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }

  error(titulo: string) {
    this.close()
    Swal.fire({
      title: titulo,
      icon: 'error',
      toast: true,
      width: '30rem',
      position: "top-end",
      showConfirmButton: false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInRightBig
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutRightBig
        `
      },
      timer: 3200,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }

  loader(msgLoading?: string) {
    msgLoading = msgLoading ? msgLoading : 'Carregando...'

    Swal.fire({
      html: `
      <div class="flex flex-column justify-content-center align-items-center mt-4">
        <div style="margin: 0 auto;" class="loader"></div>
        <h3 id="h3-add">${msgLoading}</h3>
      </div>
      `,
      width: '25rem',
      position: "center",
      showConfirmButton: false,
    });
  }

  close() {
    Swal.close();
  }

}
