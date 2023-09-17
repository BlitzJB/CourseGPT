import { Outline } from "./types"

export const SubheadingStatus = ({ outline, setShowSubheading }: { outline: Outline, setShowSubheading: React.Dispatch<{ topic: number, subtopic: number }> }) => {
    return (<div className='w-[30%] min-h-full max-h-[90vh] overflow-scroll px-8 py-4 border border-neutral-600 rounded-sm mr-3'>
        <div className='mb-3 text-2xl font-bold text-neutral-600'>Course Outline</div>
        {
            outline.items.map((item, itemIndex) => {
                return <>
                    <div className='mb-4'>
                        <div className='mb-4'>{item.topic}</div>
                        <div className='pl-4 '>
                            {
                                item.subtopics.map((subtopic, subtopicIndex) => {
                                    return <div className={`py-2 px-4 mb-2 rounded-md cursor-pointer hover:bg-neutral-100 ${subtopic.text === "Generating..." ? "opacity-30 cursor-wait" : ""}`} onClick={e => setShowSubheading({ topic: itemIndex, subtopic: subtopicIndex })}>{subtopic.name}</div>
                                })
                            }
                        </div>
                    </div>
                </>
            })
        }
    </div>)
}