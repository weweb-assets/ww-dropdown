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

      switch (this.content.position) {
        case 'top':
          if (this.content.offsetY === undefined) {
            style['bottom'] = this.coordinates.height + "px";
          } else {
            style['bottom'] = `calc(${this.coordinates.height + "px"} + ${this.content.offsetY})`;
          }
          style['--offsetX'] = "0"
          style['--offsetY'] = "16px"
          break;
        case 'bottom':
          if (this.content.offsetY === undefined) {
            style['top'] = this.coordinates.height + "px";
          } else {
            style['top'] = `calc(${this.coordinates.height + "px"} + ${this.content.offsetY})`;
          }
          style['--offsetX'] = "0"
          style['--offsetY'] = "-16px"
          break;
        case 'left':
          if (this.content.offsetX === undefined) {
            style['right'] = this.coordinates.width + "px";
          } else {
            style['right'] = `calc(${this.coordinates.width + "px"}  + ${this.content.offsetX})`;
          }
          style['--offsetX'] = "16px"
          style['--offsetY'] = "0"
          break;
        case 'right':
          if (this.content.offsetX === undefined) {
            style['left'] = this.coordinates.width + "px";
          } else {
            style['left'] = `calc(${this.coordinates.width + "px"}  + ${this.content.offsetX})`;
          }
          // style['transformOrigin'] = "center left"
          style['--offsetX'] = "-16px"
          style['--offsetY'] = "0"
          break;
      }

      switch (this.content.alignment) {
        case 'start':
          if (this.content.position === 'top' || this.content.position === 'bottom') {
            style['left'] = this.content.offsetX === undefined ? "0px" : this.content.offsetX;
          } else {
            style['top'] = 0;
          }
          break;
        case 'center':
          if (this.content.position === 'top' || this.content.position === 'bottom') {
            if (this.content.offsetX === undefined) {
              style['left'] = this.coordinates.width / 2 + "px";
            } else {
              style['left'] = `calc( ${this.coordinates.width / 2 + "px"} + ${this.content.offsetX})`;
            }
            style['transform'] = 'translate(-50%, 0px)';
          } else {
            style['top'] = this.coordinates.height / 2 + "px";
            style['transform'] = 'translate(0px, -50%)';
          }
          break;
        case 'end':
          if (this.content.position === 'top' || this.content.position === 'bottom') {
            style['right'] = this.content.offsetX === undefined ? "0px" : this.content.offsetX;;
          } else {
            style['bottom'] = 0;
          }
          break;
      }

      return style;
    }
  },
  watch: {

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
