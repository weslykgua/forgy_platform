<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
  name: '',
  muscle: 'Piernas',
  video: ''
});

// Variable para mostrar mensajes de estado (Cargando, Éxito, Error)
const statusMessage = ref('');

const saveExercise = async () => {
  statusMessage.value = 'Guardando...';

  try {
    // 1. Enviamos los datos al Backend
    const response = await fetch('http://localhost:3000/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) throw new Error('Error en el servidor');

    // 2. Si todo sale bien:
    statusMessage.value = '✅ ¡Ejercicio guardado con éxito!';
    
    // Limpiamos el formulario
    form.name = '';
    form.video = '';

    // Borrar mensaje de éxito después de 3 segundos
    setTimeout(() => statusMessage.value = '', 3000);

  } catch (error) {
    console.error(error);
    statusMessage.value = '❌ Error al conectar con el servidor';
  }
};
</script>
<template>
  <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
    <h2 class="text-xl font-bold mb-4">Nuevo Ejercicio</h2>
    
    <form @submit.prevent="saveExercise">
      <div class="mb-4">
        <label class="block text-gray-700">Nombre del Ejercicio</label>
        <input 
          v-model="form.name" 
          type="text" 
          class="w-full mt-1 p-2 border rounded"
          placeholder="Ej: Sentadilla Hack" 
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Músculo Principal</label>
        <select v-model="form.muscle" class="w-full mt-1 p-2 border rounded">
          <option>Piernas</option>
          <option>Pecho</option>
          <option>Espalda</option>
          <option>Bíceps</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">URL del Video</label>
        <input 
          v-model="form.video" 
          type="url" 
          class="w-full mt-1 p-2 border rounded"
          placeholder="https://..." 
        />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Guardar Ejercicio
      </button>
    </form>
  </div>
</template>