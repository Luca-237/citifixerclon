import { useState } from "react";
import { Trash2, Loader2, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/services/api";
import { capitalize } from "@/lib/incidents";

function CategorySkeleton() {
  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-32 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3 w-48 rounded-full bg-gray-100 animate-pulse" />
        </div>
        <div className="h-8 w-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
      </CardContent>
    </Card>
  );
}

function DeleteConfirmDialog({ category, open, onOpenChange, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(category._id);
      onDeleted?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-[#292D60]">Eliminar categoría</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-1">
          ¿Estás seguro que querés eliminar{" "}
          <span className="font-semibold">{capitalize(category?.name)}</span>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            {loading && <Loader2 size={14} className="mr-1.5 animate-spin" />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoryList({ categories, loading, onUpdated }) {
  const [toDelete, setToDelete] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => <CategorySkeleton key={i} />)}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">
        No hay categorías creadas todavía.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <Card key={cat._id} className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-[#D3D6FF]/60 flex items-center justify-center">
                  <Tag size={14} className="text-[#2F347A]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#292D60] truncate">
                    {capitalize(cat.name)}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-gray-400 truncate">{cat.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setToDelete(cat)}
                className="shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                aria-label="Eliminar categoría"
              >
                <Trash2 size={15} />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteConfirmDialog
        category={toDelete}
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        onDeleted={onUpdated}
      />
    </>
  );
}
