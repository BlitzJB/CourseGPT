import { OutlineAPIResponse, Outline } from "./types";

export const ItemType = {
    TOPIC: 'topic',
    SUBTOPIC: 'subtopic'
};

export const convertToGeneratedOutline = (outline: OutlineAPIResponse): Outline => {
    return {
        items: outline.items.map(item => ({
            topic: item.topic,
            subtopics: item.subtopics.map(subtopic => ({
                name: subtopic,
                text: "Generating..."
            }))
        }))
    };
};

export const stages = {
    WAITING_PROMPT: "WAITING_PROMPT",
    GENERATING_OUTLINE: "GENERATING_OUTLINE",
    EDITING_OUTLINE: "EDITING_OUTLINE",
    GENERATING_SECTIONS: "GENERATING_SECTIONS",
    DONE: "DONE",
    UPLOADED: "UPLOADED"
} as const