<template>
  <div>
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
      :style="floatingStyles"
      ref="dropdownElement"
      v-if="isOpen"
      @mouseenter="handleDropdownEnter"
      @mouseleave="handleDropdownLeave"
    >
      <wwElement v-bind="content.dropdownContainer" />
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

    const size = computed(() =>
      props.content.matchWidth ? `${rects.reference.width}px` : "auto"
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
        // strategy: "fixed",
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

    watch(
      () => props.content.matchWidth,
      (newValue) => {
        if (newValue) {
          middleware.value.push(
            size({
              apply({ rects, elements }) {
                elements.floating.style.width = props.content.matchWidth
                  ? `${rects.reference.width}px`
                  : "auto";
              },
            })
          );
        } else {
          if ((middleware.value.length = 3)) middleware.value.pop();
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
      handleClick,
      handleRightClick,
      handleMouseEnter,
      handleMouseLeave,
      handleDropdownEnter,
      handleDropdownLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.pointer-capture {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  pointer-events: auto;
}
</style>
