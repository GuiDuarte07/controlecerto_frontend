import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AuthGuard } from './guards/Auth.guard';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { CreditcardsComponent } from './pages/creditcards/creditcards.component';
import { InvestmentsComponent } from './pages/investments/investments.component';
import { InvestmentDetailsComponent } from './pages/investments/investment-details/investment-details.component';
import { MasterComponent } from './layouts/master/master.component';
import { RegistrationsComponent } from './layouts/registrations/registrations.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { CreditcardDetailsComponent } from './pages/creditcard-details/creditcard-details.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { DefaultComponent } from './pages/default/default.component';

export const routes: Routes = [
  { path: '', component: DefaultComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MasterComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'investments', component: InvestmentsComponent },
      { path: 'investments/:id', component: InvestmentDetailsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'invoices/:id', component: InvoicesComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'registrations',
        canActivate: [AuthGuard],
        component: RegistrationsComponent,
        children: [
          { path: 'accounts', component: AccountsComponent },
          { path: 'categories', component: CategoriesComponent },
          { path: 'creditcards', component: CreditcardsComponent },
          { path: 'creditcards/:id', component: CreditcardDetailsComponent },
        ],
      },
      /* { path: '', redirectTo: '/home', pathMatch: 'full' }, */
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email/:token', component: ConfirmEmailComponent },
  { path: 'forgot-password/:token', component: ForgotPasswordComponent },
  { path: 'articles/:title', component: ArticlesComponent },
];
