import {
  CheckSquare,
  Grid3x3,
  Film,
  User,
  Layout,
  BarChart3,
} from "lucide-react";

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

export const actions: QuickAction[] = [
  {
    icon: <CheckSquare size={18} />,
    label: "Todo App",
    prompt:
      "Create a modern todo app with task management, priority levels, due dates, and categories. Include features for adding, editing, deleting, and marking tasks as complete. Use a clean, intuitive interface with smooth animations.",
  },
  {
    icon: <Grid3x3 size={18} />,
    label: "Tic Tac Toe",
    prompt:
      "Create an interactive tic tac toe game with a clean UI, win detection, score tracking, and a reset button. Include smooth animations for moves and winning combinations. Add player vs player mode.",
  },
  {
    icon: <Film size={18} />,
    label: "Netflix Clone",
    prompt:
      "Create a Netflix-style streaming platform clone with a hero banner, multiple content rows, hover effects on thumbnails, video player interface, and responsive design. Include categories like Trending, Popular, and New Releases.",
  },
  {
    icon: <User size={18} />,
    label: "Portfolio Website",
    prompt:
      "Create a professional portfolio website with sections for About, Skills, Projects, Experience, and Contact. Include smooth scrolling, modern animations, project showcases with images, and a contact form. Make it fully responsive.",
  },
  {
    icon: <Layout size={18} />,
    label: "Landing Page",
    prompt:
      "Create a stunning landing page with a hero section, features showcase, testimonials, pricing section, and call-to-action buttons. Use modern design with gradients, animations, and responsive layout.",
  },
  {
    icon: <BarChart3 size={18} />,
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard with charts, graphs, statistics cards, data tables, and filters. Include metrics visualization, trend analysis, and a clean, professional layout with sidebar navigation.",
  },
];
