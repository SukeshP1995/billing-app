<script lang="ts">
  import { page } from '$app/stores'
	import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  import Card, { Content } from '@smui/card';
  import Select, { Option } from '@smui/select';
  import Accordion, { Panel, Header, Content as AccordionContent } from '@smui-extra/accordion';
  import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';

  export let data: PageData;
  const { models } = data;
  const { form, enhance } = superForm(data.form, { dataType: 'json' });
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
    $form.accessories[i].totalPrice = $form.accessories[i].price * $form.accessories[i].quantity;
    $form.accessories = $form.accessories;
  }
</script>

<SuperDebug data={$form}></SuperDebug>

<div style="width: 64em;">
  <Card>
    <Content>
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
          <Content>
            <form method="POST" use:enhance>
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
                  <AccordionContent>
                    {#each $form.halfKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.halfKitItems[i].name} label="Accessory name" required disabled />
                      </div>
                    {/each}
                  </AccordionContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Full kit items</Header>
                  <AccordionContent>
                    {#each $form.fullKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.fullKitItems[i].name} label="Accessory name" required disabled />  
                      </div>
                    {/each}
                  </AccordionContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Accessories</Header>
                  <AccordionContent>
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
                  </AccordionContent>
                </Panel>
              </Accordion>
              <br>
              <br>
              <Button variant="raised">
                <Label>Submit</Label>
              </Button>
            </form>
          </Content>
        </Card>
      {/if}
    </Content>
  </Card>
</div>