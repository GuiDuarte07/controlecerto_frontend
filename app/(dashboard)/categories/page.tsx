"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Tag,
  MoreVertical,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { categoryService } from "@/features/categories/services/categories.service";
import type { Category, ParentCategory, UpdateCategoryRequest } from "@/types";
import { BillTypeEnum, billTypeLabels } from "@/types/enums";
import { colorOptions, iconOptions } from "@/lib/constants";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [parentForSub, setParentForSub] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("expense");

  const { data: expenseCategories, isLoading: loadingExpenses } = useQuery({
    queryKey: ["categories", BillTypeEnum.EXPENSE],
    queryFn: () => categoryService.getCategories(BillTypeEnum.EXPENSE),
  });

  const { data: incomeCategories, isLoading: loadingIncomes } = useQuery({
    queryKey: ["categories", BillTypeEnum.INCOME],
    queryFn: () => categoryService.getCategories(BillTypeEnum.INCOME),
  });

  const createMutation = useMutation({
    mutationFn: (data: Category) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada com sucesso!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao criar categoria"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryService.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada com sucesso!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao atualizar categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria excluida com sucesso!");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao excluir categoria"),
  });

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
    setParentForSub(undefined);
  }

  function openCreate(billType: BillTypeEnum, parentId?: number) {
    setEditing(null);
    setParentForSub(parentId);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setParentForSub(cat.parentId);
    setDialogOpen(true);
  }

  const isLoading = loadingExpenses || loadingIncomes;
  const currentBillType = activeTab === "expense" ? BillTypeEnum.EXPENSE : BillTypeEnum.INCOME;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Organize suas transacoes por categorias
          </p>
        </div>
        <Button
          onClick={() => openCreate(currentBillType)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="expense" className="gap-1.5 flex-1 sm:flex-initial">
            <TrendingDown className="h-3.5 w-3.5" />
            Despesas
          </TabsTrigger>
          <TabsTrigger value="income" className="gap-1.5 flex-1 sm:flex-initial">
            <TrendingUp className="h-3.5 w-3.5" />
            Receitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="mt-4">
          {loadingExpenses ? (
            <LoadingSkeleton />
          ) : (
            <CategoryList
              categories={expenseCategories || []}
              billType={BillTypeEnum.EXPENSE}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onAddSub={(parentId) => openCreate(BillTypeEnum.EXPENSE, parentId)}
            />
          )}
        </TabsContent>

        <TabsContent value="income" className="mt-4">
          {loadingIncomes ? (
            <LoadingSkeleton />
          ) : (
            <CategoryList
              categories={incomeCategories || []}
              billType={BillTypeEnum.INCOME}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onAddSub={(parentId) => openCreate(BillTypeEnum.INCOME, parentId)}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Create / Edit Dialog */}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
        editing={editing}
        billType={currentBillType}
        parentId={parentForSub}
        onSubmit={(data) => {
          if (editing && editing.id) {
            updateMutation.mutate({ id: editing.id, ...data });
          } else {
            createMutation.mutate({
              ...data,
              billType: currentBillType,
              parentId: parentForSub,
            } as Category);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria &quot;{deleteTarget?.name}&quot; sera excluida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---- Category List with collapsible subcategories ----
function CategoryList({
  categories,
  billType,
  onEdit,
  onDelete,
  onAddSub,
}: {
  categories: ParentCategory[];
  billType: BillTypeEnum;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddSub: (parentId: number) => void;
}) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <Tag className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria de {billTypeLabels[billType].toLowerCase()} cadastrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSub={onAddSub}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
  onAddSub,
}: {
  category: ParentCategory;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddSub: (parentId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasSubs = category.subCategories && category.subCategories.length > 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-4 py-3">
            {hasSubs ? (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  {open ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            ) : (
              <div className="h-7 w-7" />
            )}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: category.color }}
              >
                {category.name[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">{category.name}</span>
              {category.limit != null && category.limit > 0 && (
                <Badge variant="outline" className="ml-2 text-[10px]">
                  Limite: R$ {category.limit.toFixed(2)}
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Editar
                </DropdownMenuItem>
                {category.id && (
                  <DropdownMenuItem onClick={() => onAddSub(category.id!)}>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Subcategoria
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasSubs && (
            <CollapsibleContent>
              <div className="flex flex-col gap-px border-t bg-muted/30">
                {category.subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 px-4 py-2.5 pl-16 hover:bg-muted/50"
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${sub.color}20` }}
                    >
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: sub.color }}
                      >
                        {sub.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 text-sm">{sub.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(sub)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(sub)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          )}
        </CardContent>
      </Card>
    </Collapsible>
  );
}

// ---- Category Form Dialog ----
function CategoryFormDialog({
  open,
  onOpenChange,
  editing,
  billType,
  parentId,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Category | null;
  billType: BillTypeEnum;
  parentId?: number;
  onSubmit: (data: Partial<Category>) => void;
  isLoading: boolean;
}) {
  const form = useForm<Partial<Category>>({
    defaultValues: { name: "", icon: "Wallet", color: colorOptions[0], limit: 0 },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset(
        editing
          ? { name: editing.name, icon: editing.icon, color: editing.color, limit: editing.limit ?? 0 }
          : { name: "", icon: "Wallet", color: colorOptions[0], limit: 0 }
      );
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Categoria" : parentId ? "Nova Subcategoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Tipo: {billTypeLabels[billType]}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Alimentacao, Salario..."
              {...form.register("name", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">Icone</Label>
            <Controller
              control={form.control}
              name="icon"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um icone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {!parentId && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="limit">Limite Mensal (opcional)</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("limit", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => form.setValue("color", c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.watch("color") === c
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
