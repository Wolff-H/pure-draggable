interface Options {
    hooks: DraggableData["hooks"];
    destroy: boolean;
    avoid: HTMLElement[];
    handles: HTMLElement[];
}
interface SimpleDraggable {
    tool_name: string;
    description: string;
    draggable_to_draggable_data_map: any;
    active_draggable: HTMLElement | null;
}
declare type DraggableToDraggableDataMap = WeakMap<HTMLElement, DraggableData>;
interface DraggableData {
    draggable: HTMLElement | null;
    mouse_start_x: number;
    mouse_start_y: number;
    draggable_start_left: number;
    draggable_start_top: number;
    hooks: {
        dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void | false;
        drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void | false;
        dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void;
    };
    avoid: HTMLElement[];
    handles: HTMLElement[];
    data_transfer?: any;
}
/**
 * Offers ability of dragging elements.
 * @todo 选项avoid改成avoids
 * @param draggable Draggable. The draggable element.
 * @param options Options.
 */
declare function simpleDraggable(draggable: HTMLElement, options?: {
    hooks?: {
        dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void | false;
        drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void | false;
        dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void;
    };
    destroy?: boolean;
    avoid?: HTMLElement[];
    handles?: HTMLElement[];
    data?: any;
}): DraggableData;
export { Options, SimpleDraggable, DraggableToDraggableDataMap, DraggableData, };
export default simpleDraggable;
