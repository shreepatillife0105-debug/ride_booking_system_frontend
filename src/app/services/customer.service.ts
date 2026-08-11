import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Customer } from '../interfaces/customer.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends ApiService{

 addCustomer(customer: Customer) {
    return this.post<ApiResponse<Customer>>(
      '/customers',
      customer
    );
  }

  getAllCustomers() {
    return this.get<ApiResponse<Customer[]>>(
      '/customers'
    );
  }

  getCustomerById(id: number) {
    return this.get<ApiResponse<Customer>>(
      `/customers/${id}`
    );
  }

  updateCustomer(id: number, customer: Customer) {
    return this.put<ApiResponse<Customer>>(
      `/customers/${id}`,
      customer
    );
  }

  deleteCustomer(id: number) {
    return this.delete<ApiResponse<null>>(
      `/customers/${id}`
    );
  }
}
