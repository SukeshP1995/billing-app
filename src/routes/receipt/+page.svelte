<script lang="ts">
	import { convertDate, formatPrice, isType, useBillStore, type JSONRecord } from '$lib/utils';
  
  let accessories: Array<JSONRecord>;
  let customerName: string;
  let model: string;
  let totalAmount: string;
  let discount: string;
  let netAmount: string;
  let gst: string;
  let sno: string;

  const today = convertDate(Date.now());
  const billData = useBillStore();

  if (isType<JSONRecord>($billData)) {
    console.log($billData)
    if (isType<Array<JSONRecord>>($billData.accessories)) {
      accessories = $billData.accessories;
    }
    if (isType<string>($billData.customerName)) {
      customerName = $billData.customerName;
    }
    if (isType<string>($billData.sno)) {
      sno = $billData.sno;
    }
    if (isType<string>($billData.model) && isType<number>($billData.netAmount)) {
      model = $billData.model;
      gst = formatPrice($billData.netAmount * 0.09);
      if (model == "ENGINE OIL" && isType<number>($billData.totalAmount)) {
        netAmount = formatPrice($billData.totalAmount + 2 * (+gst)); 
      }
    }
    if (isType<number>($billData.totalAmount)) {
      totalAmount = formatPrice($billData.totalAmount);
    }
    if (isType<number>($billData.discount)) {
      discount = formatPrice($billData.discount);
    }
    if (isType<number>($billData.netAmount)) {
      netAmount = formatPrice($billData.netAmount);
    }
  }
</script>
{#if accessories}
  <div style="border-width:5px; border-style:double; margin-top: 2em; margin-left: 4em; margin-right: 4em;">
    <div class="grid-container-1">
      <div class="showroom-name">
        <strong style="font-size: 1em; margin: -0.2em;">SREEDEVI MOTORS</strong>
      </div>
      <div class="address">
        <p class="p-0-8">S.Y.No.777/2/1A, NEAR BRINDAVAN HOUSING COLONY, GNT ROAD</p>
        <p class="p-0-8">KAVALI - 524201</p>
        <p class="p-0-8">Phone : 240243, 245243</p>
      </div>
      <div class="gst-dlr-cin">
        <p class="p-0-8">GSTIN: 37ABHFS12461ZI</p>
        <p class="p-0-8">Dlr.code: 11776</p>
        <p class="p-0-8">CIN:</p>
      </div>
      <div class="spares-bill">
        <p style="font-size: 0.8em; margin: -0.4em;">SPARES BILL</p>
      </div>
      <div class="invoice">
        <p style="font-size: 0.8em; margin: -0.4em;">INVOICE</p>
      </div>
      <div class="to">
        <p class="p-0-8">To. { customerName }</p>
      </div>
      <div class="model">
        <p class="p-0-8">Model: { model }</p>
      </div>
      <div class="bill-reg-paymode">
        <p class="p-0-8">Bill No.: {sno}</p>
        <p class="p-0-8">Date: { today }</p>
        <p class="p-0-8">Pay Mode: Cash</p>
      </div>
    </div>
    <div class="grid-container-2">
      <div class="sno-col">
        <p class="p-0-8">S.No.</p>
      </div>
      <div class="item-name-col">
        <p class="p-0-8">Item Name</p>
      </div>
      <div class="hsn-col">
        <p class="p-0-8">HSN / SAC</p>
      </div>
      <div class="qty-col">
        <p class="p-0-8">QTY</p>
      </div>
      <div class="unit-price-col">
        <p class="p-0-8">Unit Price</p>
      </div>
      <div class="amount-col">
        <p class="p-0-8">Amount</p>
      </div>
      <div class="sno">
        {#each accessories as _, i}
          <p class="p-0-8">
            { i + 1 }
          </p>
        {/each}
      </div>
      <div class="item-name">
        {#each accessories as accessory}
          <p class="p-0-8">
            { accessory.name }
          </p>
        {/each}
      </div>
      <div class="hsn">
        {#each accessories as accessory}
          <p class="p-0-8">
            { accessory.hsn }
          </p>
        {/each}
      </div>
      <div class="qty">
        {#each accessories as accessory}
          <p class="p-0-8">
            { accessory.quantity }
          </p>
        {/each}
      </div>
      <div class="unit-price">
        {#each accessories as accessory}
          <p class="p-0-8">
            { accessory.price }
          </p>
        {/each}
      </div>
      <div class="amount">
        {#each accessories as accessory}
          <p class="p-0-8">
            { accessory.totalPrice }
          </p>
        {/each}
      </div>
      <div class="total-discount-tax">
        <p class="p-0-8">Total</p>
        {#if model != 'ENGINE OIL'}
          <p class="p-0-8">Discount</p>
          <p class="p-0-8">tax</p>
        {:else}
          <p class="p-0-8">SGST@9%</p>
          <p class="p-0-8">CGST@9%</p>
        {/if}
      </div>
      <div class="total-discount-tax-price">
        <p class="p-0-8">{ totalAmount }</p>
        {#if model != 'ENGINE OIL'}
        <p class="p-0-8">{ discount }</p>
        {:else}
          <p class="p-0-8">{ gst }</p>
          <p class="p-0-8">{ gst }</p>
        {/if}
      </div>
      <div class="sp">
        <p class="p-0-8">Sp: { netAmount }</p>
      </div>
      <div class="grand-total">
        <p class="p-0-8">Grand Total:</p>
      </div>
      <div class="grand-total-price">
        <p class="p-0-8">{ netAmount }</p>
      </div>
      <div class="customer-sign-and-rules">
        <p class="p-0-8">Customer Signature:</p>
        <p class="p-0-8"><sup>**</sup>Goods once sold cannot be taken back.<sup>**</sup> Incl. of taxes<sup>**</sup></p>
      </div>
      <div class="authorized-sign">
        <h3>For SREEDEVI MOTORS</h3>
        <p class="p-0-8">Authorized Signatory:</p>
      </div>
    </div>
  </div>
{/if}
<style>
  .grid-container-1 {
    display: grid;
    grid-template-columns: 4.5fr 0.5fr 1.25fr 1.25fr 0.5fr 2.5fr;
    grid-template-rows: 1fr 3fr 1fr 3fr;
    gap: 1px 1px;
    grid-template-areas: "showroom-name showroom-name showroom-name . . ." 
                        "address address address . gst-dlr-cin gst-dlr-cin" 
                        "spares-bill spares-bill invoice invoice invoice invoice" 
                        "to model model model model bill-reg-paymode";
    margin-top: -1em;
  }
  .showroom-name { 
    grid-area: showroom-name; 
    padding-top: 1em;
    padding-left: 1em;
  }

  .address {
    grid-area: address; 
    padding-left: 1em;
    margin-bottom: 4em;
  }

  .gst-dlr-cin {
    grid-area: gst-dlr-cin;
    margin-bottom: 4em; 
  }

  .spares-bill { 
    grid-area: spares-bill; 
    margin-top: -4em;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
    padding-top: 0.25em;
    /* padding-bottom: -5em; */
    margin-bottom: 5.4em;
  }

  .invoice {
    grid-area: invoice; 
    margin-top: -4em;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding-top: 0.25em;
    /* padding-bottom: -5em; */
    margin-bottom: 5.4em;
  }

  .to { 
    grid-area: to; 
    margin-top: -5em;
    border-bottom: 1px solid black;
    padding-left: 1em;
    padding-top: -1em;
    padding-bottom: 2em;
  }

  .model { 
    grid-area: model;
    margin-top: -5em;
    border-bottom: 1px solid black;
    padding-top: -1em;
    padding-bottom: 2em;
  }

  .bill-reg-paymode { 
    grid-area: bill-reg-paymode; 
    margin-top: -5em;
    border-bottom: 1px solid black;
    padding-top: -1em;
    padding-bottom: 2em;
  }

  .p-0-8 {
    font-size: 0.8em; 
    margin: 0em;
  }

  .grid-container-2 {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    grid-template-rows: repeat(19, 1fr);
    gap: 1px 1px;
    grid-template-areas: "sno-col item-name-col item-name-col item-name-col item-name-col item-name-col hsn-col hsn-col hsn-col qty-col unit-price-col unit-price-col amount-col amount-col amount-col" 
                        "sno item-name item-name item-name item-name item-name hsn hsn hsn qty unit-price unit-price  amount amount amount" 
                        "sno item-name item-name item-name item-name item-name hsn hsn hsn qty unit-price unit-price  amount amount amount" 
                        "sno item-name item-name item-name item-name item-name hsn hsn hsn qty unit-price unit-price  amount amount amount" 
                        "sno item-name item-name item-name item-name item-name hsn hsn hsn qty unit-price unit-price  amount amount amount"
                        "sno item-name item-name item-name item-name item-name hsn hsn hsn qty unit-price unit-price  amount amount amount" 
                        "total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax-price total-discount-tax-price total-discount-tax-price" 
                        "total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax-price total-discount-tax-price total-discount-tax-price" 
                        "total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax total-discount-tax-price total-discount-tax-price total-discount-tax-price" 
                        "sp sp sp sp sp sp sp sp sp sp grand-total grand-total grand-total-price grand-total-price grand-total-price" 
                        "customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules . . authorized-sign authorized-sign authorized-sign authorized-sign" 
                        "customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules . . authorized-sign authorized-sign authorized-sign authorized-sign" 
                        "customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules customer-sign-and-rules . . authorized-sign authorized-sign authorized-sign authorized-sign";
    margin-top: -9.2em;
    margin-bottom: -7em;
  }

  .sno-col { 
    grid-area: sno-col; 
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .item-name-col { 
    grid-area: item-name-col; 
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .hsn-col { 
    grid-area: hsn-col;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .qty-col { 
    grid-area: qty-col;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .unit-price-col {
    grid-area: unit-price-col; 
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .amount-col { 
    grid-area: amount-col; 
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .sno { 
    grid-area: sno; 
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .item-name {
    grid-area: item-name; 
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .hsn { 
    grid-area: hsn; 
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .qty { 
    grid-area: qty; 
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .unit-price { 
    grid-area: unit-price; 
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .amount { 
    grid-area: amount; 
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
  }

  .total-discount-tax { 
    grid-area: total-discount-tax;
    border-bottom: 1px solid black;
    padding-right: 1em;
    text-align: right;
    margin-bottom: 1em;
  }

  .total-discount-tax-price { 
    grid-area: total-discount-tax-price;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    padding-left: 1em;
    margin-bottom: 1em;
  }

  .sp { 
    grid-area: sp; 
    border-bottom: 1px solid black;
    padding-left: 1em;
    margin-top: -1em;
    margin-bottom: 1.2em;
  }

  .grand-total { 
    grid-area: grand-total; 
    border-bottom: 1px solid black;
    padding-right: 1em;
    text-align: right;
    margin-top: -1em;
    margin-bottom: 1.2em;
  }

  .grand-total-price { 
    grid-area: grand-total-price; 
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    padding-left: 1em;
    margin-top: -1em;
    margin-bottom: 1.2em;
  }

  .customer-sign-and-rules { 
    padding-top: 1em;
    grid-area: customer-sign-and-rules; 
    padding-left: 1em;
    margin-top: -0.8em;
    margin-bottom: -1.2em;
  }

  .authorized-sign { 
    grid-area: authorized-sign; 
    text-align: center;
    margin-top: -0.8em;
    margin-bottom: -1.2em;
  }
</style>