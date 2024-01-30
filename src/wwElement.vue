<template>
  <div style="position: relative;">
    <div ref="dropdownElement" @click="handleClick" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
      <wwLayout class="layout content-layout" path="triggerLayout"/>
    </div>
    <wwLayout v-if="isOpened || (this.content.forceDisplayEditor && this.isEditing)" class="layout content-layout dropdown" :style="dropdownStyle" path="dropdownLayout" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut"/>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
    wwEditorState: { type: Object, required: true },
  },
  data() {
    return {
      isOpened: false,
      coordinates: { width: 0, height: 0},
      dropdownSize: 0,
      isMouseInside: false,
      timeoutId: 0,
      resizeObserver: null,
    };
  },
  watch: {
    'content.triggerLayout': {
      handler(newVal, oldVal) {
        // Do something when triggerLayout changes
        console.log('TriggerLayout changed:', newVal);
      },
      deep: true, // Enable deep watching
    },
  },
  computed: {
    isEditing() {
        /* wwEditor:start */
        return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
        /* wwEditor:end */
        // eslint-disable-next-line no-unreachable
        return false;
    },
    dropdownStyle() {
      const style = {};
      const { position, alignment } = this.content;
      const width = this.coordinates.width + 'px';
      const height = this.coordinates.height + 'px';

      const offsetX = this.content.offsetX !== undefined ? this.content.offsetX : '0px';
      const offsetY = this.content.offsetY !== undefined ? this.content.offsetY : '0px';

      const setStyles = (position) => {
        if (position === 'top' || position === 'bottom') {
          style[position] = `calc(${height} + ${offsetY})`;
          // height + offsetY + 'px';
        } else {
          style[position] = `calc(${width} + ${offsetX})`;
        }
      };

      setStyles(this.getOppositeSide(position));

      switch (alignment) {
        case 'start':
          if (position === 'top' || position === 'bottom') {
            style['left'] = offsetX;
          } else {
            style['top'] = offsetY;
          }
          break;
        case 'center':
          if (position === 'top' || position === 'bottom') {
            style['left'] = `calc((${width} / 2) + ${offsetX})`
            style['transform'] = 'translate(-50%, 0px)';
          } else {
            style['top'] = `calc(${height} / 2 + ${offsetY})`
            style['transform'] = 'translate(0px, -50%)';
          }
          break;
        case 'end':
          if (position === 'top' || position === 'bottom') {
            style['right'] = offsetX;
          } else {
            style['bottom'] = `calc(-1 * ${offsetY})`;
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
    const resizeObserver = new ResizeObserver(this.handleResize);
    const containerElement = this.$refs.dropdownElement;
    resizeObserver.observe(containerElement);
  },
  unmounted(){
    clearTimeout(this.timeoutId);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    handleClick() {
      if (this.content.triggerType === 'click' || this.wwFrontState.screenSize !== 'default' && !this.isEditing) {
        if (!this.content.disabled) this.isOpened = !this.isOpened;
        console.log(this.content.offsetX)
      }
    },
    handleClickOutside() {
      if (!this.isMouseInside && (this.content.triggerType === 'click' || this.wwFrontState.screenSize !== 'default')) {
        if (!this.content.disabled) this.isOpened = false;
      }
    },
    handleHoverIn() {
      if (this.content.triggerType === 'hover' && this.wwFrontState.screenSize === 'default' && !this.isEditing) {
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
    getOppositeSide(side){
      const transformations = {
          'top': 'bottom',
          'bottom': 'top',
          'left': 'right',
          'right': 'left'
        };

        return transformations[side];
    },
    handleResize(entries) {
      const entry = entries[0];
      this.coordinates.width = entry.contentRect.width;
      this.coordinates.height = entry.contentRect.height;
    },
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
}
</style>
