import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { authSelectors, timeManagementSelectors, timeManagementOperations } from 'store';
import { toast } from 'react-toastify';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import './TimeManagementPage.scss';

// ---------- date helpers ----------
const pad = n => String(n).padStart(2, '0');
const parse = s => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const toStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (s, n) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return toStr(d);
};
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const todayStr = () => toStr(new Date());
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const weekday = s => WEEKDAYS[parse(s).getDay()];
const isWeekend = s => {
  const w = parse(s).getDay();
  return w === 0 || w === 6;
};
const isMonday = s => parse(s).getDay() === 1;

const COLORS = ['#5784f4', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#e91e63', '#795548'];
const EXCLUDE_RULES = [
  { value: 'none', label: 'Нет' },
  { value: 'fri', label: 'Пятницы' },
  { value: 'weekend', label: 'Выходные' },
];
const KINDS = [
  { value: 'book', label: 'Книга' },
  { value: 'walk', label: 'Ходьба' },
  { value: 'other', label: 'Другое' },
];
const WALK_REASONS = [
  { value: 'lazy', label: 'Лень' },
  { value: 'sick', label: 'Болезнь' },
  { value: 'work', label: 'Работа' },
  { value: 'rest', label: 'Отдых' },
];
// Смайлик по умолчанию для причины пропуска ходьбы + пресеты на выбор
const REASON_EMOJI = { lazy: '😴', sick: '🤒', work: '💼', rest: '🏖️' };
const WALK_EMOJIS = ['🤒', '😴', '💼', '🏖️', '🌧️', '🤕', '😷', '🥶'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_RU = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

const emptyTask = () => ({
  id: null,
  name: '',
  info: '',
  color: COLORS[0],
  kind: 'other',
  mode: 'percent',
  unitsTotal: '',
  unitsStrategy: 'even',
  unitsPerDay: '',
  start: todayStr(),
  plannedEnd: addDays(todayStr(), 13),
  plannedDays: 14,
  planMode: 'range',
  daysCount: '',
  excludeRule: 'none',
  exclusions: [],
  marks: {},
});

const isExcluded = (d, exclusions, rule) => {
  if (exclusions?.includes(d)) return true;
  if (rule === 'fri' && weekday(d) === 'Пт') return true;
  if (rule === 'weekend' && isWeekend(d)) return true;
  return false;
};

// План единиц в день (для режима «единицы»)
const plannedUnits = (task, idx) => {
  if (task.mode !== 'units') return null;
  const total = Number(task.unitsTotal) || 0;
  const pd = task.plannedDays || 1;
  if (task.unitsStrategy === 'even') {
    const base = Math.floor(total / pd);
    const rem = total % pd;
    if (idx < rem) return base + 1;
    return base;
  }
  const perDay = Number(task.unitsPerDay) || 0;
  if (idx < pd - 1) return perDay;
  return Math.max(0, total - perDay * (pd - 1));
};

// Алгоритм пролонгации: пропуск/недовыполнение → +дни (дефицит),
// перевыполнение → −дни (излишек), исключённый день → переносится в конец.
const computeSchedule = (task, effStart) => {
  const today = todayStr();
  const plannedDays = task.plannedDays || 1;
  const origEnd = addDays(effStart, plannedDays - 1);
  let balance = 0; // сумма (100 − процент): + нужно больше дней, − излишек
  let excludedCount = 0;
  let d = effStart;
  while (d <= origEnd) {
    if (isExcluded(d, task.exclusions || [], task.excludeRule || 'none')) {
      excludedCount += 1;
    } else if (d <= today && task.kind !== 'walk') {
      // Ходьба: пропущенные дни НЕ переносятся в конец (без пролонгации)
      const m = (task.marks || {})[d];
      if (d === today && (!m || !m.done)) {
        // Текущий день без отметки — не считаем пропуском (как и в ячейках 'current'),
        // иначе график «дышит» +1 день до вечерней отметки
      } else {
        const pct = m && m.done ? m.percent || 0 : 0;
        balance += 100 - pct;
      }
    }
    d = addDays(d, 1);
  }
  let ext = 0;
  while (balance >= 100) {
    ext += 1;
    balance -= 100;
  }
  while (balance <= -100) {
    ext -= 1;
    balance += 100;
  }
  // Книга полностью прочитана по страницам — дефицита нет, не продлеваем,
  // даже если остались неотмеченные дни (добивка хвоста, финиш раньше плана)
  if (ext > 0 && task.kind === 'book' && task.mode === 'units') {
    const total = Number(task.unitsTotal) || 0;
    if (total > 0) {
      let doneUnits = 0;
      Object.values(task.marks || {}).forEach(mm => {
        if (mm && mm.done) doneUnits += Number(mm.units) || 0;
      });
      if (doneUnits >= total) {
        ext = 0;
        balance = 0;
      }
    }
  }
  const carry = Math.round(balance); // остаток −99..99
  const scheduledCount = Math.max(1, plannedDays + ext + excludedCount);
  const end = addDays(effStart, scheduledCount - 1);
  return { plannedDays, origEnd, end, carry, excludedCount, ext };
};

const getForecast = (task) => {
  if (task.kind !== 'book' || task.mode !== 'units') return null;
  const total = Number(task.unitsTotal) || 0;
  if (!total) return null;
  let done = 0;
  Object.values(task.marks || {}).forEach(m => { if (m.done) done += Number(m.units) || 0; });
  const remaining = Math.max(0, total - done);
  if (remaining === 0) return { done, remaining: 0, finished: true, avg: 0, estimatedEnd: null, diff: 0 };
  const doneEntries = Object.entries(task.marks || {}).filter(([, m]) => m.done && Number(m.units) > 0);
  const avg = doneEntries.length ? done / doneEntries.length : 0;
  if (!avg) return null;
  const daysNeeded = Math.ceil(remaining / avg);
  let est = addDays(todayStr(), 1);
  let need = daysNeeded;
  let guard = 0;
  while (need > 0 && guard < 500) {
    if (!isExcluded(est, task.exclusions || [], task.excludeRule || 'none')) need -= 1;
    if (need > 0) est = addDays(est, 1);
    guard += 1;
  }
  const plannedEnd = task.plannedEnd || addDays(task.start, (task.plannedDays || 1) - 1);
  const diff = diffDays(plannedEnd, est);
  return { done, remaining, avg: Math.round(avg * 10) / 10, estimatedEnd: est, diff, finished: false };
};

// Описание ячейки дня для задачи
const dayCell = (task, sch, effStart, d) => {
  if (d < effStart || d > sch.end) {
    if (d > sch.end && d <= sch.origEnd) return { kind: 'cut', title: 'Сокращено (излишек)' };
    return { kind: 'empty' };
  }
  const { origEnd, excludedCount, carry } = sch;
  if (d <= origEnd) {
    if (isExcluded(d, task.exclusions || [], task.excludeRule || 'none')) return { kind: 'gap', title: 'Перенесён в конец' };
const past = d <= todayStr();
      const m = (task.marks || {})[d];
      if (past) {
        if (!m || !m.done) {
          if (d === todayStr()) return { kind: 'current' };
          // Ходьба: вместо крестика можно показать смайлик причины пропуска
          if (task.kind === 'walk') {
            const emoji = m?.emoji || (m?.reason ? REASON_EMOJI[m.reason] : '');
            if (emoji) {
              const reasonLabel = (WALK_REASONS.find(r => r.value === m.reason)?.label) || '';
              return { kind: 'missEmoji', emoji, title: `Пропуск${reasonLabel ? `: ${reasonLabel}` : ''}` };
            }
          }
          return { kind: 'miss' };
        }
        return { kind: 'done', fill: m.percent };
      }
    return { kind: 'planned' };
  }
  const tailIdx = diffDays(origEnd, d); // 1 для первого хвостового дня
  if (tailIdx <= excludedCount) return { kind: 'relocated' };
  const extIdx = tailIdx - excludedCount;
  return { kind: 'extension', fill: extIdx === 1 ? carry : 0 };
};

const buildRows = (tasks, collapsed) => {
  const order = [];
  const map = {};
  tasks.forEach(t => {
    const p = t.name || 'Без названия';
    if (!map[p]) {
      map[p] = [];
      order.push(p);
    }
    map[p].push(t);
  });
  const result = [];
  order.forEach(p => {
    result.push({ type: 'phase', phase: p, items: map[p] });
    if (!collapsed[p]) {
      const sorted = [...map[p]].sort((a, b) => (a.start < b.start ? -1 : 1));
      let prevEnd = null;
      sorted.forEach(t => {
        // Вручную можно начать в день окончания предыдущей (t.start === prevEnd),
        // иначе цепочка идёт непрерывно со следующего дня
        let effStart = t.start;
        if (prevEnd && t.start !== prevEnd) effStart = addDays(prevEnd, 1);
        const sch = computeSchedule(t, effStart);
        result.push({ type: 'task', task: t, effStart, sch });
        prevEnd = sch.end;
      });
    }
  });
  return result;
};

const COLS = [
  { key: 'title', label: 'Категория / Задача', width: 320 },
  { key: 'fact', label: 'Факт', width: 130 },
];
const LEFT_OFFSET = COLS.reduce((acc, c, i) => {
  acc[i] = i === 0 ? 0 : acc[i - 1] + COLS[i - 1].width;
  return acc;
}, []);

// 3-way merge (только фронт, бэкенд не трогаем): local — текущее состояние,
// snap — последнее известное состояние сервера, fresh — свежий GET с сервера.
// Правило: менялось локально → побеждает локальное, иначе — свежее с сервера.
const sameJSON = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const mergeMarks = (local, snap, fresh) => {
  const out = {};
  const dates = new Set([...Object.keys(snap || {}), ...Object.keys(local || {}), ...Object.keys(fresh || {})]);
  dates.forEach(d => {
    const s = snap?.[d];
    const l = local?.[d];
    const f = fresh?.[d];
    if (sameJSON(l, s)) {
      if (f !== undefined) out[d] = f; // локально не трогали — берём свежее (включая удаление на другом устройстве)
    } else if (l !== undefined) {
      out[d] = l; // меняли локально — локальное побеждает
    }
    // удалено локально — пропускаем
  });
  return out;
};

const SCALAR_KEYS = [
  'name', 'info', 'color', 'kind', 'mode', 'unitsTotal', 'unitsStrategy', 'unitsPerDay',
  'start', 'plannedEnd', 'plannedDays', 'planMode', 'daysCount', 'excludeRule', 'archived',
];

const mergeTask = (lt, st, ft) => {
  const merged = { ...lt };
  SCALAR_KEYS.forEach(k => {
    merged[k] = !sameJSON(lt[k], st[k]) ? lt[k] : ft[k];
  });
  if (lt.exclusions || st.exclusions || ft.exclusions) {
    merged.exclusions = !sameJSON(lt.exclusions || [], st.exclusions || [])
      ? lt.exclusions || []
      : ft.exclusions || [];
  }
  if (lt.marks || st.marks || ft.marks) {
    merged.marks = mergeMarks(lt.marks, st.marks, ft.marks);
  }
  return merged;
};

const mergeTMLists = (localList, snapList, freshList, mergeFn = mergeTask) => {
  const snapById = Object.fromEntries((snapList || []).map(t => [t.id, t]));
  const freshById = Object.fromEntries((freshList || []).map(t => [t.id, t]));
  const localById = Object.fromEntries((localList || []).map(t => [t.id, t]));
  const out = [];
  (freshList || []).forEach(ft => {
    const lt = localById[ft.id];
    const st = snapById[ft.id];
    if (!lt) {
      if (st) return; // удалено локально
      out.push(ft); // добавлено на другом устройстве
      return;
    }
    if (!st) {
      out.push(lt); // добавлено локально
      return;
    }
    if (sameJSON(lt, st)) {
      out.push(ft); // не менялось локально — берём свежее
      return;
    }
    out.push(mergeFn(lt, st, ft));
  });
  (localList || []).forEach(lt => {
    if (!freshById[lt.id] && !snapById[lt.id]) out.push(lt); // добавлено локально, на сервере пока нет
  });
  return out;
};

// Дела: тот же 3-way merge, свои поля
const TODO_KEYS = ['title', 'date', 'done', 'doneDate', 'priority', 'rollover', 'postponed', 'createdAt'];

const mergeTodo = (lt, st, ft) => {
  const merged = { ...lt };
  TODO_KEYS.forEach(k => {
    merged[k] = !sameJSON(lt[k], st[k]) ? lt[k] : ft[k];
  });
  return merged;
};

const mergeTodoLists = (localList, snapList, freshList) => mergeTMLists(localList, snapList, freshList, mergeTodo);

// Приоритеты дел: P1 выше; сортировка — приоритет, затем создание
const TODO_PRIORITIES = ['P1', 'P2', 'P3'];
const TODO_PRIORITY_WEIGHT = { P1: 0, P2: 1, P3: 2 };
const TODO_ROLLOVERS = [
  { value: 'ask', label: 'Спрашивать', icon: '?' },
  { value: 'today', label: 'На сегодня', icon: '📅' },
  { value: 'plan', label: 'В план', icon: '📥' },
];

const sortTodos = list =>
  [...(list || [])].sort((a, b) => {
    const pa = TODO_PRIORITY_WEIGHT[a.priority] ?? 1;
    const pb = TODO_PRIORITY_WEIGHT[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

export const TimeManagementPage = () => {
  const isAdmin = useSelector(authSelectors.getIsAdmin);
  const dispatch = useDispatch();

  const reduxTasks = useSelector(timeManagementSelectors.getTimeManagementTasks);
  const reduxPlans = useSelector(timeManagementSelectors.getTimeManagementPlans);
  const reduxTodos = useSelector(timeManagementSelectors.getTimeManagementTodos);
  const loaded = useSelector(timeManagementSelectors.getTimeManagementLoaded);

  const [collapsed, setCollapsed] = useState({});
  const [taskForm, setTaskForm] = useState(emptyTask());
  const [taskOpen, setTaskOpen] = useState(false);
  const [dayForm, setDayForm] = useState(null);
  const [dayOpen, setDayOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [week, setWeek] = useState(1);
  const [weeks, setWeeks] = useState(8);
  const [view, setView] = useState('board');
  const [selected, setSelected] = useState({});
  const [boardSelected, setBoardSelected] = useState({});
  const [dragTaskId, setDragTaskId] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedYear, setSelectedYear] = useState(() => Number(todayStr().slice(0, 4)));
  const [selectedMonth, setSelectedMonth] = useState(() => Number(todayStr().slice(5, 7)) - 1);
  const [granularity, setGranularity] = useState('months'); // months | days
  const [selectedBook, setSelectedBook] = useState('all');
  const [donutPeriod, setDonutPeriod] = useState('month');
  const [perBookMode, setPerBookMode] = useState(false);
  // Цель недели: активных дней (цель — локальная настройка, прогресс — с сервера)
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try {
      const v = Number(localStorage.getItem('tm-weekly-goal'));
      return v >= 1 && v <= 7 ? v : 5;
    } catch {
      return 5;
    }
  });
  const setWeeklyGoalPersist = v => {
    const nv = Math.min(7, Math.max(1, v));
    setWeeklyGoal(nv);
    try {
      localStorage.setItem('tm-weekly-goal', String(nv));
    } catch {
      /* ignore */
    }
  };

  const today = todayStr();

  // Local state synced with Redux
  const [tasks, setTasks] = useState(() => reduxTasks || []);
  const [plans, setPlans] = useState(() => reduxPlans || []);
  const [todos, setTodos] = useState(() => reduxTodos || []);
  // Дела: быстрое добавление, окно дней, фильтр, drag&drop, просрочка
  const [todoTitle, setTodoTitle] = useState('');
  const [todoPriority, setTodoPriority] = useState('P2');
  const [todoDate, setTodoDate] = useState('today'); // today | tomorrow | plan
  const [hideDoneTodos, setHideDoneTodos] = useState(false);
  const [dragTodoId, setDragTodoId] = useState(null);
  const [overdueOpen, setOverdueOpen] = useState(false);
  const [overdueIds, setOverdueIds] = useState([]);
  const [todoDayModal, setTodoDayModal] = useState(null); // дата дня для модалки дел
  const [todoModalTitle, setTodoModalTitle] = useState('');
  const [expandedTodoDay, setExpandedTodoDay] = useState(null); // раздвинутый кликом день ганта

  const addTodoToDate = () => {
    const title = todoModalTitle.trim();
    if (!title || !todoDayModal) return;
    setTodos(prev => [
      ...prev,
      {
        id: `td${Date.now()}`,
        title,
        date: todoDayModal,
        done: false,
        doneDate: undefined,
        priority: TODO_PRIORITIES.includes(todoPriority) ? todoPriority : 'P2',
        rollover: 'ask',
        postponed: 0,
        createdAt: Date.now(),
      },
    ]);
    setTodoModalTitle('');
  };

  useEffect(() => {
    if (!loaded) {
      dispatch(timeManagementOperations.fetchTimeManagement());
    }
  }, [dispatch, loaded]);

  // Sync Redux -> local on load
  useEffect(() => {
    if (loaded && reduxTasks.length > 0) {
      setTasks(reduxTasks);
    }
  }, [loaded, reduxTasks]);

  useEffect(() => {
    if (loaded && reduxPlans.length > 0) {
      setPlans(reduxPlans);
    }
  }, [loaded, reduxPlans]);

  useEffect(() => {
    if (loaded && reduxTodos.length > 0) {
      setTodos(reduxTodos);
    }
  }, [loaded, reduxTodos]);

  // Снапшот последнего известного состояния сервера (для 3-way merge)
  const lastServerRef = useRef(null);
  useEffect(() => {
    lastServerRef.current = { tasks: reduxTasks || [], plans: reduxPlans || [], todos: reduxTodos || [] };
  }, [reduxTasks, reduxPlans, reduxTodos]);

  // Debounced auto-save with content check
  const saveTimeoutRef = useRef(null);
  const prevTasksRef = useRef(JSON.stringify(tasks));
  const prevPlansRef = useRef(JSON.stringify(plans));
  const prevTodosRef = useRef(JSON.stringify(todos));
  const saveToServer = useCallback(async () => {
    let tasksToSave = tasks;
    let plansToSave = plans;
    let todosToSave = todos;
    try {
      // Подтягиваем свежее с сервера и сливаем по датам/полям, чтобы не затереть правки с другого устройства
      const { data } = await axios.get('/timemanagement');
      const fresh = data?.data;
      const snap = lastServerRef.current;
      if (fresh && snap) {
        const mergedTasks = mergeTMLists(tasks, snap.tasks, fresh.tasks || []);
        const mergedPlans = mergeTMLists(plans, snap.plans, fresh.plans || []);
        const mergedTodos = mergeTodoLists(todos, snap.todos, fresh.todos || []);
        if (JSON.stringify(mergedTasks) !== JSON.stringify(tasks)) setTasks(mergedTasks);
        if (JSON.stringify(mergedPlans) !== JSON.stringify(plans)) setPlans(mergedPlans);
        if (JSON.stringify(mergedTodos) !== JSON.stringify(todos)) setTodos(mergedTodos);
        tasksToSave = mergedTasks;
        plansToSave = mergedPlans;
        todosToSave = mergedTodos;
      }
    } catch {
      // нет связи — сохраняем локальное как есть
    }
    prevTasksRef.current = JSON.stringify(tasksToSave);
    prevPlansRef.current = JSON.stringify(plansToSave);
    prevTodosRef.current = JSON.stringify(todosToSave);
    dispatch(
      timeManagementOperations.saveTimeManagement({ tasks: tasksToSave, plans: plansToSave, todos: todosToSave })
    );
  }, [dispatch, tasks, plans, todos]);

  useEffect(() => {
    if (!loaded || (tasks.length === 0 && todos.length === 0)) return;
    const currentTasks = JSON.stringify(tasks);
    const currentPlans = JSON.stringify(plans);
    const currentTodos = JSON.stringify(todos);
    if (
      currentTasks === prevTasksRef.current &&
      currentPlans === prevPlansRef.current &&
      currentTodos === prevTodosRef.current
    )
      return;
    prevTasksRef.current = currentTasks;
    prevPlansRef.current = currentPlans;
    prevTodosRef.current = currentTodos;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [saveToServer, loaded, tasks, plans, todos]);

  // Существующие типы (для быстрого выбора)
  const types = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.name]) map[t.name] = t.color;
    });
    return Object.entries(map).map(([name, color]) => ({ name, color }));
  }, [tasks]);

  // Окно календаря
  const origin = useMemo(() => {
    if (!tasks.length) return today;
    return tasks.reduce((m, t) => (t.start < m ? t.start : m), tasks[0].start);
  }, [tasks, today]);
  const viewStart = addDays(origin, (Math.max(1, week) - 1) * 7);
  const days = useMemo(
    () => Array.from({ length: Math.max(1, weeks) * 7 }, (_, i) => addDays(viewStart, i)),
    [viewStart, weeks]
  );

  // Строки: фазы (по типу) с авто-продолжением задач одного типа
  const rows = useMemo(() => buildRows(tasks, collapsed), [tasks, collapsed]);
  const boardRows = useMemo(() => buildRows(tasks.filter(t => !t.archived), collapsed), [tasks, collapsed]);

  // Эксперимент: дела подразделом ганта (фазой «Дела» + широкая строка).
  // Сворачивается кареткой фазы, как остальные.
  const boardRowsWithTodos = useMemo(() => {
    const head = { type: 'phase', phase: 'Дела', items: [] };
    if (collapsed['Дела']) return [head, ...boardRows];
    return [head, { type: 'todos' }, ...boardRows];
  }, [boardRows, collapsed]);

  // Авто-архив: задачи, завершённые ≥7 дней назад
  useEffect(() => {
    const cutoff = addDays(today, -7);
    const toArchive = rows
      .filter(r => r.type === 'task' && !r.task.archived && r.sch.end < cutoff)
      .map(r => r.task.id);
    if (toArchive.length) {
      setTasks(prev => prev.map(t => (toArchive.includes(t.id) ? { ...t, archived: true } : t)));
    }
  }, [rows, today]);

  // Статистика по категориям
  const stats = useMemo(() => {
    const map = {};
    const today = todayStr();
    tasks.forEach(t => {
      const p = t.name || 'Без названия';
      if (!map[p])
        map[p] = {
          name: p,
          color: t.color,
          kind: t.kind,
          planned: 0,
          done: 0,
          fillSum: 0,
          fillCount: 0,
          pagesRead: 0,
          pagesTotal: 0,
          distance: 0,
          reasons: 0,
        };
      const s = map[p];
      s.planned += t.plannedDays || 0;
      s.done += Object.values(t.marks || {}).filter(m => m.done).length;
      s.pagesTotal += Number(t.unitsTotal) || 0;
      let d = t.start;
      const origEnd = addDays(t.start, (t.plannedDays || 1) - 1);
      while (d <= origEnd) {
        if (!isExcluded(d, t.exclusions || [], t.excludeRule || 'none') && d <= today) {
          const m = (t.marks || {})[d];
          s.fillSum += m && m.done ? m.percent || 0 : 0;
          s.fillCount += 1;
          if (m && (m.reason || m.emoji)) s.reasons += 1;
          if (m && m.done) {
            s.pagesRead += Number(m.units) || 0;
            if (t.kind === 'walk') s.distance += ((Number(m.walkTime) || 0) / 60) * (Number(m.speed) || 0);
          }
        }
        d = addDays(d, 1);
      }
    });
    return Object.values(map).map(s => {
      let extra = '';
      if (s.kind === 'book') extra = `прочитано ${s.pagesRead} из ${s.pagesTotal} стр.`;
      else if (s.kind === 'walk')
        extra = s.distance > 0 ? `${s.distance.toFixed(1)} км` : s.reasons ? `пропусков: ${s.reasons}` : 'нет данных';
      else extra = `готово ${s.done}`;
      return { ...s, pct: s.fillCount ? Math.round(s.fillSum / s.fillCount) : 0, extra };
    });
  }, [tasks]);

  // Цель недели: distinct дней с отметками с понедельника по сегодня
  const weekProgress = useMemo(() => {
    const t = todayStr();
    const dow = (parse(t).getDay() + 6) % 7; // Пн=0
    const mon = addDays(t, -dow);
    const dates = new Set();
    tasks
      .filter(x => !x.archived)
      .forEach(x => {
        Object.entries(x.marks || {}).forEach(([d, m]) => {
          if (m?.done && d >= mon && d <= t) dates.add(d);
        });
      });
    const done = dates.size;
    return { done, goal: weeklyGoal, pct: weeklyGoal ? Math.min(100, Math.round((done / weeklyGoal) * 100)) : 0 };
  }, [tasks, weeklyGoal]);

  const availableYears = useMemo(() => {
    const set = new Set([Number(todayStr().slice(0,4))]);
    tasks.forEach(t => {
      if (t.start) set.add(Number(t.start.slice(0,4)));
      Object.keys(t.marks||{}).forEach(d=> set.add(Number(d.slice(0,4))));
    });
    return Array.from(set).sort((a,b)=>a-b);
  }, [tasks]);

  const availableBooks = useMemo(() => {
    const books = tasks.filter(t => t.kind === 'book');
    if (books.length) {
      return books
        .map(t => ({
          id: t.id,
          label: `${t.name || ''} ${t.info || ''}`.trim() || t.name || 'Книга',
          name: t.name,
          info: t.info,
        }))
        .sort((a,b)=> a.label.localeCompare(b.label));
    }
    const set = new Set();
    tasks.forEach(t => { if (t.name) set.add(t.name); });
    return Array.from(set).map(name=> ({ id: name, label: name, name }));
  }, [tasks]);

  const detailed = useMemo(() => {
    const today = todayStr();
    const curYear = Number(today.slice(0,4));
    const curMonthIdx = Number(today.slice(5,7)) - 1;
    const filtered = selectedBook === 'all' ? tasks : tasks.filter(t => t.id === selectedBook || t.name === selectedBook);
    let totalMarks = 0;
    const donePerDay = {};
    const donePerDayPages = {};
    filtered.forEach(t=>{
      const isBookUnits = t.kind === 'book' && t.mode === 'units';
      Object.entries(t.marks||{}).forEach(([d,mark])=>{
        if (!mark?.done) return;
        if (isBookUnits) {
          const v = Number(mark.units) || 0;
          totalMarks += v;
          donePerDay[d] = (donePerDay[d]||0) + 1;
          donePerDayPages[d] = (donePerDayPages[d]||0) + v;
        } else {
          totalMarks += 1;
          donePerDay[d] = (donePerDay[d]||0) + 1;
          donePerDayPages[d] = (donePerDayPages[d]||0) + 1;
        }
      });
    });
    // streaks (filtered)
    const allDoneDates = Object.keys(donePerDay).filter(d=>donePerDay[d]>0).sort();
    let bestStreak = 0; let curSt = 0; let prev = null; let freezeBest = false;
    allDoneDates.forEach(d=>{
      if (!prev) { curSt = 1; freezeBest = false; }
      else {
        const diff = diffDays(prev, d);
        if (diff === 1) curSt += 1;
        else if (diff === 2 && !freezeBest) { curSt += 2; freezeBest = true; }
        else { bestStreak = Math.max(bestStreak, curSt); curSt = 1; freezeBest = false; }
      }
      bestStreak = Math.max(bestStreak, curSt);
      prev = d;
    });
    // streaks с freeze (1 пропуск)
    // best уже посчитан выше с freeze, пересчитаем current с допуском
    let currentStreak2 = 0;
    let cur2 = today;
    let freeze2 = false;
    while (true) {
      if (donePerDay[cur2]) { currentStreak2 += 1; cur2 = addDays(cur2, -1); }
      else if (!freeze2) { freeze2 = true; currentStreak2 += 1; cur2 = addDays(cur2, -1); }
      else break;
      if (currentStreak2 > 365) break;
      if (cur2 < (allDoneDates[0] || cur2) && !donePerDay[cur2] && freeze2) break;
    }
    if (currentStreak2 === 1 && !donePerDay[today]) currentStreak2 = 0;
    let currentStreak = currentStreak2;

    // aggregates for selectedYear (filtered)
    const y = selectedYear;
    const planByMonth = Array(12).fill(0);
    const actualByMonth = Array(12).fill(0);
    filtered.forEach(t=>{
      const isBookUnits = t.kind === 'book' && t.mode === 'units';
      const plannedEnd = t.plannedEnd || addDays(t.start, (t.plannedDays||1)-1);
      let d = t.start;
      const yearStart = `${y}-01-01`;
      const yearEnd = `${y}-12-31`;
      if (!(plannedEnd < yearStart || d > yearEnd)) {
        let cur = d < yearStart ? yearStart : d;
        const end = plannedEnd > yearEnd ? yearEnd : plannedEnd;
        while (cur <= end) {
          if (!isExcluded(cur, t.exclusions||[], t.excludeRule||'none')) {
            const mi = Number(cur.slice(5,7))-1;
            if (isBookUnits) {
              const idx = diffDays(t.start, cur);
              const pu = plannedUnits(t, idx);
              planByMonth[mi] += Number(pu) || 0;
            } else {
              planByMonth[mi] += 1;
            }
          }
          cur = addDays(cur,1);
        }
      }
      Object.entries(t.marks||{}).forEach(([date,mark])=>{
        if (!mark?.done) return;
        if (Number(date.slice(0,4))!==y) return;
        const mi = Number(date.slice(5,7))-1;
        if (isBookUnits) actualByMonth[mi] += Number(mark.units) || 0;
        else actualByMonth[mi] += 1;
      });
    });
    const monthlyData = MONTHS_SHORT.map((name,i)=> ({
      name,
      ru: MONTHS_RU[i],
      monthIdx: i,
      actual: actualByMonth[i],
      plan: planByMonth[i],
      hasPlan: planByMonth[i] > 0,
    }));
    const maxMonthly = Math.max(1, ...monthlyData.map(x=> Math.max(x.actual, x.plan)));
    const yearTotal = actualByMonth.reduce((a,b)=>a+b,0);
    const planYearTotal = planByMonth.reduce((a,b)=>a+b,0);
    const hasAnyPlan = planYearTotal > 0;

    // daily data for selectedYear + selectedMonth (when granularity === 'days')
    const daysInSelMonth = new Date(y, selectedMonth+1, 0).getDate();
    const planByDay = Array(daysInSelMonth).fill(0);
    const actualByDay = Array(daysInSelMonth).fill(0);
    const monthPrefix = `${y}-${pad(selectedMonth+1)}`;
    filtered.forEach(t=>{
      const isBookUnits = t.kind === 'book' && t.mode === 'units';
      const plannedEnd = t.plannedEnd || addDays(t.start, (t.plannedDays||1)-1);
      let cur = t.start;
      const monthStart = `${monthPrefix}-01`;
      const monthEnd = `${monthPrefix}-${pad(daysInSelMonth)}`;
      if (!(plannedEnd < monthStart || cur > monthEnd)) {
        let d = cur < monthStart ? monthStart : cur;
        const end = plannedEnd > monthEnd ? monthEnd : plannedEnd;
        while (d <= end) {
          if (!isExcluded(d, t.exclusions||[], t.excludeRule||'none')) {
            const di = Number(d.slice(8,10))-1;
            if (isBookUnits) {
              const idx = diffDays(t.start, d);
              const pu = plannedUnits(t, idx);
              planByDay[di] += Number(pu) || 0;
            } else {
              planByDay[di] += 1;
            }
          }
          d = addDays(d,1);
        }
      }
      Object.entries(t.marks||{}).forEach(([date,mark])=>{
        if (!mark?.done) return;
        if (!date.startsWith(monthPrefix)) return;
        const di = Number(date.slice(8,10))-1;
        if (di>=0 && di<daysInSelMonth) {
          if (isBookUnits) actualByDay[di] += Number(mark.units) || 0;
          else actualByDay[di] += 1;
        }
      });
    });
    const dailyData = Array.from({length: daysInSelMonth}, (_,i)=> ({
      name: String(i+1),
      label: String(i+1),
      actual: actualByDay[i],
      plan: planByDay[i],
      hasPlan: planByDay[i] > 0,
      date: `${monthPrefix}-${pad(i+1)}`,
      isToday: `${monthPrefix}-${pad(i+1)}` === today,
      isFuture: `${monthPrefix}-${pad(i+1)}` > today,
    }));
    const maxDaily = Math.max(1, ...dailyData.map(x=> Math.max(x.actual, x.plan)));
    const chartData = granularity === 'days' ? dailyData : monthlyData;
    const maxChart = granularity === 'days' ? maxDaily : maxMonthly;
    const chartHasPlan = chartData.some(x=> x.plan > 0);

    // per-book линии для режима "Все книги"
    const perBookData = (() => {
      if (selectedBook !== 'all') return [];
      const books = filtered.filter(t => t.kind === 'book');
      if (!books.length) return [];
      return books.map(t => {
        const isBookUnits = t.kind === 'book' && t.mode === 'units';
        if (granularity === 'months') {
          const pbm = Array(12).fill(0); const abm = Array(12).fill(0);
          const pe = t.plannedEnd || addDays(t.start, (t.plannedDays||1)-1);
          const ys = `${y}-01-01`; const ye = `${y}-12-31`;
          if (!(pe < ys || t.start > ye)) {
            let cur = t.start < ys ? ys : t.start;
            const e = pe > ye ? ye : pe;
            while (cur <= e) {
              if (!isExcluded(cur, t.exclusions||[], t.excludeRule||'none')) {
                const mi = Number(cur.slice(5,7))-1;
                if (isBookUnits) { const idx = diffDays(t.start, cur); pbm[mi] += Number(plannedUnits(t, idx))||0; } else pbm[mi]+=1;
              }
              cur = addDays(cur,1);
            }
          }
          Object.entries(t.marks||{}).forEach(([date,mark])=>{
            if (!mark?.done) return; if (Number(date.slice(0,4))!==y) return;
            const mi = Number(date.slice(5,7))-1;
            if (isBookUnits) abm[mi] += Number(mark.units)||0; else abm[mi]+=1;
          });
          const data = MONTHS_SHORT.map((n,i)=> ({ name:n, actual:abm[i], plan:pbm[i] }));
          return { id: t.id, label: `${t.name||''} ${t.info||''}`.trim()||t.name, color: t.color, data };
        } else {
          const days = daysInSelMonth;
          const pb = Array(days).fill(0); const ab = Array(days).fill(0);
          const pe = t.plannedEnd || addDays(t.start, (t.plannedDays||1)-1);
          const ms = `${monthPrefix}-01`; const me = `${monthPrefix}-${pad(days)}`;
          if (!(pe < ms || t.start > me)) {
            let cur = t.start < ms ? ms : t.start;
            const e = pe > me ? me : pe;
            while (cur <= e) {
              if (!isExcluded(cur, t.exclusions||[], t.excludeRule||'none')) {
                const di = Number(cur.slice(8,10))-1;
                if (isBookUnits) { const idx=diffDays(t.start, cur); pb[di]+= Number(plannedUnits(t, idx))||0; } else pb[di]+=1;
              }
              cur = addDays(cur,1);
            }
          }
          Object.entries(t.marks||{}).forEach(([date,mark])=>{
            if (!mark?.done) return; if (!date.startsWith(monthPrefix)) return;
            const di = Number(date.slice(8,10))-1;
            if (di>=0 && di<days) { if (isBookUnits) ab[di]+= Number(mark.units)||0; else ab[di]+=1; }
          });
          const data = Array.from({length:days},(_,i)=> ({ name:String(i+1), actual:ab[i], plan:pb[i] }));
          return { id: t.id, label: `${t.name||''} ${t.info||''}`.trim()||t.name, color: t.color, data };
        }
      });
    })();

    // heatmap weeks for selectedYear (filtered)
    const weeks = (() => {
      const year = y;
      const first = new Date(year,0,1);
      const last = new Date(year,11,31);
      const start = new Date(first); start.setDate(first.getDate() - ((first.getDay()+6)%7));
      const end = new Date(last); end.setDate(last.getDate() + (6 - ((last.getDay()+6)%7)));
      const ws=[]; let cur=new Date(start);
      const maxVal = Math.max(1, ...Object.values(donePerDayPages).map(v=>v));
      while (cur <= end) {
        const week=[];
        for(let i=0;i<7;i++){
          const dStr=toStr(cur);
          const v = donePerDay[dStr] ? (donePerDayPages[dStr]||donePerDay[dStr]) : 0;
          const intensity = maxVal ? v / maxVal : 0;
          week.push({ date:dStr, value:v, intensity, isOutside: cur.getFullYear()!==year, isFuture: dStr>today, isToday: dStr===today });
          cur.setDate(cur.getDate()+1);
        }
        ws.push(week);
      }
      return ws;
    })();

    // header stats
    const monthNameForStat = MONTHS_SHORT[curMonthIdx];
    const monthCount = actualByMonth[curMonthIdx] || 0;
    const bestMonthVal = Math.max(...actualByMonth);
    const bestMonthIdxSel = actualByMonth.indexOf(bestMonthVal);
    const bestMonthName = MONTHS_SHORT[bestMonthIdxSel];
    const yearStr = String(y);

    // donut data (filtered, respects period and selectedGranularity for month)
    let donutTotalDays, donutMarkedDays;
    if (donutPeriod === 'month') {
      // for days granularity use selectedMonth, otherwise cur month
      const mIdx = granularity === 'days' ? selectedMonth : curMonthIdx;
      const daysInMonth = new Date(y, mIdx+1, 0).getDate();
      const prefix = `${y}-${pad(mIdx+1)}`;
      let marked = 0;
      for (let d=1; d<=daysInMonth; d++) {
        const date = `${prefix}-${pad(d)}`;
        if (donePerDay[date]) marked += 1;
      }
      donutMarkedDays = marked;
      donutTotalDays = daysInMonth;
    } else {
      const isLeap = (y%4===0 && y%100!==0) || y%400===0;
      const daysInYear = isLeap ? 366 : 365;
      let marked = 0;
      Object.keys(donePerDay).forEach(d=>{
        if (Number(d.slice(0,4))===y) marked += 1;
      });
      donutMarkedDays = marked;
      donutTotalDays = daysInYear;
    }
    const donutData = [
      { name: 'Отмеченные дни', value: donutMarkedDays, color: '#c2a85a' },
      { name: 'Неотмеченные дни', value: Math.max(0, donutTotalDays - donutMarkedDays), color: '#3a3a45' },
    ];

    // keep daily for backward compat (current month)
    const curMonthPrefix = today.slice(0,7);
    const yCur = Number(today.slice(0,4)); const mCur = Number(today.slice(5,7));
    const daysInCurMonth = new Date(yCur, mCur, 0).getDate();
    const daily = Array.from({length: daysInCurMonth}, (_,i)=>{
      const day = pad(i+1);
      const d = `${curMonthPrefix}-${day}`;
      return { date: d, label: String(i+1), value: donePerDay[d]||0, isFuture: d>today, isToday: d===today, wd: weekday(d) };
    });

    // Активность по дням недели (Пн..Вс): средний % выполнения за все плановые дни
    const wdNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const wdSum = Array(7).fill(0);
    const wdCnt = Array(7).fill(0);
    filtered.forEach(t => {
      if (t.archived) return;
      let d = t.start;
      const origEnd = addDays(t.start, (t.plannedDays || 1) - 1);
      while (d <= origEnd) {
        if (!isExcluded(d, t.exclusions || [], t.excludeRule || 'none') && d <= today) {
          const wi = (parse(d).getDay() + 6) % 7;
          const mark = (t.marks || {})[d];
          const pctVal = mark?.done ? (t.kind === 'walk' ? 100 : mark.percent || 0) : 0;
          wdSum[wi] += pctVal;
          wdCnt[wi] += 1;
        }
        d = addDays(d, 1);
      }
    });
    const weekdayData = wdNames.map((name, i) => ({
      name,
      pct: wdCnt[i] ? Math.round(wdSum[i] / wdCnt[i]) : 0,
      count: wdCnt[i],
    }));
    const bestWd = weekdayData.reduce((best, w) => (w.pct > best.pct ? w : best), weekdayData[0]);

    return {
      totalMarks,
      bestStreak,
      currentStreak,
      monthlyData,
      dailyData,
      chartData,
      maxChart,
      maxMonthly,
      maxDaily,
      yearTotal,
      planYearTotal,
      hasAnyPlan,
      chartHasPlan,
      perBookData,
      weeks,
      weekdayData,
      bestWd,
      monthNameForStat,
      monthCount,
      bestMonthName,
      bestMonthVal,
      yearStr,
      donutData,
      donutMarkedDays,
      donutTotalDays,
      daily,
      donePerDay,
      donePerDayPages,
      curYear,
      curMonthIdx,
    };
  }, [tasks, selectedYear, selectedMonth, granularity, selectedBook, donutPeriod]);

  // автосоздание следующего тома при 100% (книги)
  useEffect(()=>{
    if (!loaded) return;
    const toCreate = [];
    tasks.filter(t=> t.kind==='book' && t.mode==='units' && !t.archived).forEach(t=>{
      const total = Number(t.unitsTotal)||0;
      if (!total) return;
      let done = 0;
      Object.values(t.marks||{}).forEach(m=> { if(m.done) done += Number(m.units)||0; });
      if (done >= total) {
        const hasNext = tasks.some(x=> x.name===t.name && x.start === addDays(t.plannedEnd || addDays(t.start,(t.plannedDays||1)-1),1));
        const exists = tasks.some(x=> x.name===t.name && x.info && t.info && x.info!==t.info && x.start > t.start);
        if (!exists && !hasNext) {
          let nextInfo = t.info || '';
          const m = nextInfo.match(/(\d+)\s*$/);
          if (m) {
            const n = Number(m[1]) + 1;
            nextInfo = nextInfo.replace(/\d+\s*$/, String(n));
          } else if (nextInfo) {
            nextInfo = nextInfo + ' (Том 2)';
          } else {
            nextInfo = 'Том 2';
          }
          toCreate.push({ base: t, nextInfo });
        }
      }
    });
    if (toCreate.length) {
      const { base, nextInfo } = toCreate[0];
      const nextStart = addDays(base.plannedEnd || addDays(base.start,(base.plannedDays||1)-1),1);
      const nextTask = {
        ...emptyTask(),
        id: `${Date.now()}`,
        name: base.name,
        info: nextInfo,
        color: base.color,
        kind: base.kind,
        mode: base.mode,
        unitsTotal: base.unitsTotal,
        unitsStrategy: base.unitsStrategy,
        unitsPerDay: base.unitsPerDay,
        start: nextStart,
        plannedEnd: addDays(nextStart, (base.plannedDays||1)-1),
        plannedDays: base.plannedDays,
        planMode: base.planMode,
        daysCount: base.daysCount,
        excludeRule: base.excludeRule,
        exclusions: [],
        marks: {},
      };
      setTasks(prev=> [...prev, nextTask]);
      toast.success(`Автосоздан следующий том: ${nextInfo}`);
    }
  }, [tasks, loaded]);

  // Просрочка дел: авто по тумблеру сразу, 'ask' — диалог раз в день
  useEffect(() => {
    if (!loaded) return;
    const t = todayStr();
    const overdue = todos.filter(x => !x.done && x.date && x.date < t);
    if (!overdue.length) return;
    const autoPlan = overdue.filter(x => x.rollover === 'plan').map(x => x.id);
    const autoToday = overdue.filter(x => x.rollover === 'today').map(x => x.id);
    const ask = overdue.filter(x => !x.rollover || x.rollover === 'ask').map(x => x.id);
    if (autoPlan.length || autoToday.length) {
      setTodos(prev =>
        prev.map(x => {
          if (autoPlan.includes(x.id)) return { ...x, date: null, postponed: (x.postponed || 0) + 1 };
          if (autoToday.includes(x.id)) return { ...x, date: t, postponed: (x.postponed || 0) + 1 };
          return x;
        })
      );
    }
    if (!ask.length) return;
    setOverdueIds(ask);
    let asked = false;
    try {
      asked = localStorage.getItem('tm-overdue-asked') === t;
    } catch {
      /* ignore */
    }
    if (!asked) {
      setOverdueOpen(true);
      try {
        localStorage.setItem('tm-overdue-asked', t);
      } catch {
        /* ignore */
      }
    }
  }, [loaded, todos]);

  // Закрыть диалог просрочки, когда всё разобрано
  useEffect(() => {
    if (overdueOpen && overdueIds.length === 0) setOverdueOpen(false);
  }, [overdueOpen, overdueIds]);

  if (!isAdmin) return <Navigate to="/profile" replace />;

  // ---------- handlers ----------
  const openAdd = kind => {
    const base = emptyTask();
    if (kind === 'book') {
      base.kind = 'book';
      base.name = 'Книга: ';
      base.mode = 'units';
      base.unitsTotal = 320;
      base.unitsStrategy = 'fixed';
      base.unitsPerDay = 20;
      // старт по умолчанию — день после окончания последней книги
      const bookTasks = tasks.filter(t => t.kind === 'book' && !t.archived);
      if (bookTasks.length) {
        const lastEnd = bookTasks.reduce((max, t) => {
          const end = t.plannedEnd || addDays(t.start, (t.plannedDays || 1) - 1);
          return end > max ? end : max;
        }, bookTasks[0].plannedEnd || bookTasks[0].start);
        const nextStart = addDays(lastEnd, 1);
        base.start = nextStart;
        const days = Math.ceil(Number(base.unitsTotal) / Number(base.unitsPerDay));
        base.plannedDays = days;
        base.plannedEnd = addDays(nextStart, days - 1);
        base.daysCount = String(days);
        base.planMode = 'days';
      } else {
        const days = Math.ceil(Number(base.unitsTotal) / Number(base.unitsPerDay));
        base.plannedDays = days;
        base.plannedEnd = addDays(base.start, days - 1);
        base.daysCount = String(days);
        base.planMode = 'days';
      }
    } else if (kind === 'walk') {
      base.kind = 'walk';
      base.name = 'Ходьба';
      base.mode = 'percent';
      base.plannedDays = 30;
      base.plannedEnd = addDays(todayStr(), 29);
    }
    setTaskForm(base);
    setTaskOpen(true);
  };
  const openEdit = task => {
    if (task.kind === 'book') {
      // Книги всегда: страницы + фикс страниц в день. Старые задачи мигрируем в форму.
      const perDay =
        task.unitsPerDay ||
        (task.unitsTotal && task.plannedDays
          ? String(Math.ceil(Number(task.unitsTotal) / task.plannedDays))
          : task.unitsPerDay);
      setTaskForm({ ...task, mode: 'units', unitsStrategy: 'fixed', planMode: 'days', unitsPerDay: perDay });
    } else {
      setTaskForm({ ...task });
    }
    setTaskOpen(true);
  };
  const saveTask = () => {
    const name = taskForm.name.trim();
    if (!name) return toast.warn('Укажите название задачи');
    let plannedDays;
    let plannedEnd;
    if (taskForm.kind === 'book') {
      // Книги всегда: всего страниц + фикс страниц в день
      const total = Number(taskForm.unitsTotal) || 0;
      if (!total) return toast.warn('Укажите всего страниц');
      const perDay = Number(taskForm.unitsPerDay) || 0;
      if (!perDay) return toast.warn('Укажите, сколько страниц читать в день');
      const days = Math.ceil(total / perDay);
      plannedDays = days;
      plannedEnd = addDays(taskForm.start, days - 1);
    } else {
      if (taskForm.planMode === 'days') {
        plannedDays = Math.max(1, Number(taskForm.daysCount) || 1);
        plannedEnd = addDays(taskForm.start, plannedDays - 1);
      } else {
        if (taskForm.plannedEnd < taskForm.start) return toast.warn('План. финиш раньше старта');
        plannedDays = Math.max(1, diffDays(taskForm.start, taskForm.plannedEnd) + 1);
        plannedEnd = taskForm.plannedEnd;
      }
    }
    const payload = {
      ...taskForm,
      name,
      plannedDays,
      plannedEnd,
      ...(taskForm.kind === 'book'
        ? { mode: 'units', unitsStrategy: 'fixed', planMode: 'days', daysCount: String(plannedDays) }
        : {}),
    };
    if (taskForm.id) {
      setTasks(prev => prev.map(t => (t.id === taskForm.id ? payload : t)));
    } else {
      setTasks(prev => [...prev, { ...payload, id: `${Date.now()}` }]);
    }
    setTaskOpen(false);
    setTaskForm(emptyTask());
  };
  const deleteTask = () => {
    if (!taskForm.id) return;
    setTasks(prev => prev.filter(t => t.id !== taskForm.id));
    setTaskOpen(false);
    setTaskForm(emptyTask());
  };

  const archiveTask = id => setTasks(prev => prev.map(t => (t.id === id ? { ...t, archived: true } : t)));
  const restoreTask = id => setTasks(prev => prev.map(t => (t.id === id ? { ...t, archived: false } : t)));
  const toggleSelect = id => setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  const deleteArchived = () => {
    const ids = Object.keys(selected).filter(k => selected[k]);
    if (!ids.length) return;
    setTasks(prev => prev.filter(t => !ids.includes(t.id)));
    setSelected({});
  };

  const saveAsPlan = () => {
    const plan = {
      id: `${Date.now()}`,
      name: taskForm.name,
      info: taskForm.info,
      color: taskForm.color,
      kind: taskForm.kind,
      mode: taskForm.mode,
      unitsTotal: taskForm.unitsTotal,
      unitsStrategy: taskForm.unitsStrategy,
      unitsPerDay: taskForm.unitsPerDay,
      planMode: taskForm.planMode,
      daysCount: taskForm.daysCount,
      excludeRule: taskForm.excludeRule,
    };
    setPlans(prev => [...prev, plan]);
    toast.success('Сохранено как план');
  };

  const addPlanToBoard = plan => {
    const start = todayStr();
    const days = plan.planMode === 'days' ? Math.max(1, Number(plan.daysCount) || 14) : 14;
    const plannedEnd = plan.planMode === 'days' ? addDays(start, days - 1) : addDays(start, 13);
    setTaskForm({
      ...emptyTask(),
      name: plan.name,
      info: plan.info,
      color: plan.color,
      kind: plan.kind,
      mode: plan.mode,
      unitsTotal: plan.unitsTotal,
      unitsStrategy: plan.unitsStrategy,
      unitsPerDay: plan.unitsPerDay,
      planMode: plan.planMode,
      daysCount: plan.daysCount,
      start,
      plannedEnd,
      plannedDays: plan.planMode === 'days' ? days : 14,
      excludeRule: plan.excludeRule,
    });
    setTaskOpen(true);
  };

  const deletePlan = id => setPlans(prev => prev.filter(p => p.id !== id));

  const openDay = (task, effStart, date) => {
    const excl = isExcluded(date, task.exclusions || [], task.excludeRule || 'none');
    const m = (task.marks || {})[date];
    const idx = diffDays(effStart, date);
    const planned = plannedUnits(task, idx);
    let walkTime = m?.walkTime || '';
    let speed = m?.speed || '';
    let reason = m?.reason || '';
    if (task.kind === 'walk' && !m) {
      const past = Object.keys(task.marks || {})
        .filter(d => d < date)
        .sort();
      for (let i = past.length - 1; i >= 0; i--) {
        const pm = task.marks[past[i]];
        if (pm && pm.done && (pm.walkTime || pm.speed)) {
          walkTime = pm.walkTime || '';
          speed = pm.speed || '';
          break;
        }
      }
    }
    // Для книг (режим страниц): с какой страницы начинаем = после последней прочитанной
    let pageFrom = '';
    let pageTo = m?.pageTo ?? '';
    if (task.kind === 'book' && task.mode === 'units') {
      let cursor = 0;
      Object.keys(task.marks || {})
        .filter(d => d < date)
        .sort()
        .forEach(d => {
          const pm = task.marks[d];
          if (!pm?.done) return;
          if (pm.pageTo != null && pm.pageTo !== '') cursor = Number(pm.pageTo) || cursor;
          else cursor += Number(pm.units) || 0;
        });
      pageFrom = m?.pageFrom ?? cursor;
      if (m?.done && (m?.pageTo == null || m?.pageTo === '') && m?.units) {
        pageTo = Number(pageFrom) + Number(m.units);
      }
    }
    setDayForm({
      taskId: task.id,
      date,
      mode: task.mode,
      kind: task.kind,
      effStart,
      planned,
      exclude: excl,
      done: m?.done || false,
      percent: m?.percent || 0,
      units: m?.units || 0,
      pageFrom,
      pageTo,
      walkTime,
      speed,
      reason,
      emoji: m?.emoji || '',
      notes: m?.notes || '',
    });
    setDayOpen(true);
  };
  const saveDay = () => {
    const { taskId, date, mode, effStart, kind, exclude, done, percent, units, pageFrom, pageTo, walkTime, speed, reason, emoji, notes } = dayForm;
    if (
      kind === 'book' &&
      mode === 'units' &&
      !exclude &&
      pageFrom !== '' &&
      pageFrom != null &&
      pageTo !== '' &&
      pageTo != null &&
      Number(pageTo) < Number(pageFrom)
    ) {
      toast.warn('«По» меньше «с» — проверь страницы');
      return;
    }
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const exclusions = exclude
          ? [...new Set([...(t.exclusions || []), date])]
          : (t.exclusions || []).filter(x => x !== date);
        const marks = { ...(t.marks || {}) };
        if (exclude) delete marks[date];
        else {
          let pct = percent;
          if (mode === 'units') {
            const idx = diffDays(effStart, date);
            const pl = plannedUnits(t, idx);
            pct = pl > 0 ? Math.round((Number(units) || 0) / pl * 100) : done ? 100 : 0;
          } else if (kind === 'walk' && done) {
            pct = 100;
          }
          marks[date] = {
            done,
            percent: Math.max(0, Math.min(999, pct)),
            units: Number(units) || 0,
            pageFrom: kind === 'book' && mode === 'units' && pageFrom !== '' && pageFrom != null ? Number(pageFrom) : undefined,
            pageTo: kind === 'book' && mode === 'units' && pageTo !== '' && pageTo != null ? Number(pageTo) : undefined,
            walkTime: kind === 'walk' ? Number(walkTime) || 0 : undefined,
            speed: kind === 'walk' ? Number(speed) || 0 : undefined,
            reason: kind === 'walk' && !done ? reason : undefined,
            emoji: kind === 'walk' && !done && emoji?.trim() ? emoji.trim() : undefined,
            notes: notes?.trim() ? notes.trim() : undefined,
          };
        }
        return { ...t, exclusions, marks };
      })
    );
    setDayOpen(false);
    setDayForm(null);
  };

  const togglePhase = p => setCollapsed(prev => ({ ...prev, [p]: !prev[p] }));
  const goToday = () => setWeek(Math.max(1, Math.floor(diffDays(origin, today) / 7) + 1));

  // ---------- Дела ----------
  const addTodo = () => {
    const title = todoTitle.trim();
    if (!title) return toast.warn('Напиши задачу');
    const t = todayStr();
    const date = todoDate === 'today' ? t : todoDate === 'tomorrow' ? addDays(t, 1) : null;
    setTodos(prev => [
      ...prev,
      {
        id: `td${Date.now()}`,
        title,
        date,
        done: false,
        doneDate: undefined,
        priority: TODO_PRIORITIES.includes(todoPriority) ? todoPriority : 'P2',
        rollover: 'ask',
        postponed: 0,
        createdAt: Date.now(),
      },
    ]);
    setTodoTitle('');
  };

  const toggleTodo = id =>
    setTodos(prev =>
      prev.map(x => (x.id === id ? { ...x, done: !x.done, doneDate: !x.done ? todayStr() : undefined } : x))
    );

  const deleteTodo = id => setTodos(prev => prev.filter(x => x.id !== id));

  const cycleTodoPriority = id =>
    setTodos(prev =>
      prev.map(x => {
        if (x.id !== id) return x;
        const next = TODO_PRIORITIES[(TODO_PRIORITIES.indexOf(x.priority) + 1) % TODO_PRIORITIES.length];
        return { ...x, priority: next };
      })
    );

  const cycleTodoRollover = id =>
    setTodos(prev =>
      prev.map(x => {
        if (x.id !== id) return x;
        const order = ['ask', 'today', 'plan'];
        const next = order[(order.indexOf(x.rollover) + 1) % order.length];
        return { ...x, rollover: next };
      })
    );

  const moveTodo = (id, date) => setTodos(prev => prev.map(x => (x.id === id ? { ...x, date } : x)));

  const handleTodoDragStart = (e, id) => {
    setDragTodoId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleTodoDrop = (e, date) => {
    e.preventDefault();
    if (!dragTodoId) return;
    const id = dragTodoId;
    setDragTodoId(null);
    moveTodo(id, date);
  };

  // Нерешённая просрочка (для бейджа/диалога): не выполнено и дата < сегодня
  const pendingOverdue = todos
    .map(x => x)
    .filter(x => !x.done && x.date && x.date < today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const resolveOverdue = (ids, where) => {
    const t = todayStr();
    setTodos(prev =>
      prev.map(x =>
        ids.includes(x.id) ? { ...x, date: where === 'today' ? t : null, postponed: (x.postponed || 0) + 1 } : x
      )
    );
    setOverdueIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const planTodos = sortTodos(todos.filter(x => !x.date && (!hideDoneTodos || !x.done)));
  const toggleBoardSelect = id => setBoardSelected(prev => ({ ...prev, [id]: !prev[id] }));
  const bulkArchiveBoard = () => {
    const ids = Object.keys(boardSelected).filter(k=> boardSelected[k]);
    if (!ids.length) return;
    setTasks(prev=> prev.map(t=> ids.includes(t.id) ? { ...t, archived: true } : t));
    setBoardSelected({});
    toast.success(`В архив: ${ids.length}`);
  };
  const bulkDeleteBoard = () => {
    const ids = Object.keys(boardSelected).filter(k=> boardSelected[k]);
    if (!ids.length) return;
    if (!window.confirm(`Удалить ${ids.length} задач?`)) return;
    setTasks(prev=> prev.filter(t=> !ids.includes(t.id)));
    setBoardSelected({});
  };
  const bulkShiftBoard = (delta) => {
    const ids = Object.keys(boardSelected).filter(k=> boardSelected[k]);
    if (!ids.length) return;
    setTasks(prev=> prev.map(t=> {
      if (!ids.includes(t.id)) return t;
      const newStart = addDays(t.start, delta);
      const newPlannedEnd = addDays(t.plannedEnd || addDays(t.start, (t.plannedDays||1)-1), delta);
      return { ...t, start: newStart, plannedEnd: newPlannedEnd };
    }));
    toast.success(`Сдвинуто на ${delta} дн: ${ids.length}`);
  };
  const handleDragStart = (e, id) => { setDragTaskId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, date) => {
    e.preventDefault();
    if (!dragTaskId) return;
    const task = tasks.find(t=> t.id === dragTaskId);
    if (!task) return;
    const delta = diffDays(task.start, date);
    if (delta === 0) { setDragTaskId(null); return; }
    const newStart = date;
    const duration = diffDays(task.start, task.plannedEnd || addDays(task.start, (task.plannedDays||1)-1));
    const newEnd = addDays(newStart, duration);
    setTasks(prev=> prev.map(t=> t.id===dragTaskId ? { ...t, start: newStart, plannedEnd: newEnd } : t));
    toast.success(`Перенесено: ${task.name} → ${newStart}`);
    setDragTaskId(null);
  };

  // Эксперимент: 3 дня (вчера/сегодня/завтра) широкие под дела, остальные 32px.
  // Ширина действует на все строки — принимаем как условие эксперимента.
  const wideTodoDays = [addDays(today, -1), today, addDays(today, 1)];
  const gridTemplate = `${COLS.map(c => `${c.width}px`).join(' ')} ${days
    .map(d => `${wideTodoDays.includes(d) || d === expandedTodoDay ? 190 : 32}px`)
    .join(' ')}`;
  const gridTemplateRows = ['38px', ...boardRowsWithTodos.map(r => (r.type === 'todos' ? '132px' : '38px'))].join(
    ' '
  );

  const renderTodo = x => {
    const rollover = TODO_ROLLOVERS.find(r => r.value === (x.rollover || 'ask')) || TODO_ROLLOVERS[0];
    return (
      <div
        key={x.id}
        className={`tm-todo ${x.done ? 'is-done' : ''}`}
        draggable
        onDragStart={e => handleTodoDragStart(e, x.id)}
      >
        <input type="checkbox" checked={!!x.done} onChange={() => toggleTodo(x.id)} title="Выполнено" />
        <button
          type="button"
          className="tm-todo__prio"
          data-p={x.priority || 'P2'}
          onClick={() => cycleTodoPriority(x.id)}
          title={`Приоритет ${x.priority || 'P2'} — клик меняет`}
        >
          {x.priority || 'P2'}
        </button>
        <span className="tm-todo__title" title={x.title}>
          {x.title}
        </span>
        {(x.postponed || 0) > 0 && (
          <span className="tm-todo__post" title={`Переносилось раз: ${x.postponed}`}>
            ×{x.postponed}
          </span>
        )}
        <button
          type="button"
          className="tm-todo__roll"
          onClick={() => cycleTodoRollover(x.id)}
          title={`Просрочка: ${rollover.label} — клик меняет`}
        >
          {rollover.icon}
        </button>
        <button type="button" className="tm-todo__del" onClick={() => deleteTodo(x.id)} title="Удалить">
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="timemanagement">
      <div className="tm-header">
        <div className="tm-header__title">
          <h1>Трекер привычек</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" startIcon={<TodayIcon />} onClick={goToday}>
              Сегодня
            </Button>
            <Button size="small" variant="contained" onClick={() => openAdd('book')}>
              Книга
            </Button>
            <Button size="small" variant="contained" onClick={() => openAdd('walk')}>
              Ходьба
            </Button>
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => openAdd('other')}>
              Другое
            </Button>
            <Button
              size="small"
              variant={view === 'board' ? 'outlined' : 'contained'}
              onClick={() => {
                setView('board');
                setSelected({});
              }}
            >
              Доска
            </Button>
            <Button
              size="small"
              variant={view === 'chart' ? 'contained' : 'outlined'}
              startIcon={<BarChartIcon />}
              onClick={() => {
                setView('chart');
                setSelected({});
              }}
            >
              График
            </Button>
            <Button
              size="small"
              variant={view === 'archive' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('archive');
                setSelected({});
              }}
            >
              Архив ({tasks.filter(t => t.archived).length})
            </Button>
            <Button size="small" variant="outlined" onClick={() => setPlansOpen(true)}>
              Планы ({plans.length})
            </Button>
          </div>
        </div>
        <div className="tm-meta">
          <div className="tm-stepper">
            <IconButton size="small" onClick={() => setWeek(w => Math.max(1, w - 1))}>
              <ChevronRightIcon style={{ transform: 'rotate(180deg)' }} />
            </IconButton>
            <span>
              Неделя <b>{week}</b>
            </span>
            <IconButton size="small" onClick={() => setWeek(w => w + 1)}>
              <ChevronRightIcon />
            </IconButton>
            <TextField
              label="Недель"
              type="number"
              value={weeks}
              onChange={e => setWeeks(Math.max(1, Number(e.target.value) || 1))}
              size="small"
              style={{ width: 90 }}
            />
          </div>
          <span className="tm-hint">
            Клик по дню — отметить. Пропуск/недовыполнение продлевает график; исключённый день переносится в конец.
          </span>
        </div>
      </div>

      <div className="tm-stats">
        <div className="tm-stat tm-stat--goal">
          <div className="tm-stat__head">
            <span className="tm-stat__name">🎯 Цель недели</span>
            <div className="tm-goal-step">
              <button type="button" onClick={() => setWeeklyGoalPersist(weeklyGoal - 1)} aria-label="Меньше">
                −
              </button>
              <span className="tm-stat__pct">
                {weekProgress.done}/{weeklyGoal}
              </span>
              <button type="button" onClick={() => setWeeklyGoalPersist(weeklyGoal + 1)} aria-label="Больше">
                +
              </button>
            </div>
          </div>
          <div className="tm-stat__bar">
            <div
              className="tm-stat__fill"
              style={{
                width: `${weekProgress.pct}%`,
                background: weekProgress.done >= weeklyGoal ? '#4caf50' : '#c2a85a',
              }}
            />
          </div>
          <div className="tm-stat__meta">
            {weekProgress.done >= weeklyGoal ? 'Цель выполнена! 🎉' : `осталось ${weeklyGoal - weekProgress.done} дн.`}
          </div>
        </div>
        {stats.map(s => (
          <div key={s.name} className="tm-stat">
            <div className="tm-stat__head">
              <span className="tm-swatch" style={{ background: s.color }} />
              <span className="tm-stat__name">{s.name}</span>
              <span className="tm-stat__pct">{s.pct}%</span>
            </div>
            <div className="tm-stat__bar">
              <div className="tm-stat__fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
            <div className="tm-stat__meta">
              план {s.planned} дн. · {s.extra}
            </div>
          </div>
        ))}
        {!stats.length && <span className="tm-hint">Статистика появится после добавления задач.</span>}
      </div>

      {view === 'board' && (
        <>
          {Object.values(boardSelected).some(Boolean) && (
            <div className="tm-bulkbar">
              <span>Выбрано {Object.values(boardSelected).filter(Boolean).length}</span>
              <Button size="small" variant="outlined" onClick={() => bulkShiftBoard(-1)}>
                ← -1 день
              </Button>
              <Button size="small" variant="outlined" onClick={() => bulkShiftBoard(1)}>
                +1 день →
              </Button>
              <Button size="small" variant="outlined" onClick={bulkArchiveBoard}>
                В архив
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={bulkDeleteBoard}>
                Удалить
              </Button>
              <Button size="small" onClick={() => setBoardSelected({})}>
                Снять
              </Button>
            </div>
          )}
          <div className="tm-gantt tm-gantt--with-plan" onDragOver={handleDragOver}>
            <div className="tm-gantt__scroll">
            <div className="tm-grid" style={{ gridTemplateColumns: gridTemplate, gridTemplateRows }}>
              {COLS.map((c, i) => (
                <div
                  key={c.key}
                  className="tm-cell tm-cell--head tm-sticky"
                  style={{ left: LEFT_OFFSET[i], width: c.width }}
                >
                  {c.label}
                </div>
              ))}
              {days.map(d => (
                <div
                  key={d}
                  className={`tm-cell tm-cell--head tm-day ${d === today ? 'tm-day--today tm-col--today' : ''} ${
                    isWeekend(d) ? 'tm-weekend' : ''
                  } ${isMonday(d) ? 'tm-weekstart' : ''}`}
                >
                  <span className="tm-day__wd">{weekday(d)}</span>
                  <span className="tm-day__dt">{d.slice(5)}</span>
                </div>
              ))}

              {boardRowsWithTodos.map(row => {
                if (row.type === 'todos') {
                  const allDayTodos = sortTodos(todos.filter(x => x.date && (!hideDoneTodos || !x.done)));
                  const doneCount = todos.filter(x => x.done).length;
                  const overdueCount = todos.filter(x => !x.done && x.date && x.date < today).length;
                  return (
                    <React.Fragment key="todos-row">
                      <div
                        className="tm-cell tm-sticky"
                        style={{ left: LEFT_OFFSET[0], width: COLS[0].width, borderLeft: '4px solid #c2a85a' }}
                      >
                        <span className="tm-taskname">☑ Дела</span>
                        <span className="tm-tasktitle">
                          {doneCount}/{todos.length}
                        </span>
                      </div>
                      <div className="tm-cell tm-sticky" style={{ left: LEFT_OFFSET[1], width: COLS[1].width }}>
                        <span className="tm-fact">
                          ✓{allDayTodos.filter(x => x.done).length}/{allDayTodos.length}
                        </span>
                        {overdueCount > 0 && (
                          <span className="tm-fact" style={{ color: '#ff8a8a', fontWeight: 700, marginLeft: 6 }}>
                            !{overdueCount}
                          </span>
                        )}
                      </div>
                      {days.map(d => {
                        const items = sortTodos(todos.filter(x => x.date === d && (!hideDoneTodos || !x.done)));
                        const wide = wideTodoDays.includes(d) || d === expandedTodoDay;
                        if (!wide) {
                          const open = items.filter(x => !x.done).slice(0, 6);
                          return (
                            <div
                              key={d}
                              className={`tm-cell tm-todocell--narrow ${isWeekend(d) ? 'tm-weekend' : ''} ${
                                isMonday(d) ? 'tm-weekstart' : ''
                              }`}
                              onClick={() => setExpandedTodoDay(prev => (prev === d ? null : d))}
                              onDragOver={e => e.preventDefault()}
                              onDrop={e => handleTodoDrop(e, d)}
                              title={
                                items.length
                                  ? `${items.filter(x => !x.done).length} откр. — раздвинуть день`
                                  : 'Раздвинуть день'
                              }
                            >
                              <div className="tm-todo-dots">
                                {open.map(x => (
                                  <i key={x.id} className="tm-todo-dot" data-p={x.priority || 'P2'} title={x.title} />
                                ))}
                              </div>
                            </div>
                          );
                        }
                        const userExpanded = d === expandedTodoDay && !wideTodoDays.includes(d);
                        return (
                          <div
                            key={d}
                            className={`tm-cell tm-todocell ${d === today ? 'tm-col--today' : ''} ${
                              isWeekend(d) ? 'tm-weekend' : ''
                            } ${isMonday(d) ? 'tm-weekstart' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleTodoDrop(e, d)}
                          >
                            <div className="tm-todocell__corner">
                              {userExpanded && (
                                <button
                                  type="button"
                                  className="tm-todocell__btn"
                                  onClick={() => setExpandedTodoDay(null)}
                                  title="Свернуть"
                                >
                                  −
                                </button>
                              )}
                              <button
                                type="button"
                                className="tm-todocell__btn"
                                onClick={() => setTodoDayModal(d)}
                                title="Открыть в окне"
                              >
                                ⤢
                              </button>
                            </div>
                            <div className="tm-todocell__list">
                              {items.map(renderTodo)}
                              {!items.length && <span className="tm-todo-day__empty">—</span>}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                }
                if (row.type === 'phase') {
                  return (
                    <React.Fragment key={`ph-${row.phase}`}>
                      <div
                        className="tm-cell tm-sticky tm-phase"
                        style={{ left: LEFT_OFFSET[0], width: COLS[0].width }}
                      >
                        <IconButton size="small" className="tm-caret" onClick={() => togglePhase(row.phase)}>
                          {collapsed[row.phase] ? <ChevronRightIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <b>{row.phase}</b>
                      </div>
                      {COLS.slice(1).map((c, i) => (
                        <div
                          key={c.key}
                          className="tm-cell tm-sticky"
                          style={{ left: LEFT_OFFSET[i + 1], width: c.width }}
                        />
                      ))}
                      <div className="tm-cell" style={{ gridColumn: `span ${days.length}` }} />
                    </React.Fragment>
                  );
                }
                const t = row.task;
                const sch = row.sch;
                const factDays = Object.values(t.marks || {}).filter(m => m.done).length;
                const forecast = getForecast(t);
                return (
                  <React.Fragment key={t.id}>
                    <div
                      className="tm-cell tm-sticky tm-task"
                      draggable
                      onDragStart={e => handleDragStart(e, t.id)}
                      style={{
                        left: LEFT_OFFSET[0],
                        width: COLS[0].width,
                        borderLeft: `4px solid ${t.color}`,
                        cursor: 'grab',
                      }}
                      onClick={() => openEdit(t)}
                    >
                      <input
                        type="checkbox"
                        checked={!!boardSelected[t.id]}
                        onChange={() => toggleBoardSelect(t.id)}
                        onClick={e => e.stopPropagation()}
                        style={{ accentColor: t.color, width: 14, height: 14 }}
                      />
                      <span className="tm-swatch" style={{ background: t.color }} />
                      <span className="tm-taskname">{t.name}</span>
                      {t.info && <span className="tm-tasktitle">{t.info}</span>}
                    </div>
                    <div
                      className="tm-cell tm-sticky"
                      style={{
                        left: LEFT_OFFSET[1],
                        width: COLS[1].width,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        padding: '4px 6px',
                      }}
                      onClick={() => openEdit(t)}
                    >
                      <div>
                        {sch.end}{' '}
                        <span className="tm-fact">
                          ({factDays}/{sch.plannedDays}
                          {sch.ext + sch.excludedCount > 0 ? `+${sch.ext + sch.excludedCount}` : ''})
                        </span>
                      </div>
                      {forecast && !forecast.finished && (
                        <span
                          className="tm-forecast"
                          title={`Среднее ${forecast.avg} стр/день, осталось ${forecast.remaining} стр.`}
                          style={{
                            fontSize: 10,
                            color: forecast.diff > 3 ? '#ff8a8a' : forecast.diff > 0 ? '#f5c16c' : '#4ade80',
                          }}
                        >
                          прогноз {forecast.estimatedEnd}{' '}
                          {forecast.diff !== 0 ? `(${forecast.diff > 0 ? '+' : ''}${forecast.diff} дн)` : '(в срок)'}
                        </span>
                      )}
                      {forecast?.finished && (
                        <span className="tm-forecast" style={{ fontSize: 10, color: '#4ade80' }}>
                          ✓ Готово
                        </span>
                      )}
                    </div>
                    {days.map(d => {
                      const cell = dayCell(t, sch, row.effStart, d);
                      const baseCls = `tm-cell ${d === today ? 'tm-col--today' : ''} ${isWeekend(d) ? 'tm-weekend' : ''} ${
                        isMonday(d) ? 'tm-weekstart' : ''
                      }`;
                      if (cell.kind === 'empty')
                        return (
                          <div
                            key={d}
                            className={baseCls}
                            onClick={() => openDay(t, row.effStart, d)}
                            onDragOver={handleDragOver}
                            onDrop={e => handleDrop(e, d)}
                          />
                        );
                      const pct = Math.max(0, Math.min(100, cell.fill || 0));
                      const m = (t.marks || {})[d];
                      let title = cell.title || '';
                      if (!title) {
                        if (cell.kind === 'done') {
                          if (t.kind === 'book' && t.mode === 'units') {
                            title =
                              m?.pageFrom != null && m?.pageTo != null
                                ? `Стр. ${m.pageFrom}—${m.pageTo} (${m.units || 0} стр.)`
                                : `${m?.units || 0} стр.`;
                            const pl = plannedUnits(t, diffDays(row.effStart, d));
                            if (pl) title += ` · план ${pl}`;
                          } else if (t.kind === 'walk') {
                            const parts = [];
                            if (m?.walkTime) parts.push(`${m.walkTime} мин`);
                            if (m?.speed) parts.push(`${m.speed} км/ч`);
                            const dist = ((Number(m?.walkTime) || 0) / 60) * (Number(m?.speed) || 0);
                            if (dist) parts.push(`${dist.toFixed(1)} км`);
                            title = parts.join(' • ') || `${Math.round(cell.fill)}%`;
                          } else {
                            title = `${Math.round(cell.fill)}%`;
                          }
                          if (m?.notes) title += ` • ✎ ${m.notes}`;
                        } else if (cell.kind === 'miss') {
                          title = 'Пропуск';
                          if (m?.reason) {
                            const rl = WALK_REASONS.find(r => r.value === m.reason)?.label;
                            if (rl) title += `: ${rl}`;
                          }
                          if (m?.notes) title += ` • ✎ ${m.notes}`;
                        } else if (cell.kind === 'current') {
                          title = 'Текущий день';
                        }
                      }
                      const showText =
                        cell.kind === 'done' ||
                        cell.kind === 'miss' ||
                        cell.kind === 'missEmoji' ||
                        (cell.kind === 'extension' && cell.fill > 0);
                      const filled = (cell.kind === 'done' || cell.kind === 'extension') && cell.fill > 0;
                      const borderColor =
                        cell.kind === 'miss' || cell.kind === 'missEmoji'
                          ? '#f44336'
                          : cell.kind === 'cut'
                            ? '#9e9e9e'
                            : cell.kind === 'gap'
                              ? 'var(--color-07)'
                              : t.color;
                      return (
                        <div
                          key={d}
                          className={`${baseCls} tm-daycell ${cell.kind === 'miss' || cell.kind === 'missEmoji' ? 'tm-miss' : ''} ${
                            cell.kind === 'cut' ? 'tm-cut' : ''
                          } ${cell.kind === 'gap' ? 'tm-excluded' : ''} ${cell.kind === 'extension' ? 'tm-ext' : ''} ${dragTaskId === t.id ? 'tm-drop-target' : ''}`}
                          style={{ borderColor }}
                          onClick={() => openDay(t, row.effStart, d)}
                          onDragOver={handleDragOver}
                          onDrop={e => handleDrop(e, d)}
                          title={title}
                        >
                          {cell.kind === 'gap' && <span className="tm-gap-mark">↩</span>}
                          {filled && (
                            <div
                              className={`tm-fill ${cell.kind === 'extension' ? 'tm-fill--proj' : ''}`}
                              style={{ width: `${pct}%` }}
                            />
                          )}
                          {showText && (
                            <span
                              className={`tm-pct ${cell.kind === 'miss' ? 'tm-pct--miss' : ''} ${cell.kind === 'missEmoji' ? 'tm-emoji' : ''}`}
                            >
                              {cell.kind === 'miss'
                                ? '✗'
                                : cell.kind === 'missEmoji'
                                  ? cell.emoji
                                  : Math.round(cell.fill)}
                            </span>
                          )}
                          {t.marks?.[d]?.notes && (
                            <span className="tm-note-dot" title={t.marks[d].notes}>
                              ✎
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {tasks.filter(t => !t.archived).length === 0 && (
                <div className="tm-empty" style={{ gridColumn: `1 / span ${days.length + COLS.length}` }}>
                  Пока нет задач. Нажмите «Добавить задачу».
                </div>
              )}
            </div>
            </div>
            {/* План — общая колонка справа в ганте */}
            <div
              className="tm-planpane"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleTodoDrop(e, null)}
            >
              <div className="tm-planpane__head">
                <b>📥 План</b>
                <span>{planTodos.length}</span>
                {pendingOverdue.length > 0 && (
                  <button type="button" className="tm-todos__badge" onClick={() => setOverdueOpen(true)}>
                    !{pendingOverdue.length}
                  </button>
                )}
              </div>
              <div className="tm-planpane__add">
                <TextField
                  placeholder="Новое дело…"
                  value={todoTitle}
                  onChange={e => setTodoTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addTodo();
                  }}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: false }}
                />
                <div className="tm-planpane__row">
                  <TextField
                    select
                    value={todoPriority}
                    onChange={e => setTodoPriority(e.target.value)}
                    size="small"
                    style={{ flex: 1 }}
                  >
                    {TODO_PRIORITIES.map(p => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    value={todoDate}
                    onChange={e => setTodoDate(e.target.value)}
                    size="small"
                    style={{ flex: 1 }}
                  >
                    <MenuItem value="today">Сегодня</MenuItem>
                    <MenuItem value="tomorrow">Завтра</MenuItem>
                    <MenuItem value="plan">В план</MenuItem>
                  </TextField>
                  <Button size="small" variant="contained" onClick={addTodo}>
                    +
                  </Button>
                </div>
              </div>
              <div className="tm-planpane__list">
                {planTodos.map(renderTodo)}
                {!planTodos.length && <span className="tm-todo-day__empty">Пусто — перетащи сюда</span>}
              </div>
              <label className="tm-todos__filter" style={{ padding: '8px 10px 0' }}>
                <input type="checkbox" checked={hideDoneTodos} onChange={e => setHideDoneTodos(e.target.checked)} />
                скрыть выполненные
              </label>
            </div>
          </div>
        </>
      )}

      {view === 'chart' && (
        <div className="tm-detail">
          {/* header как на макете */}
          <div className="tm-detail__head">
            <IconButton
              onClick={() => setView('board')}
              size="small"
              sx={{ color: '#c9c9c9', bgcolor: '#1e1e1e', width: 36, height: 36 }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <div className="tm-detail__head-icon">
              <CalendarTodayIcon sx={{ fontSize: 18, color: '#c2a85a' }} />
            </div>
            <div className="tm-detail__head-text">
              <b>{tasks[0]?.name || 'Статистика'}</b>
              <span>Детальная статистика</span>
            </div>
          </div>

          {/* 2 большие карточки */}
          <div className="tm-detail__grid2">
            <div className="tm-detail__card tm-detail__card--stat">
              <div className="tm-detail__icon tm-detail__icon--gold">
                <CheckCircleOutlineIcon sx={{ color: '#c2a85a', fontSize: 20 }} />
              </div>
              <div>
                <b>{detailed.totalMarks}</b>
                <span>Всего отметок</span>
              </div>
            </div>
            <div className="tm-detail__card tm-detail__card--stat">
              <div className="tm-detail__icon tm-detail__icon--gold2">
                <EmojiEventsIcon sx={{ color: '#c2a85a', fontSize: 20 }} />
              </div>
              <div>
                <b>{detailed.bestStreak}</b>
                <span>Лучшая серия</span>
              </div>
            </div>
          </div>

          {/* 4 маленькие карточки */}
          <div className="tm-detail__grid4">
            <div className="tm-detail__card tm-detail__card--sm">
              <div className="tm-detail__icon tm-detail__icon--gold">
                <CalendarTodayIcon sx={{ color: '#c2a85a', fontSize: 18 }} />
              </div>
              <div>
                <b>{detailed.monthCount}</b>
                <span>
                  {detailed.monthNameForStat} {detailed.yearStr}
                </span>
              </div>
            </div>
            <div className="tm-detail__card tm-detail__card--sm">
              <div className="tm-detail__icon tm-detail__icon--blue">
                <TrendingUpIcon sx={{ color: '#6ea8ff', fontSize: 18 }} />
              </div>
              <div>
                <b>{detailed.yearTotal}</b>
                <span>{detailed.yearStr} всего</span>
              </div>
            </div>
            <div className="tm-detail__card tm-detail__card--sm">
              <div className="tm-detail__icon tm-detail__icon--green">
                <WorkspacePremiumIcon sx={{ color: '#4ade80', fontSize: 18 }} />
              </div>
              <div>
                <b>{detailed.bestMonthName}</b>
                <span>{detailed.bestMonthVal} отм.</span>
              </div>
            </div>
            <div className="tm-detail__card tm-detail__card--sm">
              <div className="tm-detail__icon tm-detail__icon--orange">
                <LocalFireDepartmentIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
              </div>
              <div>
                <b>{detailed.currentStreak}</b>
                <span>Текущая серия</span>
              </div>
            </div>
          </div>

          {/* контролы графика */}
          <div className="tm-detail__controls">
            <div className="tm-segment">
              <button className={chartType === 'bar' ? 'active' : ''} onClick={() => setChartType('bar')}>
                <BarChartOutlinedIcon sx={{ fontSize: 16 }} /> Столбчатый
              </button>
              <button className={chartType === 'line' ? 'active' : ''} onClick={() => setChartType('line')}>
                <ShowChartIcon sx={{ fontSize: 16 }} /> Линейный
              </button>
            </div>
            <div className="tm-segment">
              <button className={granularity === 'months' ? 'active' : ''} onClick={() => setGranularity('months')}>
                По месяцам
              </button>
              <button className={granularity === 'days' ? 'active' : ''} onClick={() => setGranularity('days')}>
                По дням
              </button>
            </div>
            <div className="tm-year-select">
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {availableYears.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {granularity === 'days' && (
              <div className="tm-year-select">
                <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                  {MONTHS_RU.map((m, i) => (
                    <option key={i} value={i}>
                      {m} {selectedYear}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="tm-year-select">
              <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
                <option value="all">Все книги</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c9c9c9', fontSize: 12 }}>
              <Switch
                size="small"
                checked={perBookMode}
                onChange={e => setPerBookMode(e.target.checked)}
                disabled={
                  selectedBook !== 'all' ||
                  availableBooks.filter(b => tasks.some(t => t.id === b.id && t.kind === 'book')).length < 2
                }
              />
              Раздельно по книгам
            </label>
          </div>

          {/* Распределение */}
          <div className="tm-detail__card tm-detail__card--chart">
            <h4>
              {granularity === 'days'
                ? `Распределение по дням — ${MONTHS_RU[selectedMonth]} ${selectedYear}`
                : 'Распределение по месяцам'}
              {selectedBook !== 'all' ? ` — ${availableBooks.find(b => b.id === selectedBook)?.label}` : ''}
            </h4>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                {perBookMode && selectedBook === 'all' && detailed.perBookData.length ? (
                  chartType === 'line' ? (
                    <LineChart
                      data={detailed.perBookData[0]?.data || detailed.chartData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#8a8a8a', fontSize: granularity === 'days' ? 10 : 11 }}
                        axisLine={{ stroke: '#2a2a2a' }}
                        tickLine={false}
                        interval={granularity === 'days' && detailed.chartData.length > 20 ? 1 : 0}
                      />
                      <YAxis
                        tick={{ fill: '#8a8a8a', fontSize: 11 }}
                        axisLine={{ stroke: '#2a2a2a' }}
                        tickLine={false}
                        allowDecimals={false}
                        domain={[0, 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e1e1e',
                          border: '1px solid #333',
                          borderRadius: 8,
                          color: '#fff',
                        }}
                      />
                      {detailed.perBookData.map(b => (
                        <Line
                          key={b.id}
                          data={b.data}
                          type="monotone"
                          dataKey="actual"
                          stroke={b.color}
                          strokeWidth={2}
                          dot={{ r: 3, fill: b.color }}
                          name={`${b.label} факт`}
                        />
                      ))}
                      {detailed.perBookData.map(b =>
                        b.data.some(x => x.plan > 0) ? (
                          <Line
                            key={b.id + '-plan'}
                            data={b.data}
                            type="monotone"
                            dataKey="plan"
                            stroke={b.color}
                            strokeDasharray="6 4"
                            strokeWidth={1.5}
                            dot={false}
                            opacity={0.6}
                            name={`${b.label} план`}
                          />
                        ) : null
                      )}
                    </LineChart>
                  ) : (
                    <BarChart
                      data={detailed.perBookData[0]?.data || detailed.chartData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#8a8a8a', fontSize: granularity === 'days' ? 10 : 11 }}
                        axisLine={{ stroke: '#2a2a2a' }}
                        tickLine={false}
                        interval={granularity === 'days' && detailed.chartData.length > 20 ? 1 : 0}
                      />
                      <YAxis
                        tick={{ fill: '#8a8a8a', fontSize: 11 }}
                        axisLine={{ stroke: '#2a2a2a' }}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e1e1e',
                          border: '1px solid #333',
                          borderRadius: 8,
                          color: '#fff',
                        }}
                      />
                      {detailed.perBookData.map(b => (
                        <Bar
                          key={b.id}
                          data={b.data}
                          dataKey="actual"
                          fill={b.color}
                          radius={[4, 4, 0, 0]}
                          name={`${b.label} факт`}
                        />
                      ))}
                    </BarChart>
                  )
                ) : chartType === 'line' ? (
                  <LineChart data={detailed.chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#8a8a8a', fontSize: granularity === 'days' ? 10 : 11 }}
                      axisLine={{ stroke: '#2a2a2a' }}
                      tickLine={false}
                      interval={granularity === 'days' && detailed.chartData.length > 20 ? 1 : 0}
                    />
                    <YAxis
                      tick={{ fill: '#8a8a8a', fontSize: 11 }}
                      axisLine={{ stroke: '#2a2a2a' }}
                      tickLine={false}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                      formatter={(value, name) => [value, name === 'actual' ? 'Факт' : 'План']}
                    />
                    {detailed.chartHasPlan && (
                      <Line
                        type="monotone"
                        dataKey="plan"
                        stroke="#6b6b6b"
                        strokeDasharray="6 4"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#6b6b6b' }}
                        name="plan"
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#c2a85a"
                      strokeWidth={2.5}
                      dot={{ r: granularity === 'days' ? 3 : 5, fill: '#c2a85a', stroke: '#c2a85a' }}
                      activeDot={{ r: 6 }}
                      name="actual"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={detailed.chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#8a8a8a', fontSize: granularity === 'days' ? 10 : 11 }}
                      axisLine={{ stroke: '#2a2a2a' }}
                      tickLine={false}
                      interval={granularity === 'days' && detailed.chartData.length > 20 ? 1 : 0}
                    />
                    <YAxis
                      tick={{ fill: '#8a8a8a', fontSize: 11 }}
                      axisLine={{ stroke: '#2a2a2a' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                    />
                    {detailed.chartHasPlan && <Bar dataKey="plan" fill="#3a3a3a" radius={[6, 6, 0, 0]} name="План" />}
                    <Bar dataKey="actual" fill="#c2a85a" radius={[6, 6, 0, 0]} name="Факт" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            {(
              perBookMode && selectedBook === 'all' && detailed.perBookData.length
                ? detailed.perBookData.some(b => b.data.some(x => x.plan > 0))
                : detailed.chartHasPlan
            ) ? (
              <div className="tm-detail__legend">
                <span>
                  <i style={{ background: '#c2a85a' }} /> Факт
                </span>
                <span>
                  <i style={{ background: '#6b6b6b' }} /> План
                </span>
              </div>
            ) : perBookMode && selectedBook === 'all' && detailed.perBookData.length ? (
              <div className="tm-detail__legend">
                {detailed.perBookData.map(b => (
                  <span key={b.id}>
                    <i style={{ background: b.color }} /> {b.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Heatmap */}
          <div className="tm-detail__card tm-detail__card--chart">
            <h4>Карта активности — {selectedYear}</h4>
            <div className="tm-heatmap">
              <div className="tm-heatmap__grid">
                {detailed.weeks.map((week, wi) => (
                  <div key={wi} className="tm-heatmap__week">
                    {week.map(day => {
                      const lvl = day.isOutside
                        ? -1
                        : day.intensity === 0
                          ? 0
                          : day.intensity < 0.25
                            ? 1
                            : day.intensity < 0.5
                              ? 2
                              : day.intensity < 0.75
                                ? 3
                                : 4;
                      const cls = lvl === -1 ? 'is-outside' : lvl === 0 ? 'lvl-0' : `lvl-${lvl}`;
                      return (
                        <div
                          key={day.date}
                          className={`tm-heatmap__cell ${cls} ${day.isToday ? 'is-today' : ''}`}
                          title={`${day.date}: ${day.value} ${selectedBook === 'all' ? 'отм.' : 'стр.'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="tm-heatmap__legend">
                <span>Меньше</span>
                <div className="tm-heatmap__scale">
                  <i className="lvl-0" />
                  <i className="lvl-1" />
                  <i className="lvl-2" />
                  <i className="lvl-3" />
                  <i className="lvl-4" />
                </div>
                <span>Больше</span>
              </div>
            </div>
          </div>

          {/* Активность по дням недели */}
          <div className="tm-detail__card tm-detail__card--chart">
            <h4>Лучший день недели{detailed.bestWd ? ` — ${detailed.bestWd.name} (${detailed.bestWd.pct}%)` : ''}</h4>
            <div className="tm-weekdays">
              {detailed.weekdayData.map(w => (
                <div
                  key={w.name}
                  className={`tm-weekday ${detailed.bestWd && w.name === detailed.bestWd.name && w.count ? 'tm-weekday--best' : ''}`}
                  title={`${w.name}: средний ${w.pct}% за ${w.count} дн.`}
                >
                  <div className="tm-weekday__bar">
                    <div className="tm-weekday__fill" style={{ height: `${w.pct}%` }} />
                  </div>
                  <span className="tm-weekday__label">{w.name}</span>
                  <span className="tm-weekday__pct">{w.pct}%</span>
                </div>
              ))}
            </div>
            <div className="tm-detail__legend tm-detail__legend--center">
              <span>Средний % выполнения по дням недели</span>
            </div>
          </div>

          {/* Соотношение выполнения */}
          <div className="tm-detail__card tm-detail__card--chart">
            <div className="tm-detail__card-head">
              <h4>Соотношение выполнения</h4>
              <div className="tm-segment tm-segment--small">
                <button className={donutPeriod === 'month' ? 'active' : ''} onClick={() => setDonutPeriod('month')}>
                  Текущий месяц
                </button>
                <button className={donutPeriod === 'year' ? 'active' : ''} onClick={() => setDonutPeriod('year')}>
                  Год
                </button>
              </div>
            </div>
            <div
              style={{ width: '100%', height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={detailed.donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#111"
                  >
                    {detailed.donutData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="#111" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="tm-detail__legend tm-detail__legend--center">
              <span>
                <i style={{ background: '#3a3a45' }} /> Неотмеченные дни
              </span>
              <span>
                <i style={{ background: '#c2a85a' }} /> Отмеченные дни
              </span>
            </div>
          </div>
        </div>
      )}

      {view === 'archive' && (
        <div className="tm-archive">
          <div className="tm-archive__bar">
            <span>Архив — отмеченные можно удалить или восстановить</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!Object.values(selected).some(Boolean)}
                onClick={deleteArchived}
              >
                Удалить выбранные
              </Button>
            </div>
          </div>
          {tasks.filter(t => t.archived).length === 0 && (
            <div className="tm-empty">Архив пуст. Завершённые задачи попадают сюда через 7 дней.</div>
          )}
          {tasks
            .filter(t => t.archived)
            .map(t => (
              <div key={t.id} className="tm-archive__row">
                <input type="checkbox" checked={!!selected[t.id]} onChange={() => toggleSelect(t.id)} />
                <span className="tm-swatch" style={{ background: t.color }} />
                <span className="tm-archive__name">{t.name}</span>
                <span className="tm-archive__info">{t.info}</span>
                <span className="tm-archive__date">финиш: {addDays(t.start, (t.plannedDays || 1) - 1)}</span>
                <Button size="small" onClick={() => restoreTask(t.id)}>
                  Восстановить
                </Button>
              </div>
            ))}
        </div>
      )}

      {/* диалог просрочки дел */}
      <Dialog open={overdueOpen} onClose={() => setOverdueOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Просроченные дела ({pendingOverdue.length})</DialogTitle>
        <DialogContent className="tm-dialog">
          <span className="tm-hint">Не успел отметить? Выбери куда перенести каждое дело.</span>
          {pendingOverdue.map(x => (
            <div key={x.id} className="tm-overdue__row">
              <div className="tm-overdue__body">
                <div className="tm-overdue__name">{x.title}</div>
                <div className="tm-overdue__meta">
                  было на {x.date}
                  {(x.postponed || 0) > 0 ? ` · переносилось ×${x.postponed}` : ''}
                </div>
              </div>
              <Button size="small" variant="outlined" onClick={() => resolveOverdue([x.id], 'plan')}>
                В план
              </Button>
              <Button size="small" variant="contained" onClick={() => resolveOverdue([x.id], 'today')}>
                На сегодня
              </Button>
            </div>
          ))}
          {!pendingOverdue.length && <span className="tm-hint">Всё разобрано 🎉</span>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resolveOverdue(pendingOverdue.map(x => x.id), 'plan')}>Всё в план</Button>
          <Button onClick={() => resolveOverdue(pendingOverdue.map(x => x.id), 'today')} variant="contained">
            Всё на сегодня
          </Button>
        </DialogActions>
      </Dialog>

      {/* модалка дня дел (дальние дни ганта) */}
      <Dialog open={!!todoDayModal} onClose={() => setTodoDayModal(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Дела — {todoDayModal === today ? 'сегодня' : todoDayModal ? `${weekday(todoDayModal)} ${todoDayModal.slice(5)}` : ''}
        </DialogTitle>
        <DialogContent className="tm-dialog">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <TextField
              placeholder="Новое дело на этот день…"
              value={todoModalTitle}
              onChange={e => setTodoModalTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addTodoToDate();
              }}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: false }}
            />
            <Button size="small" variant="contained" onClick={addTodoToDate} style={{ flexShrink: 0 }}>
              +
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {todoDayModal &&
              sortTodos(todos.filter(x => x.date === todoDayModal && (!hideDoneTodos || !x.done))).map(renderTodo)}
            {todoDayModal &&
              !todos.filter(x => x.date === todoDayModal && (!hideDoneTodos || !x.done)).length && (
                <span className="tm-hint">Пусто — добавь первое дело выше.</span>
              )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTodoDayModal(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* диалог задачи */}
      <Dialog open={taskOpen} onClose={() => setTaskOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{taskForm.id ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
        <DialogContent className="tm-dialog">
          {types.length > 0 && (
            <div className="tm-types">
              {types.map(tp => (
                <button
                  key={tp.name}
                  type="button"
                  className="tm-type-chip"
                  style={{ borderColor: tp.color }}
                  onClick={() => setTaskForm(p => ({ ...p, name: tp.name, color: tp.color }))}
                >
                  <span className="tm-swatch" style={{ background: tp.color }} />
                  {tp.name}
                </button>
              ))}
            </div>
          )}
          <TextField
            label="Категория"
            select
            value={taskForm.kind}
            onChange={e => setTaskForm(p => ({ ...p, kind: e.target.value }))}
            fullWidth
            margin="dense"
          >
            {KINDS.map(k => (
              <MenuItem key={k.value} value={k.value}>
                {k.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Название (тип задачи)"
            value={taskForm.name}
            onChange={e => setTaskForm(p => ({ ...p, name: e.target.value }))}
            fullWidth
            margin="dense"
            autoFocus
            placeholder="Книга: Название"
          />
          <TextField
            label="Название"
            value={taskForm.info}
            onChange={e => setTaskForm(p => ({ ...p, info: e.target.value }))}
            fullWidth
            margin="dense"
            placeholder="Напр. том 1"
          />
          <div className="tm-dialog__colors">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`tm-color ${taskForm.color === c ? 'tm-color--active' : ''}`}
                style={{ background: c }}
                onClick={() => setTaskForm(p => ({ ...p, color: c }))}
                aria-label={c}
              />
            ))}
          </div>
          {taskForm.kind === 'book' ? (
            <>
              <TextField
                label="Всего страниц в книге"
                type="number"
                value={taskForm.unitsTotal}
                onChange={e => setTaskForm(p => ({ ...p, unitsTotal: e.target.value }))}
                fullWidth
                margin="dense"
                placeholder="320"
              />
              <TextField
                label="Страниц читать в день"
                type="number"
                value={taskForm.unitsPerDay}
                onChange={e => setTaskForm(p => ({ ...p, unitsPerDay: e.target.value }))}
                fullWidth
                margin="dense"
                placeholder="20"
              />
            </>
          ) : (
            taskForm.kind !== 'walk' && (
              <>
                <TextField
                  label="Режим наполнения"
                  select
                  value={taskForm.mode}
                  onChange={e => setTaskForm(p => ({ ...p, mode: e.target.value }))}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="percent">Проценты</MenuItem>
                  <MenuItem value="units">Единицы</MenuItem>
                </TextField>
                {taskForm.mode === 'units' && (
                  <>
                    <TextField
                      label="Всего единиц"
                      type="number"
                      value={taskForm.unitsTotal}
                      onChange={e => setTaskForm(p => ({ ...p, unitsTotal: e.target.value }))}
                      fullWidth
                      margin="dense"
                      placeholder="320"
                    />
                    <TextField
                      label="Раскладка"
                      select
                      value={taskForm.unitsStrategy}
                      onChange={e => setTaskForm(p => ({ ...p, unitsStrategy: e.target.value }))}
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="even">Поровну между днями (остаток в конец)</MenuItem>
                      <MenuItem value="fixed">Фикс ед./день (остаток в конец)</MenuItem>
                    </TextField>
                    {taskForm.unitsStrategy === 'fixed' && (
                      <TextField
                        label="Единиц в день"
                        type="number"
                        value={taskForm.unitsPerDay}
                        onChange={e => setTaskForm(p => ({ ...p, unitsPerDay: e.target.value }))}
                        fullWidth
                        margin="dense"
                      />
                    )}
                  </>
                )}
              </>
            )
          )}
          {taskForm.kind === 'book' && Number(taskForm.unitsTotal) > 0 && (
            <Box
              sx={{
                mt: 1,
                p: 1.2,
                background: '#1a1a1e',
                border: '1px solid #2a2a2e',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              {(() => {
                const total = Number(taskForm.unitsTotal) || 0;
                const perDay = Number(taskForm.unitsPerDay) || 0;
                if (!perDay)
                  return (
                    <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>
                      Укажите, сколько страниц читать в день
                    </Typography>
                  );
                const days = Math.ceil(total / perDay);
                const last = total - perDay * (days - 1);
                const end = addDays(taskForm.start, days - 1);
                const isAfterPrev = (() => {
                  const books = tasks.filter(t => t.kind === 'book' && !t.archived && t.id !== taskForm.id);
                  if (!books.length) return false;
                  const lastEnd = books.reduce((max, t) => {
                    const e = t.plannedEnd || addDays(t.start, (t.plannedDays || 1) - 1);
                    return e > max ? e : max;
                  }, books[0].plannedEnd || books[0].start);
                  return taskForm.start === addDays(lastEnd, 1);
                })();
                return (
                  <>
                    <Typography sx={{ fontSize: 11, color: '#e8dcc3' }}>
                      📖 <b>{days} дн.</b> по <b>{perDay} стр.</b>, в последний день <b>{last} стр.</b>
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>
                      Финиш: <b style={{ color: '#c2a85a' }}>{end}</b> {isAfterPrev ? '(авто после предыдущей)' : ''}
                    </Typography>
                  </>
                );
              })()}
            </Box>
          )}
          {taskForm.kind === 'walk' && (
            <div className="tm-hint">Ходьба отмечается по дням: время и скорость (или причина пропуска).</div>
          )}
          {taskForm.kind === 'book' ? (
            <TextField
              label="Дата начала"
              type="date"
              value={taskForm.start}
              onChange={e => setTaskForm(p => ({ ...p, start: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
              helperText="По умолчанию — день после предыдущей, можно в день её окончания"
              FormHelperTextProps={{ sx: { fontSize: 10, color: '#8a8a8a' } }}
            />
          ) : (
            <>
              <TextField
                label="Способ планирования"
                select
                value={taskForm.planMode}
                onChange={e => setTaskForm(p => ({ ...p, planMode: e.target.value }))}
                fullWidth
                margin="dense"
              >
                <MenuItem value="range">Диапазон дат</MenuItem>
                <MenuItem value="days">За N дней</MenuItem>
              </TextField>
              <div className="tm-dialog__row">
                <TextField
                  label="Старт"
                  type="date"
                  value={taskForm.start}
                  onChange={e => setTaskForm(p => ({ ...p, start: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                />
                {taskForm.planMode === 'days' ? (
                  <TextField
                    label="Сделать за N дней"
                    type="number"
                    value={taskForm.daysCount}
                    onChange={e => setTaskForm(p => ({ ...p, daysCount: e.target.value }))}
                    margin="dense"
                  />
                ) : (
                  <TextField
                    label="План. финиш"
                    type="date"
                    value={taskForm.plannedEnd}
                    onChange={e => setTaskForm(p => ({ ...p, plannedEnd: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    margin="dense"
                  />
                )}
              </div>
            </>
          )}
          <TextField
            label="Исключать дни"
            select
            value={taskForm.excludeRule}
            onChange={e => setTaskForm(p => ({ ...p, excludeRule: e.target.value }))}
            fullWidth
            margin="dense"
          >
            {EXCLUDE_RULES.map(r => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>
          {/* произвольные даты-исключения */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: '#8a8a8a', marginBottom: 4 }}>
              Исключённые даты ({(taskForm.exclusions || []).length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              {(taskForm.exclusions || []).map(d => (
                <span
                  key={d}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 12,
                    padding: '2px 8px',
                    fontSize: 11,
                  }}
                >
                  {d}{' '}
                  <IconButton
                    size="small"
                    onClick={() => setTaskForm(p => ({ ...p, exclusions: p.exclusions.filter(x => x !== d) }))}
                    sx={{ width: 16, height: 16, p: 0 }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </span>
              ))}
              {!(taskForm.exclusions || []).length && <span style={{ fontSize: 11, color: '#666' }}>нет дат</span>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <TextField type="date" size="small" id="exclDate" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const el = document.getElementById('exclDate');
                  const v = el && el.value;
                  if (!v) return toast.warn('Выберите дату');
                  if ((taskForm.exclusions || []).includes(v)) return toast.warn('Уже в списке');
                  setTaskForm(p => ({ ...p, exclusions: [...(p.exclusions || []), v] }));
                  if (el) el.value = '';
                }}
              >
                + Дата
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {taskForm.id && (
            <IconButton onClick={deleteTask} color="error" aria-label="delete">
              <DeleteOutlineIcon />
            </IconButton>
          )}
          {taskForm.id && (
            <Button
              onClick={() => {
                archiveTask(taskForm.id);
                setTaskOpen(false);
              }}
            >
              В архив
            </Button>
          )}
          <Button onClick={saveAsPlan}>Сохранить как план</Button>
          <Button onClick={() => setTaskOpen(false)}>Отмена</Button>
          <Button onClick={saveTask} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* диалог планов */}
      <Dialog open={plansOpen} onClose={() => setPlansOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Планы (шаблоны)</DialogTitle>
        <DialogContent className="tm-dialog">
          {plans.length === 0 && (
            <span className="tm-hint">Планов пока нет. Откройте задачу и нажмите «Сохранить как план».</span>
          )}
          {plans.map(p => (
            <div key={p.id} className="tm-plan">
              <span className="tm-swatch" style={{ background: p.color }} />
              <div className="tm-plan__body">
                <div className="tm-plan__name">{p.name}</div>
                <div className="tm-plan__meta">
                  {p.kind === 'book' ? 'Книга' : p.kind === 'walk' ? 'Ходьба' : 'Другое'}
                  {p.mode === 'units' ? ` · ${p.unitsTotal} стр.` : ''}
                  {p.planMode === 'days' ? ` · за ${p.daysCount || '?'} дн.` : ''}
                </div>
              </div>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  addPlanToBoard(p);
                  setPlansOpen(false);
                }}
              >
                На доску
              </Button>
              <IconButton size="small" color="error" onClick={() => deletePlan(p.id)} aria-label="delete">
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlansOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* диалог отметки дня */}
      <Dialog open={dayOpen} onClose={() => setDayOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>День {dayForm?.date}</DialogTitle>
        <DialogContent className="tm-dialog">
          {dayForm && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={dayForm.exclude}
                    onChange={e => setDayForm(p => ({ ...p, exclude: e.target.checked }))}
                  />
                }
                label="Исключить день (перенести в конец)"
              />
              {!dayForm.exclude &&
                dayForm.date <= today &&
                (dayForm.kind === 'walk' ? (
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={dayForm.done}
                          onChange={e => setDayForm(p => ({ ...p, done: e.target.checked }))}
                        />
                      }
                      label="Выполнено"
                    />
                    {dayForm.done ? (
                      <div className="tm-dialog__row">
                        <TextField
                          label="Время хотьбы (мин)"
                          type="number"
                          value={dayForm.walkTime}
                          onChange={e => setDayForm(p => ({ ...p, walkTime: e.target.value }))}
                          margin="dense"
                        />
                        <TextField
                          label="Скорость (км/ч)"
                          type="number"
                          value={dayForm.speed}
                          onChange={e => setDayForm(p => ({ ...p, speed: e.target.value }))}
                          margin="dense"
                        />
                      </div>
                    ) : (
                      <>
                        <TextField
                          label="Причина пропуска"
                          select
                          value={dayForm.reason}
                          onChange={e => {
                            const reason = e.target.value;
                            setDayForm(p => {
                              const prevAuto = REASON_EMOJI[p.reason] || '';
                              const next =
                                !p.emoji || p.emoji === prevAuto ? REASON_EMOJI[reason] || '' : p.emoji;
                              return { ...p, reason, emoji: next };
                            });
                          }}
                          fullWidth
                          margin="dense"
                        >
                          {WALK_REASONS.map(r => (
                            <MenuItem key={r.value} value={r.value}>
                              {r.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontSize: 11, color: '#8a8a8a', marginBottom: 4 }}>
                            Смайлик вместо ✗ {dayForm.emoji ? `— ${dayForm.emoji}` : ''}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                            {WALK_EMOJIS.map(em => (
                              <button
                                key={em}
                                type="button"
                                onClick={() => setDayForm(p => ({ ...p, emoji: p.emoji === em ? '' : em }))}
                                style={{
                                  fontSize: 20,
                                  lineHeight: 1,
                                  padding: '4px 8px',
                                  borderRadius: 10,
                                  border: dayForm.emoji === em ? '2px solid #c2a85a' : '1px solid #333',
                                  background: dayForm.emoji === em ? '#2a2211' : '#1e1e1e',
                                  cursor: 'pointer',
                                }}
                                aria-label={em}
                              >
                                {em}
                              </button>
                            ))}
                          </div>
                          <TextField
                            label="Свой смайлик"
                            value={dayForm.emoji || ''}
                            onChange={e => setDayForm(p => ({ ...p, emoji: e.target.value }))}
                            fullWidth
                            margin="dense"
                            placeholder="🤒"
                            inputProps={{ maxLength: 8 }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {dayForm.mode === 'percent' ? (
                      <>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dayForm.done}
                              onChange={e => setDayForm(p => ({ ...p, done: e.target.checked }))}
                            />
                          }
                          label="Выполнено"
                        />
                        <div className="tm-dialog__slider">
                          <span>Наполнение: {dayForm.percent}%</span>
                          <Slider
                            value={dayForm.percent}
                            onChange={(e, v) => setDayForm(p => ({ ...p, percent: v, done: v > 0 }))}
                          />
                        </div>
                      </>
                    ) : dayForm.kind === 'book' && dayForm.mode === 'units' ? (
                      <>
                        <div className="tm-dialog__slider">
                          <span>
                            Прочитано: стр. {dayForm.pageFrom || '…'} — {dayForm.pageTo || '…'} (
                            {dayForm.units || 0} стр.)
                          </span>
                          {dayForm.planned != null && <span> (план: {dayForm.planned})</span>}
                        </div>
                        <div className="tm-dialog__row">
                          <TextField
                            label="С какой страницы"
                            type="number"
                            value={dayForm.pageFrom}
                            onChange={e => {
                              const pf = e.target.value;
                              setDayForm(p => {
                                const pt = Number(p.pageTo) || 0;
                                const units =
                                  pf !== '' && pt >= Number(pf) ? pt - Number(pf) : 0;
                                return { ...p, pageFrom: pf, units, done: units > 0 };
                              });
                            }}
                            margin="dense"
                          />
                          <TextField
                            label="На какой странице читаю"
                            type="number"
                            value={dayForm.pageTo}
                            onChange={e => {
                              const pt = e.target.value;
                              setDayForm(p => {
                                const pf = p.pageFrom === '' || p.pageFrom == null ? 0 : Number(p.pageFrom);
                                const units =
                                  pt !== '' && Number(pt) >= pf ? Number(pt) - pf : 0;
                                return { ...p, pageTo: pt, units, done: units > 0 };
                              });
                            }}
                            margin="dense"
                            error={
                              dayForm.pageFrom !== '' &&
                              dayForm.pageFrom != null &&
                              dayForm.pageTo !== '' &&
                              dayForm.pageTo != null &&
                              Number(dayForm.pageTo) < Number(dayForm.pageFrom)
                            }
                            helperText={
                              dayForm.pageFrom !== '' &&
                              dayForm.pageFrom != null &&
                              dayForm.pageTo !== '' &&
                              dayForm.pageTo != null &&
                              Number(dayForm.pageTo) < Number(dayForm.pageFrom)
                                ? '«По» меньше «с» — проверь страницы'
                                : ''
                            }
                            FormHelperTextProps={{ sx: { fontSize: 10, color: '#ff8a8a' } }}
                          />
                        </div>
                        <TextField
                          label="Страниц прочитано"
                          type="number"
                          value={dayForm.units}
                          onChange={e => {
                            const u = e.target.value;
                            setDayForm(p => {
                              const pf = p.pageFrom === '' || p.pageFrom == null ? 0 : Number(p.pageFrom);
                              const pt = Number(u) > 0 ? pf + Number(u) : '';
                              return { ...p, units: u, pageTo: pt, done: Number(u) > 0 };
                            });
                          }}
                          fullWidth
                          margin="dense"
                        />
                      </>
                    ) : (
                      <>
                        <div className="tm-dialog__slider">
                          <span>Сделано единиц: {dayForm.units}</span>
                          {dayForm.planned != null && <span> (план: {dayForm.planned})</span>}
                        </div>
                        <TextField
                          label="Единиц выполнено"
                          type="number"
                          value={dayForm.units}
                          onChange={e =>
                            setDayForm(p => ({ ...p, units: e.target.value, done: Number(e.target.value) > 0 }))
                          }
                          fullWidth
                          margin="dense"
                        />
                      </>
                    )}
                  </>
                ))}
              {!dayForm.exclude && dayForm.date <= today && (
                <TextField
                  label="Заметка"
                  value={dayForm.notes || ''}
                  onChange={e => setDayForm(p => ({ ...p, notes: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                  margin="dense"
                  placeholder="Комментарий к дню..."
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDayOpen(false)}>Отмена</Button>
          <Button onClick={saveDay} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TimeManagementPage;
