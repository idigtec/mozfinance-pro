
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Note, NoteColor, ChecklistItem } from '../types';
import { 
    Plus, Pin, X, CheckSquare, Image as ImageIcon, Palette, Trash2, Search, Lightbulb, Briefcase, User, FileText, Paperclip
} from 'lucide-react';

const COLORS: { [key in NoteColor]: string } = {
  white: 'bg-white border-gray-200',
  red: 'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  green: 'bg-green-50 border-green-200',
  teal: 'bg-teal-50 border-teal-200',
  blue: 'bg-blue-50 border-blue-200',
  darkblue: 'bg-indigo-50 border-indigo-200',
  purple: 'bg-purple-50 border-purple-200',
  pink: 'bg-pink-50 border-pink-200',
  brown: 'bg-stone-100 border-stone-300',
  gray: 'bg-gray-100 border-gray-200'
};

// Mock Categories for demonstration as they are not in the core Type yet,
// In a real scenario we would add 'category' to the Note type.
// For now, we will simulate filtering/tagging if tags contain these keywords.
const CATEGORIES = [
    { id: 'ALL', label: 'Todas', icon: FileText },
    { id: 'IDEA', label: 'Ideias', icon: Lightbulb },
    { id: 'WORK', label: 'Trabalho', icon: Briefcase },
    { id: 'PERSONAL', label: 'Pessoal', icon: User }
];

export const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useFinance();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Filter Logic
  const filteredNotes = notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
          (n.content && n.content.toLowerCase().includes(search.toLowerCase())) ||
          (n.items && n.items.some(i => i.text.toLowerCase().includes(search.toLowerCase())));
      
      let matchesCat = true;
      if (filterCat !== 'ALL') {
          // Check tags for category simulation
          const tag = filterCat === 'IDEA' ? 'ideia' : filterCat === 'WORK' ? 'trabalho' : 'pessoal';
          matchesCat = n.tags.some(t => t.toLowerCase() === tag);
      }

      return matchesSearch && matchesCat;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const handleCreate = (preSetTag?: string) => {
      setEditingNote(preSetTag ? { tags: [preSetTag] } as any : null);
      setIsModalOpen(true);
  };

  const handleEdit = (note: Note) => {
      setEditingNote(note);
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Notas & Ideias</h2>
            <p className="text-gray-600 text-sm">Organize pensamentos, projetos e listas</p>
         </div>
         <button 
           onClick={() => handleCreate()}
           className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-emerald-700 transition flex items-center space-x-2"
         >
             <Plus className="h-5 w-5" />
             <span>Criar Nota</span>
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-48 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                        filterCat === cat.id 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                  </button>
              ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Pesquisar notas..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 shadow-sm placeholder-gray-400 font-medium"
                />
            </div>

            <div className="space-y-8">
                {pinnedNotes.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-1"><Pin className="h-3 w-3" /> Fixadas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pinnedNotes.map(note => <NoteCard key={note.id} note={note} onEdit={handleEdit} />)}
                        </div>
                    </div>
                )}

                <div>
                    {pinnedNotes.length > 0 && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Outras</h3>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {otherNotes.map(note => <NoteCard key={note.id} note={note} onEdit={handleEdit} />)}
                        
                        {/* Quick Add Idea Card */}
                        <div 
                            onClick={() => handleCreate('ideia')}
                            className="rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition cursor-pointer min-h-[160px]"
                        >
                            <Lightbulb className="h-8 w-8 mb-2" />
                            <span className="font-bold text-sm">Nova Ideia Rápida</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialNote={editingNote} 
        onSave={(n) => {
            // Fix: Cast Partial<Note> to the expected type for updateNote and addNote
            if(editingNote && editingNote.id) updateNote(n as Note);
            else addNote(n as Omit<Note, 'id' | 'createdAt'>);
            setIsModalOpen(false);
        }}
        onDelete={(id) => {
            if (confirm("Apagar esta nota?")) {
                deleteNote(id);
                setIsModalOpen(false);
            }
        }}
      />
    </div>
  );
};

interface NoteCardProps {
    note: Note;
    onEdit: (n: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
    return (
        <div 
           onClick={() => onEdit(note)}
           className={`rounded-xl border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group flex flex-col h-full min-h-[180px] ${COLORS[note.color]}`}
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 line-clamp-1 text-lg">{note.title || 'Sem título'}</h4>
                {note.isPinned && <Pin className="h-4 w-4 text-slate-700 fill-current flex-shrink-0" />}
            </div>
            
            <div className="text-sm text-gray-800 flex-1 overflow-hidden">
                {note.type === 'TEXT' ? (
                    <p className="whitespace-pre-wrap line-clamp-6 font-medium leading-relaxed">{note.content}</p>
                ) : (
                    <div className="space-y-1.5">
                        {note.items?.slice(0, 5).map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${item.isChecked ? 'bg-gray-500 border-gray-500' : 'border-gray-400'}`}>
                                    {item.isChecked && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className={`font-medium ${item.isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>{item.text}</span>
                            </div>
                        ))}
                        {(note.items?.length || 0) > 5 && <p className="text-xs text-gray-500 italic font-bold">+{ (note.items?.length || 0) - 5 } itens</p>}
                    </div>
                )}
            </div>
            
            {/* Visual Attachment Placeholder */}
            {note.content?.includes('[imagem]') && (
                <div className="mt-2 h-20 bg-black/5 rounded-lg flex items-center justify-center text-gray-500">
                    <ImageIcon className="h-6 w-6 opacity-50" />
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-1 justify-between items-end">
                <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/5 rounded-full text-gray-700 font-bold uppercase tracking-wide">#{tag}</span>
                    ))}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                    {new Date(note.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialNote: Note | null;
    onSave: (note: Partial<Note>) => void;
    onDelete: (id: string) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, initialNote, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [type, setType] = useState<'TEXT' | 'CHECKLIST'>('TEXT');
    const [color, setColor] = useState<NoteColor>('white');
    const [isPinned, setIsPinned] = useState(false);
    const [reminder, setReminder] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Load initial state
    React.useEffect(() => {
        if (isOpen) {
            setTitle(initialNote?.title || '');
            setContent(initialNote?.content || '');
            setItems(initialNote?.items || []);
            setType(initialNote?.type || 'TEXT');
            setColor(initialNote?.color || 'white');
            setIsPinned(initialNote?.isPinned || false);
            setReminder(initialNote?.reminder || '');
            setTags(initialNote?.tags || []);
        }
    }, [isOpen, initialNote]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            id: initialNote?.id, // undefined if new
            title,
            type,
            content: type === 'TEXT' ? content : undefined,
            items: type === 'CHECKLIST' ? items : undefined,
            color,
            isPinned,
            tags, 
            reminder: reminder || undefined,
            createdAt: initialNote?.createdAt || new Date().toISOString()
        });
    };

    const toggleCheckItem = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, isChecked: !i.isChecked } : i));
    };

    const addCheckItem = (text: string) => {
        if(!text.trim()) return;
        setItems([...items, { id: Date.now().toString(), text, isChecked: false }]);
    };
    
    const addTag = () => {
        if(newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${COLORS[color]}`} onClick={e => e.stopPropagation()}>
                <div className="p-6 flex flex-col h-full">
                    
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
                        <input 
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                           placeholder="Título da Nota"
                           className="text-xl font-black bg-transparent border-none outline-none placeholder-gray-500 w-full text-gray-900"
                        />
                        <button onClick={() => setIsPinned(!isPinned)} className={`ml-2 p-2 rounded-full hover:bg-black/10 transition ${isPinned ? 'text-slate-900 bg-white/50' : 'text-gray-400'}`}>
                            <Pin className={`h-5 w-5 ${isPinned ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto min-h-[200px] mb-4">
                        {type === 'TEXT' ? (
                            <textarea 
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Comece a escrever..."
                                className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-800 text-lg leading-relaxed font-medium"
                            />
                        ) : (
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 group">
                                        <button onClick={() => toggleCheckItem(item.id)} className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${item.isChecked ? 'bg-gray-600 border-gray-600' : 'border-gray-400'}`}>
                                             {item.isChecked && <CheckSquare className="h-4 w-4 text-white" />}
                                        </button>
                                        <input 
                                           value={item.text}
                                           onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, text: e.target.value } : i))}
                                           className={`flex-1 bg-transparent border-b border-transparent focus:border-black/10 px-2 py-1 outline-none text-lg ${item.isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}
                                        />
                                        <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 mt-2 opacity-60 focus-within:opacity-100">
                                    <Plus className="h-6 w-6 text-gray-500" />
                                    <input 
                                        placeholder="Adicionar item"
                                        className="flex-1 bg-transparent border-none outline-none text-lg"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addCheckItem(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Tags Input */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded-md text-xs font-bold text-gray-700 uppercase">
                                #{tag}
                                <button onClick={() => setTags(tags.filter(t => t !== tag))}><X className="h-3 w-3" /></button>
                            </span>
                        ))}
                        <input 
                            placeholder="# Adicionar Tag..." 
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => {
                                if(e.key === 'Enter') addTag();
                            }}
                            className="bg-transparent text-xs font-medium outline-none text-gray-600 w-32"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-black/10 relative">
                         <div className="flex items-center gap-2">
                             <div className="relative">
                                 <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 hover:bg-black/10 rounded-full" title="Cor">
                                     <Palette className="h-5 w-5 text-gray-700" />
                                 </button>
                                 {showColorPicker && (
                                     <div className="absolute bottom-12 left-0 bg-white shadow-2xl rounded-xl p-3 grid grid-cols-4 gap-2 z-50 w-56 border border-gray-100">
                                         {Object.keys(COLORS).map((c) => (
                                             <button 
                                                key={c} 
                                                className={`w-10 h-10 rounded-full border-2 ${COLORS[c as NoteColor].split(' ')[0]} ${color === c ? 'border-slate-800' : 'border-gray-200'}`}
                                                onClick={() => { setColor(c as NoteColor); setShowColorPicker(false); }}
                                             />
                                         ))}
                                     </div>
                                 )}
                             </div>
                             <button onClick={() => setType(type === 'TEXT' ? 'CHECKLIST' : 'TEXT')} className="p-2 hover:bg-black/10 rounded-full" title="Alternar Checkbox">
                                 {type === 'TEXT' ? <CheckSquare className="h-5 w-5 text-gray-700" /> : <FileText className="h-5 w-5 text-gray-700" />}
                             </button>
                             
                             {/* Mock Attachments */}
                             <button className="p-2 hover:bg-black/10 rounded-full text-gray-500 hover:text-gray-700" title="Anexar Imagem (Demo)">
                                 <ImageIcon className="h-5 w-5" />
                             </button>
                             <button className="p-2 hover:bg-black/10 rounded-full text-gray-500 hover:text-gray-700" title="Anexar Arquivo (Demo)">
                                 <Paperclip className="h-5 w-5" />
                             </button>

                             <div className="ml-2 flex items-center gap-1 border-l border-black/10 pl-2">
                                 <input 
                                    type="datetime-local" 
                                    value={reminder ? reminder.slice(0, 16) : ''} 
                                    onChange={e => setReminder(e.target.value)} 
                                    className="bg-white/50 border border-gray-300 rounded px-2 py-1 text-xs w-36 cursor-pointer font-medium"
                                 />
                             </div>
                         </div>

                         <div className="flex items-center gap-3">
                             {initialNote && (
                                 <button onClick={() => onDelete(initialNote.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-full">
                                     <Trash2 className="h-5 w-5" />
                                 </button>
                             )}
                             <button onClick={handleSave} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold shadow hover:bg-slate-800 flex items-center gap-2">
                                 <span className="hidden sm:inline">Salvar Nota</span>
                                 <span className="sm:hidden">Salvar</span>
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
