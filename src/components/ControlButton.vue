<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import { MoveState, MoveType } from '@/models/move';

export default defineComponent({
  props: {
    size: {
      type: String,
    },
    moveType: {
      type: Number as PropType<MoveType>,
      required: true,
    },
    moveState: {
      type: Number as PropType<MoveState>,
      default: MoveState.IDLE,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    iconName() {
      switch (this.moveType) {
        case MoveType.UP:
          return "arrow-up-bold";

        case MoveType.DOWN:
          return "arrow-down-bold";

        case MoveType.LEFT:
          return "arrow-left-bold";

        case MoveType.RIGHT:
          return "arrow-right-bold";

        case MoveType.OPEN:
          return "key";

        case MoveType.LOOP_START:
          return "arrow-expand-right";

        case MoveType.LOOP_END:
          return "arrow-expand-left";
      }
    },
    iconClass() {
      switch (this.moveState) {
        case MoveState.IDLE:
        case MoveState.INVALID:
        case MoveState.FINISHED:
          return null;

        case MoveState.RUNNING:
          return 'control-button__button--active';
      }
    },
    iconTooltip() {
      switch (this.moveType) {
        case MoveType.UP:
          return "Mover para CIMA";

        case MoveType.DOWN:
          return "Mover para BAIXO";

        case MoveType.LEFT:
          return "Mover para ESQUERDA";

        case MoveType.RIGHT:
          return "Mover para DIREITA";

        case MoveType.OPEN:
          return "Abrir BAÚ";

        case MoveType.LOOP_START:
          return "INÍCIO do Laço de Repetição";

        case MoveType.LOOP_END:
          return "FIM do Laço de Repetição";
      }
    },
    isLoopStart() {
      return !this.disabled && this.moveType === MoveType.LOOP_START;
    }
  }
})
</script>

<template>
  <mdicon :title="iconTooltip" :size="size ?? '100%'" :name="iconName" :class="iconClass"/>
</template>

<style scoped>
.control-button__button--active {
  color: var(--color-heading);
}
</style>