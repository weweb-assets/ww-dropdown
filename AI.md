---
name: ww-dropdown
description: The `ww-dropdown` component provides a customizable dropdown menu that can be triggered by click, hover, or right-click, with configurable positions, alignments, and optional animations, allowing for flexible integration into web applications.
keywords:
  - triggertype
  - position
  - alignment
  - offsetx
  - offsety
  - dropdownzindex
  - animated
  - forcedisplayeditor
  - closedropdown
  - ww-layout
---

#### ww-dropdown

Component Purpose: Renders a dropdown menu triggered by click, hover, or right-click with configurable positions and alignments.

Properties:
- triggerType: 'click' | 'hover' | 'right-click' - Trigger type for opening. Default: "click"
- position: 'top' | 'right' | 'bottom' | 'left' - Position relative to trigger. Default: "bottom"
- alignment: 'start' | 'center' | 'end' - Alignment along position axis. Default: "start"
- offsetX: string - Horizontal offset. Default: undefined
- offsetY: string - Vertical offset. Default: undefined
- dropdownZIndex: number - Z-index of dropdown. Default: undefined
- disabled: boolean - Disables dropdown. Default: undefined
- animated: boolean - Enables animations. Default: undefined
- forceDisplayEditor: boolean - Forces display in editor. Default: undefined

Children:
- triggerLayout: any - Trigger element layout
- dropdownLayout: any - Dropdown content layout

Actions:
- closeDropdown: Programmatically closes the dropdown

Example:

{"uid":"dropdown-element","tag":"ww-dropdown","props":{"default":{"offsetY":"8px","position":"bottom","alignment":"start","triggerType":"click","forceDisplayEditor":true}},"children":{"triggerLayout":[{"uid":"dropdown-trigger-layout"}],"dropdownLayout":[{"uid":"dropdown-layout"}]}}
{"uid":"dropdown-trigger-layout","tag":"ww-button","props":{"default":{"disabled":false,"text":{"en":"<div>Click me</div>"}}},"styles":{"default":{"height":"38px","padding":"8px 16px","backgroundColor":"#000000","color":"#FFFFFF"}}}
{"uid":"dropdown-layout","tag":"ww-flexbox","styles":{"default":{"width":"220px","padding":"8px","borderRadius":"12px"}},"children":{"children":[{"uid":"dropdown-layout-children"}]}}
{"uid":"dropdown-layout-children","tag":"ww-flexbox","children":{"children":[{"uid":"layout-children-icon"},{"uid":"layout-children-text"}]}}
{"uid":"layout-children-icon","tag":"ww-icon","props":{"default":{"icon":"icon-user","fontSize":"16","color":"black"}}}
{"uid":"layout-children-text","tag":"ww-text","props":{"default":{"text":{"en":"<div>Profile</div>"}}}}

Events: none

Variables: none
