<script lang="ts">
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Button, { Label } from '@smui/button';

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
<slot />