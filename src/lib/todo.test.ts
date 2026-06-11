import { Todo } from '../types/todo';
import { addTodo, getTodo, toggleTodo, deleteTodo, updateTodo } from './todo';

describe('Todo TDD 핵심 기능 테스트', () => {
  let initialTodos: Todo[];

  beforeEach(() => {
    initialTodos = [
      {
        id: '1',
        title: '첫 번째 할 일',
        completed: false,
        createdAt: new Date('2026-06-11T10:00:00Z'),
      },
      {
        id: '2',
        title: '두 번째 할 일',
        completed: true,
        createdAt: new Date('2026-06-11T11:00:00Z'),
      },
    ];
  });

  describe('addTodo - 새 할 일 추가', () => {
    it('유효한 제목으로 추가하면 새 할 일이 추가되고 기존 목록이 유지된다.', () => {
      const result = addTodo(initialTodos, '새로운 할 일');
      expect(result.length).toBe(3);
      expect(result[result.length - 1].title).toBe('새로운 할 일');
      expect(result[result.length - 1].completed).toBe(false);
      expect(result[result.length - 1].id).toBeDefined();
      expect(result[result.length - 1].createdAt).toBeInstanceOf(Date);
    });

    it('빈 문자열이나 공백만 있는 제목을 입력하면 예외(Error)를 발생시킨다.', () => {
      expect(() => addTodo(initialTodos, '')).toThrow('할 일 제목은 비어 있을 수 없습니다.');
      expect(() => addTodo(initialTodos, '   ')).toThrow('할 일 제목은 비어 있을 수 없습니다.');
    });

    it('제목이 100자를 초과하는 경우 예외(Error)를 발생시킨다.', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => addTodo(initialTodos, longTitle)).toThrow('할 일 제목은 100자를 초과할 수 없습니다.');
    });
  });

  describe('getTodo - 전체 목록 조회 및 정렬', () => {
    it('전체 목록을 조회하면 저장된 모든 할 일 목록을 반환한다.', () => {
      const result = getTodo(initialTodos);
      expect(result).toHaveLength(2);
      expect(result.find(t => t.id === '1')).toBeDefined();
      expect(result.find(t => t.id === '2')).toBeDefined();
    });

    it('빈 목록일 경우 빈 배열을 반환한다.', () => {
      const result = getTodo([]);
      expect(result).toEqual([]);
    });

    it('생성일자(createdAt) 기준 내림차순(최신순)으로 정렬하여 반환한다.', () => {
      const sortedResult = getTodo(initialTodos);
      // '2'번 할 일이 11시, '1'번 할 일이 10시이므로 내림차순 정렬 시 2번이 먼저 와야 함.
      expect(sortedResult[0].id).toBe('2');
      expect(sortedResult[1].id).toBe('1');
    });
  });

  describe('toggleTodo - 완료 상태 토글', () => {
    it('특정 ID를 제공하면 해당 할 일의 완료 상태(completed)를 토글한다.', () => {
      const result = toggleTodo(initialTodos, '1');
      expect(result[0].completed).toBe(true); // false -> true

      const result2 = toggleTodo(initialTodos, '2');
      expect(result2[1].completed).toBe(false); // true -> false
    });

    it('존재하지 않는 ID를 토글하려고 하면 원본 목록을 그대로 반환한다.', () => {
      const result = toggleTodo(initialTodos, 'non-existent-id');
      expect(result).toEqual(initialTodos);
    });

    it('빈 목록에서 토글을 시도하면 빈 배열을 그대로 반환한다.', () => {
      const result = toggleTodo([], '1');
      expect(result).toEqual([]);
    });
  });

  describe('deleteTodo - 할 일 삭제', () => {
    it('특정 ID를 제공하면 해당 할 일을 목록에서 삭제한다.', () => {
      const result = deleteTodo(initialTodos, '1');
      expect(result).toHaveLength(1);
      expect(result.find(t => t.id === '1')).toBeUndefined();
    });

    it('존재하지 않는 ID를 삭제하려고 하면 원본 목록을 그대로 반환한다.', () => {
      const result = deleteTodo(initialTodos, 'non-existent-id');
      expect(result).toEqual(initialTodos);
    });

    it('여러 개의 할 일 중 정확히 지정된 ID의 항목만 삭제한다.', () => {
      const result = deleteTodo(initialTodos, '2');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('updateTodo - 할 일 수정', () => {
    it('특정 ID와 새 제목을 제공하면 해당 할 일의 제목을 수정한다.', () => {
      const result = updateTodo(initialTodos, '1', '수정된 할 일');
      expect(result[0].title).toBe('수정된 할 일');
    });

    it('수정하려는 제목이 빈 문자열이거나 공백만 있는 경우 예외를 발생시킨다.', () => {
      expect(() => updateTodo(initialTodos, '1', '')).toThrow('할 일 제목은 비어 있을 수 없습니다.');
      expect(() => updateTodo(initialTodos, '1', '   ')).toThrow('할 일 제목은 비어 있을 수 없습니다.');
    });

    it('존재하지 않는 ID의 제목을 수정하려고 하면 원본 목록을 그대로 반환한다.', () => {
      const result = updateTodo(initialTodos, 'non-existent-id', '수정된 제목');
      expect(result).toEqual(initialTodos);
    });
  });
});
