# simple-draggable

A javascript library that offers ability of dragging element.

## Installation

`$ npm install simple-draggable`

## Usage

### Basic
```js
import simpleSraggable from "simple-draggable"

simpleSraggable(draggable)
```

## API

```ts
function simpleSraggable(
    draggable: HTMLElement,
    options?:
    {
        hooks?:
        {
            dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: ResizerData) => void|false,
            drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: ResizerData) => void|false,
            dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: ResizerData) => void,
        },
        destroy?: boolean,
        avoid?: HTMLElement[],
        handles?: HTMLElement[],
        data?: any,
    },
): DraggableData|void
```

- `draggable`

    The draggable element.

- `options`

    Other options.

    - `hooks`

        Custom hooks.

        - `dragStart`

            Call when drag starts. Return `false` to prevent default behaviour.

        - `drag`

            Call on each drag move. Return `false` to prevent default behaviour.

        - `dragEnd`

            Call when drag ends.

    - `destroy`
    
        When true, remove draggable ability on the element.

    - `avoid`

        Drag will not happen on those elements.
    
    - `handles`
    
        Drag will only happen on those elements. When both avoid and handles are defined, only handles take effect.
    
    - `data`

        Data that is to be carried on data_transfer.