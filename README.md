# handled-resizable

A javascript library that offers ability of resizing element by dragging a handle.

## Installation

`$ npm install handled-resizable`

## Usage

Notice: This library is designed to be as elementary as possible. Thus, to use this library you must provide a "handle" (the resizer) element by yourself.

### Basic
```js
import handledResizable from "handled-resizable"

handledResizable(resizer, resizee)
```

## API

```ts
function handledResizable(
    resizer: HTMLElement,
    resizee: HTMLElement|null,
    options?:
    {
        movement?:
        {
            x?: -1|0|1,
            y?: -1|0|1,
        },
        hooks?:
        {
            resizeStart?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false,
            resize?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false,
            resizeEnd?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void,
        }
    },
): void
```

- `resizer`

    The resizer element. Drag the resizer to resize resizee.

- `resizee`

    The resizee element. When drag on resizer, resizee resizes correspondingly.
    When null, clear all resizable relations on passed resizer.

- `options`

    Other options.

    - `movement`
    
        Movement constraint.
    
        - `x`, `y`

            Defines in what direction the resizee resizes.

            > -1: Negative direction.
            
            > 0: No move.

            > 1: Positive direction.

    - `hooks`

        Custom hooks.

        - `resizeStart`

            Call when resize starts. Return `false` to prevent default behaviour.

        - `resize`

            Call on each resize move. Return `false` to prevent default behaviour.

        - `resizeEnd`

            Call when resize ends.

