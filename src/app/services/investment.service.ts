import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverConnectionString } from '../config/server';
import { CreateInvestmentRequest } from '../models/investments/CreateInvestmentRequest';
import { UpdateInvestmentRequest } from '../models/investments/UpdateInvestmentRequest';
import { DepositInvestmentRequest } from '../models/investments/DepositInvestmentRequest';
import { AdjustInvestmentRequest } from '../models/investments/AdjustInvestmentRequest';
import { InfoInvestmentResponse } from '../models/investments/InfoInvestmentResponse';
import { InvestmentHistoryResponse } from '../models/investments/InvestmentHistoryResponse';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private hostAddress = `${serverConnectionString}/Investment`;

  constructor(private http: HttpClient) {}

  createInvestment(request: CreateInvestmentRequest) {
    return this.http.post<InfoInvestmentResponse>(
      `${this.hostAddress}/CreateInvestment`,
      request,
    );
  }

  updateInvestment(request: UpdateInvestmentRequest) {
    return this.http.patch<any>(
      `${this.hostAddress}/UpdateInvestment`,
      request,
    );
  }

  deposit(request: DepositInvestmentRequest) {
    return this.http.post<InfoInvestmentResponse>(
      `${this.hostAddress}/Deposit`,
      request,
    );
  }

  withdraw(request: DepositInvestmentRequest) {
    console.log(request);
    return this.http.post<InfoInvestmentResponse>(
      `${this.hostAddress}/Withdraw`,
      request,
    );
  }

  adjustValue(request: AdjustInvestmentRequest) {
    return this.http.post<InfoInvestmentResponse>(
      `${this.hostAddress}/AdjustValue`,
      request,
    );
  }

  getInvestments() {
    return this.http.get<InfoInvestmentResponse[]>(
      `${this.hostAddress}/GetInvestments`,
    );
  }

  getInvestmentById(id: number) {
    return this.http.get<InfoInvestmentResponse>(
      `${this.hostAddress}/GetInvestment/${id}`,
    );
  }

  getInvestmentHistory(investmentId: number) {
    return this.http.get<InvestmentHistoryResponse[]>(
      `${this.hostAddress}/GetInvestmentHistory/${investmentId}`,
    );
  }
}
