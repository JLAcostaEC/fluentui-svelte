<p align="center">
	<picture>
  		<source media="(prefers-color-scheme: dark)" srcset="https://github.com/JLAcostaEC/fluentui-svelte/blob/main/static/images/banner-white.png?raw=true" height="130" style="margin-bottom: 20px">
  		<img alt="Fluent UI Svelte Logo" src="https://github.com/JLAcostaEC/fluentui-svelte/blob/main/static/images/banner.png?raw=true" height="130" style="margin-bottom: 20px"/>
	</picture>
</p>

<p align="center">
  Modern components based on <a href="https://learn.microsoft.com/en-us/windows/apps/design/">Microsoft's Fluent UI</a> for Svelte 5.
</p>

## Features

- Svelte 5 components!
- All components will be accessible following [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standards.
- Semantic HTML & Native Behavior Elements (Like: `<dialog></dialog>` or `<details></details>`)
- Reduced motion supported.

### Undocumented Components

The documentation site is currently in building fase. All components exported in the library are not yet documented.

Please keep in mind that any undocumented component is _considered to be in the 0.x phase of development_. This means that they could potentially recieve breaking API changes or be heavily updated before being finalized.

## Resources

> ### [Windows UI Kit - Figma File](https://www.figma.com/community/file/1440832812269040007)
>
> The Windows UI Toolkit is a resource for creating experiences on Windows. It contains a control library and examples of how those controls are used within the WinUI platform.

> ### Official Gallery Docs: [WinUI 3 Gallery](https://apps.microsoft.com/detail/9p3jfpwwdzrc)
>
> This app demonstrates all of the Windows UI 3 library controls and styles available to make a WinUI 3 app with the Windows App SDK.

> ### Documentation: [Microsoft's Fluent UI](https://learn.microsoft.com/en-us/windows/apps/design/)
>
> Design guidelines and UI code examples for creating Windows app experiences.

> ### [Fluent UI 2 Web - Figma File](https://www.figma.com/community/file/836828295772957889)
>
> Explore the next evolution of Microsoft’s design system with the Fluent 2 Web UI Kit.

## Credits

> - [Microsoft's Fluent UI](https://learn.microsoft.com/en-us/windows/apps/design/): Thank Microsoft for creating this masterpiece.
> - [Fluent Svelte](https://github.com/Tropix126/fluent-svelte): Which was unfortunately abandoned.

## Notes

> [!IMPORTANT]
> This repository is not affiliated with or connected to Microsoft in any way. It is merely an open-source package that provides their components to use with Svelte 5 applications.

> [!IMPORTANT]
> The fluentui-svelte library relies on new CSS features that (for now) are only available in Chromium-based browsers (such as Chrome or Edge). This means that in browsers like Firefox and Safari, some styles may not render correctly or may exhibit visual issues.

> [!NOTE]
> This package is not an exact port/reimplementation of Fluent UI (React, Web or any other official/unofficial variation), many features/APIs are not the same as those described in the Fluent UI documentation.
