import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReceiptComponent } from './receipt/receipt.component';
import { BillFormComponent } from './bill-form/bill-form.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceiptComponent,
    BillFormComponent,
    AdminDashboardComponent,
    BillSummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
