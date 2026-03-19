// This interface exactly mirrors what your NestJS /api/projects returns
// If the API shape changes, you update it here and TypeScript
// immediately shows you every place in the app that breaks
export interface Project {
  id:          number;
  title:       string;
  description: string;
  image:       string;
  liveUrl:     string;
  githubUrl:   string;
  skills:      string[];
}
