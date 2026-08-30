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

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';

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

const seedExamples = () => [
  {
    id: 'seed-book',
    name: 'Книга: пример',
    info: '320 стр.',
    color: COLORS[0],
    kind: 'book',
    mode: 'units',
    unitsTotal: 320,
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
  },
  {
    id: 'seed-walk',
    name: 'Ходьба',
    info: 'утро',
    color: COLORS[3],
    kind: 'walk',
    mode: 'percent',
    start: todayStr(),
    plannedEnd: addDays(todayStr(), 29),
    plannedDays: 30,
    planMode: 'range',
    daysCount: '',
    excludeRule: 'none',
    exclusions: [],
    marks: {},
  },
];

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
      if (!m || !m.done) return { kind: 'miss' };
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

  if (!isAdmin) return <Navigate to="/profile" replace />;

  // ---------- handlers ----------
  const openAdd = kind => {
    const base = emptyTask();
    if (kind === 'book') {
      base.kind = 'book';
      base.name = 'Книга: ';
      base.mode = 'units';
      base.unitsTotal = 320;
      base.unitsStrategy = 'even';
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
    if (taskForm.planMode === 'days') {
      plannedDays = Math.max(1, Number(taskForm.daysCount) || 1);
      plannedEnd = addDays(taskForm.start, plannedDays - 1);
    } else {
      if (taskForm.plannedEnd < taskForm.start) return toast.warn('План. финиш раньше старта');
      plannedDays = Math.max(1, diffDays(taskForm.start, taskForm.plannedEnd) + 1);
      plannedEnd = taskForm.plannedEnd;
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
    });
    setDayOpen(true);
  };
  const saveDay = () => {
    const { taskId, date, mode, effStart, kind, exclude, done, percent, units, walkTime, speed, reason } = dayForm;
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
        <div className="tm-gantt">
          <div className="tm-grid" style={{ gridTemplateColumns: gridTemplate }}>
          {COLS.map((c, i) => (
            <div key={c.key} className="tm-cell tm-cell--head tm-sticky" style={{ left: LEFT_OFFSET[i], width: c.width }}>
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
                  <div className="tm-cell tm-sticky tm-phase" style={{ left: LEFT_OFFSET[0], width: COLS[0].width }}>
                    <IconButton size="small" className="tm-caret" onClick={() => togglePhase(row.phase)}>
                      {collapsed[row.phase] ? <ChevronRightIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <b>{row.phase}</b>
                  </div>
                  {COLS.slice(1).map((c, i) => (
                    <div key={c.key} className="tm-cell tm-sticky" style={{ left: LEFT_OFFSET[i + 1], width: c.width }} />
                  ))}
                  <div className="tm-cell" style={{ gridColumn: `span ${days.length}` }} />
                </React.Fragment>
              );
            }
            const t = row.task;
            const sch = row.sch;
            const factDays = Object.values(t.marks || {}).filter(m => m.done).length;
            return (
              <React.Fragment key={t.id}>
                <div
                  className="tm-cell tm-sticky tm-task"
                  style={{ left: LEFT_OFFSET[0], width: COLS[0].width, borderLeft: `4px solid ${t.color}` }}
                  onClick={() => openEdit(t)}
                >
                  <span className="tm-swatch" style={{ background: t.color }} />
                  <span className="tm-taskname">{t.name}</span>
                  {t.info && <span className="tm-tasktitle">{t.info}</span>}
                </div>
                <div className="tm-cell tm-sticky" style={{ left: LEFT_OFFSET[1], width: COLS[1].width }} onClick={() => openEdit(t)}>
                  {row.effStart}
                </div>
                <div className="tm-cell tm-sticky" style={{ left: LEFT_OFFSET[2], width: COLS[2].width }} onClick={() => openEdit(t)}>
                  {t.plannedEnd}
                </div>
                <div className="tm-cell tm-sticky" style={{ left: LEFT_OFFSET[3], width: COLS[3].width }} onClick={() => openEdit(t)}>
                  {sch.end}{' '}
                  <span className="tm-fact">
                    ({factDays}/{sch.plannedDays}
                    {sch.ext + sch.excludedCount > 0 ? `+${sch.ext + sch.excludedCount}` : ''})
                  </span>
                </div>
                {days.map(d => {
                  const cell = dayCell(t, sch, row.effStart, d);
                  const baseCls = `tm-cell ${d === today ? 'tm-col--today' : ''} ${isWeekend(d) ? 'tm-weekend' : ''} ${
                    isMonday(d) ? 'tm-weekstart' : ''
                  }`;
                  if (cell.kind === 'empty')
                    return <div key={d} className={baseCls} onClick={() => openDay(t, row.effStart, d)} />;
                  const pct = Math.max(0, Math.min(100, cell.fill || 0));
                  const title =
                    cell.title ||
                    (cell.kind === 'done' ? `${Math.round(cell.fill)}%` : cell.kind === 'miss' ? 'Пропуск' : '');
                  const showText = cell.kind === 'done' || cell.kind === 'miss' || (cell.kind === 'extension' && cell.fill > 0);
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
                      } ${cell.kind === 'gap' ? 'tm-excluded' : ''} ${cell.kind === 'extension' ? 'tm-ext' : ''}`}
                      style={{ borderColor }}
                      onClick={() => openDay(t, row.effStart, d)}
                      title={title}
                    >
                      {cell.kind === 'gap' && <span className="tm-gap-mark">↩</span>}
                      {filled && (
                        <div className={`tm-fill ${cell.kind === 'extension' ? 'tm-fill--proj' : ''}`} style={{ width: `${pct}%` }} />
                      )}
                      {showText && (
                        <span className={`tm-pct ${cell.kind === 'miss' ? 'tm-pct--miss' : ''}`}>
                          {cell.kind === 'miss' ? '✗' : Math.round(cell.fill)}
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
      )}

      {view === 'archive' && (
        <div className="tm-archive">
          <div className="tm-archive__bar">
            <span>Архив — отмеченные можно удалить или восстановить</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small" variant="contained" color="error" disabled={!Object.values(selected).some(Boolean)} onClick={deleteArchived}>
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
                    <MenuItem value="fixed">Фикс {taskForm.kind === 'book' ? 'стр.' : 'ед.'}/день (остаток в конец)</MenuItem>
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
        </DialogContent>
        <DialogActions>
          {taskForm.id && (
            <IconButton onClick={deleteTask} color="error" aria-label="delete">
              <DeleteOutlineIcon />
            </IconButton>
          )}
          {taskForm.id && (
            <Button onClick={() => { archiveTask(taskForm.id); setTaskOpen(false); }}>В архив</Button>
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
          {plans.length === 0 && <span className="tm-hint">Планов пока нет. Откройте задачу и нажмите «Сохранить как план».</span>}
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
              <Button size="small" variant="contained" onClick={() => { addPlanToBoard(p); setPlansOpen(false); }}>
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
                  <Switch checked={dayForm.exclude} onChange={e => setDayForm(p => ({ ...p, exclude: e.target.checked }))} />
                }
                label="Исключить день (перенести в конец)"
              />
              {!dayForm.exclude && dayForm.date <= today && (
                dayForm.kind === 'walk' ? (
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
                          onChange={e => setDayForm(p => ({ ...p, units: e.target.value, done: Number(e.target.value) > 0 }))}
                          fullWidth
                          margin="dense"
                        />
                      </>
                    )}
                  </>
                )
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
