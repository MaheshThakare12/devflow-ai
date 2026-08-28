'use client'

import { useMemo, useState, useEffect } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { 
  Activity, BarChart3, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, HelpCircle, 
  ClipboardCheck, Clock3, FolderKanban, FolderPlus, Gauge, LayoutDashboard, ListTodo, 
  Menu, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, Sparkles, 
  Target, TrendingUp, Users, X, User as UserIcon, LogOut, FileText, MessageSquare, Wand2, Loader2, Trash2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useProjects'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { useSuggestTasks, useEnhanceTask } from '@/hooks/useAI'
import toast from 'react-hot-toast'

const chartData = [
  { day: 'Mon', completed: 4, created: 7 }, 
  { day: 'Tue', completed: 6, created: 5 }, 
  { day: 'Wed', completed: 5, created: 8 },
  { day: 'Thu', completed: 8, created: 6 }, 
  { day: 'Fri', completed: 7, created: 9 }, 
  { day: 'Sat', completed: 9, created: 4 }, 
  { day: 'Sun', completed: 11, created: 6 },
]

const analyticsData = [
  { week: 'Week 1', velocity: 24, hours: 38 },
  { week: 'Week 2', velocity: 32, hours: 42 },
  { week: 'Week 3', velocity: 28, hours: 35 },
  { week: 'Week 4', velocity: 41, hours: 46 },
]

const initialProjects: any[] = []

const initialTasks: any[] = []


const activities = [
  ['Completed', 'Build authentication API', '12 min ago', CheckCircle2],
  ['Created project', 'E-Commerce Platform', '1 hour ago', FolderPlus],
  ['Assigned', 'Database schema design', '3 hours ago', Users],
  ['Updated priority', 'Responsive dashboard UI', 'Yesterday', TrendingUp],
  ['Completed', 'Set up CI/CD pipeline', 'Yesterday', CheckCircle2],
] as const

function Avatar({ initials, small = false }: { initials: string; small?: boolean }) {
  return (
    <span className={`${small ? 'size-6 text-[9px]' : 'size-8 text-[11px]'} inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[#151519] bg-[#1e1e24] font-semibold text-white`}>
      {initials}
    </span>
  )
}

function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: string }) {
  const v = (variant || '').toLowerCase()
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium ${
      v === 'high' || v === 'urgent' ? 'bg-red-950/60 text-red-300 border border-red-800/40' :
      v === 'medium' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
      v === 'low' ? 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50' :
      v === 'done' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
      v === 'progress' || v === 'in progress' || v === 'in-progress' ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' :
      'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50'
    }`}>
      {children}
    </span>
  )
}

function Sidebar({ 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen,
  activeTab,
  setActiveTab,
  onOpenProfile,
  userRole
}: { 
  collapsed: boolean; 
  setCollapsed: (v: boolean) => void; 
  mobileOpen: boolean; 
  setMobileOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  onOpenProfile: () => void;
  userRole?: string;
}) {
  const { user } = useAuthStore()
  const userName = user?.name || 'Mahesh'
  const displayRole = userRole || user?.role || 'Full Stack Engineer'
  const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MC'

  const nav = [
    [LayoutDashboard, 'Dashboard'],
    [FolderKanban, 'Projects'],
    [ListTodo, 'Tasks'],
    [BarChart3, 'Analytics']
  ] as const

  return (
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${collapsed ? 'md:w-[76px]' : 'md:w-64'} fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#222228] bg-[#151519] px-3 py-5 transition-all duration-300`}>
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-black shadow-sm">
            <Sparkles size={17} />
          </span>
          {!collapsed && <span className="font-semibold tracking-tight text-base text-white">DevFlow</span>}
        </div>
        <button 
          aria-label="Close sidebar" 
          onClick={() => { setCollapsed(!collapsed); setMobileOpen(false) }} 
          className="hidden rounded-md p-1.5 text-zinc-400 hover:bg-[#222228] hover:text-white md:block transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {nav.map(([Icon, label]) => {
          const isActive = activeTab === label
          return (
            <button 
              key={label}
              onClick={() => { setActiveTab(label); setMobileOpen(false) }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive 
                  ? 'bg-[#222228] font-medium text-white shadow-sm' 
                  : 'text-zinc-400 hover:bg-[#1c1c22] hover:text-white'
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-white" />}
            </button>
          )
        })}
        
        <div className="my-6 h-px bg-[#222228]" />
        
        {[[Settings, 'Settings'], [HelpCircle, 'Help & Support']].map(([Icon, label]) => (
          <button 
            key={label as string} 
            onClick={() => { setActiveTab(label as string); setMobileOpen(false) }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              activeTab === label 
                ? 'bg-[#222228] font-medium text-white' 
                : 'text-zinc-400 hover:bg-[#1c1c22] hover:text-white'
            }`}
          >
            <Icon size={18} />
            {!collapsed && <span>{label as string}</span>}
          </button>
        ))}
      </nav>




      <button 
        onClick={onOpenProfile}
        className="mt-5 flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[#1c1c22] transition-colors w-full"
      >
        <Avatar initials={initials} />
        {!collapsed && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{userName}</span>
            <span className="block text-[11px] text-zinc-400">{displayRole}</span>
          </span>
        )}
        {!collapsed && <MoreHorizontal size={16} className="text-zinc-400" />}
      </button>
    </aside>
  )
}

function Topbar({ 
  onMenu, 
  dark, 
  setDark,
  searchQuery,
  setSearchQuery,
  onOpenProfile,
  onToggleNotifications,
  unreadNotifications
}: { 
  onMenu: () => void; 
  dark: boolean; 
  setDark: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onOpenProfile: () => void;
  onToggleNotifications: () => void;
  unreadNotifications: boolean;
}) {
  const { user } = useAuthStore()
  const userName = user?.name || 'Mahesh'
  const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MC'

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-[#222228] bg-[#0e0e11]/90 px-5 backdrop-blur md:px-8">
      <button aria-label="Open sidebar" className="md:hidden text-zinc-300" onClick={onMenu}>
        <Menu size={20} />
      </button>

      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-[#222228] bg-[#151519] pl-10 pr-12 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all" 
          placeholder="Search projects, tasks..." 
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#26262e] bg-[#1c1c22] px-1.5 py-0.5 text-[10px] text-zinc-400">
          ⌘ K
        </kbd>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button 
          aria-label="Notifications" 
          onClick={onToggleNotifications}
          className="relative rounded-lg p-2.5 text-zinc-400 hover:bg-[#1c1c22] hover:text-white transition-colors"
        >
          <Bell size={18} />
          {unreadNotifications && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-white animate-pulse" />}
        </button>

        <button 
          aria-label="Toggle theme" 
          onClick={() => setDark(!dark)} 
          className="rounded-lg p-2.5 text-zinc-400 hover:bg-[#1c1c22] hover:text-white transition-colors"
        >
          {dark ? <Sparkles size={18} /> : <Clock3 size={18} />}
        </button>

        <button onClick={onOpenProfile} aria-label="Open user profile">
          <Avatar initials={initials} />
        </button>
      </div>
    </header>
  )
}

function StatCard({ icon: Icon, label, value, sub, trend }: { icon: React.ElementType; label: string; value: string; sub: string; trend: string }) {
  const isPositivePercent = trend.includes('%')
  return (
    <article className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm transition-all hover:border-[#33333e]">
      <div className="flex items-start justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-[#222228] text-zinc-300">
          <Icon size={18} />
        </span>
        <span className={`text-[11px] font-semibold ${isPositivePercent ? 'text-emerald-400' : 'text-zinc-400'}`}>
          {trend}
        </span>
      </div>
      <p className="mt-4 text-sm text-zinc-400 font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
    </article>
  )
}

function ProjectCard({ 
  project, 
  onOpenAI, 
  onDelete,
  onSelectProject
}: { 
  project: any; 
  onOpenAI: (proj: any) => void; 
  onDelete: (id: string) => void;
  onSelectProject?: (title: string) => void;
}) {
  const title = project.name || project.title || 'Untitled Project'
  const desc = project.description || 'No description provided.'
  const progress = project.progress ?? 65
  const tone = project.tone || 'blue'

  return (
    <article 
      onClick={() => onSelectProject?.(title)}
      className="group rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-600/50 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className={`grid size-9 place-items-center rounded-lg ${
          tone === 'blue' ? 'bg-blue-950/50 text-blue-400 border border-blue-800/30' :
          tone === 'violet' ? 'bg-violet-950/50 text-violet-400 border border-violet-800/30' :
          tone === 'amber' ? 'bg-amber-950/50 text-amber-400 border border-amber-800/30' :
          'bg-teal-950/50 text-teal-400 border border-teal-800/30'
        }`}>
          <FolderKanban size={18} />
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onOpenAI(project)}
            title="AI Generate Tasks for Project"
            className="text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 border border-amber-700/40 transition-colors"
          >
            <Sparkles size={12} /> AI Tasks
          </button>
          <button
            onClick={() => onDelete(project.id)}
            title="Delete Project"
            className="text-red-400 bg-red-950/40 hover:bg-red-900/60 p-1.5 rounded-md border border-red-800/40 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{title}</h3>
      <p className="mt-1.5 min-h-10 text-xs leading-5 text-zinc-400 line-clamp-2">{desc}</p>
      
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="font-semibold text-white">{progress}% complete</span>
        <span className="text-zinc-400 font-medium">
          <strong className="text-emerald-400">{project.done || 0}</strong> / {project.tasks || 0} tasks done
        </span>
      </div>
      
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#222228]">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            progress >= 80 ? 'bg-emerald-500' : progress >= 40 ? 'bg-purple-500' : progress > 0 ? 'bg-amber-500' : 'bg-zinc-700'
          }`} 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="mt-5 flex items-center justify-between pt-2 border-t border-[#222228]">
        <div className="flex -space-x-1.5">
          {(project.team || ['MC']).map((x: string) => (
            <Avatar key={x} initials={x} small />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          <CalendarDays size={13} />
          {project.due || 'Sep 30'}
        </div>
      </div>
    </article>
  )
}



export default function DevFlowApp() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
   const [statusFilter, setStatusFilter] = useState('All status')
  const [priorityFilter, setPriorityFilter] = useState('All priorities')
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string | null>(null)

  // Auth guard
  const { user, isInitialized } = useAuthStore()

  // Real-time API Hooks
  const { data: apiProjects, isLoading: isLoadingProjects } = useProjects()
  const { data: apiTasks, isLoading: isLoadingTasks } = useTasks()
  const createProjectMutation = useCreateProject()
  const deleteProjectMutation = useDeleteProject()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const suggestTasksMutation = useSuggestTasks()
  const enhanceTaskMutation = useEnhanceTask()

  // Local state fallbacks
  const [localProjects, setLocalProjects] = useState<any[]>([])
  const [localTasks, setLocalTasks] = useState<any[]>([])

  const tasksList = useMemo(() => {
    const apiMapped = (apiTasks || []).map((t: any) => ({
      id: t._id,
      title: t.title,
      description: t.description || '',
      project: typeof t.project === 'object' ? t.project?.title : 'Project',
      priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
      status: t.status === 'done' ? 'Done' : t.status === 'in-progress' ? 'In Progress' : 'Todo',
      due: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
      assignee: 'MC'
    }))
    // Merge: API data + optimistic local-only entries
    const apiIds = new Set(apiMapped.map((t: any) => t.id))
    const localOnly = localTasks.filter(t => !apiIds.has(t.id))
    return [...apiMapped, ...localOnly]
  }, [apiTasks, localTasks])

  // Merge API and local projects data with live task counts & progress calculation
  const projectsList = useMemo(() => {
    const rawMapped = (apiProjects || []).map((p: any) => ({
      id: p._id,
      name: p.title,
      description: p.description || 'Engineering project',
      due: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sep 30',
      status: 'On track',
      tone: p.color || 'blue',
      team: ['MC', 'AK']
    }))

    const apiIds = new Set(rawMapped.map((p: any) => p.id))
    const localOnly = localProjects.filter(p => !apiIds.has(p.id))
    const allProjs = [...rawMapped, ...localOnly]

    return allProjs.map(p => {
      const pTasks = tasksList.filter(t => (t.project || '').toLowerCase() === (p.name || '').toLowerCase())
      const totalTasks = pTasks.length
      const doneTasks = pTasks.filter(t => t.status === 'Done').length
      const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

      return {
        ...p,
        tasks: totalTasks,
        done: doneTasks,
        progress: progressPercent
      }
    })
  }, [apiProjects, localProjects, tasksList])


  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)

  const [userRole, setUserRole] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'Full Stack Engineer'
    }
    return 'Full Stack Engineer'
  })

  // Weekly Goal
  const [weeklyGoal, setWeeklyGoal] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weeklyGoal')
      return saved ? parseInt(saved, 10) : 10
    }
    return 10
  })
  const [weeklyGoalInput, setWeeklyGoalInput] = useState('')
  const [isEditingGoal, setIsEditingGoal] = useState(false)

  const weeklyProgress = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    // Monday as start of week
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    startOfWeek.setDate(now.getDate() + diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const doneTasks = tasksList.filter(t => t.status === 'Done').length
    const inProgressTasks = tasksList.filter(t => t.status === 'In Progress').length
    const todoTasks = tasksList.filter(t => t.status === 'Todo').length
    const totalCreatedThisWeek = tasksList.length

    const goalPercent = weeklyGoal > 0 ? Math.min(Math.round((doneTasks / weeklyGoal) * 100), 100) : 0

    const dailyBreakdown = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayLabel, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const isToday = d.toDateString() === now.toDateString()
      const isPast = d < now && !isToday
      // Distribute tasks evenly across the week for display
      const completedSlice = isPast ? Math.round(doneTasks / 7) : isToday ? (doneTasks % 7) || 0 : 0
      return { day: dayLabel, completed: completedSlice, isToday, isPast }
    })

    return {
      doneTasks,
      inProgressTasks,
      todoTasks,
      totalCreatedThisWeek,
      goalPercent,
      dailyBreakdown,
      remaining: Math.max(weeklyGoal - doneTasks, 0),
      isGoalMet: doneTasks >= weeklyGoal
    }
  }, [tasksList, weeklyGoal])

  const handleSaveGoal = () => {
    const val = parseInt(weeklyGoalInput, 10)
    if (!isNaN(val) && val > 0) {
      setWeeklyGoal(val)
      if (typeof window !== 'undefined') localStorage.setItem('weeklyGoal', String(val))
      toast.success(`Weekly goal set to ${val} tasks! 🎯`)
    }
    setIsEditingGoal(false)
    setWeeklyGoalInput('')
  }

  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiProjTitle, setAiProjTitle] = useState('')
  const [aiProjDesc, setAiProjDesc] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState<any[]>([])
  const [selectedAiIndices, setSelectedAiIndices] = useState<number[]>([])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [newTaskProject, setNewTaskProject] = useState('E-Commerce Platform')
  const [newTaskPriority, setNewTaskPriority] = useState('High')
  const [newTaskDue, setNewTaskDue] = useState('Today')

  const [newProjName, setNewProjName] = useState('')
  const [newProjDesc, setNewProjDesc] = useState('')
  const [newProjTone, setNewProjTone] = useState('blue')

  const { logout } = useAuthStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      window.location.href = '/login'
    }
  }, [user, isInitialized])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const handleSelectProject = (projectTitle: string) => {
    setSelectedProjectFilter(projectTitle)
    setActiveTab('Tasks')
    toast.success(`Showing tasks for "${projectTitle}"`)
  }

  const filteredTasks = useMemo(() => {
    return tasksList.filter(t => {
      const matchProject = !selectedProjectFilter || t.project.toLowerCase() === selectedProjectFilter.toLowerCase()
      const matchSearch = `${t.title} ${t.project}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All status' || t.status === statusFilter
      const matchPriority = priorityFilter === 'All priorities' || t.priority === priorityFilter
      return matchProject && matchSearch && matchStatus && matchPriority
    })
  }, [tasksList, searchQuery, statusFilter, priorityFilter, selectedProjectFilter])

  const filteredProjects = useMemo(() => {
    return projectsList.filter(p => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  }, [projectsList, searchQuery])

  const analyticsMetrics = useMemo(() => {
    const totalTasks = tasksList.length
    const doneTasks = tasksList.filter(t => t.status === 'Done').length
    const inProgressTasks = tasksList.filter(t => t.status === 'In Progress').length
    const todoTasks = tasksList.filter(t => t.status === 'Todo').length

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    const highPriority = tasksList.filter(t => t.priority === 'High' || t.priority === 'Urgent').length
    const mediumPriority = tasksList.filter(t => t.priority === 'Medium').length
    const lowPriority = tasksList.filter(t => t.priority === 'Low').length

    const statusChartData = [
      { name: 'Completed', count: doneTasks },
      { name: 'In Progress', count: inProgressTasks },
      { name: 'Todo', count: todoTasks }
    ]

    const priorityChartData = [
      { priority: 'High / Urgent', count: highPriority },
      { priority: 'Medium', count: mediumPriority },
      { priority: 'Low', count: lowPriority }
    ]

    const projectPerformance = projectsList.map(p => {
      const pTasks = tasksList.filter(t => t.project.toLowerCase() === p.name.toLowerCase())
      const pDone = pTasks.filter(t => t.status === 'Done').length
      const pTotal = pTasks.length
      const pRate = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0
      return {
        id: p.id,
        name: p.name,
        done: pDone,
        total: pTotal,
        rate: pRate
      }
    })

    return {
      totalTasks,
      doneTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      statusChartData,
      priorityChartData,
      projectPerformance
    }
  }, [tasksList, projectsList])


  // Show spinner while auth initializing or redirecting
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-zinc-400">Loading workspace...</p>
        </div>
      </div>
    )
  }

  // Real-time task status toggle
  const toggleTaskStatus = (id: string) => {
    const currentTask = tasksList.find(t => t.id === id)
    if (!currentTask) return

    const nextStatus = currentTask.status === 'Done' ? 'Todo' : 'Done'
    const apiStatus = nextStatus === 'Done' ? 'done' : 'todo'

    // Update in backend API if MongoDB id
    if (id.length > 10) {
      updateTaskMutation.mutate({ id, status: apiStatus as any })
    }

    setLocalTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: nextStatus }
      }
      return t
    }))
    toast.success(`Task marked as ${nextStatus}!`)
  }

  // Real-time AI task generation
  const handleGenerateAITasks = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiProjTitle.trim()) return

    setIsAiLoading(true)
    try {
      const res = await suggestTasksMutation.mutateAsync({ 
        projectTitle: aiProjTitle, 
        projectDescription: aiProjDesc, 
        count: 5 
      })
      const tasksRes = res.length > 0 ? res : [
        { title: `Design database schema for ${aiProjTitle}`, priority: 'high', tags: ['DB', 'Design'], description: 'Draft entity models and relationships.' },
        { title: `Implement authentication & user roles`, priority: 'urgent', tags: ['Auth', 'Security'], description: 'JWT authentication endpoints and middleware.' },
        { title: `Create responsive dashboard UI components`, priority: 'medium', tags: ['Frontend', 'UI'], description: 'Build interactive cards and status filters.' },
        { title: `Integrate payment processing API`, priority: 'high', tags: ['Payments', 'API'], description: 'Stripe/Razorpay webhook and checkout flow.' },
        { title: `Write unit & integration tests`, priority: 'low', tags: ['Testing', 'QA'], description: 'Automated test suite coverage.' }
      ]
      setAiGeneratedTasks(tasksRes)
      setSelectedAiIndices(tasksRes.map((_: any, i: number) => i))
      toast.success('AI generated actionable tasks!')
    } catch (err) {
      toast.error('AI Service Fallback Triggered')
    } finally {
      setIsAiLoading(false)
    }
  }

  // AI Task Enhancer
  const handleEnhanceTaskWithAI = async () => {
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title first')
      return
    }
    setIsEnhancing(true)
    try {
      const enhanced = await enhanceTaskMutation.mutateAsync({
        title: newTaskTitle,
        description: newTaskDesc
      })
      if (enhanced) {
        if (enhanced.title) setNewTaskTitle(enhanced.title)
        if (enhanced.description) setNewTaskDesc(enhanced.description)
        if (enhanced.priority) {
          const capPriority = enhanced.priority.charAt(0).toUpperCase() + enhanced.priority.slice(1)
          setNewTaskPriority(capPriority)
        }
        toast.success('✨ Task enhanced by AI!')
      }
    } catch (err) {
      toast.error('AI Enhancement service fallback used')
    } finally {
      setIsEnhancing(false)
    }
  }

  // Import AI tasks into workspace & persist in MongoDB real-time
  const handleImportAITasks = () => {
    const tasksToImport = aiGeneratedTasks.filter((_, i) => selectedAiIndices.includes(i))
    if (!tasksToImport.length) return

    // Match selected project from API
    let targetProject = apiProjects?.find((p: any) => p.title?.toLowerCase() === aiProjTitle.toLowerCase())
    if (!targetProject && apiProjects && apiProjects.length > 0) {
      targetProject = apiProjects[0]
    }

    const newTasks = tasksToImport.map((t, index) => {
      if (targetProject) {
        createTaskMutation.mutate({
          title: t.title,
          description: t.description || '',
          project: targetProject._id as any,
          priority: (t.priority || 'medium').toLowerCase() as any,
          status: 'todo'
        })
      }

      return {
        id: `ai_${Date.now()}_${index}`,
        title: t.title,
        description: t.description || '',
        project: targetProject ? targetProject.title : aiProjTitle,
        priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
        status: 'Todo',
        due: 'Sep 15',
        assignee: user?.name ? user.name.substring(0, 2).toUpperCase() : 'MC'
      }
    })

    setLocalTasks([...newTasks, ...localTasks])
    setIsAIModalOpen(false)
    setAiGeneratedTasks([])
    toast.success(`Imported & Saved ${newTasks.length} AI tasks to database!`)
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    // Match project from API
    let targetProject = apiProjects?.find((p: any) => p.title?.toLowerCase() === newTaskProject.toLowerCase())
    if (!targetProject && apiProjects && apiProjects.length > 0) {
      targetProject = apiProjects[0]
    }

    if (targetProject) {
      createTaskMutation.mutate({
        title: newTaskTitle,
        description: newTaskDesc,
        project: targetProject._id as any,
        priority: newTaskPriority.toLowerCase() as any,
        status: 'todo'
      })
    }

    const newTask = {
      id: `t_${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      project: targetProject ? targetProject.title : newTaskProject,
      priority: newTaskPriority,
      status: 'Todo',
      due: newTaskDue || 'Today',
      assignee: user?.name ? user.name.substring(0, 2).toUpperCase() : 'MC'
    }

    setLocalTasks([newTask, ...localTasks])
    setNewTaskTitle('')
    setNewTaskDesc('')
    setIsTaskModalOpen(false)
    toast.success('Task created successfully!')
  }


  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjName.trim()) return

    // Persist to backend API
    createProjectMutation.mutate({
      title: newProjName,
      description: newProjDesc,
      color: '#6366f1'
    })

    const newProj = {
      id: `p_${Date.now()}`,
      name: newProjName,
      description: newProjDesc || 'Strategic engineering project.',
      progress: 0,
      tasks: 0,
      done: 0,
      due: 'Oct 30',
      status: 'On track',
      tone: newProjTone,
      team: [user?.name ? user.name.substring(0, 2).toUpperCase() : 'MC']
    }

    setLocalProjects([newProj, ...localProjects])
    setNewProjName('')
    setNewProjDesc('')
    setIsProjectModalOpen(false)
  }

  const handleDeleteProject = (id: string) => {
    // Delete from backend if it's a MongoDB ID
    if (id.length > 10) {
      deleteProjectMutation.mutate(id, {
        onSuccess: () => toast.success('Project deleted!'),
        onError: () => toast.error('Failed to delete project')
      })
    } else {
      // Remove from local state (optimistic local-only entries)
      setLocalProjects(prev => prev.filter(p => p.id !== id))
      toast.success('Project deleted!')
    }
  }

  const userName = user?.name ? user.name.split(' ')[0] : 'Mahesh'

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#0e0e11] text-white">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          userRole={userRole}
        />

        {mobileOpen && (
          <button 
            aria-label="Close navigation overlay" 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" 
            onClick={() => setMobileOpen(false)} 
          />
        )}

        <div className={`${collapsed ? 'md:pl-[76px]' : 'md:pl-64'} transition-all`}>
          <Topbar 
            onMenu={() => setMobileOpen(true)} 
            dark={dark} 
            setDark={setDark} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onToggleNotifications={() => {
              setIsNotificationsOpen(!isNotificationsOpen)
              setUnreadNotifications(false)
            }}
            unreadNotifications={unreadNotifications}
          />

          {isNotificationsOpen && (
            <div className="absolute right-8 top-16 z-50 w-80 rounded-xl border border-[#2c2c34] bg-[#151519] p-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
                <h4 className="text-sm font-semibold text-white">Notifications</h4>
                <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={15} />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex gap-3 text-xs">
                  <span className="size-2 mt-1.5 rounded-full bg-white shrink-0" />
                  <div>
                    <p className="font-medium text-white">Task assigned: Auth API Endpoints</p>
                    <p className="text-[11px] text-zinc-400">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:py-10">
            {/* Header & Actions with AI Button */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end mb-8">
              <div>
                <p className="text-sm font-medium text-zinc-400">Monday, August 23, 2026</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance md:text-4xl text-white">
                  Good morning, {userName}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Here&apos;s your productivity workspace & AI task breakdown engine.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition hover:opacity-90 active:scale-[0.98]"
                >
                  <Sparkles size={18} className="animate-pulse" /> ✨ AI Suggest Tasks
                </button>

                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-md transition hover:bg-zinc-200 active:scale-[0.98]"
                >
                  <Plus size={16} /> New Task
                </button>

                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2c2c34] bg-[#151519] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e1e24] active:scale-[0.98]"
                >
                  <FolderPlus size={16} /> New Project
                </button>
              </div>
            </div>

            {/* TAB 1: DASHBOARD */}
            {activeTab === 'Dashboard' && (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={FolderKanban} label="Total Projects" value={String(projectsList.length)} sub="2 added this month" trend="+2" />
                  <StatCard icon={ListTodo} label="Total Tasks" value={String(tasksList.length)} sub="12 created this week" trend="+12" />
                  <StatCard icon={CheckCircle2} label="Completed Tasks" value={String(tasksList.filter(t => t.status === 'Done').length)} sub="64.5% completion rate" trend="+6.4%" />
                  <StatCard icon={Target} label="Overall Progress" value="72%" sub="from last week" trend="+8.2%" />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
                  {/* Recent Activity */}
                  <article className="min-w-0 rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm md:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="font-semibold text-white">Recent Activity</h2>
                        <p className="mt-1 text-xs text-zinc-400">What&apos;s happening across your workspace</p>
                      </div>
                      <button onClick={() => setActiveTab('Tasks')} className="text-xs font-medium text-zinc-300 hover:text-white hover:underline">View all</button>
                    </div>

                    <div className="flex flex-col divide-y divide-[#222228]">
                      {tasksList.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-6 text-center">No activity yet. Create a project to get started!</p>
                      ) : (
                        tasksList.slice(0, 6).map((t, i) => {
                          const icons = [CheckCircle2, ClipboardCheck, TrendingUp, FolderPlus, Clock3, Users]
                          const Icon = icons[i % icons.length]
                          const actions = ['Working on', 'Created task', 'Updated', 'Added to project', 'Pending review', 'Assigned']
                          const action = actions[i % actions.length]
                          const timeLabels = ['Just now', '5 min ago', '12 min ago', '1 hr ago', '3 hrs ago', 'Yesterday']
                          return (
                            <div key={t.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#222228] text-white">
                                <Icon size={14} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs leading-5">
                                  <span className="text-zinc-400">{action} </span>
                                  <span className="font-semibold text-white">{t.title}</span>
                                </p>
                                <div className="mt-0.5 flex items-center gap-2">
                                  <p className="text-[11px] text-zinc-500">{timeLabels[i % timeLabels.length]}</p>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    t.status === 'Done' ? 'bg-emerald-950/60 text-emerald-400' :
                                    t.status === 'In Progress' ? 'bg-blue-950/60 text-blue-400' :
                                    'bg-zinc-800 text-zinc-400'
                                  }`}>{t.status}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </article>

                  {/* Overall Progress */}
                  <article className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm md:p-6">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h2 className="font-semibold text-white">Overall Progress</h2>
                        <p className="mt-1 text-xs text-zinc-400">Task completion over the last 7 days</p>
                      </div>
                      <button className="flex items-center gap-1.5 rounded-lg border border-[#2c2c34] bg-[#1a1a20] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white">
                        Last 7 days <ChevronDown size={14} />
                      </button>
                    </div>

                    <div className="mt-4 h-[235px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="completedGrad" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="createdGrad" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="#222228" strokeDasharray="3 3" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #2c2c34', background: '#18181f', fontSize: 12, color: '#ffffff' }} />
                          <Area type="monotone" dataKey="created" name="Created" stroke="#8b5cf6" fill="url(#createdGrad)" strokeWidth={2} strokeDasharray="5 5" />
                          <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" fill="url(#completedGrad)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex gap-5 text-xs text-zinc-400 pt-3 border-t border-[#222228]">
                      <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-emerald-500" />Tasks completed</span>
                      <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-purple-500" />Tasks created</span>
                    </div>
                  </article>

                </section>


                <section className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">My projects</h2>
                      <p className="mt-1 text-xs text-zinc-400">Keep an eye on your active work</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Projects')}
                      className="text-sm font-medium text-zinc-300 hover:text-white hover:underline"
                    >
                      View all projects →
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {filteredProjects.map(p => (
                      <ProjectCard 
                        key={p.id} 
                        project={p} 
                        onOpenAI={(proj) => {
                          setAiProjTitle(proj.name)
                          setAiProjDesc(proj.description)
                          setIsAIModalOpen(true)
                        }}
                        onDelete={handleDeleteProject}
                        onSelectProject={handleSelectProject}
                      />

                    ))}
                  </div>

                </section>

                <section className="mt-8 rounded-xl border border-[#222228] bg-[#151519] shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-[#222228] p-5 md:flex-row md:items-center md:justify-between md:p-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">My tasks</h2>
                      <p className="mt-1 text-xs text-zinc-400">Stay focused on what&apos;s next</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                          value={searchQuery} 
                          onChange={e => setSearchQuery(e.target.value)} 
                          placeholder="Search tasks" 
                          className="h-9 w-40 rounded-lg border border-[#2c2c34] bg-[#0e0e11] pl-9 pr-3 text-xs text-white outline-none focus:border-zinc-500" 
                        />
                      </div>

                      <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)} 
                        className="h-9 rounded-lg border border-[#2c2c34] bg-[#0e0e11] px-3 text-xs text-white outline-none"
                      >
                        <option>All status</option>
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>

                      <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2c2c34] bg-[#1c1c22] px-3 text-xs font-medium text-white hover:bg-[#262630]"
                      >
                        <ClipboardCheck size={14} /> Filter
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-[#222228]">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex flex-col gap-3 p-4 transition hover:bg-[#1c1c22] sm:flex-row sm:items-center md:px-6"
                        >
                          <button 
                            aria-label={`Mark ${task.title} complete`} 
                            onClick={() => toggleTaskStatus(task.id)} 
                            className={`grid size-5 shrink-0 place-items-center rounded-full border transition-all ${
                              task.status === 'Done' ? 'border-white bg-white text-black' : 'border-[#383842] hover:border-white'
                            }`}
                          >
                            {task.status === 'Done' && <Check size={12} />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium ${task.status === 'Done' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                              {task.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">{task.project}</p>
                          </div>

                          <div className="flex items-center gap-3 pl-8 sm:pl-0">
                            <Badge variant={task.priority}>{task.priority}</Badge>
                            <Badge variant={task.status}>{task.status}</Badge>
                            <span className="flex min-w-16 items-center gap-1.5 text-xs text-zinc-400">
                              <CalendarDays size={13} />
                              {task.due}
                            </span>
                            <Avatar initials={task.assignee} small />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-12 text-center">
                        <Search size={24} className="text-zinc-500" />
                        <p className="text-sm font-medium text-white">No tasks found</p>
                        <p className="text-xs text-zinc-400">Try adjusting your search or filters.</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* TAB 2: PROJECTS VIEW */}
            {activeTab === 'Projects' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Projects Workspace</h1>
                    <p className="text-xs text-zinc-400 mt-1">Manage, track, and collaborate on your active engineering projects.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAIModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                    >
                      <Sparkles size={15} /> ✨ AI Generator
                    </button>
                    <button 
                      onClick={() => setIsProjectModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
                    >
                      <Plus size={16} /> New Project
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProjects.map(p => (
                    <ProjectCard 
                      key={p.id} 
                      project={p} 
                      onOpenAI={(proj) => {
                        setAiProjTitle(proj.name)
                        setAiProjDesc(proj.description)
                        setIsAIModalOpen(true)
                      }}
                      onDelete={handleDeleteProject}
                      onSelectProject={handleSelectProject}
                    />

                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TASKS VIEW */}
            {activeTab === 'Tasks' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Tasks & Deliverables</h1>
                    <p className="text-xs text-zinc-400 mt-1">Sprint tasks, priorities, and implementation status.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAIModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                    >
                      <Sparkles size={15} /> ✨ AI Task Generator
                    </button>
                    <button 
                      onClick={() => setIsTaskModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
                    >
                      <Plus size={16} /> New Task
                    </button>
                  </div>
                </div>

                {selectedProjectFilter && (
                  <div className="flex items-center justify-between bg-purple-950/40 border border-purple-800/40 px-4 py-2 rounded-xl text-xs text-purple-300">
                    <span className="flex items-center gap-2 font-medium">
                      <FolderKanban size={15} className="text-purple-400" />
                      Showing tasks for project: <strong className="text-white font-bold">{selectedProjectFilter}</strong>
                    </span>
                    <button 
                      onClick={() => setSelectedProjectFilter(null)} 
                      className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold hover:underline"
                    >
                      <X size={14} /> Clear filter (Show all tasks)
                    </button>
                  </div>
                )}

                <div className="rounded-xl border border-[#222228] bg-[#151519] p-4 flex flex-wrap items-center gap-3">

                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks by title or project..."
                      className="h-9 w-full rounded-lg border border-[#2c2c34] bg-[#0e0e11] pl-9 pr-3 text-xs text-white outline-none focus:border-white"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="h-9 rounded-lg border border-[#2c2c34] bg-[#0e0e11] px-3 text-xs text-white outline-none"
                  >
                    <option value="All status">All Statuses</option>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <select 
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="h-9 rounded-lg border border-[#2c2c34] bg-[#0e0e11] px-3 text-xs text-white outline-none"
                  >
                    <option value="All priorities">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="rounded-xl border border-[#222228] bg-[#151519] divide-y divide-[#222228]">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="flex flex-col gap-3 p-4 hover:bg-[#1c1c22] sm:flex-row sm:items-center">
                      <button 
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                          task.status === 'Done' ? 'border-white bg-white text-black' : 'border-[#383842] hover:border-white'
                        }`}
                      >
                        {task.status === 'Done' && <Check size={12} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${task.status === 'Done' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">{task.project}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={task.priority}>{task.priority}</Badge>
                        <Badge variant={task.status}>{task.status}</Badge>
                        <span className="text-xs text-zinc-400">{task.due}</span>
                        <Avatar initials={task.assignee} small />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ANALYTICS VIEW */}
            {activeTab === 'Analytics' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Real-Time Engineering Analytics</h1>
                  <p className="text-xs text-zinc-400 mt-1">Live metrics, project health, and task completion velocity across your workspace.</p>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm">
                    <p className="text-xs font-medium text-zinc-400">Total Projects</p>
                    <p className="mt-2 text-3xl font-bold text-white">{projectsList.length}</p>
                    <p className="mt-1 text-[11px] text-purple-400 font-medium">Active workspace projects</p>
                  </div>

                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm">
                    <p className="text-xs font-medium text-zinc-400">Total Tasks</p>
                    <p className="mt-2 text-3xl font-bold text-white">{analyticsMetrics.totalTasks}</p>
                    <p className="mt-1 text-[11px] text-blue-400 font-medium">{analyticsMetrics.doneTasks} Completed</p>
                  </div>

                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm">
                    <p className="text-xs font-medium text-zinc-400">Completion Rate</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">{analyticsMetrics.completionRate}%</p>
                    <p className="mt-1 text-[11px] text-emerald-500 font-medium">Overall throughput</p>
                  </div>

                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm">
                    <p className="text-xs font-medium text-zinc-400">Active Tasks</p>
                    <p className="mt-2 text-3xl font-bold text-amber-400">{analyticsMetrics.inProgressTasks + analyticsMetrics.todoTasks}</p>
                    <p className="mt-1 text-[11px] text-amber-500 font-medium">{analyticsMetrics.inProgressTasks} In Progress</p>
                  </div>
                </div>

                {/* 2 Live Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Task Status Breakdown</h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsMetrics.statusChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                          <YAxis stroke="#71717a" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2c2c34', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Priority Distribution</h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsMetrics.priorityChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                          <XAxis dataKey="priority" stroke="#71717a" fontSize={11} />
                          <YAxis stroke="#71717a" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2c2c34', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Project Performance Breakdown List */}
                <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Project Completion Health</h3>
                  {analyticsMetrics.projectPerformance.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">No projects in workspace yet. Create a project to track analytics!</p>
                  ) : (
                    <div className="space-y-4">
                      {analyticsMetrics.projectPerformance.map(p => (
                        <div key={p.id} className="p-3 rounded-lg bg-[#0e0e11] border border-[#222228] flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{p.name}</span>
                            <span className="text-zinc-400 font-medium">{p.done} / {p.total} tasks ({p.rate}%)</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#222228]">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                p.rate >= 80 ? 'bg-emerald-500' : p.rate >= 40 ? 'bg-amber-500' : 'bg-purple-500'
                              }`} 
                              style={{ width: `${p.rate}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Weekly Goal Card */}
                <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
                        <Target size={16} className="text-white" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Weekly Goal Tracker</h3>
                        <p className="text-[11px] text-zinc-400">Target: <span className="text-purple-400 font-bold">{weeklyGoal} tasks</span> completed this week</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsEditingGoal(true); setWeeklyGoalInput(String(weeklyGoal)) }}
                      className="px-3 py-1.5 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-[11px] font-medium text-zinc-300 hover:text-white hover:border-purple-500 transition-colors"
                    >
                      Edit Goal
                    </button>
                  </div>

                  {/* Edit Goal inline input */}
                  {isEditingGoal && (
                    <div className="mb-5 flex items-center gap-3 p-3 rounded-lg bg-[#0e0e11] border border-purple-800/50">
                      <label className="text-xs font-medium text-zinc-400 whitespace-nowrap">New weekly target:</label>
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={weeklyGoalInput}
                        onChange={e => setWeeklyGoalInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveGoal()}
                        className="flex-1 h-8 px-3 rounded-lg border border-[#2c2c34] bg-[#151519] text-xs text-white outline-none focus:border-purple-500"
                        placeholder="e.g. 15"
                        autoFocus
                      />
                      <button onClick={handleSaveGoal} className="px-3 py-1.5 rounded-lg bg-purple-600 text-[11px] font-semibold text-white hover:bg-purple-500">Save</button>
                      <button onClick={() => setIsEditingGoal(false)} className="px-3 py-1.5 rounded-lg border border-[#2c2c34] text-[11px] font-medium text-zinc-400 hover:text-white">Cancel</button>
                    </div>
                  )}

                  {/* Big Progress Ring-style stat */}
                  <div className="flex items-center gap-6 mb-5">
                    <div className="flex flex-col items-center justify-center size-24 rounded-full border-4 border-[#222228] shrink-0" style={{ background: `conic-gradient(${weeklyProgress.isGoalMet ? '#10b981' : '#8b5cf6'} ${weeklyProgress.goalPercent * 3.6}deg, #222228 0deg)` }}>
                      <div className="flex flex-col items-center justify-center size-[76px] rounded-full bg-[#151519]">
                        <span className={`text-xl font-bold ${weeklyProgress.isGoalMet ? 'text-emerald-400' : 'text-white'}`}>{weeklyProgress.goalPercent}%</span>
                        <span className="text-[9px] text-zinc-500">of goal</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Completed</span>
                        <span className="font-bold text-emerald-400">{weeklyProgress.doneTasks} tasks</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Remaining to goal</span>
                        <span className={`font-bold ${weeklyProgress.isGoalMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {weeklyProgress.isGoalMet ? '🎉 Goal Met!' : `${weeklyProgress.remaining} tasks`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">In Progress</span>
                        <span className="font-bold text-blue-400">{weeklyProgress.inProgressTasks} tasks</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Todo</span>
                        <span className="font-bold text-zinc-400">{weeklyProgress.todoTasks} tasks</span>
                      </div>
                    </div>
                  </div>

                  {/* Full-width progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5">
                      <span>Progress towards {weeklyGoal} task goal</span>
                      <span>{weeklyProgress.doneTasks}/{weeklyGoal}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#222228]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${weeklyProgress.isGoalMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-600 to-blue-500'}`}
                        style={{ width: `${weeklyProgress.goalPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Daily bar chart */}
                  <div>
                    <p className="text-[11px] text-zinc-500 mb-3">Daily breakdown (Mon – Sun)</p>
                    <div className="flex items-end gap-2 h-16">
                      {weeklyProgress.dailyBreakdown.map((d, i) => {
                        const barH = weeklyGoal > 0 ? Math.min(Math.round((d.completed / Math.ceil(weeklyGoal / 7)) * 100), 100) : 0
                        return (
                          <div key={i} className="flex flex-1 flex-col items-center gap-1">
                            <div className="w-full flex flex-col justify-end" style={{ height: '48px' }}>
                              <div
                                className={`w-full rounded-t transition-all duration-500 ${
                                  d.isToday ? 'bg-purple-500' : d.isPast && d.completed > 0 ? 'bg-emerald-500/70' : 'bg-[#222228]'
                                }`}
                                style={{ height: d.completed > 0 ? `${Math.max(barH, 8)}%` : '6px' }}
                              />
                            </div>
                            <span className={`text-[10px] font-medium ${d.isToday ? 'text-purple-400' : 'text-zinc-500'}`}>{d.day}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* TAB 5: SETTINGS VIEW */}
            {activeTab === 'Settings' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings & Preferences</h1>
                  <p className="text-xs text-zinc-400 mt-1">Manage account profile, workspace defaults, and notifications.</p>
                </div>

                <div className="rounded-xl border border-[#222228] bg-[#151519] p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-[#222228]">
                    <div className="flex items-center gap-4">
                      <Avatar initials="MC" />
                      <div>
                        <h3 className="text-base font-semibold text-white">{user?.name || 'Mahesh'}</h3>
                        <p className="text-xs text-zinc-400">{user?.email || 'developer@devflow.io'}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-purple-950/60 border border-purple-800/40 px-3 py-1 text-xs text-purple-300 font-medium">
                      {userRole}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Developer Handle</label>
                      <input type="text" defaultValue={user?.name || 'Mahesh'} className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Role / Specialization</label>
                      <select 
                        value={userRole} 
                        onChange={(e) => {
                          setUserRole(e.target.value)
                          if (typeof window !== 'undefined') localStorage.setItem('userRole', e.target.value)
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none appearance-none cursor-pointer focus:border-zinc-500"
                      >
                        <optgroup label="Engineering">
                          <option>Full Stack Engineer</option>
                          <option>Frontend Developer</option>
                          <option>Backend Developer</option>
                          <option>Mobile Developer</option>
                          <option>DevOps Engineer</option>
                          <option>Site Reliability Engineer (SRE)</option>
                          <option>Cloud Architect</option>
                          <option>Embedded Systems Engineer</option>
                        </optgroup>
                        <optgroup label="Data & AI">
                          <option>Data Scientist</option>
                          <option>Machine Learning Engineer</option>
                          <option>AI / LLM Engineer</option>
                          <option>Data Analyst</option>
                          <option>Data Engineer</option>
                        </optgroup>
                        <optgroup label="Design & Product">
                          <option>UI / UX Designer</option>
                          <option>Product Manager</option>
                          <option>Product Designer</option>
                        </optgroup>
                        <optgroup label="Security & QA">
                          <option>Cybersecurity Engineer</option>
                          <option>QA / Test Engineer</option>
                          <option>Penetration Tester</option>
                        </optgroup>
                        <optgroup label="Management">
                          <option>Engineering Manager</option>
                          <option>Tech Lead</option>
                          <option>CTO / Technical Co-Founder</option>
                        </optgroup>
                        <optgroup label="Other">
                          <option>Freelancer</option>
                          <option>Student / Intern</option>
                          <option>Researcher</option>
                          <option>Other</option>
                        </optgroup>
                      </select>
                    </div>
                    <button 
                      onClick={() => toast.success(`Profile & Role (${userRole}) updated!`)}
                      className="px-4 py-2 rounded-lg bg-white text-xs font-semibold text-black hover:bg-zinc-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: HELP & SUPPORT VIEW */}
            {activeTab === 'Help & Support' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h1 className="text-2xl font-bold text-white">Help & Support</h1>
                  <p className="text-xs text-zinc-400 mt-1">Documentation, keyboard shortcuts, and developer support.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <FileText size={20} className="text-white mb-2" />
                    <h3 className="text-sm font-semibold text-white">DevFlow Documentation</h3>
                    <p className="text-xs text-zinc-400 mt-1">Guides on task prioritization, sprint tracking, and REST APIs.</p>
                  </div>
                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <MessageSquare size={20} className="text-white mb-2" />
                    <h3 className="text-sm font-semibold text-white">Community Support</h3>
                    <p className="text-xs text-zinc-400 mt-1">Ask questions and request new features from the team.</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* AI TASK GENERATOR MODAL */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-purple-800/40 bg-[#151519] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">AI-Assisted Task Generator</h3>
                  <p className="text-[11px] text-zinc-400">OpenAI GPT powered task breakdown & suggestion</p>
                </div>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {!aiGeneratedTasks.length ? (
              <form onSubmit={handleGenerateAITasks} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={aiProjTitle} 
                    onChange={e => setAiProjTitle(e.target.value)}
                    placeholder="e.g., E-Commerce Shopping App"
                    className="w-full h-10 px-3 rounded-xl border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Project Description</label>
                  <textarea 
                    rows={4}
                    value={aiProjDesc} 
                    onChange={e => setAiProjDesc(e.target.value)}
                    placeholder="Describe what you want to build in detail..."
                    className="w-full p-3 rounded-xl border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAIModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#2c2c34] text-xs text-zinc-300 hover:bg-[#1c1c22]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isAiLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Analyzing & Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} /> ⚡ Generate Tasks with AI
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-zinc-300">
                    AI Suggested Tasks ({selectedAiIndices.length}/{aiGeneratedTasks.length} selected):
                  </p>
                  <button 
                    onClick={() => setSelectedAiIndices(aiGeneratedTasks.map((_, i) => i))}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    Select All
                  </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {aiGeneratedTasks.map((task, idx) => {
                    const isSelected = selectedAiIndices.includes(idx)
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (isSelected) setSelectedAiIndices(prev => prev.filter(i => i !== idx))
                          else setSelectedAiIndices(prev => [...prev, idx])
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                          isSelected ? 'bg-purple-950/30 border-purple-700/50' : 'bg-[#0e0e11] border-[#222228] opacity-60'
                        }`}
                      >
                        <div className={`size-4 rounded mt-0.5 flex items-center justify-center border ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-600'}`}>
                          {isSelected && <Check size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-white truncate">{task.title}</h4>
                            <Badge variant={task.priority}>{task.priority}</Badge>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1">{task.description}</p>
                          <div className="flex gap-1.5 mt-2">
                            {task.tags?.map((tag: string) => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-3 border-t border-[#222228] flex justify-between items-center">
                  <button 
                    onClick={() => setAiGeneratedTasks([])}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ← Re-generate
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAIModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-[#2c2c34] text-xs text-zinc-300 hover:bg-[#1c1c22]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleImportAITasks}
                      disabled={!selectedAiIndices.length}
                      className="px-5 py-2 rounded-xl bg-white text-xs font-bold text-black shadow-md hover:bg-zinc-200 disabled:opacity-50"
                    >
                      Import {selectedAiIndices.length} Tasks
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-[#2c2c34] bg-[#151519] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
              <h3 className="text-base font-semibold text-white">User Account Profile</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center text-center">
              <Avatar initials="MC" />
              <h4 className="mt-3 text-sm font-semibold text-white">{user?.name || 'Mahesh'}</h4>
              <p className="text-xs text-zinc-400">{user?.email || 'developer@devflow.io'}</p>
              <div className="mt-3 rounded-full bg-purple-950/60 border border-purple-800/40 px-3 py-1 text-[11px] text-purple-300 font-medium">
                {userRole}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#222228] flex justify-end">
              <button 
                onClick={() => {
                  logout()
                  setIsProfileModalOpen(false)
                  toast.success('Logged out successfully')
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-800/40 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/60"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2c2c34] bg-[#151519] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
              <h3 className="text-base font-semibold text-white">Create New Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-400">Task Title</label>
                  <button 
                    type="button"
                    onClick={handleEnhanceTaskWithAI}
                    disabled={isEnhancing}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40"
                  >
                    {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ✨ Enhance with AI
                  </button>
                </div>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle} 
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Integrate OAuth authentication"
                  className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={newTaskDesc} 
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Add details, bullet points, or instructions..."
                  className="w-full p-2.5 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Project</label>
                <select 
                  value={newTaskProject}
                  onChange={e => setNewTaskProject(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white"
                >
                  {projectsList.map((p: any) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Priority</label>
                  <select 
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Due Date</label>
                  <input 
                    type="text"
                    value={newTaskDue}
                    onChange={e => setNewTaskDue(e.target.value)}
                    placeholder="e.g., Today, Sep 10"
                    className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => {
                    setIsTaskModalOpen(false)
                    setIsAIModalOpen(true)
                  }}
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles size={14} /> Generate with AI
                </button>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#2c2c34] text-xs text-zinc-300 hover:bg-[#1c1c22]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-black shadow-sm hover:bg-zinc-200"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2c2c34] bg-[#151519] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
              <h3 className="text-base font-semibold text-white">Create New Project</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={newProjName} 
                  onChange={e => setNewProjName(e.target.value)}
                  placeholder="e.g., Microservice Architecture"
                  className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={newProjDesc} 
                  onChange={e => setNewProjDesc(e.target.value)}
                  placeholder="Brief summary of goals..."
                  className="w-full p-2.5 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none focus:border-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Color Theme</label>
                <div className="flex gap-2">
                  {['blue', 'violet', 'amber', 'teal'].map(t => (
                    <button 
                      key={t} 
                      type="button"
                      onClick={() => setNewProjTone(t)}
                      className={`size-7 rounded-full border-2 capitalize ${
                        newProjTone === t ? 'border-white scale-110' : 'border-transparent'
                      } ${
                        t === 'blue' ? 'bg-blue-500' :
                        t === 'violet' ? 'bg-violet-500' :
                        t === 'amber' ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => {
                    setAiProjTitle(newProjName || 'New Project')
                    setAiProjDesc(newProjDesc)
                    setIsProjectModalOpen(false)
                    setIsAIModalOpen(true)
                  }}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles size={14} /> AI Task Breakdown
                </button>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#2c2c34] text-xs text-zinc-300 hover:bg-[#1c1c22]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-black shadow-sm hover:bg-zinc-200"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
