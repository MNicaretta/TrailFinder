<script lang="ts">
import { defineComponent } from 'vue'

import ControlButton from './ControlButton.vue';

import { MoveType } from '@/models/move';

export default defineComponent({
  setup() {
    return { MoveType };
  },

  components: {
    ControlButton
  },
})
</script>

<template>
  <div class="tutorial">
    <h1>Trail Finder</h1>
    <h2>Objetivo</h2>
    <p>Crie um script de movimentação para levar o personagem até os baús e abri-los</p>
    <h2>Como jogar</h2>
    <p>Utilize as setas de movimentação 
      <ControlButton size="30px" :moveType="MoveType.LEFT"/>
      <ControlButton size="30px" :moveType="MoveType.RIGHT"/>
      <ControlButton size="30px" :moveType="MoveType.UP"/>
      <ControlButton size="30px" :moveType="MoveType.DOWN"/>
      para mover o personagem. A validação do movimento acontece na execução do código,
      para mover-se horizontalmente é preciso que um chão esteja na frente do personagem.
      As movimentações verticais só podem acontecer através de escadas.
      <br/>
      Para abrir um baú, utilize a chave
      <ControlButton size="30px" :moveType="MoveType.OPEN"/>
      . É preciso que o personagem esteja no mesmo bloco do baú.
      <br/>
      É possível utilizar os blocos de repetição
      <ControlButton size="30px" :moveType="MoveType.LOOP_START"/>
      <ControlButton size="30px" :moveType="MoveType.LOOP_END"/>
      para aprimorar o script. Ao adicionar um laço, você poderá definir o número de repetições.
      Todo laço deveria ter um início e um fim e o número de repetições definirá quantas vezes
      os blocos presentes entre o início e fim do laço serão repetidos.
    </p>
  </div>
</template>

<style scoped>
.tutorial {
  padding: 7%;
}
</style>