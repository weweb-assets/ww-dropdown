<template>
  <div
    :style="{
      '--transition-duration': animationDuration,
      '--transition-easing': content.animationEasing,
    }"
  >
    <div
      v-if="!isEditing && content.preventInteractionsOutside && isOpen"
      class="pointer-capture"
      @click.stop="null"
    ></div>

    <div
      ref="triggerElement"
      @click="handleClick"
      @contextmenu.prevent="handleRightClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <wwElement v-bind="content.triggerContainer" />
    </div>

    <div
      :style="[floatingStyles, { width: dropdownWidth }]"
      ref="dropdownElement"
      @mouseenter="handleDropdownEnter"
      @mouseleave="handleDropdownLeave"
    >
      <Transition mode="out-in" :name="transitionName" v-if="isOpen">
        <div class="class=ww-dropdown-transition-root">
          <wwElement v-bind="content.dropdownContainer" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeUnmount, watch } from "vue";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
} from "@floating-ui/vue";
import { useClickOutside } from "./composables/handleClickOutside";
import getTransitionName from "./composables/getTransitionName";

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ["trigger-event"],
  setup(props, { emit }) {
    // const isOpen = ref(false);
    const triggerElement = ref(null);
    const dropdownElement = ref(null);
    const hoverTimeout = ref(null);

    const animationDuration = computed(() => {
      return props.content.animationDuration + "ms";
    });

    const transitionName = computed(() => {
      return getTransitionName(
        props.content.animation,
        props.content.slideInDirection
      );
    });

    const { value: isOpen, setValue: setIsOpen } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "open",
        type: "boolean",
        defaultValue: false,
        componentType: "element",
      });

    const isEditing = computed(() => {
      /* wwEditor:start */
      return (
        props.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Get trigger type from props or default to 'click'
    const triggerType = computed(() => props.content.trigger || "click");

    // Clear hover timeout on component unmount
    onBeforeUnmount(() => {
      if (hoverTimeout.value) clearTimeout(hoverTimeout.value);
    });

    function handleClick() {
      if (props.content.trigger === "click" && !isEditing.value) {
        toggleDropdown();
      }
    }

    function handleRightClick(event) {
      if (triggerType.value === "rightClick" && !isEditing.value) {
        toggleDropdown();
      }
    }

    function handleMouseEnter() {
      if (triggerType.value === "hover" && !isEditing.value) {
        clearTimeout(hoverTimeout.value);
        openDropdown();
      }
    }

    function handleMouseLeave() {
      if (triggerType.value === "hover" && !isEditing.value) {
        hoverTimeout.value = setTimeout(() => {
          closeDropdown();
        }, 150); // Small delay to allow moving to dropdown
      }
    }

    function handleDropdownEnter() {
      if (triggerType.value === "hover") {
        clearTimeout(hoverTimeout.value);
      }
    }

    function handleDropdownLeave() {
      if (triggerType.value === "hover" && !isEditing.value) {
        closeDropdown();
      }
    }

    function openDropdown() {
      setIsOpen(true);
      emit("trigger-event", {
        name: "open",
      });
    }

    function closeDropdown() {
      setIsOpen(false);
      emit("trigger-event", {
        name: "close",
      });
    }

    function toggleDropdown() {
      isOpen.value ? closeDropdown() : openDropdown();
    }

    useClickOutside(dropdownElement, handleClickOutside);

    function handleClickOutside() {
      if (
        (triggerType.value === "click" || triggerType.value === "rightClick") &&
        !isEditing.value &&
        props.content.clickOutsideCloses
      ) {
        if (isOpen.value) closeDropdown();
      }
    }

    const placement = computed(() => {
      const side = props.content.side || "bottom";
      const align = props.content.align || "start";
      return `${side}-${align}`;
    });

    const triggerElementWidth = computed(
      () => triggerElement.value.getBoundingClientRect().width + "px"
    );

    const dropdownWidth = computed(() =>
      props.content.matchWidth ? triggerElementWidth.value : "auto"
    );

    const middleware = computed(() => [
      offset({
        mainAxis: parseFloat(props.content.mainAxisOffset) || 0,
        crossAxis: parseFloat(props.content.crossAxisOffset) || 0,
      }),
      flip({ padding: parseFloat(props.content.boundOffset) || 0 }),
      shift({ padding: 0 }),
    ]);

    const { floatingStyles, updateFloating: update } = useFloating(
      triggerElement,
      dropdownElement,
      {
        placement,
        middleware,
        // transform: false,
        whileElementsMounted: autoUpdate,
      }
    );

    watch(
      () => isOpen.value,
      (newValue) => {
        console.log(middleware);
        if (props.content.preventScroll && !isEditing.value) {
          const overflowValue = newValue ? "hidden" : "auto";
          wwLib.getFrontDocument().body.style.overflow = overflowValue;
          wwLib.getFrontDocument().documentElement.style.overflow =
            overflowValue;
        }
      }
    );

    /* wwEditor:start */
    watch(
      () => isEditing.value,
      (newValue) => {
        if (props.content.preventScroll && isOpen.value && newValue) {
          wwLib.getFrontDocument().body.style.overflow = "auto";
          wwLib.getFrontDocument().documentElement.style.overflow = "auto";
        }
      }
    );
    /* wwEditor:end */

    wwLib.wwElement.useRegisterElementLocalContext(
      "dropdown",
      ref({ isOpen }),
      {
        closeDropdown: {
          method: closeDropdown,
          editor: {
            label: "Close",
            description: "Close the dropdown.",
          },
        },
      }
    );

    return {
      floatingStyles,
      isOpen,
      toggleDropdown,
      isEditing,
      closeDropdown,
      openDropdown,
      triggerElement,
      dropdownElement,
      dropdownWidth,
      handleClick,
      handleRightClick,
      handleMouseEnter,
      handleMouseLeave,
      handleDropdownEnter,
      handleDropdownLeave,
      transitionName,
      animationDuration,
    };
  },
};
</script>

<style lang="scss" scoped>
.ww-dropdown-transition-root {
  --translate-x: 0px;
  --translate-y: 0px;
  --translate-x-offset: 0px;
  --translate-y-offset: 0px;
  --scale: 1;
  --calc-translate-x: calc(var(--translate-x) + var(--translate-x-offset));
  --calc-translate-y: calc(var(--translate-y) + var(--translate-y-offset));
  transition: transform var(--transition-duration) var(--transition-easing),
    opacity var(--transition-duration) var(--transition-easing) !important;
  transform: translateX(var(--calc-translate-x))
    translateY(var(--calc-translate-y)) scaleX(var(--scale))
    scaleY(var(--scale)) !important;
}

/* Fade Animation */
.fade-transition-enter-from .ww-dropdown-transition-root,
.fade-transition-leave-to .ww-dropdown-transition-root {
  opacity: 0;
}

/* Slide-in left Animation */
.slide-in-left-transition-enter-from .ww-dropdown-transition-root {
  --translate-x-offset: -20px;
  opacity: 0;
}
.slide-in-left-transition-enter-to .ww-dropdown-transition-root {
  --translate-x-offset: 0;
  opacity: 1;
}
.slide-in-left-transition-leave-from .ww-dropdown-transition-root {
  --translate-x-offset: 0;
  opacity: 1;
}
.slide-in-left-transition-leave-to .ww-dropdown-transition-root {
  --translate-x-offset: -20px;
  opacity: 0;
}

/* Slide-in right Animation */
.slide-in-right-transition-enter-from .ww-dropdown-transition-root {
  --translate-x-offset: 20px;
  opacity: 0;
}
.slide-in-right-enter-to .ww-dropdown-transition-root {
  --translate-x-offset: 0;
  opacity: 1;
}
.slide-in-right-transition-leave-from .ww-dropdown-transition-root {
  --translate-x-offset: 0;
  opacity: 1;
}
.slide-in-right-transition-leave-to .ww-dropdown-transition-root {
  --translate-x-offset: 20px;
  opacity: 0;
}

/* Slide-in top Animation */
.slide-in-top-transition-enter-from .ww-dropdown-transition-root {
  --translate-y-offset: -20px;
  opacity: 0;
}
.slide-in-top-enter-to .ww-dropdown-transition-root {
  --translate-y-offset: 0;
  opacity: 1;
}
.slide-in-top-transition-leave-from .ww-dropdown-transition-root {
  --translate-y-offset: 0;
  opacity: 1;
}
.slide-in-top-transition-leave-to .ww-dropdown-transition-root {
  --translate-y-offset: -20px;
  opacity: 0;
}

/* Slide-in bottom Animation */
.slide-in-bottom-transition-enter-from .ww-dropdown-transition-root {
  --translate-y-offset: 20px;
  opacity: 0;
}
.slide-in-bottom-enter-to .ww-dropdown-transition-root {
  --translate-y-offset: 0;
  opacity: 1;
}
.slide-in-bottom-transition-leave-from .ww-dropdown-transition-root {
  --translate-y-offset: 0;
  opacity: 1;
}
.slide-in-bottom-transition-leave-to .ww-dropdown-transition-root {
  --translate-y-offset: 20px;
  opacity: 0;
}

/* Zoom Animation */
.zoom-transition-enter-from .ww-dropdown-transition-root,
.zoom-transition-leave-to .ww-dropdown-transition-root {
  --scale: 0;
}
.zoom-transition-enter-to .ww-dropdown-transition-root,
.zoom-transition-leave-from .ww-dropdown-transition-root {
  --scale: 1;
}

.pointer-capture {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  pointer-events: auto;
}
</style>
