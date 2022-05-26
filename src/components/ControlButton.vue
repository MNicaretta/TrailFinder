<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import { MoveState, MoveType } from '@/models/move';

export default defineComponent({
  props: {
    moveType: {
      type: Number as PropType<MoveType>,
      required: true,
    },
    moveState: {
      type: Number as PropType<MoveState>,
      default: MoveState.IDLE,
    },
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
      }
    },
    iconClass() {
      switch (this.moveState) {
        case MoveState.IDLE:
        case MoveState.INVALID:
          return null;

        case MoveState.RUNNING:
        case MoveState.FINISHED:
          return 'control-button--active';
      }
    }
  }
})
</script>

<template>
  <mdicon size="80px" :name="iconName" :class="iconClass"/>
</template>

<style scoped>
.control-button--active {
  color: var(--color-heading);
}
</style>