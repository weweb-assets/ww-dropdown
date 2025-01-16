export default {
  editor: {
    label: {
      en: "Dropdown",
    },
    icon: "navigator-dropdown",
    navigator: {
      groups: ["Trigger", "Dropdown"],
    },
  },
  triggerEvents: [
    {
      name: "open",
      label: {
        en: "On open",
        fr: "À l'ouverture",
      },
    },
    {
      name: "close",
      label: {
        en: "On close",
        fr: "À la fermeture",
      },
    },
  ],
  actions: [
    {
      label: "Toggle",
      action: "toggleDropdown",
    },
    {
      label: "Open",
      action: "openDropdown",
    },
    {
      label: "Close",
      action: "closeDropdown",
    },
  ],
  properties: {
    toggleDialog: {
      type: "Button",
      editorOnly: true,
      bindable: true,
      options: {
        text: { en: "Toggle" },
        action: "toggleDropdown",
      },
    },
    trigger: {
      label: { en: "trigger" },
      type: "TextSelect",
      bindable: true,
      options: {
        options: [
          { value: "click", label: "Click" },
          { value: "hover", label: "Hover" },
          { value: "rightClick", label: "Right click" },
        ],
      },
      defaultValue: "bottom",
      // hidden: content => content.autoPosition,
    },
    side: {
      label: { en: "Side" },
      type: "TextSelect",
      bindable: true,
      options: {
        options: [
          { value: "bottom", label: "Bottom" },
          { value: "left", label: "Left" },
          { value: "top", label: "Top" },
          { value: "right", label: "Right" },
        ],
      },
      defaultValue: "bottom",
      // hidden: content => content.autoPosition,
    },
    align: {
      label: { en: "Align" },
      type: "TextSelect",
      bindable: true,
      options: {
        options: [
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" },
        ],
      },
      defaultValue: "start",
      // hidden: content => content.autoPosition,
    },
    mainAxisOffset: {
      label: { en: "Side offset" },
      type: "Length",
      options: {
        unitChoices: [{ value: "px", label: "px", min: -100, max: 100 }],
      },
      defaultValue: "0px",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "number" }],
        tooltip:
          "The horizontal offset of the dropdown relative to the trigger. A number value: \n\n`4`, `8`, `12`, etc.",
      },
      propertyHelp: {
        tooltip:
          "The horizontal offset of the dropdown relative to the trigger.",
      },
      /* wwEditor:end */
    },
    crossAxisOffset: {
      label: { en: "Alignment offset" },
      type: "Length",
      options: {
        unitChoices: [{ value: "px", label: "px", min: -100, max: 100 }],
      },
      defaultValue: "0px",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "number" }],
        tooltip:
          "The vertical offset of the dropdown relative to the trigger. A number value: \n\n`4`, `8`, `12`, etc.",
      },
      propertyHelp: {
        tooltip: "The vertical offset of the dropdown relative to the trigger.",
      },
      /* wwEditor:end */
    },
    boundOffset: {
      label: { en: "Edge offset" },
      type: "Length",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 100 },
          { value: "%", label: "%", min: 0, max: 100 },
        ],
      },
      defaultValue: "0px",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "number" }],
        tooltip:
          "Offset to the edge of the screen when the dropdown should change the side to opposite when there is no space for it. A number value: \n\n`4`, `8`, `12`, etc.",
      },
      propertyHelp: {
        tooltip:
          "Offset to the edge of the screen when the dropdown should change the side to opposite when there is no space for it.",
      },
      /* wwEditor:end */
    },
    animation: {
      label: {
        en: "Animation",
        fr: "Animation",
      },
      section: "style",
      type: "TextSelect",
      options: {
        options: [
          { value: null, label: { en: "None", fr: "Aucune" } },
          { value: "fade", label: { en: "Fade", fr: "Fondu" } },
          { value: "slide-in", label: { en: "Slide in", fr: "Diapositive" } },
          { value: "zoom", label: { en: "Zoom", fr: "Zoom" } },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          'A string matching one of the dialog animation types: "fade", "slide-in", "zoom" or null.',
      },
      /* wwEditor:end */
      defaultValue: null,
      bindable: true,
    },
    slideInDirection: {
      hidden: (content) => content.animation !== "slide-in",
      label: {
        en: "Direction",
        fr: "Direction",
      },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "top", label: { en: "Top", fr: "Haut" } },
          { value: "left", label: { en: "Left", fr: "Gauche" } },
          { value: "bottom", label: { en: "Bottom", fr: "Bas" } },
          { value: "right", label: { en: "Right", fr: "Droite" } },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          'A string matching one of the slide in directions: "top", "left", "right" or "bottom".',
      },
      /* wwEditor:end */
      defaultValue: "top",
      bindable: true,
    },
    animationDuration: {
      label: {
        en: "Animation duration (ms)",
        fr: "Durée de l'animation (ms)",
      },
      section: "style",
      type: "Number",
      defaultValue: 300,
      options: {
        min: 0,
        max: 10000,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "A number between 0 and 10000.",
      },
      /* wwEditor:end */
      bindable: true,
      hidden: (content) => content.animation === "none",
    },
    animationEasing: {
      label: {
        en: "Animation easing",
        fr: "Animation easing",
      },
      section: "style",
      type: "TextSelect",
      options: {
        options: [
          { value: "linear", label: { en: "Linear", fr: "Linéaire" } },
          { value: "ease", label: { en: "Ease", fr: "Acceleration" } },
          {
            value: "ease-in",
            label: { en: "Ease in", fr: "Acceleration progressive" },
          },
          { value: "ease-out", label: { en: "Ease out", fr: "Deceleration" } },
          {
            value: "ease-in-out",
            label: { en: "Ease in out", fr: "Acceleration et déclinaison" },
          },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          'A string matching one of the dialog animation easing types: "linear", "ease", "ease-in", "ease-out" or "ease-in-out".',
      },
      /* wwEditor:end */
      defaultValue: "linear",
      bindable: true,
    },
    matchWidth: {
      label: { en: "Match widths" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "boolean" }],
      },
      /* wwEditor:end */
    },
    disabled: {
      label: { en: "Disabled" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "boolean" }],
      },
      /* wwEditor:end */
    },
    preventInteractionsOutside: {
      label: { en: "Prevent interactions outside" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "boolean" }],
      },
      /* wwEditor:end */
    },
    preventScroll: {
      label: { en: "Prevent scrolling" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "boolean" }],
      },
      /* wwEditor:end */
    },
    clickOutsideCloses: {
      label: { en: "Click outside closes" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        validations: [{ type: "boolean" }],
      },
      /* wwEditor:end */
    },
    dropdownContent: {
      hidden: true,
      defaultValue: [],
    },
    triggerContainer: {
      hidden: true,
      defaultValue: {
        isWwObject: true,
        type: "ww-flexbox",
        name: "Trigger",
        content: {
          children: [],
        },
      },
    },
    dropdownContainer: {
      hidden: true,
      defaultValue: {
        isWwObject: true,
        type: "ww-flexbox",
        name: "Dropdown",
        content: {
          children: [],
        },
      },
    },
  },
};
