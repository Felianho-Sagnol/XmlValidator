import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtdServiceService {
  apiUrl : string = "http://127.0.0.1:8000/api/"

  constructor(private http: HttpClient) { }

  sendDtdInternalContent(content : string) : Observable<any>{
    let data = {
      content : content.replace(/encoding="utf-8"/i,'')
    }

    return this.http.post<any>(this.apiUrl+"dtd-interne",data)
  }

  sendDtdExternalContent(content : any) : Observable<any>{
    let xml = content.xml.replace(/encoding="utf-8"/i,'')
    let data = {
      xml : xml,
      dtd : content.dtd
    }
    return this.http.post<any>(this.apiUrl+"dtd-externe",data)
  }
}
