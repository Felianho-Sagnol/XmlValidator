import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }
  private dtdState : boolean = true
  private schemaState : boolean = true

  changeDtdState(){
    this.dtdState = !this.dtdState
  }
  getDtdState(){
    return this.dtdState
  }

  changeSchemaState(state : boolean){
    this.schemaState = state
  }
  getSchemaState(){
    return this.schemaState
  }
}
