import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.services';
import { DialogService } from './dialog.service';
import { ErrorLoggerService } from './error-logger.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

  constructor(private _authService: AuthService,
              private _router: Router,
              private _logger: ErrorLoggerService,
              private _dialog: DialogService) {
    super();
  }

  public handleError(exception: any) {
    let logData = {};
    try {
      let temp = {
        user: this._authService.currentUser ? this._authService.currentUser : 'anonym',
        agent: window.navigator.userAgent ?? '{}',
        currentRoute: this._router.url ?? '',
        error: exception.message,
        timestamp: Date.now()
      }
      logData = temp;
    } catch(error) {
      logData = {
        error: exception,
      }
    }
    this._logger.createLog(logData);
    this._dialog.confirm('Unerwarteter Fehler', 'Es ist ein unerwarteter Fehler aufgetreten.');
    super.handleError(exception);
  }
}

