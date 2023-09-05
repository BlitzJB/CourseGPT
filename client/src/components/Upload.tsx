import JSZip from 'jszip';
import { useRef } from 'react';
import { stages } from './common';

export const Upload = ({ outline, setOutline, setStage }) => {
  const ref = useRef<HTMLInputElement>(null)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      const extractedContent = {
        items: [],
      };

      await Promise.all(
        Object.keys(zipContent.files).map(async (filename) => {
          const isDirectory = zipContent.files[filename].dir;

          if (!isDirectory) {
            const fileContent = await zipContent.files[filename].async('text');
            const topic = filename.substring(0, filename.lastIndexOf('/'));
            const subtopicName = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.md'));

            const existingTopic = extractedContent.items.find((item) => item.topic === topic);

            if (existingTopic) {
              existingTopic.subtopics.push({ name: subtopicName, text: fileContent });
            } else {
              extractedContent.items.push({
                topic,
                subtopics: [{ name: subtopicName, text: fileContent }],
              });
            }
          }
        })
      );

      setOutline(extractedContent);
      setStage(stages.UPLOADED)
    } catch (error) {
      console.error('Error extracting zip file:', error);
    }
  };

  return (
    <div>
      <input ref={ref} type="file" accept=".zip" onChange={handleFileUpload} style={{ display: 'none' }} />
      <button onClick={e => ref.current.click()} className={`h-12 px-4 font-medium transition-colors border-2 rounded-sm mr-2 border-violet-500 text-violet-800 hover:text-white hover:bg-violet-500 cursor-pointer`}>
        Import
      </button>
    </div>
  );
};
