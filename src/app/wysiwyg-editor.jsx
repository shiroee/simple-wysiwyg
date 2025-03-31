"use client"

import { useState, useRef, useEffect } from "react"
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    LinkIcon,
    Image,
    Code,
} from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"
import * as Separator from "@radix-ui/react-separator"
import * as Tabs from "@radix-ui/react-tabs"

export default function WysiwygEditor() {
    const editorRef = useRef(null)
    const [html, setHtml] = useState("")
    const [showOutput, setShowOutput] = useState(true)

    // Update the HTML state when the content of the editor changes
    const handleInput = () => {
        if (editorRef.current) {
            setHtml(editorRef.current.innerHTML)
        }
    }

    // Check if cursor is inside a list item
    const isInsideListItem = () => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return false

        let node = selection.anchorNode

        // Traverse up the DOM tree to find if we're inside a list item
        while (node && node !== editorRef.current) {
            if (node.nodeName === "LI") {
                return true
            }
            node = node.parentNode
        }

        return false
    }

    // Handle key presses
    const handleKeyDown = (e) => {
        // If inside a list item and Enter is pressed, let the default behavior handle it
        if (e.key === "Enter" && isInsideListItem()) {
            // Don't prevent default - let the browser handle list continuation
            return true
        }

        // For non-list content, handle Enter key as before
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()

            // Insert a proper line break
            document.execCommand("insertLineBreak")

            // Alternative approach if insertLineBreak is not supported in some browsers
            if (!document.queryCommandSupported("insertLineBreak")) {
                document.execCommand("insertHTML", false, "<br><br>")
            }

            return false
        }
    }

    // Execute formatting commands
    const execCommand = (command, value = "") => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            editorRef.current.focus()
        }
    }

    // Apply Tailwind classes to lists
    const applyTailwindToLists = () => {
        if (!editorRef.current) return

        // Find all unordered lists and add Tailwind classes
        const ulLists = editorRef.current.querySelectorAll("ul")
        ulLists.forEach((ul) => {
            if (!ul.className.includes("list-disc")) {
                ul.className = "list-disc list-inside pl-5 space-y-0.5 text-base"
            }
        })

        // Find all ordered lists and add Tailwind classes
        const olLists = editorRef.current.querySelectorAll("ol")
        olLists.forEach((ol) => {
            if (!ol.className.includes("list-decimal")) {
                ol.className = "list-decimal list-inside pl-5 space-y-0.5 text-base"
            }
        })

        // Find all list items and add Tailwind classes
        // const listItems = editorRef.current.querySelectorAll("li")
        // listItems.forEach((li) => {
        //     if (!li.className.includes("py-0.5")) {
        //         li.className = "py-0.5"
        //     }
        // })

        // Update HTML state to reflect changes
        setHtml(editorRef.current.innerHTML)
    }

    // Format handlers
    const handleBold = () => execCommand("bold")
    const handleItalic = () => execCommand("italic")
    const handleUnderline = () => execCommand("underline")
    const handleHeading = (level) => execCommand("formatBlock", level)
    const handleAlign = (alignment) => execCommand("justify" + alignment)

    const handleList = (type) => {
        // Make sure we're using the correct command names
        const command = type === "Unordered" ? "insertUnorderedList" : "insertOrderedList"

        // Save selection position
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        // Execute the command
        document.execCommand(command, false)

        // Apply Tailwind classes to the newly created list
        setTimeout(() => {
            applyTailwindToLists()

            // Focus back on the editor to ensure proper cursor position
            if (editorRef.current) {
                editorRef.current.focus()
            }
        }, 0)
    }

    const handleLink = () => {
        const url = prompt("Enter URL:")
        if (url) execCommand("createLink", url)
    }

    const handleImage = () => {
        const url = prompt("Enter image URL:")
        if (url) execCommand("insertImage", url)
    }

    // Toggle HTML output view
    const toggleOutput = () => {
        setShowOutput(!showOutput)
    }

    // Initialize the editor content
    useEffect(() => {
        if (editorRef.current) {
            // Only set initial content if needed
            if (html && editorRef.current.innerHTML !== html) {
                editorRef.current.innerHTML = html
            }
            editorRef.current.focus()
        }
    }, [])

    // Apply Tailwind classes to lists when editor content changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            applyTailwindToLists()
        })

        if (editorRef.current) {
            observer.observe(editorRef.current, {
                childList: true,
                subtree: true,
                characterData: true,
            })
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    // Custom button component using Radix UI styling approach
    const IconButton = ({ icon: Icon, onClick, active, label }) => (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        type="button"
                        className={`p-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={onClick}
                        onMouseDown={(e) => e.preventDefault()}
                        aria-label={label}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        sideOffset={5}
                    >
                        {label}
                        <Tooltip.Arrow className="fill-current" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )

    return (
        <div className="w-full max-w-4xl mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white p-2 border-b border-gray-200 flex flex-wrap gap-1 items-center">
                <IconButton icon={Bold} onClick={handleBold} label="Bold" />
                <IconButton icon={Italic} onClick={handleItalic} label="Italic" />
                <IconButton icon={Underline} onClick={handleUnderline} label="Underline" />

                <Separator.Root className="mx-2 h-6 w-[1px] bg-gray-200" orientation="vertical" />

                <IconButton icon={Heading1} onClick={() => handleHeading("h1")} label="Heading 1" />
                <IconButton icon={Heading2} onClick={() => handleHeading("h2")} label="Heading 2" />

                <Separator.Root className="mx-2 h-6 w-[1px] bg-gray-200" orientation="vertical" />

                <IconButton icon={AlignLeft} onClick={() => handleAlign("Left")} label="Align Left" />
                <IconButton icon={AlignCenter} onClick={() => handleAlign("Center")} label="Align Center" />
                <IconButton icon={AlignRight} onClick={() => handleAlign("Right")} label="Align Right" />

                <Separator.Root className="mx-2 h-6 w-[1px] bg-gray-200" orientation="vertical" />

                <IconButton icon={List} onClick={() => handleList("Unordered")} label="Bullet List" />
                <IconButton icon={ListOrdered} onClick={() => handleList("Ordered")} label="Numbered List" />

                <Separator.Root className="mx-2 h-6 w-[1px] bg-gray-200" orientation="vertical" />

                <IconButton icon={LinkIcon} onClick={handleLink} label="Insert Link" />
                <IconButton icon={Image} onClick={handleImage} label="Insert Image" />

                <div className="ml-auto">
                    <IconButton icon={Code} onClick={toggleOutput} active={showOutput} label="Toggle HTML Output" />
                </div>
            </div>

            <Tabs.Root defaultValue="editor" className="w-full">
                <Tabs.List className="hidden">
                    <Tabs.Trigger value="editor">Editor</Tabs.Trigger>
                    <Tabs.Trigger value="output">Output</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="editor" className="mt-0">
                    <div
                        ref={editorRef}
                        className="min-h-[300px] p-4 focus:outline-none"
                        contentEditable={true}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                    />
                </Tabs.Content>
            </Tabs.Root>

            {showOutput && (
                <div className="border-t border-gray-200">
                    <div className="bg-gray-50 p-2">
                        <h3 className="text-sm font-medium">HTML Output</h3>
                    </div>
                    <pre className="w-full whitespace-pre-wrap p-4 bg-gray-50/50 overflow-auto text-xs max-h-[200px]">{html}</pre>
                </div>
            )}

            <div className="bg-gray-50 p-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">{html.length} characters</div>
            </div>
        </div>
    )
}

