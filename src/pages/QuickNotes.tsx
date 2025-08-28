import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Download, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteTitle(note.title);
      setNoteContent(note.content);
    } else {
      setEditingNote(null);
      setNoteTitle('');
      setNoteContent('');
    }
    setIsDialogOpen(true);
  };

  const saveNote = () => {
    if (noteTitle.trim() || noteContent.trim()) {
      const now = new Date().toISOString();
      
      if (editingNote) {
        // Update existing note
        setNotes(notes.map(note =>
          note.id === editingNote.id
            ? { ...note, title: noteTitle || 'Untitled', content: noteContent, updatedAt: now }
            : note
        ));
      } else {
        // Create new note
        const newNote: Note = {
          id: Date.now().toString(),
          title: noteTitle || 'Untitled',
          content: noteContent,
          createdAt: now,
          updatedAt: now,
        };
        setNotes([newNote, ...notes]);
      }
      
      setNoteTitle('');
      setNoteContent('');
      setEditingNote(null);
      setIsDialogOpen(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const exportNotes = () => {
    const exportData = notes.map(note => 
      `Title: ${note.title}\nContent: ${note.content}\nCreated: ${new Date(note.createdAt).toLocaleString()}\n${'='.repeat(50)}\n`
    ).join('\n');
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 pb-24">
      <div className="max-w-sm mx-auto">
        <header className="text-center mb-6 mt-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Quick Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts instantly</p>
        </header>

        {/* Search Bar */}
        <Card className="app-card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </Card>

        {/* Export Button */}
        {notes.length > 0 && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={exportNotes}
              variant="outline"
              className="rounded-full flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All Notes
            </Button>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3 mb-6">
          {filteredNotes.map((note, index) => (
            <Card
              key={note.id}
              className="app-card cursor-pointer hover:scale-[1.02] transition-all slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openDialog(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground flex-1">{note.title}</h4>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDialog(note);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {note.content}
              </p>
              <div className="text-xs text-muted-foreground">
                {formatDate(note.updatedAt)}
              </div>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="app-card text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No notes found' : 'Start Taking Notes!'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try a different search term'
                : 'Tap the + button to create your first note'
              }
            </p>
          </Card>
        )}

        {/* Add/Edit Note Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="floating-action" onClick={() => openDialog()}>
              <Plus className="w-6 h-6 text-primary-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="app-card max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                {editingNote ? 'Edit Note' : 'New Note'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="rounded-full"
              />
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[120px] rounded-xl resize-none"
              />
              <Button onClick={saveNote} className="gradient-button w-full">
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuickNotes;