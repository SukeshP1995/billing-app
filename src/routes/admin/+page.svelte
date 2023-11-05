<script lang="ts">
  import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

  import Accordion, { Panel, Header, Content as PaperContent } from '@smui-extra/accordion';
	import Button, { Label } from '@smui/button';
  import Card, { Content as CardContent } from '@smui/card';
  import Textfield from '@smui/textfield';
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Select, { Option } from '@smui/select';
  import Snackbar, { Actions } from '@smui/snackbar';
  
  export let data: PageData;

  const { models } = data;
  const { form, enhance, message } = superForm(data.form, { dataType: 'json', invalidateAll: true });
  const { searchParams } = $page.url;
  let model = searchParams.get('model');
  let snackbar: Snackbar;

  $: {
    if (model && model != searchParams.get('model')) {
      let query = new URLSearchParams(searchParams.toString());
      query.set('model', model);
      goto(`?${query.toString()}`);
    } else if (!model) {
      $form.model = '';
    }
  }
  $: console.log($message);

  $: ($message == "submitted") && snackbar.open();
  type ListType = 'accessories' | 'fullKitItems' | 'halfKitItems';

  function removeItem(propertyName: ListType, i: number) {
    if (propertyName == 'accessories') {
      $form[propertyName] = [...$form[propertyName].slice(0, i), ...$form[propertyName].slice(i + 1)];
    } else {
      $form[propertyName] = [...$form[propertyName].slice(0, i), ...$form[propertyName].slice(i + 1)];
    }
  }

  function addItem(propertyName: ListType) {
    if (propertyName == 'accessories') {
      $form[propertyName] = [...$form[propertyName], { name: '', hsn: '', quantity: 0, price: 0 }];
    } else {
      $form[propertyName] = [...$form[propertyName], { name: '' }];
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
          <Select bind:value={model} label="Model">
            {#each models as model}
              <Option value={model}>{model}</Option>
            {/each}
          </Select>       
        </div>
      </div>
        <Card>
          <CardContent>
            <form method="POST" use:enhance>
              <Textfield bind:value={$form.model} label="Model" required />
              <br>
              <Textfield bind:value={$form.halfKitHsn} label="Half kit HSN" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.halfKitPrice} label="Half kit price" type="number" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.halfKitQuantity} label="Half kit quantity" type="number" required />
              <br>
              <Textfield bind:value={$form.fullKitHsn} label="Full kit HSN" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.fullKitPrice} label="Full kit price" type="number" required />
              &nbsp;&nbsp;
              <Textfield bind:value={$form.fullKitQuantity} label="Full kit quantity" type="number" required />
              <br>
              <Accordion multiple>
                <Panel>
                  <Header>Half kit items</Header>
                  <PaperContent>
                    {#each $form.halfKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.halfKitItems[i].name} label="Accessory name" required />
                        &nbsp;&nbsp;
                        <IconButton class="material-icons" aria-label="Remove" on:click={() => removeItem('fullKitItems', i)} >
                          remove
                        </IconButton>
                      </div>
                    {/each}
                    <Button on:click={() => addItem('halfKitItems')} >
                      <Label>Add accessory +</Label>
                    </Button>
                  </PaperContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Full kit items</Header>
                  <PaperContent>
                    {#each $form.fullKitItems as _, i}
                      <div>
                        <Textfield bind:value={$form.fullKitItems[i].name} label="Accessory name" required />
                        &nbsp;&nbsp;
                        <IconButton class="material-icons" aria-label="Remove" on:click={() => removeItem('fullKitItems', i)} >
                          remove
                        </IconButton>
                      </div>
                    {/each}
                    <Button on:click={() => addItem('fullKitItems')} >
                      <Label>Add accessory +</Label>
                    </Button>
                  </PaperContent>
                </Panel>
                <br>
                <Panel>
                  <Header>Accessories</Header>
                  <PaperContent>
                    {#each $form.accessories as _, i}
                      <div>
                        <Textfield bind:value={$form.accessories[i].name} label="Accessory name" required />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].hsn} label="Accessory HSN" required />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].price} label="Accessory price" type="number" required />
                        &nbsp;&nbsp;
                        <Textfield bind:value={$form.accessories[i].quantity} label="Accessory quantity" type="number" required />
                        &nbsp;&nbsp;
                        <IconButton class="material-icons" aria-label="Remove" on:click={() => removeItem('accessories', i)} >
                          remove
                        </IconButton>
                      </div>
                    {/each}
                    <Button on:click={() => addItem('accessories')} >
                      <Label>Add accessory +</Label>
                    </Button>
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
    </CardContent>
  </Card>
</div>

<Snackbar leading bind:this={snackbar} >
  <Label>submitted</Label>
  <Actions>
    <Button>close</Button>
  </Actions>
</Snackbar>