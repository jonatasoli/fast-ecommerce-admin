<script lang="ts">
	
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
  
    function closeModal() {
      dispatch('close');
    }
  
    function updateLogistics() {
      // Implementar a lógica para atualizar a logística aqui
      console.log('Atualizando logística...');
      closeModal();
    }
  </script>
  
  <Modal bind:open={isOpen} on:close={closeModal} size="md">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
  
      <div class="mb-4">
        <label for="orderId" class="block text-sm font-medium text-gray-700">ID do Pedido</label>
        <Input id="orderId" type="text" value={selectedOrder.order_id} readonly class="mt-1" />
      </div>
  
      <div class="mb-4">
        <label for="orderDate" class="block text-sm font-medium text-gray-700">Data do Pedido</label>
        <Input id="orderDate" type="text" value={new Date(selectedOrder.order_date).toLocaleDateString()} readonly class="mt-1" />
      </div>
  
      <div class="mb-4">
        <label for="orderStatus" class="block text-sm font-medium text-gray-700">Status do Pedido</label>
        <Input id="orderStatus" type="text" value={getStatusTranslation(selectedOrder.order_status)} readonly class="mt-1" />
      </div>
  
      <div class="mb-4">
        <label for="trackingCode" class="block text-sm font-medium text-gray-700">Código de Rastreio</label>
        <Input id="trackingCode" type="text" bind:value={selectedOrder.tracking_number} class="mt-1" />
      </div>
  
      <div class="flex justify-end space-x-2">
        <Button variant="secondary" on:click={closeModal}>Cancelar</Button>
        <Button variant="primary" on:click={updateLogistics}>Atualizar Logística</Button>
      </div>
    </div>
  </Modal>
  