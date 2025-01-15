// useClickOutside.js
import { onMounted, onBeforeUnmount } from "vue";

export function useClickOutside(ref, callback) {
  function handleClick(event) {
    const el = ref.value;
    const isOutside = el && !el.contains(event.target);

    if (isOutside) {
      callback();
    }
  }

  onMounted(() => {
    wwLib.getFrontDocument().addEventListener("click", handleClick, true);
  });

  onBeforeUnmount(() => {
    wwLib.getFrontDocument().removeEventListener("click", handleClick, true);
  });
}
