import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

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
    } else if (d <= today) {
      const m = (task.marks || {})[d];
      const pct = m && m.done ? m.percent || 0 : 0;
      balance += 100 - pct;
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
        const effStart = prevEnd ? addDays(prevEnd, 1) : t.start;
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
  { key: 'start', label: 'Старт', width: 100 },
  { key: 'planned', label: 'План', width: 100 },
  { key: 'fact', label: 'Факт', width: 130 },
];
const LEFT_OFFSET = COLS.reduce((acc, c, i) => {
  acc[i] = i === 0 ? 0 : acc[i - 1] + COLS[i - 1].width;
  return acc;
}, []);

export const TimeManagementPage = () => {
  const isAdmin = useSelector(authSelectors.getIsAdmin);
  const dispatch = useDispatch();

  const reduxTasks = useSelector(timeManagementSelectors.getTimeManagementTasks);
  const reduxPlans = useSelector(timeManagementSelectors.getTimeManagementPlans);
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

  const today = todayStr();

  // Local state synced with Redux
  const [tasks, setTasks] = useState(() => reduxTasks || []);
  const [plans, setPlans] = useState(() => reduxPlans || []);

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

  const saveToServer = useCallback(() => {
    dispatch(timeManagementOperations.saveTimeManagement({ tasks, plans }));
  }, [dispatch, tasks, plans]);

  // Debounced auto-save with content check
  const saveTimeoutRef = useRef(null);
  const prevTasksRef = useRef(JSON.stringify(tasks));
  const prevPlansRef = useRef(JSON.stringify(plans));
  useEffect(() => {
    if (!loaded || tasks.length === 0) return;
    const currentTasks = JSON.stringify(tasks);
    const currentPlans = JSON.stringify(plans);
    if (currentTasks === prevTasksRef.current && currentPlans === prevPlansRef.current) return;
    prevTasksRef.current = currentTasks;
    prevPlansRef.current = currentPlans;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [saveToServer, loaded, tasks, plans]);

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
          if (m && m.reason) s.reasons += 1;
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
    setTaskForm({ ...task });
    setTaskOpen(true);
  };
  const saveTask = () => {
    const name = taskForm.name.trim();
    if (!name) return toast.warn('Укажите название задачи');
    let plannedDays;
    let plannedEnd;
    if (taskForm.kind === 'book' && taskForm.mode === 'units') {
      const total = Number(taskForm.unitsTotal) || 0;
      if (!total) return toast.warn('Укажите всего страниц');
      if (taskForm.unitsStrategy === 'fixed') {
        const perDay = Number(taskForm.unitsPerDay) || 0;
        if (!perDay) return toast.warn('Укажите страниц в день');
        const days = Math.ceil(total / perDay);
        plannedDays = days;
        plannedEnd = addDays(taskForm.start, days - 1);
      } else {
        // even — берём из planMode как раньше
        if (taskForm.planMode === 'days') {
          plannedDays = Math.max(1, Number(taskForm.daysCount) || 1);
          plannedEnd = addDays(taskForm.start, plannedDays - 1);
        } else {
          if (taskForm.plannedEnd < taskForm.start) return toast.warn('План. финиш раньше старта');
          plannedDays = Math.max(1, diffDays(taskForm.start, taskForm.plannedEnd) + 1);
          plannedEnd = taskForm.plannedEnd;
        }
      }
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
    const payload = { ...taskForm, name, plannedDays, plannedEnd };
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
      walkTime,
      speed,
      reason,
      notes: m?.notes || '',
    });
    setDayOpen(true);
  };
  const saveDay = () => {
    const { taskId, date, mode, effStart, kind, exclude, done, percent, units, walkTime, speed, reason, notes } = dayForm;
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
            walkTime: kind === 'walk' ? Number(walkTime) || 0 : undefined,
            speed: kind === 'walk' ? Number(speed) || 0 : undefined,
            reason: kind === 'walk' && !done ? reason : undefined,
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

  const gridTemplate = `${COLS.map(c => `${c.width}px`).join(' ')} repeat(${days.length}, 32px)`;

  return (
    <div className="timemanagement">
      <div className="tm-header">
        <div className="tm-header__title">
          <h1>Тайм-менеджмент</h1>
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
          <div className="tm-gantt" onDragOver={handleDragOver}>
            <div className="tm-grid" style={{ gridTemplateColumns: gridTemplate }}>
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

              {boardRows.map(row => {
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
                      style={{ left: LEFT_OFFSET[1], width: COLS[1].width }}
                      onClick={() => openEdit(t)}
                    >
                      {row.effStart}
                    </div>
                    <div
                      className="tm-cell tm-sticky"
                      style={{ left: LEFT_OFFSET[2], width: COLS[2].width }}
                      onClick={() => openEdit(t)}
                    >
                      {t.plannedEnd}
                    </div>
                    <div
                      className="tm-cell tm-sticky"
                      style={{
                        left: LEFT_OFFSET[3],
                        width: COLS[3].width,
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
                      const title =
                        cell.title ||
                        (cell.kind === 'done'
                          ? `${Math.round(cell.fill)}%`
                          : cell.kind === 'miss'
                            ? 'Пропуск'
                            : cell.kind === 'current'
                              ? 'Текущий день'
                              : '');
                      const showText =
                        cell.kind === 'done' || cell.kind === 'miss' || (cell.kind === 'extension' && cell.fill > 0);
                      const filled = (cell.kind === 'done' || cell.kind === 'extension') && cell.fill > 0;
                      const borderColor =
                        cell.kind === 'miss'
                          ? '#f44336'
                          : cell.kind === 'cut'
                            ? '#9e9e9e'
                            : cell.kind === 'gap'
                              ? 'var(--color-07)'
                              : t.color;
                      return (
                        <div
                          key={d}
                          className={`${baseCls} tm-daycell ${cell.kind === 'miss' ? 'tm-miss' : ''} ${
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
                            <span className={`tm-pct ${cell.kind === 'miss' ? 'tm-pct--miss' : ''}`}>
                              {cell.kind === 'miss' ? '✗' : Math.round(cell.fill)}
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

              {boardRows.length === 0 && (
                <div className="tm-empty" style={{ gridColumn: `1 / span ${days.length + COLS.length}` }}>
                  Пока нет задач. Нажмите «Добавить задачу».
                </div>
              )}
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
          {taskForm.kind !== 'walk' && (
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
                <MenuItem value="units">{taskForm.kind === 'book' ? 'Страницы' : 'Единицы'}</MenuItem>
              </TextField>
              {taskForm.mode === 'units' && (
                <>
                  <TextField
                    label={taskForm.kind === 'book' ? 'Всего страниц' : 'Всего единиц'}
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
                    <MenuItem value="fixed">
                      Фикс {taskForm.kind === 'book' ? 'стр.' : 'ед.'}/день (остаток в конец)
                    </MenuItem>
                  </TextField>
                  {taskForm.unitsStrategy === 'fixed' && (
                    <TextField
                      label={taskForm.kind === 'book' ? 'Страниц в день' : 'Единиц в день'}
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
          )}
          {taskForm.kind === 'book' && taskForm.mode === 'units' && Number(taskForm.unitsTotal) > 0 && (
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
                if (taskForm.unitsStrategy === 'fixed') {
                  const perDay = Number(taskForm.unitsPerDay) || 0;
                  if (!perDay)
                    return <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>Укажите страниц в день</Typography>;
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
                } else {
                  const days =
                    taskForm.planMode === 'days'
                      ? Number(taskForm.daysCount) || 1
                      : Math.max(1, diffDays(taskForm.start, taskForm.plannedEnd) + 1);
                  const avg = Math.round(total / days);
                  const base = Math.floor(total / days);
                  return (
                    <>
                      <Typography sx={{ fontSize: 11, color: '#e8dcc3' }}>
                        📖 Равномерно <b>{days} дн.</b> ~<b>{avg} стр/день</b>, посл. <b>{base} стр.</b>
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: '#8a8a8a' }}>
                        Финиш:{' '}
                        <b style={{ color: '#c2a85a' }}>
                          {taskForm.planMode === 'days' ? addDays(taskForm.start, days - 1) : taskForm.plannedEnd}
                        </b>
                      </Typography>
                    </>
                  );
                }
              })()}
            </Box>
          )}
          {taskForm.kind === 'walk' && (
            <div className="tm-hint">Ходьба отмечается по дням: время и скорость (или причина пропуска).</div>
          )}
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
              helperText={taskForm.kind === 'book' ? 'По умолчанию — день после предыдущей' : ''}
              FormHelperTextProps={{ sx: { fontSize: 10, color: '#8a8a8a' } }}
            />
            {taskForm.planMode === 'days' ? (
              <TextField
                label={taskForm.kind === 'book' ? 'Прочитать за N дней' : 'Сделать за N дней'}
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
          {taskForm.kind === 'book' && (
            <div
              style={{
                marginTop: 12,
                padding: 8,
                background: '#121214',
                border: '1px solid #1f1f22',
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 11, color: '#8a8a8a', marginBottom: 6 }}>Шаблоны серии (томов)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Трилогия 3×320', total: 960, days: 90 },
                  { label: '5 томов 1500', total: 1500, days: 120 },
                  { label: '30 дней ×20стр', total: 600, days: 30, perDay: 20 },
                  { label: '90 дней ×10стр', total: 900, days: 90, perDay: 10 },
                ].map(tpl => (
                  <Button
                    key={tpl.label}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11, borderColor: '#333', color: '#c9c9c9' }}
                    onClick={() => {
                      setTaskForm(p => ({
                        ...p,
                        mode: 'units',
                        unitsTotal: String(tpl.total),
                        unitsStrategy: tpl.perDay ? 'fixed' : 'even',
                        unitsPerDay: tpl.perDay ? String(tpl.perDay) : p.unitsPerDay,
                        plannedDays: tpl.days,
                        plannedEnd: addDays(p.start, tpl.days - 1),
                        daysCount: String(tpl.days),
                      }));
                      toast.info(`Применён шаблон: ${tpl.label}`);
                    }}
                  >
                    {tpl.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
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
                      <TextField
                        label="Причина пропуска"
                        select
                        value={dayForm.reason}
                        onChange={e => setDayForm(p => ({ ...p, reason: e.target.value }))}
                        fullWidth
                        margin="dense"
                      >
                        {WALK_REASONS.map(r => (
                          <MenuItem key={r.value} value={r.value}>
                            {r.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                    ) : (
                      <>
                        <div className="tm-dialog__slider">
                          <span>
                            {dayForm.kind === 'book' ? 'Прочитано стр.' : 'Сделано единиц'}: {dayForm.units}
                          </span>
                          {dayForm.planned != null && <span> (план: {dayForm.planned})</span>}
                        </div>
                        <TextField
                          label={dayForm.kind === 'book' ? 'Страниц прочитано' : 'Единиц выполнено'}
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
