'use client';
import { useState } from "react";
import Editor from "react-simple-wysiwyg";

export default function EditorForm({ value, onChange }) {
    const [html, setHtml] = useState("my <b>HTML</b>");
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 text-black">Simple WYSIWYG Editor</h1>
            <Editor value={html} onChange={(e)=>setHtml(e.target.value)}/>
            <div className="w-full mt-4 mb-2">
                <h1>Code Preview:</h1>
                <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full">
                    <code>{html}</code>
                </div>
            </div>
        </div>
    );
}