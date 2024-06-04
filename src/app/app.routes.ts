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
import { MasterComponent } from './layouts/master/master.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MasterComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'creditcards', component: CreditcardsComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
