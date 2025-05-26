import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Code,
  ListOrdered,
  List,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  Eye,
} from 'lucide-react';
import { uploadImageToCloudinary } from '@/utils/cloudinary';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
}

// Stil sınıfları için sabit
const editorClasses = 'prose prose-sm sm:prose lg:prose-lg prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-sm prose-p:my-3 prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-img:rounded-md prose-img:mx-auto focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-0';

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className = '',
  placeholder = 'Write your content here...',
}) => {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'code'>('edit');
  const [htmlContent, setHtmlContent] = useState(content);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Update htmlContent when content prop changes
  useEffect(() => {
    setHtmlContent(content);
  }, [content]);

  // Initialize editor with initial content
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-3',
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'font-bold mt-4 mb-2',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'pl-5 mb-4 list-disc space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'pl-5 mb-4 list-decimal space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full mb-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setHtmlContent(html);
    },
    editorProps: {
      attributes: {
        class: editorClasses + ' outline-none border-none ring-0 ring-offset-0',
        placeholder,
        spellcheck: 'false',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editor content when html content changes in code view
  useEffect(() => {
    if (viewMode === 'edit' && editor && htmlContent !== editor.getHTML()) {
      editor.commands.setContent(htmlContent);
    }
  }, [viewMode, htmlContent, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      
      setImageUrl(imageUrl);
      
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  const insertImage = () => {
    if (editor && imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: 'Blog image' })
        .run();
      
      setImageUrl('');
      setIsImageMenuOpen(false);
    }
  };

  const insertLink = () => {
    if (editor && linkUrl) {
      // Check if URL has protocol
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
      
      setLinkUrl('');
      setIsLinkMenuOpen(false);
    }
  };

  const removeLink = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run();
    }
  };

  const setColor = (color: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setColor(color)
        .run();
      
      setSelectedColor(color);
    }
  };

  // Fonksiyon ekleyelim: HTML'i görsel olarak daha güzel formatlayalım
  const formatHtml = (html: string): string => {
    // Basit bir şekilde HTML'i daha okunabilir hale getirelim
    let formatted = html
      .replace(/></g, '>\n<') // Her tag'ı yeni satıra geçir
      .replace(/<\/([^>]+)>/g, '</$1>\n') // Kapanış tag'larından sonra yeni satır
      .replace(/<([^\/][^>]+)>/g, '\n<$1>') // Açılış tag'larından önce yeni satır
      .replace(/\n\s*\n/g, '\n'); // Fazla boş satırları temizle
    
    // Girintileri ekleyelim
    let indentLevel = 0;
    const lines = formatted.split('\n');
    formatted = lines.map(line => {
      line = line.trim();
      if (!line) return line;
      
      // Kapanış tag'ı ise girinti azalt
      if (line.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Mevcut girinti seviyesine göre boşluk ekle
      const indent = '  '.repeat(indentLevel);
      const result = indent + line;
      
      // Açılış tag'ı ise (kapanışı aynı satırda değilse) girinti arttır
      if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.includes('</')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
    
    return formatted;
  };

  // HTML içerik değiştiğinde formatlayalım
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    onChange(newHtml);
  };

  // HTML kod editörüne geçerken formatla
  const switchToCodeView = () => {
    if (viewMode !== 'code') {
      const formattedHtml = editor ? formatHtml(editor.getHTML()) : htmlContent;
      setHtmlContent(formattedHtml);
      setViewMode('code');
    }
  };

  // Focus the editor on mount
  useEffect(() => {
    setTimeout(() => {
      editor?.commands.focus('end');
    }, 100);
  }, [editor]);

  // To avoid issues with menu popping up when creating links or images
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLinkMenuOpen && linkInputRef.current && !linkInputRef.current.contains(event.target as Node)) {
        setIsLinkMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkMenuOpen]);

  const colorOptions = [
    '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', 
    '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', 
    '#f2f2f2', '#ffffff', '#ff0000', '#ff9900', '#ffff00', 
    '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
  ];

  if (!editor) {
    return null;
  }

  return (
    <div className={`rounded-md ${className}`}>
      <div className="flex flex-col border-b bg-gray-50">
        {/* Text formatting toolbar - First row */}
        <div className="flex flex-wrap gap-1 p-2 border-b">
          <div className="flex gap-1 items-center mr-2">
            <Button
              size="icon"
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              type="button"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              type="button"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('underline') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              type="button"
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('code') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleCode().run()}
              type="button"
              title="Code"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 items-center mr-2">
            <Button
              size="icon"
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              type="button"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              type="button"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              type="button"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              type="button"
              title="Align Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 items-center mr-2">
            <div className="relative group">
              <Button
                size="icon"
                variant="outline"
                onClick={() => {}}
                onMouseOver={() => setSelectedColor(editor.getAttributes('textStyle').color || '#000000')}
                type="button"
                title="Text Color"
              >
                <Palette className="h-4 w-4" style={{ color: selectedColor }} />
              </Button>
              <div className="absolute hidden group-hover:flex top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-md z-10 flex-wrap gap-1 max-w-[220px]">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className="w-5 h-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: color }}
                    onClick={() => setColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Structure formatting toolbar - Second row */}
        <div className="flex flex-wrap gap-1 p-2">
          <div className="flex gap-1 items-center mr-2">
            <Button
              size="icon"
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              type="button"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              type="button"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              type="button"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 items-center mr-2">
            <Button
              size="icon"
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              type="button"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              type="button"
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 items-center mr-2">
            <div className="relative">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsLinkMenuOpen(!isLinkMenuOpen)}
                type="button"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              {isLinkMenuOpen && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-md z-10 flex gap-2 items-center min-w-[250px]" ref={linkInputRef}>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full"
                    onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                  />
                  <Button size="sm" onClick={insertLink} type="button" disabled={!linkUrl}>
                    Add
                  </Button>
                </div>
              )}
            </div>
            {editor.isActive('link') && (
              <Button
                size="icon"
                variant="outline"
                onClick={removeLink}
                type="button"
                title="Remove Link"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-1 items-center">
            <div className="relative">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsImageMenuOpen(!isImageMenuOpen)}
                type="button"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              {isImageMenuOpen && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-md z-10 flex flex-col gap-2 min-w-[300px]">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium">Image URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full"
                        onKeyDown={(e) => e.key === 'Enter' && insertImage()}
                      />
                      <Button size="sm" onClick={insertImage} type="button" disabled={!imageUrl}>
                        Insert
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium">Upload Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    {!isUploading && !imageUrl && (
                      <Button 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()} 
                        type="button" 
                        className="w-full"
                      >
                        Choose Image
                      </Button>
                    )}
                    
                    {isUploading && (
                      <div className="flex items-center justify-center p-2 bg-gray-50 rounded border">
                        <div className="animate-pulse text-sm">Uploading...</div>
                      </div>
                    )}
                    
                    {imageUrl && (
                      <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-medium">Image Preview</label>
                          <div className="relative aspect-video border rounded overflow-hidden bg-gray-50">
                            <img 
                              src={imageUrl} 
                              alt="Image preview" 
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-medium">Cloudinary URL</label>
                          <Input 
                            value={imageUrl} 
                            readOnly 
                            className="text-xs bg-gray-50"
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                          />
                        </div>
                        
                        <div className="flex justify-between gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setImageUrl("");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            type="button"
                          >
                            Clear
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={insertImage} 
                            type="button"
                          >
                            Insert Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Third row - View mode toggle */}
        <div className="flex flex-wrap gap-1 p-2 border-t">
          <div className="flex gap-1 items-center">
            <div className="border rounded-md overflow-hidden flex shadow-sm">
              <Button
                size="sm"
                variant={viewMode === 'edit' ? "default" : "ghost"}
                onClick={() => setViewMode('edit')}
                type="button"
                className="rounded-none border-0 py-1 px-3 h-8"
              >
                <Eye className="h-4 w-4 mr-1" />
                Görsel Editör
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                size="sm"
                variant={viewMode === 'code' ? "default" : "ghost"}
                onClick={switchToCodeView}
                type="button"
                className="rounded-none border-0 py-1 px-3 h-8"
              >
                <Code className="h-4 w-4 mr-1" />
                HTML Kodu
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'edit' && (
        <div className="relative border-0 outline-none">
          <EditorContent 
            editor={editor} 
            className={`editor-content ${editorClasses} focus-visible:outline-none focus-visible:ring-0 border-0`}
          />
          {!editor?.getText() && (
            <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      )}

      {viewMode === 'code' && (
        <div className="relative border-0">
          <Textarea 
            value={htmlContent}
            onChange={handleHtmlChange}
            className="min-h-[400px] max-h-full font-mono p-4 w-full border-0 focus-visible:ring-0 focus-visible:outline-none whitespace-pre-wrap text-sm"
            placeholder="HTML kodunu buraya girin..."
          />
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white"
              onClick={() => {
                if (editor) {
                  const formattedHtml = formatHtml(editor.getHTML());
                  setHtmlContent(formattedHtml);
                }
              }}
            >
              HTML Düzenle
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Root element */
        .tiptap {
          outline: none !important;
          border: none !important;
        }
        
        /* Editor content */
        .editor-content {
          min-height: 300px;
          padding: 1rem;
          overflow-y: auto;
          outline: none !important;
          border: none !important;
        }
        
        /* Tiptap ProseMirror sınıfına odaklanma */
        .ProseMirror {
          outline: none !important;
          border: none !important;
          outline-color: transparent !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
        
        .ProseMirror:focus,
        .ProseMirror:focus-visible,
        .ProseMirror-focused {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          --tw-ring-color: transparent !important;
          --tw-ring-offset-width: 0 !important;
          --tw-ring-offset-color: transparent !important;
          --tw-ring-width: 0 !important;
          --tw-ring-inset: 0 !important;
        }
        
        /* Tüm düzenlenebilir elementler */
        .editor-content:focus,
        .editor-content:focus-visible,
        .editor-content [contenteditable]:focus,
        .editor-content [contenteditable]:focus-visible,
        .editor-content *:focus,
        .editor-content *:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
          border-color: transparent !important;
          --tw-ring-color: transparent !important;
          --tw-ring-offset-width: 0 !important;
          --tw-ring-offset-color: transparent !important;
          --tw-ring-width: 0 !important;
          --tw-ring-inset: 0 !important;
        }
        
        .editor-content [contenteditable] {
          outline: none !important;
          caret-color: #000;
        }
        
        /* Kırmızı sınırı gösteren tüm elementleri hedefle */
        *:focus-visible {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          ring: 0 !important;
          ring-offset: 0 !important;
        }
        
        /* Tiptap editor içindeki her elemana odaklandığında */
        [data-tippy-root], 
        [contenteditable="true"],
        [contenteditable="true"]:focus,
        [contenteditable="true"]:focus-visible {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
        
        .editor-content h1, .editor-content h2, .editor-content h3, 
        .editor-content h4, .editor-content h5, .editor-content h6 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .editor-content p {
          margin-bottom: 0.75rem;
        }
        
        .editor-content ul, .editor-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .editor-content ul {
          list-style-type: disc;
        }
        
        .editor-content ol {
          list-style-type: decimal;
        }
        
        .editor-content li {
          margin-bottom: 0.25rem;
        }
        
        .editor-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem auto;
        }
        
        .editor-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        
        .editor-content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .editor-content code {
          font-family: monospace;
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 