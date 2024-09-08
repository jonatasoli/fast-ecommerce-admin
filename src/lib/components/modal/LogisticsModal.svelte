<script lang="ts">
	import { goto } from '$app/navigation';

	
	import { getStatusTranslation } from '$lib/utils';
  
	import { Modal, Button, Input } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';


    interface OrderTracking {
	order_id: number;
	order_date: string;
	tracking_number: any;
	order_status: string;
}
    
  
    export let isOpen: boolean = false;

    export let selectedOrder: OrderTracking = {

        order_id: 0,
        order_date: '',
        order_status: '',
        tracking_number: '',
    }
 
    const dispatch = createEventDispatcher();


    async function updateTrackingNumber() {
    
    const url = `https://staging.api.gattorosa.com.br/order/${selectedOrder.order_id}/tracking_number`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Inclua outros cabeçalhos necessários, como autenticação
      },
      body: JSON.stringify({
        tracking_number: selectedOrder.tracking_number
      })
    });

    if (response) {
      console.log(response);
      updatedModal();
      closeModal();
    } else {
      console.error('Erro ao atualizar número de rastreamento:', response);
      updatedModal();
      closeModal();
    }
  }

  
  
    function closeModal() {
      dispatch('close');
    }

    function updatedModal(){
      dispatch('updated');
    }
  
    
  </script>
  
  <Modal bind:open={isOpen} on:close={closeModal} size="md" >
    <div class="p-4 space-y-4">
      <h3 class="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
  
      <div class="mb-4">
        <label for="orderId" class="block text-sm font-medium text-gray-700">ID do Pedido</label>
        <Input id="orderId" type="text" value={selectedOrder.order_id} readonly class="mt-1 w-full" />
      </div>
  
      <div class="mb-4">
        <label for="orderDate" class="block text-sm font-medium text-gray-700">Data do Pedido</label>
        <Input id="orderDate" type="text" value={new Date(selectedOrder.order_date).toLocaleDateString()} readonly class="mt-1 w-full" />
      </div>
  
      <div class="mb-4">
        <label for="orderStatus" class="block text-sm font-medium text-gray-700">Status do Pedido</label>
        <Input id="orderStatus" type="text" value={getStatusTranslation(selectedOrder.order_status)} readonly class="mt-1 w-full" />
      </div>
  
      <div class="mb-4">
        <label for="trackingCode" class="block text-sm font-medium text-gray-700">Código de Rastreio</label>
        <Input id="trackingCode" type="text" bind:value={selectedOrder.tracking_number} class="mt-1 w-full" />
      </div>
  
      <div class="flex flex-wrap justify-end space-x-2 mt-4">
        <Button variant="secondary" on:click={closeModal} class="w-full sm:w-auto">Cancelar</Button>
        <Button variant="primary" on:click={updateTrackingNumber} class="w-full sm:w-auto">Atualizar Logística</Button>
      </div>
    </div>
  </Modal>
  
  <!-- AB123456789CD -->