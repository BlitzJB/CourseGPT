import React, { Dispatch, useEffect } from "react";
import { Outline } from "./types";

interface SubheadingUploadedNavigatorProps {
  outline: Outline
  setShowSubheading: Dispatch<{ topic: number, subtopic: number}>
}

export const SubheadingUploadedNavigator: React.FC<SubheadingUploadedNavigatorProps> = ({ outline, setShowSubheading }) => {
  useEffect(() => {
    setShowSubheading({ topic: 0, subtopic: 0 })
  }, [])
  
  return (
    <div className="md:w-[30%] min-h-full max-h-[90vh] overflow-scroll md:px-8 px-4 py-4 border border-neutral-600 rounded-sm md:mr-3">
      <div className="mb-3 text-2xl font-bold text-neutral-600">Course Outline</div>
      {outline.items.map((item, itemIndex) => {
        return (
          <>
            <div className="mb-4">
              <div className="mb-1 font-bold">{item.topic}</div>
              <div className="">
                {item.subtopics.map((subtopic, subtopicIndex) => {
                  return (
                    <div
                      className="px-3 py-1 mb-2 rounded-md cursor-pointer hover:bg-neutral-100"
                      onClick={(e) => setShowSubheading({ topic: itemIndex, subtopic: subtopicIndex })}
                    >
                      {subtopic.name.replaceAll("_", " ")}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};