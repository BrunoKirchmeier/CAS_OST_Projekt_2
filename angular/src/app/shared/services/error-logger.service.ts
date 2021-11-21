import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable()
export class ErrorLoggerService {

  private _logCollection: string = 'logs';

  constructor(private _dbExt: DatabaseService) {}

  createLog(logData: any) {

    this._dbExt.createDoc<any>(this._logCollection,
                               logData)
  }

}
