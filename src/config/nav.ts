import type { LucideIcon } from 'lucide-react';
import {
  Home,
  ClipboardList,
  FileText,
  PlayCircle,
  Brain,
  BarChart3,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  authRequired?: boolean; // To distinguish between public and private routes
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    authRequired: true,
  },
  {
    title: 'Test Cases',
    href: '/test-cases',
    icon: ClipboardList,
    authRequired: true,
  },
  {
    title: 'Test Plans',
    href: '/test-plans',
    icon: FileText,
    authRequired: true,
  },
  {
    title: 'Test Execution',
    href: '/test-execution',
    icon: PlayCircle,
    authRequired: true,
  },
  {
    title: 'AI Suggestions',
    href: '/ai-suggestions',
    icon: Brain,
    authRequired: true,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    authRequired: true,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    authRequired: true,
  },
];

export const authNavItems: NavItem[] = [
  {
    title: 'Login',
    href: '/login',
    icon: LogIn,
  },
  {
    title: 'Register',
    href: '/register',
    icon: UserPlus,
  },
];
