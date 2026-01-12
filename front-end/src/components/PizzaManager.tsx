import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Save, X, Plus, Loader2, Check } from 'lucide-react';
import { ImageUploadCrop } from './ImageUploadCrop';
import { toast } from 'sonner';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: string;
  vegetarian: boolean;
  available: boolean;
  imageUrl?: string;
  preparationTime: number;
  ingredients: Array<{
    id: number;
    name: string;
    imageUrl?: string;
  }>;
}

interface PizzaManagerProps {
  onBack: () => void;
}

interface SortablePizzaProps {
  pizza: Pizza;
  isEditing: boolean;
  onEdit: (pizza: Pizza) => void;
  onSave: (pizza: Pizza) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  editingPizza: Partial<Pizza>;
  setEditingPizza: (pizza: Partial<Pizza>) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

function SortablePizza({
  pizza,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  editingPizza,
  setEditingPizza,
  isSaving = false,
  isDeleting = false
}: SortablePizzaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: pizza.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isEditing) {
    return (
      <Card ref={setNodeRef} style={style} className="mb-4">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <ImageUploadCrop
                currentImageUrl={editingPizza.imageUrl}
                onImageSave={(imageUrl) => setEditingPizza({ ...editingPizza, imageUrl })}
                alt={editingPizza.name || 'Pizza'}
                className="w-24 h-24"
              />
              <div className="flex-1 space-y-2">
                <Input
                  value={editingPizza.name || ''}
                  onChange={(e) => setEditingPizza({ ...editingPizza, name: e.target.value })}
                  placeholder="Nom de la pizza"
                  className="font-semibold"
                />
                <div className="flex space-x-2">
                  <div className="relative w-24">
                    <Input
                      type="number"
                      value={editingPizza.price || ''}
                      onChange={(e) => setEditingPizza({ ...editingPizza, price: e.target.value })}
                      placeholder="10"
                      className="pr-6"
                      step="0.50"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">€</span>
                  </div>
                  <div className="relative w-32">
                    <Input
                      type="number"
                      value={editingPizza.preparationTime || ''}
                      onChange={(e) => setEditingPizza({ ...editingPizza, preparationTime: parseInt(e.target.value) })}
                      placeholder="15"
                      className="pr-8"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Textarea
              value={editingPizza.description || ''}
              onChange={(e) => setEditingPizza({ ...editingPizza, description: e.target.value })}
              placeholder="Description de la pizza"
              rows={3}
            />

            {/* Options */}
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingPizza.vegetarian || false}
                  onChange={(e) => setEditingPizza({ ...editingPizza, vegetarian: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Végétarien</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingPizza.available !== false}
                  onChange={(e) => setEditingPizza({ ...editingPizza, available: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Disponible</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={() => onSave(editingPizza as Pizza)}
                disabled={isSaving || !editingPizza.name}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`mb-4 transition-all duration-200 hover:shadow-md ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      } ${
        isDragging ? 'rotate-2 shadow-lg' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Image */}
          <ImageUploadCrop
            currentImageUrl={pizza.imageUrl}
            onImageSave={(imageUrl) => {
              // Update the pizza image directly
              handleEdit({ ...pizza, imageUrl });
              handleSave({ ...pizza, imageUrl });
            }}
            alt={pizza.name}
            className="w-16 h-16 flex-shrink-0"
          />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{pizza.name}</h3>
              <span className="font-bold text-primary">{pizza.price}€</span>
              {pizza.vegetarian && <Badge variant="secondary">Végé</Badge>}
              {!pizza.available && <Badge variant="destructive">Indispo</Badge>}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{pizza.description}</p>
            <div className="text-xs text-gray-500 mt-1">
              {pizza.preparationTime} min • {pizza.ingredients?.length || 0} ingrédients
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(pizza)}
              disabled={isDeleting}
              className="transition-all hover:scale-105"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(pizza.id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 transition-all hover:scale-105 min-w-[40px]"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PizzaManager({ onBack }: PizzaManagerProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [originalOrder, setOriginalOrder] = useState<number[]>([]);
  const [orderChanged, setOrderChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPizza, setEditingPizza] = useState<Partial<Pizza>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/pizzas`);
      const data = await response.json();
      setPizzas(data);
      setOriginalOrder(data.map((p: Pizza) => p.id));
      setOrderChanged(false);
      toast.success(`${data.length} pizzas chargées avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement des pizzas:', error);
      toast.error('Erreur lors du chargement des pizzas');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPizzas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Vérifier si l'ordre a changé par rapport à l'original
        const newIds = newOrder.map(p => p.id);
        const hasChanged = !originalOrder.every((id, index) => id === newIds[index]);
        setOrderChanged(hasChanged);
        
        return newOrder;
      });
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    toast.loading('Sauvegarde de l\'ordre...', { id: 'save-order' });
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const pizzaIds = pizzas.map(p => p.id);
      await fetch(`${API_BASE}/pizzas/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pizzaIds }),
      });
      
      setOriginalOrder(pizzaIds);
      setOrderChanged(false);
      toast.success('Ordre sauvegardé avec succès !', { id: 'save-order' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
      toast.error('Erreur lors de la sauvegarde', { id: 'save-order' });
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = () => {
    // Restaurer l'ordre original
    const originalPizzas = originalOrder.map(id => pizzas.find(p => p.id === id)).filter(Boolean) as Pizza[];
    setPizzas(originalPizzas);
    setOrderChanged(false);
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingId(pizza.id);
    setEditingPizza(pizza);
  };

  const handleSave = async (updatedPizza: Pizza) => {
    const pizzaId = updatedPizza.id;
    setSavingIds(prev => new Set([...prev, pizzaId]));
    toast.loading(`Sauvegarde de ${updatedPizza.name}...`, { id: `save-${pizzaId}` });
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/pizzas/${updatedPizza.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedPizza.name,
          description: updatedPizza.description,
          price: parseFloat(updatedPizza.price),
          vegetarian: updatedPizza.vegetarian,
          available: updatedPizza.available,
          preparationTime: updatedPizza.preparationTime,
          imageUrl: updatedPizza.imageUrl
        }),
      });

      if (response.ok) {
        await fetchPizzas();
        setEditingId(null);
        setEditingPizza({});
        toast.success(`${updatedPizza.name} sauvegardée !`, { id: `save-${pizzaId}` });
      } else {
        throw new Error('Erreur de sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur lors de la sauvegarde de ${updatedPizza.name}`, { id: `save-${pizzaId}` });
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(pizzaId);
        return newSet;
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingPizza({});
    setIsCreating(false);
  };

  const handleDelete = async (id: number) => {
    const pizza = pizzas.find(p => p.id === id);
    const pizzaName = pizza?.name || `Pizza ${id}`;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${pizzaName}" ?`)) {
      setDeletingIds(prev => new Set([...prev, id]));
      toast.loading(`Suppression de ${pizzaName}...`, { id: `delete-${id}` });
      
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE}/pizzas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchPizzas();
          toast.success(`${pizzaName} supprimée avec succès`, { id: `delete-${id}` });
        } else {
          throw new Error('Erreur de suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(`Erreur lors de la suppression de ${pizzaName}`, { id: `delete-${id}` });
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }
  };

  const handleCreate = async (newPizza: Partial<Pizza>) => {
    setSaving(true);
    toast.loading(`Création de ${newPizza.name || 'la nouvelle pizza'}...`, { id: 'create-pizza' });
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/pizzas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPizza.name,
          description: newPizza.description,
          price: parseFloat(newPizza.price || '0'),
          vegetarian: newPizza.vegetarian || false,
          available: newPizza.available !== false,
          preparationTime: newPizza.preparationTime || 15,
          size: 'medium',
          imageUrl: newPizza.imageUrl
        }),
      });

      if (response.ok) {
        await fetchPizzas();
        setIsCreating(false);
        setEditingPizza({});
        toast.success(`${newPizza.name} créée avec succès !`, { id: 'create-pizza' });
      } else {
        throw new Error('Erreur de création');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la pizza', { id: 'create-pizza' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (id: number, imageUrl: string) => {
    // Pour l'instant, on utilise l'URL générée par le crop
    // En production, tu ajouteras un vrai service d'upload
    console.log('Save image URL for pizza', id, imageUrl);
    
    // TODO: Implémenter le vrai upload vers ton service de stockage
    // For now, the imageUrl is already set by the ImageUploadCrop component
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingPizza({
      name: '',
      description: '',
      price: '',
      vegetarian: false,
      available: true,
      preparationTime: 15
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Pizzas</h1>
          <p className="text-gray-600">Réorganisez par glisser-déposer, éditez et gérez vos pizzas</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={startCreating} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Pizza
          </Button>
          <Button variant="outline" onClick={onBack}>
            ← Retour
          </Button>
        </div>
      </div>

      {/* Création nouvelle pizza */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nouvelle Pizza</CardTitle>
          </CardHeader>
          <CardContent>
            <SortablePizza
              pizza={{} as Pizza}
              isEditing={true}
              onEdit={() => {}}
              onSave={handleCreate}
              onCancel={handleCancel}
              onDelete={() => {}}
              editingPizza={editingPizza}
              setEditingPizza={setEditingPizza}
              isSaving={saving}
            />
          </CardContent>
        </Card>
      )}

      {/* Liste des pizzas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={pizzas.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {pizzas.map((pizza) => (
            <SortablePizza
              key={pizza.id}
              pizza={pizza}
              isEditing={editingId === pizza.id}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              editingPizza={editingPizza}
              setEditingPizza={setEditingPizza}
              isSaving={savingIds.has(pizza.id)}
              isDeleting={deletingIds.has(pizza.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {pizzas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune pizza trouvée. Créez votre première pizza !
        </div>
      )}

      {/* Bouton de sauvegarde de l'ordre */}
      {orderChanged && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              L'ordre des pizzas a été modifié
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelOrder}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={saveOrder}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 min-w-[140px] transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}