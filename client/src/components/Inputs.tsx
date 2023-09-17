import { Stage, Outline, OutlineAPIResponse } from "./types"
import { stages, convertToGeneratedOutline } from "./common"
import { BASEURL } from "./config"
import { saveAs } from 'file-saver';
import { Spinner } from "./Spinner";
import JSZip from 'jszip';
import { Upload } from "./Upload";

interface InputsProps { 
    topic: string
    setTopic: React.Dispatch<string>
    stage: Stage
    setStage: React.Dispatch<Stage>
    setOutline: React.Dispatch<Outline | null | ((prevOutline: Outline) => void)> 
    outline: Outline | null
}

export const Inputs = ({ topic, setTopic, stage, setStage, setOutline, outline }: InputsProps) => {
    const generate_outline_payload = {
        topic: topic,
        custom_instructions: ""
    }
    
    let retried = false

    const fetchOneSubheading = async (topicNumber: number, subtopicNumber: number) => {
        const generate_subheading_payload = {
            topic: topic,
            topic_number: topicNumber+1,
            subheading_number: subtopicNumber+1,
            outline: outline
        }
        const response = await fetch(`${BASEURL}/getfull`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(generate_subheading_payload)
        })
        if (response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 10000))
            return await fetchOneSubheading(topicNumber, subtopicNumber)
        }
        if (response.status === 500) {
            if (retried) alert(await response.text())
            else {
                retried = true
                return await fetchOneSubheading(topicNumber, subtopicNumber)
            }
        }
        if (response.ok) {
            return await response.json()
        }
    }
    
    const handleGenerateOutline = async (): Promise<Outline> => {
        setStage(stages.GENERATING_OUTLINE)
        const response = await fetch(`${BASEURL}/getoutline`, {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(generate_outline_payload)
        })
        if (response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 10000))
            return handleGenerateOutline()
        }
        if (response.status === 500) {
            if (retried) alert(await response.text())
            else {
                retried = true
                return handleGenerateOutline()
            }
        }
        if (response.ok) {
            const data = await response.json() as OutlineAPIResponse
            setOutline(convertToGeneratedOutline(data))
            setStage(stages.EDITING_OUTLINE)
            retried = false
        }
        
    }

    const handleGenerateSubheading = async () => {
        setStage(stages.GENERATING_SECTIONS)

        const encodedOutline = btoa(JSON.stringify(outline))
        const eventSource = new EventSource(`${BASEURL}/getcourse?outline=${encodedOutline}&topic=${topic}`)

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setOutline((prevOutline: Outline) => {
                if (!prevOutline) return null

                const newOutline = { ...prevOutline, items: [...prevOutline.items] }
                newOutline.items[data.index].subtopics[data.subindex].text = data.result

                return newOutline
            })
        }

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error)
            eventSource.close()
        }

        eventSource.onopen = () => {
            setStage(stages.DONE)
            console.log("EventSource opened")
        }
    }

    const handleDownload = async () => {
        const zip = new JSZip();

        for (const item of outline.items) {
            const folder = zip.folder(item.topic);
            item.subtopics.forEach((subtopic) => {
                const sanitizedFilename = subtopic.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') + '.md';
                folder.file(sanitizedFilename, subtopic.text);
            });
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${topic.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.zip`);
    };
    
    return <>
        <div className='flex mt-6'>
            <input placeholder='Write a course on anything' className='flex-grow h-12 px-4 mr-3 border-2 rounded-sm border-neutral-500' type="text" value={topic} onChange={e => setTopic(e.target.value)} />
            <button 
                disabled={stage === stages.WAITING_PROMPT || stage === stages.GENERATING_OUTLINE}
                title={stage === stages.WAITING_PROMPT || stage === stages.GENERATING_OUTLINE ? "Let generation complete before exporting" : "Export as zip file"}
                onClick={handleDownload}
                className={`h-12 px-4 font-medium transition-colors border-2 rounded-sm mr-2 ${stage !== stages.DONE ? "border-neutral-500 text-neutral-500": "border-violet-500 text-violet-800 hover:text-white hover:bg-violet-500 cursor-pointer"}`}
            >
                {
                    stage === stages.DONE ? "Export" : 
                    stage === stages.GENERATING_SECTIONS ? "Export Partially" :
                    "Export"
                }
            </button>
            <Upload setOutline={setOutline} outline={outline} setStage={setStage} />
            <button disabled={stage === stages.GENERATING_OUTLINE || stage === stages.GENERATING_SECTIONS} onClick={stage === stages.EDITING_OUTLINE ? handleGenerateSubheading : handleGenerateOutline} className={`h-12 pl-4 pr-3 font-medium transition-colors border-2 rounded-sm ${stage === stages.GENERATING_OUTLINE || stage === stages.GENERATING_SECTIONS ? "border-neutral-500 text-neutral-500 cursor-not-allowed" : "border-violet-500 text-violet-800 hover:text-white hover:bg-violet-500"}`}>
                {
                    stage === stages.WAITING_PROMPT ? "Generate✨" : 
                    stage === stages.GENERATING_OUTLINE ? <div className='flex items-center'><Spinner/> Working the Magic🪄</div> : 
                    stage === stages.EDITING_OUTLINE ? "Save Outline" :
                    stage === stages.GENERATING_SECTIONS ? <div className='flex items-center'><Spinner/> Working the Magic🪄</div> :
                    stage === stages.DONE ? "Go Again✨" : 
                    stage === stages.UPLOADED ? "Generate New✨": "UNKNOWN"
                }
            </button>
        </div>
    </>
}