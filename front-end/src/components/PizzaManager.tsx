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
import { GripVertical, Edit2, Trash2, Save, X, Plus, Upload } from 'lucide-react';

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
  onImageUpload: (id: number, file: File) => void;
  editingPizza: Partial<Pizza>;
  setEditingPizza: (pizza: Partial<Pizza>) => void;
}

function SortablePizza({
  pizza,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onImageUpload,
  editingPizza,
  setEditingPizza
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(pizza.id, file);
    }
  };

  if (isEditing) {
    return (
      <Card ref={setNodeRef} style={style} className="mb-4">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                {editingPizza.imageUrl ? (
                  <img 
                    src={editingPizza.imageUrl} 
                    alt={editingPizza.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    🍕
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload image"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
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
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button size="sm" onClick={() => onSave(editingPizza as Pizza)}>
                <Save className="w-4 h-4 mr-1" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-4">
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
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {pizza.imageUrl ? (
              <img 
                src={pizza.imageUrl} 
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                🍕
              </div>
            )}
          </div>

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
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(pizza.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
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
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/pizzas`);
      const data = await response.json();
      setPizzas(data);
      setOriginalOrder(data.map((p: Pizza) => p.id));
      setOrderChanged(false);
    } catch (error) {
      console.error('Erreur lors du chargement des pizzas:', error);
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
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
      alert('Erreur lors de la sauvegarde de l\'ordre');
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
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingPizza({});
    setIsCreating(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pizza ?')) {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE}/pizzas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchPizzas();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleCreate = async (newPizza: Partial<Pizza>) => {
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
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleImageUpload = async (id: number, file: File) => {
    // Pour l'instant, on simule l'upload en créant une URL locale
    // En production, tu ajouteras un vrai service d'upload
    const imageUrl = URL.createObjectURL(file);
    setEditingPizza(prev => ({ ...prev, imageUrl }));
    
    // TODO: Implémenter le vrai upload vers ton service de stockage
    console.log('Upload image pour pizza', id, file);
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
              onImageUpload={(_, file) => handleImageUpload(0, file)}
              editingPizza={editingPizza}
              setEditingPizza={setEditingPizza}
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
              onImageUpload={handleImageUpload}
              editingPizza={editingPizza}
              setEditingPizza={setEditingPizza}
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
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder l\'ordre'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}