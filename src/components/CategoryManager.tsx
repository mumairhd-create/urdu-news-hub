import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useLanguage } from '@/hooks/useLanguage'
import { database, Category } from '@/lib/database'
import { Plus, Edit, Trash2, FolderOpen, ChevronDown } from 'lucide-react'

interface CategoryFormData {
  name: { ur: string; en: string; ps?: string }
  description: { ur: string; en: string; ps?: string }
  parent_id?: string
  updated_at?: string
}

export function CategoryManager() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: { ur: '', en: '', ps: '' },
    description: { ur: '', en: '', ps: '' },
    parent_id: '',
    updated_at: new Date().toISOString()
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await database.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const categoryData = {
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      if (editingCategory) {
        await database.updateCategory(editingCategory.id, categoryData)
      } else {
        await database.createCategory(categoryData)
      }
      
      await loadCategories()
      resetForm()
      setIsCreateOpen(false)
      setIsEditOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || { ur: '', en: '', ps: '' },
      parent_id: category.parent_id || '',
      updated_at: category.updated_at
    })
    setIsEditOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await database.deleteCategory(id)
      await loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: { ur: '', en: '', ps: '' },
      description: { ur: '', en: '', ps: '' },
      parent_id: '',
      updated_at: new Date().toISOString()
    })
    setEditingCategory(null)
  }

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parent_id)
  }

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parent_id === parentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'ur' ? 'زمرہ جات کا انتظام' : 'Category Management'}
        </h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'ur' ? 'نیا زمرہ' : 'New Category'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'ur' ? 'نیا زمرہ بنائیں' : 'Create New Category'}
              </DialogTitle>
              <DialogDescription>
                {language === 'ur' ? 'نیا زمرہ کی معلومات درج کریں' : 'Enter category information'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Urdu */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">اردو</h3>
                <div>
                  <Label htmlFor="name_ur">نام</Label>
                  <Input
                    id="name_ur"
                    value={formData.name.ur}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      name: { ...formData.name, ur: e.target.value } 
                    })}
                    placeholder="مثال: سیاست"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="description_ur">تفصیل</Label>
                  <Textarea
                    id="description_ur"
                    value={formData.description.ur}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      description: { ...formData.description, ur: e.target.value } 
                    })}
                    placeholder="سیاسی خبروں کی تفصیل"
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>
              
              {/* English */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">English</h3>
                <div>
                  <Label htmlFor="name_en">Name</Label>
                  <Input
                    id="name_en"
                    value={formData.name.en}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      name: { ...formData.name, en: e.target.value } 
                    })}
                    placeholder="e.g: Politics"
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">Description</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description.en}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      description: { ...formData.description, en: e.target.value } 
                    })}
                    placeholder="Political news and updates"
                    rows={2}
                  />
                </div>
              </div>
              
              {/* Pashto */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">پښتو</h3>
                <div>
                  <Label htmlFor="name_ps">نوم</Label>
                  <Input
                    id="name_ps"
                    value={formData.name.ps || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      name: { ...formData.name, ps: e.target.value } 
                    })}
                    placeholder="مثال: سیاست"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="description_ps">تفصیل</Label>
                  <Textarea
                    id="description_ps"
                    value={formData.description.ps || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      description: { ...formData.description, ps: e.target.value } 
                    })}
                    placeholder="سیاسی خبروں کی تفصیل"
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="parent_id">
                  {language === 'ur' ? 'بڑا زمرہ' : 'Parent Category'}
                </Label>
                <select
                  id="parent_id"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="">
                    {language === 'ur' ? 'کوئی زمرہ نہیں' : 'No Parent'}
                  </option>
                  {getParentCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name[language as keyof typeof cat.name] || cat.name.en}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </Button>
                <Button onClick={handleSubmit}>
                  {language === 'ur' ? 'بنائیں' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ur' ? 'زمرہ ترمیم کریں' : 'Edit Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Urdu */}
            <div className="space-y-2 p-4 bg-muted rounded">
              <h3 className="font-medium text-foreground">اردو</h3>
              <div>
                <Label htmlFor="edit_name_ur">نام</Label>
                <Input
                  id="edit_name_ur"
                  value={formData.name.ur}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: { ...formData.name, ur: e.target.value } 
                  })}
                  dir="rtl"
                />
              </div>
            </div>
            
            {/* English */}
            <div className="space-y-2 p-4 bg-muted rounded">
              <h3 className="font-medium text-foreground">English</h3>
              <div>
                <Label htmlFor="edit_name_en">Name</Label>
                <Input
                  id="edit_name_en"
                  value={formData.name.en}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: { ...formData.name, en: e.target.value } 
                  })}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button onClick={handleSubmit}>
                {language === 'ur' ? 'اپڈیٹ کریں' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {category.name[language as keyof typeof category.name] || category.name.en}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {category.description && (category.description[language as keyof typeof category.description] || category.description.en)}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="secondary">
                  {getSubcategories(category.id).length} {language === 'ur' ? 'ذیلیے زمرہ' : 'subcategories'}
                </Badge>
                {getSubcategories(category.id).length > 0 && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              
              {getSubcategories(category.id).length > 0 && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  {getSubcategories(category.id).map(subcat => (
                    <div key={subcat.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {subcat.name[language as keyof typeof subcat.name] || subcat.name.en}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {language === 'ur' ? 'ذیلیہ' : 'Subcategory'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
