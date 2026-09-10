---
'fluentui-svelte': patch
---

fix: app freezes when animating clip-path

This change fixes the issue where the app would freeze when animating `clip-path`, introduced in chromium versions 150-151, see more here https://issues.chromium.org/issues/545348583