import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

export const SubheadingPreview = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            children={content}
            className={`prose min-w-[70%] md:mt-0 mt-4 max-h-[90vh] overflow-scroll border border-neutral-600 rounded-sm px-6 py-4 ${content === "Generating..." ? "flex items-center justify-center h-full w-full" : ""}`}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                    <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                    />
                    ) : (
                    <code {...props} className={className}>
                        {children}
                    </code>
                    )
                }
            }}
        />
    )
}
