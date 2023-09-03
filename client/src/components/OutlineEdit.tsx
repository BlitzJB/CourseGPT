import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableSubtopic } from './DraggableSubtopic'
import { DraggableTopic } from './DraggableTopic'
import { EditableDraggableDiv } from './EditableDraggableDiv'

export const OutlineEdit = ({ outline, setOutline }) => {
    const handleTopicChange = (index, newTopic) => {
        const newItems = [...outline.items];
        newItems[index].topic = newTopic;
        setOutline({ items: newItems });
    }

    const handleSubtopicChange = (itemIndex, subtopicIndex, newSubtopic) => {
        const newItems = [...outline.items];
        newItems[itemIndex].subtopics[subtopicIndex] = {name: newSubtopic, text: newItems[itemIndex].subtopics[subtopicIndex].text};
        setOutline({ items: newItems });
    }

    const handleAddTopic = () => {
        const newItems = [...outline.items, { topic: 'Type Topic Name', subtopics: [] }];
        setOutline({ items: newItems });
    }

    const handleAddSubtopic = (itemIndex) => {
        const newItems = [...outline.items];
        newItems[itemIndex].subtopics.push({ name: 'Type Subtopic Name', text: 'Generating...' });
        setOutline({ items: newItems });
    }

    const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...outline.items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setOutline({ items: updatedItems });
    }

    const moveSubtopic = (fromTopicIndex, fromSubtopicIndex, toTopicIndex, toSubtopicIndex) => {
        if (fromTopicIndex !== toTopicIndex) return; // Do not move across topics for this example

        const updatedItems = [...outline.items];
        const [movedSubtopic] = updatedItems[fromTopicIndex].subtopics.splice(fromSubtopicIndex, 1);
        updatedItems[toTopicIndex].subtopics.splice(toSubtopicIndex, 0, movedSubtopic);
        setOutline({ items: updatedItems });
    };

    const handleDeleteTopic = (index) => {
        const newItems = [...outline.items];
        newItems.splice(index, 1);
        setOutline({ items: newItems });
    }

    const handleDeleteSubtopic = (itemIndex, subtopicIndex) => {
        const newItems = [...outline.items];
        newItems[itemIndex].subtopics.splice(subtopicIndex, 1);
        setOutline({ items: newItems });
    }

    return (
        <div className='w-[30%] min-h-full max-h-[90vh] overflow-y-scroll px-8 py-4 border border-neutral-600 rounded-sm mr-3'>
            <div className='mb-3 text-2xl font-bold text-neutral-600'>Course Outline</div>
            <DndProvider backend={HTML5Backend}>
                <div className='flex flex-col'>
                    {outline.items.map((item, itemIndex) => (
                        <DraggableTopic key={itemIndex} item={item} itemIndex={itemIndex} moveItem={moveItem}>
                            <div className='mb-2'>
                                <EditableDraggableDiv 
                                    value={item.topic} 
                                    onChange={(newVal) => handleTopicChange(itemIndex, newVal)}
                                    onDelete={() => handleDeleteTopic(itemIndex)}
                                />
                            </div>
                            {item.subtopics.map((subtopic, subtopicIndex) => (
                                <DraggableSubtopic 
                                    key={subtopicIndex}
                                    itemIndex={itemIndex} 
                                    subtopicIndex={subtopicIndex} 
                                    moveSubtopic={moveSubtopic}>
                                        <EditableDraggableDiv 
                                            value={subtopic.name} 
                                            onChange={(newVal) => handleSubtopicChange(itemIndex, subtopicIndex, newVal)}
                                            onDelete={() => handleDeleteSubtopic(itemIndex, subtopicIndex)}
                                        />
                                </DraggableSubtopic>
                            ))}
                            <button className="w-[calc(100%-1.5rem)] mt-1 mb-2 ml-6 border border-dashed rounded-sm border-neutral-600 py-1" onClick={() => handleAddSubtopic(itemIndex)}>Add Subheading +</button>
                        </DraggableTopic>
                    ))}
                    <button className="w-full py-1 mt-1 border border-dashed rounded-sm border-neutral-600" onClick={handleAddTopic}>Add Topic +</button>
                </div>
            </DndProvider>
        </div>
    );
}