import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  apiUrl : string = "http://127.0.0.1:8000/api/"

  constructor(private http: HttpClient) { }

  /*sendSchemaContent(content : string) : Observable<any>{
    let data = {
      content : content.replace(/encoding="utf-8"/i,'')
    }

    return this.http.post<any>(this.apiUrl+"dtd-interne",data)
  }*/

  sendSchemaContent(content : any) : Observable<any>{
    let xml = content.xml.replace(/encoding="utf-8"/i,'')
    let data = {
      xml : xml,
      xsd : content.xsd
    }
    //console.log(data)
    return this.http.post<any>(this.apiUrl+"schema",data)
  }
}
