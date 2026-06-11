"use client";

import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import { addTodo, getTodo, toggleTodo, deleteTodo, updateTodo } from "@/lib/todo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit3, Plus, CheckCircle2, Circle, AlertCircle, Calendar } from "lucide-react";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 수정 관련 상태
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // 초기 픽스처 로드 (클라이언트에서만 Date 객체 파싱을 안전하게 하기 위해 useEffect 활용)
  useEffect(() => {
    setTodos([
      {
        id: "1",
        title: "TDD 테스트 작성하기",
        completed: true,
        createdAt: new Date(Date.now() - 3600000 * 2), // 2시간 전
      },
      {
        id: "2",
        title: "핵심 CRUD 함수 구현 완료하기",
        completed: true,
        createdAt: new Date(Date.now() - 3600000), // 1시간 전
      },
      {
        id: "3",
        title: "Shadcn UI로 멋진 대시보드 화면 꾸미기",
        completed: false,
        createdAt: new Date(),
      },
    ]);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const updated = addTodo(todos, newTitle);
      setTodos(updated);
      setNewTitle("");
    } catch (err: any) {
      setError(err.message || "에러가 발생했습니다.");
    }
  };

  const handleToggle = (id: string) => {
    const updated = toggleTodo(todos, id);
    setTodos(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteTodo(todos, id);
    setTodos(updated);
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditError(null);
  };

  const handleUpdate = () => {
    if (!editingTodo) return;
    setEditError(null);
    try {
      const updated = updateTodo(todos, editingTodo.id, editTitle);
      setTodos(updated);
      setEditingTodo(null);
    } catch (err: any) {
      setEditError(err.message || "에러가 발생했습니다.");
    }
  };

  // 정렬된 Todo 목록 가져오기 (getTodo 함수 호출)
  const sortedTodos = getTodo(todos);

  // 진행률 계산
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      {/* 백그라운드 오너먼트 */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[128px] opacity-10 animate-pulse pointer-events-none" />

      <Card className="w-full max-w-2xl bg-slate-950/70 border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        {/* 상단 무드 바 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        
        <CardHeader className="space-y-2 pt-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Task Matrix
            </CardTitle>
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              TDD Verified
            </div>
          </div>
          <CardDescription className="text-slate-400 text-sm">
            Jest 유닛 테스트를 거친 견고한 할 일 관리 대시보드
          </CardDescription>

          {/* 진행률 바 */}
          <div className="mt-4 pt-2 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>진행률 ({completedCount}/{totalCount})</span>
              <span className="font-semibold text-purple-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 할 일 입력 폼 */}
          <form onSubmit={handleAdd} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="새로운 할 일을 입력하세요... (최대 100자)"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  className="bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-slate-950 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium px-4 shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* 할 일 목록 */}
          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {sortedTodos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요!
              </div>
            ) : (
              sortedTodos.map((todo) => (
                <div 
                  key={todo.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    todo.completed 
                      ? "bg-slate-950/30 border-slate-900/80 text-slate-500" 
                      : "bg-slate-900/50 border-slate-800/60 text-slate-200 hover:border-slate-700/60 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(todo.id)}
                      className="text-slate-400 hover:text-purple-400 transition-colors focus:outline-none shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10 animate-scale-in" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm font-medium break-all transition-all duration-300 ${
                        todo.completed ? "line-through text-slate-600 decoration-slate-700" : ""
                      }`}>
                        {todo.title}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(todo.createdAt).toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(todo)}
                      className="h-8 w-8 text-slate-400 hover:text-purple-400 hover:bg-slate-800/50"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(todo.id)}
                      className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 수정 모달 */}
      <Dialog open={editingTodo !== null} onOpenChange={(open) => !open && setEditingTodo(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              할 일 수정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold">제목</label>
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editError) setEditError(null);
                }}
                className="bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-purple-500 focus-visible:ring-offset-slate-950"
              />
            </div>
            {editError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setEditingTodo(null)}
              className="border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
