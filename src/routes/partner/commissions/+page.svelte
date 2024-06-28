<script lang="ts">
	import Button from '$lib/components/Button.svelte';
  import { Dropdown, DropdownItem, Label, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import {  CashSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Comissões</h1>
	</div>
    <div>
        <Button>Filtrar por status<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
        <Dropdown>
          <DropdownItem>Comissões Pagas</DropdownItem>
          <DropdownItem>Comissões Pendentes</DropdownItem>
          <DropdownItem>Todas</DropdownItem>
        </Dropdown>
        <Table>
          <TableHead>
            <TableHeadCell>Código do pedido</TableHeadCell>
            <TableHeadCell>Comissão</TableHeadCell>
            <TableHeadCell>Data da compra</TableHeadCell>
            <TableHeadCell>Data de liberação do crédito</TableHeadCell>
            <TableHeadCell>Liberado</TableHeadCell>
            <TableHeadCell>Pago</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            <TableBodyRow>
              <TableBodyCell>1</TableBodyCell>
              <TableBodyCell>R$10,00</TableBodyCell>
              <TableBodyCell>21/02/2024</TableBodyCell>
              <TableBodyCell>21/03/2024</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell>2</TableBodyCell>
              <TableBodyCell>R$100,00</TableBodyCell>
              <TableBodyCell>22/02/2024</TableBodyCell>
              <TableBodyCell>22/03/2024</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell>3</TableBodyCell>
              <TableBodyCell>R$90,00</TableBodyCell>
              <TableBodyCell>28/02/2024</TableBodyCell>
              <TableBodyCell>28/03/2024</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
              <TableBodyCell>Não</TableBodyCell>
            </TableBodyRow>
          </TableBody>
        </Table>
    </div>
    <div class="flex flex-row justify-between">
        <div>
            <Label>Total de crédito à liberar</Label><p>R$200,00</p>
            <Label>Total de crédito disponível</Label><p>R$100,00</p>
        </div>
        <div>
            <Button>Solicitar créditos<CashSolid class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
        </div>
    </div>
</div>

