interface Options
{
    hooks: DraggableData["hooks"]
    destroy: boolean
    avoid: HTMLElement[]
    handles: HTMLElement[]
}

interface SimpleDraggable
{
    tool_name: string
    description: string
    draggable_to_draggable_data_map: any
    active_draggable: HTMLElement|null
}

type DraggableToDraggableDataMap = WeakMap<HTMLElement, DraggableData>

interface DraggableData
{
    draggable: HTMLElement|null
    mouse_start_x: number
    mouse_start_y: number
    draggable_start_left: number
    draggable_start_top: number
    hooks:
    {
        dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false
        drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false
        dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void
    }
    avoid: HTMLElement[]
    handles: HTMLElement[]
    data_transfer?: any
}

/**
 * ！！！TODO：可以考虑让simpleDraggable返回刚刚创建的draggable的draggable_data的引用，这样用户可以在外层设置data_transfer
 * @param draggable 拖拽物。
 * @param hooks 拖拽行为的生命周期钩子。在钩子中返回false将会阻止该行为的默认动作。
 * @param options 其他配置。传destroy为true则删除元素上的拖拽监听。
 */
function simpleDraggable(
    draggable: HTMLElement,
    options:
    {
        hooks?:
        {
            dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false,
            drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false,
            dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void,
        },
        destroy?: boolean,
        /** 拖拽行为将不会在这些元素上发生 */
        avoid?: HTMLElement[],
        /** 拖拽行为将仅会在这个元素上发生（当同时定义了avoid和handle，仅handle会生效） */
        handles?: HTMLElement[],
        /** data carried on data_transfer, the passed data will replace the entire data_transfer */
        data?: any,
    } = {},
){
    // defaults --------------------------------------------------------------------------------------------------------
    const default_options: Options =
    {
        hooks: {},
        destroy: false,
        avoid: [],
        handles: [],
    }

    if(!window.__SimpleDraggable)
    {
        window.__SimpleDraggable =
        {
            tool_name: 'simple-draggable',
            description: 'Simple draggable.',
            draggable_to_draggable_data_map: new WeakMap(),
            active_draggable: null,
        } as SimpleDraggable
    }

    const map: DraggableToDraggableDataMap = window.__SimpleDraggable.draggable_to_draggable_data_map

    // composed params -------------------------------------------------------------------------------------------------
    const _options = Object.assign({}, default_options, options)
    
    // take an action --------------------------------------------------------------------------------------------------
    // #1. destroy - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if(_options.destroy)
    {
        if(map.has(draggable))
        {
            map.delete(draggable)

            draggable.removeEventListener('mousedown', _dragStart)
        }

        return
    }
    
    // #2. create - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    if(!map.has(draggable))
    {
        map.set(
            draggable,
            {
                draggable: draggable,
                mouse_start_x: 0,
                mouse_start_y: 0,
                draggable_start_top: 0, // parseOffset(draggable.style.top),
                draggable_start_left: 0, // parseOffset(draggable.style.left),
                hooks: _options.hooks,
                avoid: _options.avoid,
                handles: _options.handles,
                ...(options.data ? { data_transfer: options.data } : {}),
            }
        )

        draggable.addEventListener('mousedown', _dragStart)

        return map.get(draggable)
    }
    // #3. update - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    else
    {
        map.set(
            draggable,
            {
                draggable: draggable,
                mouse_start_x: 0,
                mouse_start_y: 0,
                draggable_start_top: 0, // parseOffset(draggable.style.top),
                draggable_start_left: 0, // parseOffset(draggable.style.left),
                hooks: _options.hooks,
                avoid: _options.avoid,
                handles: _options.handles,
                ...(options.data ? { data_transfer: options.data } : {}),
            }
        )
    }
}

function parseOffset(style_offset_string: string)
{
    return parseInt(style_offset_string) || 0
}

function _dragStart(this: HTMLElement, event: MouseEvent)
{
    const draggable = this
    const map: DraggableToDraggableDataMap = window.__SimpleDraggable.draggable_to_draggable_data_map
    const draggable_data = map.get(draggable)!

    // 检查是否通过handles或avoid //
    if(
        (draggable_data.handles.length > 0 && !draggable_data.handles.includes(event.target as HTMLElement)) ||
        (draggable_data.avoid.length > 0 && draggable_data.avoid.includes(event.target as HTMLElement))
    ){
        return
    }
    
    // 调用自定义hook //
    if(draggable_data.hooks?.dragStart && draggable_data.hooks?.dragStart(event, draggable, draggable_data) === false) return

    
    
    // 默认动作： //
    // 设置draggable的初始状态 //
    draggable_data.draggable_start_top = parseOffset(draggable.style.top)
    draggable_data.draggable_start_left = parseOffset(draggable.style.left)

    draggable_data.mouse_start_x = event.clientX
    draggable_data.mouse_start_y = event.clientY
    
    window.__SimpleDraggable.active_draggable = draggable    // !!! 这个可能需要放到自定义hook前面去
    
    // 设置后续动作监听器 //
    document.addEventListener('mousemove', _drag)
    document.addEventListener('mouseup', _dragEnd)
}

function _drag(event: MouseEvent)
{
    const draggable = window.__SimpleDraggable.active_draggable as HTMLElement
    const map: DraggableToDraggableDataMap = window.__SimpleDraggable.draggable_to_draggable_data_map
    const draggable_data = map.get(draggable)!

    // 调用自定义hook //
    if(draggable_data.hooks?.drag && draggable_data.hooks?.drag(event, draggable, draggable_data) === false) return

    // 默认动作：移动拖拽物 //
    draggable.style.top = draggable_data.draggable_start_top + (event.clientY - draggable_data.mouse_start_y) + 'px'
    draggable.style.left = draggable_data.draggable_start_left + (event.clientX - draggable_data.mouse_start_x) + 'px'
}

function _dragEnd(event: MouseEvent)
{
    const draggable = window.__SimpleDraggable.active_draggable as HTMLElement
    const map: DraggableToDraggableDataMap = window.__SimpleDraggable.draggable_to_draggable_data_map
    const draggable_data = map.get(draggable)!

    // 默认动作：移除动作监听器 //
    document.removeEventListener('mousemove', _drag)
    document.removeEventListener('mouseup', _dragEnd)

    // 在最后，调用自定义hook //
    if(draggable_data.hooks.dragEnd)
    {
        draggable_data.hooks.dragEnd(event, draggable, draggable_data)
    }
}



export
{
    Options,
    SimpleDraggable,
    DraggableToDraggableDataMap,
    DraggableData,
}

export default simpleDraggable