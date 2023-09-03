import { useDrag, useDrop } from "react-dnd"
import { ItemType } from "./common";

export const DraggableSubtopic = ({ itemIndex, subtopicIndex, moveSubtopic, children }) => {
    const [, ref] = useDrag({
        type: ItemType.SUBTOPIC,
        item: { id: subtopicIndex, topicId: itemIndex }
    });

    const [, drop] = useDrop({
        accept: ItemType.SUBTOPIC,
        hover(draggedItem: any) {
            if (draggedItem.topicId === itemIndex && draggedItem.id !== subtopicIndex) {
                moveSubtopic(draggedItem.topicId, draggedItem.id, itemIndex, subtopicIndex);
                draggedItem.id = subtopicIndex;
            }
        }
    });

    return <div className='px-3 py-1 mb-1 ml-6 border rounded-[3px] border-neutral-500' ref={(node) => ref(drop(node))}>{children}</div>;
};