"use client"
import { useState } from "react";
import WysiwygEditor from "./wysiwyg-editor";
import { Card } from "@radix-ui/themes";

export default function Home() {
	const [content, setContent] = useState(
		"<p>This is a <strong>WYSIWYG</strong> editor built with <em>React</em> and <u>Tailwind CSS</u>.</p>",
	);
	return (
		<main className="container mx-auto py-10 px-4">
			<Card className="max-w-3xl mx-auto">
				<div className="flex flex-col space-y-1.5 p-6">
					<div className="text-2xl font-semibold leading-none tracking-tight">WYSIWYG Editor with TailwindCSS class</div>
					<div className="text-sm text-muted-foreground">A simple rich text editor with formatting options</div>
				</div>
				<div className="p-6 pt-0 space-y-6">
					<WysiwygEditor
						initialContent={content}
						onChange={setContent}
						placeholder="Start typing..."
						className="w-full"
					/>
				</div>
			</Card>
		</main>
	);
}
