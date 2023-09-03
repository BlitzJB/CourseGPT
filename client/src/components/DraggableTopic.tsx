import { useDrag, useDrop } from "react-dnd"
import { ItemType } from "./common";

export const DraggableTopic = ({ item, itemIndex, moveItem, children }) => {
    const [, ref] = useDrag({
        type: ItemType.TOPIC,
        item: { id: itemIndex }
    });
    
    const [, drop] = useDrop({
        accept: ItemType.TOPIC,
        hover(draggedItem: any) {
            if (draggedItem.id !== itemIndex) {
                moveItem(draggedItem.id, itemIndex);
                draggedItem.id = itemIndex;
            }
        }
    });

    return <div className='px-3 py-1 mb-2 border rounded-[3px] border-neutral-500' ref={(node) => ref(drop(node))}>{children}</div>;
};