import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const RichTextEditor = ({ value, onChange, placeholder, singleLine = false }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      // Pass the formatted HTML back to parent state
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[${singleLine ? '38px' : '96px'}] px-3 py-2 text-slate-800 text-sm`,
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent bg-white">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-50 border-b border-slate-200 px-2 py-1 text-xs text-slate-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-slate-200 font-bold ${
            editor.isActive('bold') ? 'bg-slate-200 text-orange-600' : ''
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-slate-200 italic ${
            editor.isActive('italic') ? 'bg-slate-200 text-orange-600' : ''
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded hover:bg-slate-200 line-through ${
            editor.isActive('strike') ? 'bg-slate-200 text-orange-600' : ''
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <span className="text-slate-300 mx-0.5">|</span>

        {!singleLine && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-slate-200 ${
                editor.isActive('bulletList') ? 'bg-slate-200 text-orange-600' : ''
              }`}
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded hover:bg-slate-200 ${
                editor.isActive('orderedList') ? 'bg-slate-200 text-orange-600' : ''
              }`}
              title="Numbered List"
            >
              1. List
            </button>
          </>
        )}
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;