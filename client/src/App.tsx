    import { useState } from 'react'
    import { Stage, Outline } from './components/types'
    import { stages } from './components/common'

    import { Inputs } from './components/Inputs'
    import { OutlineEdit } from './components/OutlineEdit'
    import { SubheadingPreview } from './components/SubheadingPreview'
    import { SubheadingStatus } from './components/SubheadingStatus'
import { SubheadingUploadedNavigator } from './components/SubheadingUploadedNavigator'


    function App() { 
        const [stage, setStage] = useState<Stage>(stages.WAITING_PROMPT)
        const [topic, setTopic] = useState<string>("")
        const [outline, setOutline] = useState<Outline | null>(null)
        const [showSubheading, setShowSubheading] = useState<{ topic: number, subtopic: number }>({ topic: 0, subtopic: 0 })

        return (<>
            <div className='relative px-4 md:px-10 lg:px-24'>
                <Inputs setOutline={setOutline} setStage={setStage} setTopic={setTopic} stage={stage} topic={topic} outline={outline} />
                {
                    (stage === stages.EDITING_OUTLINE && outline) && <div className='flex mt-4'>
                        <OutlineEdit outline={outline} setOutline={setOutline} />
                        <div className='w-[70%] border border-neutral-600 rounded-sm flex items-center justify-center text-neutral-400'>
                            Save the Outline after changes to begin generating
                        </div>
                    </div>
                }
                {
                    ((stage === stages.GENERATING_SECTIONS || stage === stages.DONE) && outline && <div className='flex mt-4'>
                        <SubheadingStatus outline={outline} setShowSubheading={setShowSubheading} />
                        <SubheadingPreview content={outline.items[showSubheading.topic].subtopics[showSubheading.subtopic].text} />
                    </div>)
                }
                {
                    stage === stages.UPLOADED && (<div className='flex flex-col mt-4 md:flex-row'>
                        <SubheadingUploadedNavigator outline={outline} setShowSubheading={setShowSubheading} />
                        <SubheadingPreview content={outline.items[showSubheading.topic].subtopics[showSubheading.subtopic].text} />
                    </div>)
                }
            </div>
        </>)
    }

    export default App