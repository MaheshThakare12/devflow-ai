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
import { useSuggestTasks } from '@/hooks/useAI'
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

const initialProjects = [
  { id: '1', name: 'E-Commerce Platform', description: 'Modern online shopping platform with authentication and payment integration.', progress: 78, tasks: 24, done: 19, due: 'Sep 18', status: 'On track', tone: 'blue', team: ['MC', 'AK', 'RS'] },
  { id: '2', name: 'Developer Portfolio', description: 'Personal portfolio showcasing projects, skills, and technical writing.', progress: 92, tasks: 12, done: 11, due: 'Sep 05', status: 'On track', tone: 'violet', team: ['MC', 'JL'] },
  { id: '3', name: 'AI Task Manager', description: 'Intelligent task planning with natural language and smart prioritization.', progress: 46, tasks: 18, done: 8, due: 'Oct 02', status: 'At risk', tone: 'amber', team: ['MC', 'NT', 'AK'] },
  { id: '4', name: 'College Management System', description: 'Unified platform for students, faculty, and administration workflows.', progress: 64, tasks: 31, done: 20, due: 'Oct 24', status: 'On track', tone: 'teal', team: ['MC', 'RS'] },
]

const initialTasks = [
  { id: 't1', title: 'Design authentication flow', project: 'E-Commerce Platform', priority: 'High', status: 'In Progress', due: 'Today', assignee: 'MC' },
  { id: 't2', title: 'Create REST API endpoints', project: 'AI Task Manager', priority: 'High', status: 'Todo', due: 'Aug 26', assignee: 'AK' },
  { id: 't3', title: 'Implement MySQL database schema', project: 'College Management System', priority: 'Medium', status: 'In Progress', due: 'Aug 28', assignee: 'RS' },
  { id: 't4', title: 'Build responsive dashboard', project: 'Developer Portfolio', priority: 'Medium', status: 'Done', due: 'Aug 22', assignee: 'MC' },
  { id: 't5', title: 'Integrate AI task generator', project: 'AI Task Manager', priority: 'Low', status: 'Todo', due: 'Sep 01', assignee: 'NT' },
]

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
  onOpenProfile
}: { 
  collapsed: boolean; 
  setCollapsed: (v: boolean) => void; 
  mobileOpen: boolean; 
  setMobileOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  onOpenProfile: () => void;
}) {
  const { user } = useAuthStore()
  const userName = user?.name || 'Mahesh'
  const userRole = user?.role || 'Developer'
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

      {!collapsed && (
        <div className="rounded-xl bg-[#1c1c22] p-3.5 border border-[#26262e]">
          <div className="mb-2 flex items-center gap-2">
            <Gauge size={15} className="text-white" />
            <span className="text-xs font-semibold text-white">Weekly goal</span>
          </div>
          <div className="mb-2 flex justify-between text-[11px] text-zinc-400">
            <span>18 of 25 tasks</span>
            <span>72%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#26262e]">
            <div className="h-full w-[72%] rounded-full bg-white" />
          </div>
        </div>
      )}

      <button 
        onClick={onOpenProfile}
        className="mt-5 flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[#1c1c22] transition-colors w-full"
      >
        <Avatar initials={initials} />
        {!collapsed && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{userName}</span>
            <span className="block text-[11px] text-zinc-400">{userRole}</span>
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

function ProjectCard({ project, onOpenAI }: { project: any; onOpenAI: (proj: any) => void }) {
  const title = project.name || project.title || 'Untitled Project'
  const desc = project.description || 'No description provided.'
  const progress = project.progress ?? 65
  const tone = project.tone || 'blue'

  return (
    <article className="group rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#33333e]">
      <div className="flex items-start justify-between">
        <div className={`grid size-9 place-items-center rounded-lg ${
          tone === 'blue' ? 'bg-blue-950/50 text-blue-400 border border-blue-800/30' :
          tone === 'violet' ? 'bg-violet-950/50 text-violet-400 border border-violet-800/30' :
          tone === 'amber' ? 'bg-amber-950/50 text-amber-400 border border-amber-800/30' :
          'bg-teal-950/50 text-teal-400 border border-teal-800/30'
        }`}>
          <FolderKanban size={18} />
        </div>
        <button 
          onClick={() => onOpenAI(project)}
          title="AI Generate Tasks for Project"
          className="text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 border border-amber-700/40 transition-colors"
        >
          <Sparkles size={12} /> AI Tasks
        </button>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1.5 min-h-10 text-xs leading-5 text-zinc-400 line-clamp-2">{desc}</p>
      
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="font-medium text-white">{progress}% complete</span>
        <span className="text-zinc-500">{project.done || 12}/{project.tasks || 18} tasks</span>
      </div>
      
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#222228]">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            progress > 80 ? 'bg-emerald-500' : progress < 50 ? 'bg-amber-500' : 'bg-white'
          }`} 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="mt-5 flex items-center justify-between pt-2 border-t border-[#222228]">
        <div className="flex -space-x-1.5">
          {(project.team || ['MC', 'AK']).map((x: string) => (
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

  // Real-time API Hooks
  const { data: apiProjects, isLoading: isLoadingProjects } = useProjects()
  const { data: apiTasks, isLoading: isLoadingTasks } = useTasks()
  const createProjectMutation = useCreateProject()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const suggestTasksMutation = useSuggestTasks()

  // Local state fallbacks
  const [localProjects, setLocalProjects] = useState(initialProjects)
  const [localTasks, setLocalTasks] = useState(initialTasks)

  // Merge API and local data
  const projectsList = useMemo(() => {
    if (apiProjects && apiProjects.length > 0) {
      return apiProjects.map((p: any) => ({
        id: p._id,
        name: p.title,
        description: p.description || 'Engineering project',
        progress: 65,
        tasks: 10,
        done: 6,
        due: 'Sep 30',
        status: 'On track',
        tone: 'blue',
        team: ['MC', 'AK']
      }))
    }
    return localProjects
  }, [apiProjects, localProjects])

  const tasksList = useMemo(() => {
    if (apiTasks && apiTasks.length > 0) {
      return apiTasks.map((t: any) => ({
        id: t._id,
        title: t.title,
        project: typeof t.project === 'object' ? t.project?.title : 'Project',
        priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
        status: t.status === 'done' ? 'Done' : t.status === 'in-progress' ? 'In Progress' : 'Todo',
        due: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
        assignee: 'MC'
      }))
    }
    return localTasks
  }, [apiTasks, localTasks])

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)

  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiProjTitle, setAiProjTitle] = useState('E-Commerce Platform')
  const [aiProjDesc, setAiProjDesc] = useState('Build an e-commerce platform with authentication, cart, and payment processing.')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState<any[]>([])
  const [selectedAiIndices, setSelectedAiIndices] = useState<number[]>([])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskProject, setNewTaskProject] = useState('E-Commerce Platform')
  const [newTaskPriority, setNewTaskPriority] = useState('High')
  const [newTaskDue, setNewTaskDue] = useState('Today')

  const [newProjName, setNewProjName] = useState('')
  const [newProjDesc, setNewProjDesc] = useState('')
  const [newProjTone, setNewProjTone] = useState('blue')

  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const filteredTasks = useMemo(() => {
    return tasksList.filter(t => {
      const matchSearch = `${t.title} ${t.project}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All status' || t.status === statusFilter
      const matchPriority = priorityFilter === 'All priorities' || t.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    })
  }, [tasksList, searchQuery, statusFilter, priorityFilter])

  const filteredProjects = useMemo(() => {
    return projectsList.filter(p => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  }, [projectsList, searchQuery])

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

  // Import AI tasks into workspace
  const handleImportAITasks = () => {
    const tasksToImport = selectedAiIndices.map(i => aiGeneratedTasks[i])
    if (!tasksToImport.length) return

    const newTasks = tasksToImport.map((t, index) => ({
      id: `ai_${Date.now()}_${index}`,
      title: t.title,
      project: aiProjTitle,
      priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
      status: 'Todo',
      due: 'Sep 15',
      assignee: user?.name ? user.name.substring(0, 2).toUpperCase() : 'MC'
    }))

    setLocalTasks([...newTasks, ...localTasks])
    setIsAIModalOpen(false)
    setAiGeneratedTasks([])
    toast.success(`Imported ${newTasks.length} AI generated tasks!`)
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    // Persist to backend API if projects exist
    if (apiProjects && apiProjects.length > 0) {
      createTaskMutation.mutate({
        title: newTaskTitle,
        project: apiProjects[0]._id as any,
        priority: newTaskPriority.toLowerCase() as any,
        status: 'todo'
      })
    }

    const newTask = {
      id: `t_${Date.now()}`,
      title: newTaskTitle,
      project: newTaskProject,
      priority: newTaskPriority,
      status: 'Todo',
      due: newTaskDue || 'Today',
      assignee: user?.name ? user.name.substring(0, 2).toUpperCase() : 'MC'
    }

    setLocalTasks([newTask, ...localTasks])
    setNewTaskTitle('')
    setIsTaskModalOpen(false)
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
                  <article className="min-w-0 rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-white">Productivity overview</h2>
                        <p className="mt-1 text-xs text-zinc-400">Your activity over the last 7 days</p>
                      </div>
                      <button className="flex items-center gap-1.5 rounded-lg border border-[#2c2c34] bg-[#1a1a20] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white">
                        Last 7 days <ChevronDown size={14} />
                      </button>
                    </div>

                    <div className="mt-6 h-[235px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="completed" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="#222228" strokeDasharray="3 3" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #2c2c34', background: '#18181f', fontSize: 12, color: '#ffffff' }} />
                          <Area type="monotone" dataKey="created" stroke="#71717a" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                          <Area type="monotone" dataKey="completed" stroke="#ffffff" fill="url(#completed)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex gap-5 text-xs text-zinc-400 pt-3 border-t border-[#222228]">
                      <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-white" />Tasks completed</span>
                      <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-zinc-500" />Tasks created</span>
                    </div>
                  </article>

                  <article className="rounded-xl border border-[#222228] bg-[#151519] p-5 shadow-sm md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-white">Recent activity</h2>
                        <p className="mt-1 text-xs text-zinc-400">What&apos;s happening across your workspace</p>
                      </div>
                      <button className="text-xs font-medium text-zinc-300 hover:text-white hover:underline">View all</button>
                    </div>

                    <div className="mt-5 flex flex-col divide-y divide-[#222228]">
                      {activities.map(([action, name, time, Icon]) => (
                        <div key={name} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#222228] text-white">
                            <Icon size={14} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs leading-5">
                              <span className="text-zinc-400">{action} </span>
                              <span className="font-semibold text-white">{name}</span>
                            </p>
                            <p className="mt-0.5 text-[11px] text-zinc-500">{time}</p>
                          </div>
                        </div>
                      ))}
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
                  <h1 className="text-2xl font-bold text-white">Engineering Analytics</h1>
                  <p className="text-xs text-zinc-400 mt-1">Velocity, sprint throughput, and developer productivity indicators.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Sprint Velocity (Tasks Completed)</h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                          <XAxis dataKey="week" stroke="#71717a" fontSize={11} />
                          <YAxis stroke="#71717a" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2c2c34', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="velocity" fill="#ffffff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#222228] bg-[#151519] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Deep Work Hours per Sprint</h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                          <XAxis dataKey="week" stroke="#71717a" fontSize={11} />
                          <YAxis stroke="#71717a" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #2c2c34', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="hours" fill="#71717a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
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
                  <div className="flex items-center gap-4 pb-6 border-b border-[#222228]">
                    <Avatar initials="MC" />
                    <div>
                      <h3 className="text-base font-semibold text-white">{user?.name || 'Mahesh'}</h3>
                      <p className="text-xs text-zinc-400">{user?.email || 'developer@devflow.io'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Developer Handle</label>
                      <input type="text" defaultValue={user?.name || 'Mahesh'} className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Role / Specialization</label>
                      <input type="text" defaultValue="Full Stack Engineer" className="w-full h-9 px-3 rounded-lg border border-[#2c2c34] bg-[#0e0e11] text-xs text-white outline-none" />
                    </div>
                    <button 
                      onClick={() => toast.success('Settings saved!')}
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
              <div className="mt-3 rounded-full bg-zinc-800 px-3 py-1 text-[11px] text-zinc-300 font-medium">
                {user?.role || 'Developer'}
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
                <label className="block text-xs font-medium text-zinc-400 mb-1">Task Title</label>
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
