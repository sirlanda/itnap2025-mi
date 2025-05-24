'use client';
import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems, authNavItems } from '@/config/nav'; // Assuming authNavItems for login/register for unauth state
import { LogOut, Settings as SettingsIcon, UserCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock auth state - in a real app, this would come from an auth provider
const useAuth = () => ({ isAuthenticated: true, user: { username: 'john.doe', email: 'john.doe@example.com' } });


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const currentNavItems = isAuthenticated ? navItems : authNavItems;
  const router = useRouter();

  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
        if (e.code === "KeyC") {
          e.preventDefault();
          router.push("/test-cases");
        } else if (e.code === "KeyP") {
          e.preventDefault();
          router.push("/test-plans");
        } else if (e.code === "KeyX") {
          e.preventDefault();
          router.push("/test-execution");
        }
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [router]);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="icon"
        className="border-r border-sidebar-border shadow-md"
      >
        <SidebarHeader className="p-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span className="text-xl font-semibold text-sidebar-foreground">TestFlow</span>
          </Link>
          <Link href="/" className="items-center gap-2 hidden group-data-[collapsible=icon]:flex">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {currentNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {isAuthenticated && (
          <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt={user.username} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium text-sidebar-foreground">{user.username}</span>
                    <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem > {/*onClick={() => alert('Logout clicked')} */}
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        )}
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6 shadow-sm">
          <SidebarTrigger className="text-foreground hover:bg-accent/50" />
          <h1 className="text-lg font-semibold text-foreground">TestFlow</h1>
          {/* Additional header content can go here, e.g., search bar or quick actions */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
         <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TestFlow. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
