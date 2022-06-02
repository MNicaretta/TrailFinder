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
    <p>Crie um script de movimentação para levar o personagem até os baús e abri-los.</p>
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
    <h2>Resultados</h2>
    <p>
      Ao finalizar o script você poderá executar ele através do
      <mdicon size="30px" title="Iniciar Script" name="play"/>.
      <br/>
      Após a execução havendo ou não falha no script, você poderá reiniciar a fase pelo
      <mdicon size="30px" title="Reiniciar Fase" name="restart"/>.
      <br/>
      Se o script foi executado com sucesso, aparecerá a opção de próximo nível
      <mdicon size="30px" title="Próximo Nível" name="skip-next"/>.
      <br/>
      Se o script tiver o menor número de movimentos possível, no topo dele você receberá uma
      <mdicon size="30px" title="Melhor Script" name="medal"/>.
      <br/>
      A qualquer momento, é possível alterar para qualquer fase através do menu
      <mdicon size="30px" name="menu"></mdicon>.
      Nesse menu serão exibidas todas as fases, indicando as concluídas
      <mdicon size="30px" name="check"></mdicon>
      e as fases concluídas com o menos número de movimentos possível
      <mdicon size="30px" name="medal"></mdicon>.
    </p>
    <br/>
    <small>Game art by <i>Buch @ <a href="https://opengameart.org/users/buch">opengameart.org</a></i></small>
  </div>
</template>

<style scoped>
.tutorial {
  padding: 7%;
  overflow: auto;
  height: 100%;
}
</style>