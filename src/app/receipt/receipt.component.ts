import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  constructor() { }

  public customerName;
  public model;
  public accessories;
  public totalAmount;
  public discount;
  public netAmount;

  ngOnInit(): void {
    const data = window.history.state;
    this.customerName = data['customerName'];
    this.model = data['model'];
    this.accessories = data["accessories"];
    this.totalAmount = data["totalAmount"];
    this.discount = data["discount"];
    this.netAmount = data["netAmount"];
  }

}
