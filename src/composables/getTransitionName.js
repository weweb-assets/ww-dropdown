export default function getTransitionName(animation, slideInDirection) {
  switch (animation) {
    case "fade":
      return "fade-transition";
    case "slide-in":
      switch (slideInDirection) {
        default:
          return "slide-in-left-transition";
        case "left":
          return "slide-in-left-transition";
        case "right":
          return "slide-in-right-transition";
        case "top":
          return "slide-in-top-transition";
        case "bottom":
          return "slide-in-bottom-transition";
      }
    case "zoom":
      return "zoom-transition";
    default:
      return "";
  }
}
