<template>
  <div style="position: relative">
    <div
      ref="triggerElement"
      @click="handleClick"
      @mouseenter="handleHoverIn"
      @mouseleave="handleHoverOut"
      @contextmenu.prevent="handleRightClick"
    >
      <wwElement class="ww-select-trigger" v-bind="content.triggerContainer" />
    </div>

    <div
      :style="floatingStyles"
      class="dropdown"
      ww-responsive="dropdown"
      ref="dropdownElement"
      @mouseenter="handleHoverIn"
      @mouseleave="handleHoverOut"
    >
      <wwElement
        v-if="isOpened || (this.content.forceDisplayEditor && this.isEditing)"
        v-bind="content.dropdownLayout"
      />
    </div>
  </div>
</template>

<script>
import useDropdownFloating from "./composables/useFloating";

export default {
  props: {
    content: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
    wwEditorState: { type: Object, required: true },
  },
  data() {
    return {
      isOpened: false,
      coordinates: { width: 0, height: 0 },
      dropdownSize: 0,
      isMouseInside: false,
      timeoutId: 0,
      resizeObserver: null,
    };
  },
  setup(props) {
    const { floatingStyles, syncFloating } = useDropdownFloating(
      triggerElement,
      dropdownElement
    );

    return { floatingStyles, syncFloating };
  },
  computed: {
    isEditing() {
      /* wwEditor:start */
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
  },
  beforeMount() {
    wwLib.getFrontDocument().addEventListener("click", this.handleClickOutside);
  },
  mounted() {
    const resizeObserver = new ResizeObserver(this.handleResize);
    const containerElement = this.$refs.dropdownElement;
    resizeObserver.observe(containerElement);
  },
  unmounted() {
    clearTimeout(this.timeoutId);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    handleClick() {
      if (
        this.content.triggerType === "click" ||
        (this.wwFrontState.screenSize !== "default" && !this.isEditing)
      ) {
        if (!this.content.disabled) this.isOpened = !this.isOpened;
      }
    },
    closeDropdown() {
      this.isOpened = false;
    },
    handleClickOutside() {
      if (
        !this.isMouseInside &&
        (this.content.triggerType === "click" ||
          this.content.triggerType === "right-click" ||
          this.wwFrontState.screenSize !== "default")
      ) {
        if (!this.content.disabled) this.isOpened = false;
      }
    },
    handleHoverIn() {
      if (
        this.content.triggerType === "hover" &&
        this.wwFrontState.screenSize === "default" &&
        !this.isEditing
      ) {
        clearTimeout(this.timeoutId);
        if (!this.content.disabled) this.isOpened = true;
      } else {
        this.isMouseInside = true;
      }
    },
    handleHoverOut() {
      if (this.content.triggerType === "hover") {
        this.timeoutId = setTimeout(() => {
          if (!this.content.disabled) this.isOpened = false;
        }, 200);
      } else {
        this.isMouseInside = false;
      }
    },
    handleRightClick() {
      if (
        this.content.triggerType === "right-click" ||
        (this.wwFrontState.screenSize !== "default" && !this.isEditing)
      ) {
        if (!this.content.disabled) this.isOpened = !this.isOpened;
      }
    },
    getOppositeSide(side) {
      const transformations = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      };

      return transformations[side];
    },
    handleResize(entries) {
      const entry = entries[0];
      this.coordinates.width = entry.contentRect.width;
      this.coordinates.height = entry.contentRect.height;
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
  --slideOriginX: 0px;
  --slideOriginY: 0px;
  --transformOrigin: top left;
}

.dropdown {
  position: absolute;
  // transform: translateX(-50%)
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  transform-origin: var(--transformOrigin);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(var(--slideOriginX), var(--slideOriginY)) scale(0.1);
}
</style>
