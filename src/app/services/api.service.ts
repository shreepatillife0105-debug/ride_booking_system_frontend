import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected baseUrl = 'http://localhost:8080'

  constructor(protected http:HttpClient) { }

  get<T>(url:string){
    return this.http.get<T>(`${this.baseUrl}${url}`)
  }

  post<T>(url:string,data:any){
      return this.http.post<T>(`${this.baseUrl}${url}`,data)
  }

  put<T>(url:string,data:any){
    return this.http.put<T>(`${this.baseUrl}${url}`,data)
  }

  delete<T>(url:string){
    return this.http.delete<T>(`${this.baseUrl}${url}`)
  }

}
