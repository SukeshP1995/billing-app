<script lang="ts">
  import { page } from '$app/stores'
	import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { stringify } from 'devalue';

  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  import Accordion, { Panel, Header, Content as PaperContent } from '@smui-extra/accordion';
	import Button, { Label } from '@smui/button';
  import Card, { Content as CardContent } from '@smui/card';
  import Dialog, { Title as DialogTitle, Content as DialogContent, Actions as DialogActions } from '@smui/dialog';
  import Select, { Option } from '@smui/select';
  import Textfield from '@smui/textfield';
	import { isType, type JSONRecord, type JSONObject, useBillStore } from '$lib/utils';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	
  export let data: PageData;
  let open = false;
  let totalAmount = 0;
  let netAmount = 0;
  
  $: discount = totalAmount - netAmount;

  const { models } = data;
  const { form } = superForm(data.form, { dataType: 'json', invalidateAll: true });
  let billData: JSONObject;
  const billDataStore = useBillStore();
  const { searchParams } = $page.url;
  let model = $page.url.searchParams.get('model');
  $: {
    if (model && model != searchParams.get('model')) {
      let query = new URLSearchParams(searchParams.toString());
      query.set('model', model);
      goto(`?${query.toString()}`);
    }
  }

  $: $form.halfKitTotalPrice = $form.halfKitQuantity * $form.halfKitPrice;
  $: $form.fullKitTotalPrice = $form.fullKitQuantity * $form.fullKitPrice;

  function onAccessoryPriceChange(i: number) {
    $form.accessories[i].totalPrice = $form.accessories[i].price! * $form.accessories[i].quantity;
    $form.accessories = $form.accessories;
  }

  function onSubmit() {
    billData = structuredClone($form);
    if (isType<JSONObject[]>(billData.accessories)) {
      billData.accessories = [{
          name: "HALF KIT",
          hsn: billData.halfKitHsn,
          price: billData.halfKitPrice,
          quantity: billData.halfKitQuantity,
          totalPrice: billData.halfKitTotalPrice
        }, {
          name: "FULL KIT",
          hsn: billData.fullKitHsn,
          price: billData.fullKitPrice,
          quantity: billData.fullKitQuantity,
          totalPrice: billData.fullKitTotalPrice
        }, ...billData.accessories].filter((obj) => {
          if (isType<JSONRecord>(obj)) {
            const {quantity} = obj;
            if (isType<number>(quantity)) {
              return quantity > 0;
            } 
          }
        });
      
      totalAmount = billData.accessories.reduce((a: number, b) => a + (isType<JSONRecord>(b) && isType<number>(b.totalPrice) ? b.totalPrice : 0), 0)
      netAmount = totalAmount;
      open = true;
    }
  }

  async function openReceipt() {
    if (isType<JSONRecord>(billData)) {
      billData.totalAmount = totalAmount;
      billData.discount = discount;
      billData.netAmount = netAmount;
      const {sno} = await (await fetch('/', {
        method: 'POST',
        body: stringify(billData)
      })).json();
      billData.sno = sno;
      
      $billDataStore = billData;
      goto('/receipt');
      open = false;
    }
  }
</script>

<TopAppBar
  variant="static"
  color={'primary'}
>
  <Row>
    <Section>
      <Title>Billing App</Title>
    </Section>
    <Section align="end" toolbar>
      <Button href="/admin">
        <Label>admin</Label>
      </Button>
      <IconButton class="material-icons" aria-label="Home" href='/'>
        home
      </IconButton>
    </Section>
  </Row>
</TopAppBar>

<div style="width: 64em;">
  <Card>
    <CardContent>
      <div class="columns margins" style="justify-content: flex-start;">
        <div>
          <Select bind:value={model} label="Select Menu">
            {#each models as model}
              <Option value={model}>{model}</Option>
            {/each}
          </Select>       
        </div>
      </div>
      {#if model}
        <Card>
          <CardContent>
            <form on:submit={() => onSubmit()}>
              <Textfield bind:value={$form.customerName} label="Customer name" required />
              <br>
              <Textfield bind:value={$form.model} label="Model" required disabled />
              <br>
              <Textfield bind:value={$form.halfKitPrice} label="Half kit unit price" type="number" required disabled />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.halfKitQuantity} label="Half kit quantity" type="number" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.halfKitTotalPrice} label="Half kit total price" type="number" required disabled />
              <br>
              <Textfield bind:value={$form.fullKitPrice} label="Full kit unit price" type="number" required disabled />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.fullKitQuantity} label="Full kit quantity" type="number" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.fullKitTotalPrice} label="Full kit total price" type="number" required disabled />
              <br>
              <br>
              <Accordion multiple>
                <Panel>
                  <Header>Half kit items</Header>
                  <PaperContent>
                    {#each $form.halfKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.halfKitItems[i].name} label="Accessory name" required disabled />
                      </div>
                    {/each}
                  </PaperContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Full kit items</Header>
                  <PaperContent>
                    {#each $form.fullKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.fullKitItems[i].name} label="Accessory name" required disabled />  
                      </div>
                    {/each}
                  </PaperContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Accessories</Header>
                  <PaperContent>
                    {#each $form.accessories as _, i}
                      <div>
                        <Textfield bind:value={$form.accessories[i].name} label="Accessory name" required disabled />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].price} label="Accessory price" type="number" required disabled />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].quantity} label="Accessory quantity" type="number" on:input={() => onAccessoryPriceChange(i)} required />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].totalPrice} label="Accessory total price" type="number" required disabled />
                      </div>
                    {/each}
                  </PaperContent>
                </Panel>
              </Accordion>
              <br>
              <br>
              <Button variant="raised">
                <Label>Submit</Label>
              </Button>
            </form>
          </CardContent>
        </Card>
      {/if}
    </CardContent>
  </Card>
  
  <Dialog
    bind:open
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
  >
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <DialogTitle id="simple-title">Summary</DialogTitle>
    <DialogContent id="simple-content">
      <Textfield bind:value={totalAmount} label="Total Amount" type="number" required disabled />
      <br>
      <Textfield bind:value={discount} label="Discount" type="number" required disabled />
      <br>
      <Textfield bind:value={netAmount} label="Net Amount" type="number" required />
    </DialogContent>
    <DialogActions>
      <Button on:click={() => {open = false}}>
        <Label>Close</Label>
      </Button>
      <Button on:click={() => openReceipt()}>
        <Label>Submit</Label>
      </Button>
    </DialogActions>
  </Dialog>
</div>