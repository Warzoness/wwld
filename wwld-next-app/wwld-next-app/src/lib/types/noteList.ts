interface NoteData{
    id: number;
    noteName: string;
    noteContent: string;
    storyId: number;
    description : string;
    image: string;
}

interface NoteDataPayLoad{
    id?: number;
    noteName: string;
    noteContent: string;
    storyId: number;
    description : string;
    image: string;
}