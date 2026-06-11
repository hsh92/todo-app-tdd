import { Todo } from '../types/todo';

// ID 생성 헬퍼 함수
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function addTodo(todos: Todo[], title: string): Todo[] {
  if (!title || title.trim() === '') {
    throw new Error('할 일 제목은 비어 있을 수 없습니다.');
  }
  if (title.length > 100) {
    throw new Error('할 일 제목은 100자를 초과할 수 없습니다.');
  }

  const newTodo: Todo = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    createdAt: new Date(),
  };

  return [...todos, newTodo];
}

export function getTodo(todos: Todo[]): Todo[] {
  if (todos.length === 0) return [];
  // createdAt 기준 내림차순 정렬 (최신순)
  return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  const exists = todos.some(todo => todo.id === id);
  if (!exists) return todos;

  return todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  const exists = todos.some(todo => todo.id === id);
  if (!exists) return todos;

  return todos.filter(todo => todo.id !== id);
}

export function updateTodo(todos: Todo[], id: string, title: string): Todo[] {
  if (!title || title.trim() === '') {
    throw new Error('할 일 제목은 비어 있을 수 없습니다.');
  }
  const exists = todos.some(todo => todo.id === id);
  if (!exists) return todos;

  return todos.map(todo =>
    todo.id === id ? { ...todo, title: title.trim() } : todo
  );
}
