// Mock conversation data for the ChatPage
export const mockConversation = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    content: 'I need to extract text from a PDF document. Can you help me with that?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: '3',
    content: 'Absolutely! I can help you extract text from PDF documents. You can upload your PDF using the attachment button, and I\'ll process it for you. Alternatively, you can use the !document command followed by the path to your PDF file.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: '4',
    content: 'Great! What other features do you have?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: '5',
    content: 'I have several capabilities:\n\n1. **Document Processing**: I can extract text from PDFs and images using OCR.\n\n2. **Memory Management**: I can remember important information for future reference.\n\n3. **Vector Search**: I can perform semantic searches to find relevant information.\n\n4. **User Information**: I can track and store details about you to provide personalized assistance.\n\nYou can use commands like !memory, !document, and !model to access these features.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3200000).toISOString(),
  },
];

// Mock documents data for the DocumentsPage
export const mockDocuments = [
  {
    id: '1',
    name: 'project_proposal.pdf',
    type: 'pdf',
    size: 2500000,
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    content: 'This is a sample project proposal document that outlines the key objectives, timeline, and budget for the AI integration project. The document includes sections on background research, methodology, expected outcomes, and potential challenges.',
  },
  {
    id: '2',
    name: 'meeting_notes.docx',
    type: 'document',
    size: 150000,
    uploadDate: new Date(Date.now() - 172800000).toISOString(),
    content: 'Meeting Notes - AI Project Kickoff\n\nDate: January 15, 2023\nAttendees: John, Sarah, Michael, Lisa\n\nAgenda Items:\n1. Project overview and goals\n2. Team roles and responsibilities\n3. Timeline and milestones\n4. Next steps\n\nAction Items:\n- John: Prepare technical requirements document\n- Sarah: Research existing solutions\n- Michael: Set up development environment\n- Lisa: Create project management plan',
  },
  {
    id: '3',
    name: 'data_analysis.png',
    type: 'image',
    size: 750000,
    uploadDate: new Date(Date.now() - 259200000).toISOString(),
    content: '[This is an image containing a data analysis chart showing performance metrics over time]',
  },
  {
    id: '4',
    name: 'research_paper.pdf',
    type: 'pdf',
    size: 3200000,
    uploadDate: new Date(Date.now() - 345600000).toISOString(),
    content: 'Abstract: This research paper explores the latest advancements in natural language processing and their applications in conversational AI systems. The study examines various approaches to improving context understanding, memory retention, and knowledge integration in AI assistants.',
  },
];

// Mock memories data for the MemoriesPage
export const mockMemories = [
  {
    id: '1',
    content: 'User prefers to be addressed as Alex rather than Alexander.',
    tags: ['preferences', 'personal'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: '2',
    content: 'Project deadline is May 15th, 2023. The final deliverables include a working prototype and documentation.',
    tags: ['project', 'deadline'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '3',
    content: 'User is allergic to peanuts and has mentioned this in the context of recipe recommendations.',
    tags: ['health', 'preferences', 'important'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    content: 'The company uses Python 3.9 for backend development and React 18 for frontend. All new code should follow these standards.',
    tags: ['technical', 'standards'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '5',
    content: 'Weekly team meetings are held every Monday at 10:00 AM EST via Zoom.',
    tags: ['schedule', 'meetings'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Mock tags for the MemoriesPage
export const mockTags = [
  'personal',
  'preferences',
  'project',
  'deadline',
  'health',
  'important',
  'technical',
  'standards',
  'schedule',
  'meetings',
];
