// dashboard-layout.tsx
import {
  Menu,
  Home,
  Wallet,
  Receipt,
  LogOut,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  PiggyBank
} from 'lucide-react';
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import logo from '@/assets/react.svg';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { paths } from '@/config/paths';
import { useAuth } from '@/lib/auth';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown';
import { useDisclosure } from '@/hooks/use-disclosure';

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  submenu?: Array<{
    to: string;
    label: string;
  }>;
};

const SidebarLink = ({ to, icon, label, submenu, isOpen }: SidebarLinkProps) => {
  const { isOpen: isSubmenuOpen, toggle: toggleSubmenu, close: closeSubmenu } = useDisclosure();
  const submenuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close submenu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeSubmenu();
      }
    };

    if (isSubmenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubmenuOpen, closeSubmenu]);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          {submenu ? (
            <button
              onClick={toggleSubmenu}
              className={cn(
                'group flex w-full items-center rounded-lg p-2 text-[hsl(var(--text-secondary))] transition-all hover:bg-[hsl(var(--bg-secondary))]',
                isSubmenuOpen && 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
              )}
            >
              <span className="flex items-center gap-2">
                {icon}
                {isOpen && <span>{label}</span>}
              </span>
              {isOpen && (
                <ChevronRight
                  className={cn(
                    'ml-auto size-4 transition-transform',
                    isSubmenuOpen && 'rotate-90'
                  )}
                />
              )}
            </button>
          ) : (
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'group flex w-full items-center gap-2 rounded-lg p-2 text-[hsl(var(--text-secondary))] transition-all hover:bg-[hsl(var(--bg-secondary))]',
                  isActive && 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
                )
              }
            >
              {icon}
              {isOpen && <span>{label}</span>}
            </NavLink>
          )}
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>

      {submenu && isSubmenuOpen && (
        <div
          ref={submenuRef}
          className={cn(
            'z-50 border-[hsl(var(--border-input))]',
            isOpen
              ? 'ml-4 border-l pl-4'
              : 'absolute left-12 top-0 ml-2 w-48 rounded-lg border bg-[hsl(var(--bg-base))] p-2 shadow-lg'
          )}
        >
          {submenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-2 text-sm text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))]',
                  isActive && 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const sidebarLinks = [
  {
    to: paths.app.dashboard.path,
    icon: <Home className="size-5" />,
    label: 'Dashboard'
  },
  {
    to: paths.app.income.path,
    icon: <Wallet className="size-5" />,
    label: 'Pemasukan',
    submenu: [
      {
        to: paths.app.income.path,
        label: 'Lihat Pemasukan Bulanan'
      },
      {
        to: paths.app.income.category,
        label: 'Kategori Pemasukan'
      }
    ]
  },
  {
    to: paths.app.expense.path,
    icon: <Receipt className="size-5" />,
    label: 'Pengeluaran',
    submenu: [
      {
        to: paths.app.expense.path,
        label: 'Lihat Pengeluaran Bulanan'
      },
      {
        to: paths.app.expense.category,
        label: 'Kategori Pengeluaran'
      }
    ]
  },
  {
    to: paths.app.budget.path,
    icon: <PiggyBank className="size-5" />,
    label: 'Anggaran'
  }
];

const Sidebar = () => {
  const { isOpen, toggle } = useDisclosure();

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-4 transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-between p-2">
        {/* Logo always visible but smaller when sidebar is collapsed */}
        <img
          src={logo}
          alt="Logo"
          className={cn('transition-all duration-300', isOpen ? 'h-8 w-8' : 'h-6 w-6 mx-auto')}
        />
        {isOpen && (
          <Button variant="ghost" size="icon" onClick={toggle}>
            <ChevronLeft className="size-4" />
          </Button>
        )}
        {!isOpen && (
          <Button variant="ghost" size="icon" onClick={toggle} className="mt-2 w-full">
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.to} {...link} isOpen={isOpen} />
        ))}
      </div>
    </div>
  );
};

const MobileSidebar = ({ onClose }: { onClose: () => void }) => {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  const toggleSubmenu = (path: string) => {
    setExpandedMenus((current) =>
      current.includes(path) ? current.filter((p) => p !== path) : [...current, path]
    );
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">Keuangan App</span>
        </div>
      </div>

      {/* Content with scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <div key={link.to} className="mb-1">
              {link.submenu ? (
                <div className="mb-2">
                  <button
                    onClick={() => toggleSubmenu(link.to)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))]',
                      expandedMenus.includes(link.to) &&
                        'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'size-4 transition-transform',
                        expandedMenus.includes(link.to) && 'rotate-90'
                      )}
                    />
                  </button>
                  {expandedMenus.includes(link.to) && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {link.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'rounded-lg px-3 py-2 text-sm text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))]',
                              isActive &&
                                'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
                            )
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-[hsl(var(--text-secondary))] transition-all hover:bg-[hsl(var(--bg-secondary))]',
                      isActive && 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-primary))]'
                    )
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { close } = useDisclosure();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page whether the API call succeeds or not
      // since we're clearing the token locally anyway
      navigate(paths.auth.login.path);
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login since we've cleared the token locally
      navigate(paths.auth.login.path);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header - Fixed alignment between hamburger and user name */}
      <header className="flex h-14 items-center justify-between border-b border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))] px-4 lg:hidden">
        <div className="flex items-center gap-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left" className="p-0 w-full sm:w-80">
              <MobileSidebar onClose={close} />
            </DrawerContent>
          </Drawer>
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar - With logo always visible */}
        <TooltipProvider>
          <aside
            className={cn(
              'hidden border-r border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))] p-2 lg:block',
              'transition-all duration-300'
            )}
          >
            <Sidebar />
          </aside>
        </TooltipProvider>

        {/* Main Content */}
        <main className="flex-1 bg-[hsl(var(--bg-secondary))]/50">
          <div className="flex items-center justify-end border-b border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))] px-4 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span>{user?.name || 'Test User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="gap-2">
                  <PlusCircle className="size-4" />
                  <span>Create New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};
