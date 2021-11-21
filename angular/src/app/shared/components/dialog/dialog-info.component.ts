import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-fail-dialog',
    templateUrl: './dialog-info.component.html'
})
export class DialogInfoComponent {

    public title: string | undefined;
    public message: string | undefined;

    constructor(private dialogRef: MatDialogRef<DialogInfoComponent>) {}

    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }

    onConfirmClick(): void {
      this.dialogRef.close();
    }

}
