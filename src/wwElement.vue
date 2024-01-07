<template>
  <div style="position: relative;">
    <div ref="dropdownElement" @click="handleClick" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
      <wwLayout class="layout content-layout" path="triggerLayout"/>
    </div>
    <div ref="dropdownContent" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
      <wwLayout v-if="isOpened" class="layout content-layout dropdown" :style="dropdownStyle" path="dropdownLayout"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
  },
  data() {
    return {
      isOpened: false,
      coordinates: 0,
      dropdownSize: 0,
      isMouseInside: false,
      timeoutId: 0
    };
  },
  computed: {
    textStyle() {
      return {
        color: this.content.textColor,
      };
    },
    dropdownStyle() {
      const style = {};
      const { position, alignment } = this.content;
      const { width, height } = this.coordinates;

      const offsetX = this.content.offsetX !== undefined ? parseInt(this.content.offsetX) : 0;
      const offsetY = this.content.offsetY !== undefined ? parseInt(this.content.offsetY) : 0;

      const setStyles = (position) => {
        if (position === 'top' || position === 'bottom') {
          style[position] = height + offsetY + 'px';
        } else {
          style[position] = width + offsetX + 'px';
        }
      };

      function getOppositeSide(side) {
        const transformations = {
          'top': 'bottom',
          'bottom': 'top',
          'left': 'right',
          'right': 'left'
        };

        return transformations[side];
      }

      setStyles(getOppositeSide(position));

      switch (alignment) {
        case 'start':
          if (position === 'top' || position === 'bottom') {
            style['left'] = offsetX + 'px';
          } else {
            style['top'] = offsetY + 'px';
          }
          break;
        case 'center':
          if (position === 'top' || position === 'bottom') {
            style['left'] = width / 2 + offsetX + 'px';
            style['transform'] = 'translate(-50%, 0px)';
          } else {
            style['top'] = height / 2 + offsetY + 'px';
            style['transform'] = 'translate(0px, -50%)';
          }
          break;
        case 'end':
          if (position === 'top' || position === 'bottom') {
            style['right'] = offsetX + 'px';
          } else {
            style['bottom'] = -1 * offsetY + 'px';
          }
          break;
      }

      return style;
    }
  },
  beforeMount() {
    wwLib.getFrontDocument().addEventListener('click', this.handleClickOutside);
  },
  mounted() {
    this.updatePosition();
  },
  methods: {
    updatePosition() {
      this.coordinates = this.$refs.dropdownElement.getBoundingClientRect();
    },
    toggleDropdown() {
      this.isOpened = !this.isOpened;
      this.updatePosition();
    },
    toggleEdit() {
      this.toggleDropdown();
    },
    handleClick() {
      if (this.content.triggerType === 'click' || this.wwFrontState.screenSize !== 'default') {
        this.updatePosition();
        if (!this.content.disabled) this.isOpened = !this.isOpened;
      }
    },
    handleHoverIn() {
      if (this.content.triggerType === 'hover' && this.wwFrontState.screenSize === 'default') {
        this.updatePosition();
        clearTimeout(this.timeoutId);
        if (!this.content.disabled) this.isOpened = true;
      } else {
        this.isMouseInside = true;
      }
    },
    handleHoverOut() {
      if (this.content.triggerType === 'hover') {
        this.timeoutId = setTimeout(() => {
          if (!this.content.disabled) this.isOpened = false;
        }, 200);
      } else {
        this.isMouseInside = false;
      }
    },
    handleClickOutside() {
      if (!this.isMouseInside && (this.content.triggerType === 'click' || this.wwFrontState.screenSize !== 'default')) {
        if (!this.content.disabled) this.isOpened = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  // animation: fade-in 2s ease;
  // transform-origin: top left;
}

@keyframes fade-in {
  0% {
    transform: translate(var(--offsetX), var(--offsetY));
    transform: scale(0.0);
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
