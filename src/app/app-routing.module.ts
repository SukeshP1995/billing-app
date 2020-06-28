import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptComponent } from './receipt/receipt.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BillFormComponent } from './bill-form/bill-form.component';


const routes: Routes = [
  { path: '', component: BillFormComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'receipt', component: ReceiptComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
