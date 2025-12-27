import React, { useEffect, useState } from 'react'
import { CheckCircle2, Eye, Image as ImageIcon, ListChecks, Loader2, Palette, PlusCircle, Tag, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'

const placeholderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'

const resolvePreview = (media) => {
  if (!media) {
    return null
  }

  if (typeof media === 'string') {
    return media
  }

  if (media.preview) {
    return media.preview
  }

  if (media.url) {
    return media.url
  }

  if (media.image) {
    return media.image
  }

  return null
}

function UpdateProduct() {
  const userData = UserData()
  const axios = apiInstance
  const param = useParams()

  if (UserData()?.vendor_id === 0) {
    window.location.href = '/vendor/register/'
  }

  const [product, setProduct] = useState({
    title: '',
    image: null,
    description: '',
    category: '',
    tags: '',
    brand: '',
    price: '',
    old_price: '',
    shipping_amount: '',
    stock_qty: '',
    vendor: userData?.vendor_id,
    status: 'published',
    type: 'regular',
    featured: false,
    hot_deal: false,
    special_offer: false,
    digital: false,
    in_stock: true,
    slug: '',
    pid: '',
    sku: ''
  })
  const [specifications, setSpecifications] = useState([{ title: '', content: '' }])
  const [colors, setColors] = useState([{ name: '', color_code: '', image: null }])
  const [sizes, setSizes] = useState([{ name: '', price: 0 }])
  const [gallery, setGallery] = useState([{ image: null }])
  const [category, setCategory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMore = (setStateFunction, template) => {
    setStateFunction((prevState) => [...prevState, template])
  }

  const handleRemove = (index, setStateFunction) => {
    setStateFunction((prevState) => prevState.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleInputChange = (index, field, value, setStateFunction) => {
    setStateFunction((prevState) => {
      const updated = [...prevState]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleImageChange = (index, event, setStateFunction) => {
    const file = event.target.files?.[0]

    if (!file) {
      setStateFunction((prevState) => {
        const updated = [...prevState]
        updated[index] = { ...updated[index], image: null }
        return updated
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setStateFunction((prevState) => {
        const updated = [...prevState]
        updated[index] = { ...updated[index], image: { file, preview: reader.result } }
        return updated
      })
    }
    reader.readAsDataURL(file)
  }

  const handleProductInputChange = (event) => {
    const { name, value } = event.target
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProductFileChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProduct((prev) => ({
        ...prev,
        image: {
          file,
          preview: reader.result
        }
      }))
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get('category/')
        setCategory(response.data)
      } catch (error) {
        console.error('Failed to load categories', error)
      }
    }

    fetchCategory()
  }, [axios])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!param?.pid || !userData?.vendor_id) {
        return
      }

      try {
        const response = await axios.get(`vendor-product-edit/${userData.vendor_id}/${param.pid}/`)
        const data = response.data

        setProduct((prev) => ({
          ...prev,
          title: data.title ?? '',
          image: data.image ?? null,
          description: data.description ?? '',
          category: data.category?.id ? String(data.category.id) : data.category ?? '',
          tags: data.tags ?? '',
          brand: data.brand ?? '',
          price: data.price ?? '',
          old_price: data.old_price ?? '',
          shipping_amount: data.shipping_amount ?? '',
          stock_qty: data.stock_qty ?? '',
          vendor: data.vendor?.id ?? userData.vendor_id,
          status: data.status ?? prev.status,
          type: data.type ?? prev.type,
          featured: data.featured ?? prev.featured,
          hot_deal: data.hot_deal ?? prev.hot_deal,
          special_offer: data.special_offer ?? prev.special_offer,
          digital: data.digital ?? prev.digital,
          in_stock: data.in_stock ?? prev.in_stock,
          slug: data.slug ?? '',
          pid: data.pid ?? '',
          sku: data.sku ?? prev.sku
        }))

        setSpecifications(
          data.specification?.length
            ? data.specification.map((item) => ({
                title: item.title ?? '',
                content: item.content ?? ''
              }))
            : [{ title: '', content: '' }]
        )

        setColors(
          data.color?.length
            ? data.color.map((item) => ({
                name: item.name ?? '',
                color_code: item.color_code ?? '',
                image: item.image ?? null
              }))
            : [{ name: '', color_code: '', image: null }]
        )

        setSizes(
          data.size?.length
            ? data.size.map((item) => ({
                name: item.name ?? '',
                price: item.price ?? ''
              }))
            : [{ name: '', price: 0 }]
        )

        setGallery(
          data.gallery?.length
            ? data.gallery.map((item) => ({
                image: item.image ?? null
              }))
            : [{ image: null }]
        )
      } catch (error) {
        console.error('Failed to load product', error)
        Swal.fire({
          icon: 'error',
          title: 'Unable to load product',
          text: 'Please try again later.'
        })
      }
    }

    fetchProduct()
  }, [axios, param?.pid, userData?.vendor_id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!product.title || !product.description || !product.price || !product.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing details',
        text: 'Title, description, price, and category are required.'
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()

      const productPayload = {
        title: product.title,
        description: product.description,
        category: product.category,
        tags: product.tags,
        brand: product.brand,
        price: product.price,
        old_price: product.old_price,
        shipping_amount: product.shipping_amount,
        stock_qty: product.stock_qty,
        vendor: product.vendor ?? userData?.vendor_id,
        status: product.status,
        type: product.type,
        featured: product.featured,
        hot_deal: product.hot_deal,
        special_offer: product.special_offer,
        digital: product.digital,
        in_stock: product.in_stock,
        slug: product.slug,
        pid: product.pid,
        sku: product.sku
      }

      Object.entries(productPayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value)
        }
      })

      if (product.image) {
        if (product.image.file) {
          formData.append('image', product.image.file)
        } else {
          formData.append('image', product.image)
        }
      }

      specifications.forEach((specification, index) => {
        formData.append(`specifications[${index}][title]`, specification.title ?? '')
        formData.append(`specifications[${index}][content]`, specification.content ?? '')
      })

      colors.forEach((color, index) => {
        formData.append(`colors[${index}][name]`, color.name ?? '')
        formData.append(`colors[${index}][color_code]`, color.color_code ?? '')
        if (color.image) {
          if (color.image.file) {
            formData.append(`colors[${index}][image]`, color.image.file)
          } else {
            formData.append(`colors[${index}][image]`, color.image)
          }
        }
      })

      sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][name]`, size.name ?? '')
        formData.append(`sizes[${index}][price]`, size.price ?? '')
      })

      gallery.forEach((item, index) => {
        if (item.image) {
          if (item.image.file) {
            formData.append(`gallery[${index}][image]`, item.image.file)
          } else {
            formData.append(`gallery[${index}][image]`, item.image)
          }
        }
      })

      await axios.put(`vendor-product-edit/${userData?.vendor_id}/${param?.pid}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      Swal.fire({
        icon: 'success',
        title: 'Product updated',
        text: 'The product has been updated successfully.'
      })
    } catch (error) {
      console.error('Failed to update product', error)
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Please review the form and try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const productImagePreview = resolvePreview(product.image) || placeholderImage

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
        <Sidebar />
        <form className="flex-1 space-y-8" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">Update Product</h1>
            <p className="text-sm text-muted-foreground">
              Modify product information, refresh media assets, and adjust available variations.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <ImageIcon className="h-5 w-5" />
                  Product Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-dashed border-slate-200 bg-white">
                  <img src={productImagePreview} alt="Product preview" className="h-64 w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-slate-900">{product.title || 'Untitled product'}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.description
                      ? product.description.slice(0, 140)
                      : 'Keep product details current to build trust with your customers.'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {product.slug && (
                    <Button asChild className="w-full sm:w-auto">
                      <Link to={`/detail/${product.slug}/`}>
                        <Eye className="h-4 w-4" />
                        View Product
                      </Link>
                    </Button>
                  )}
                  <Button type="button" variant="destructive" className="w-full sm:w-auto" disabled>
                    <Trash2 className="h-4 w-4" />
                    Delete (coming soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Product details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="product-image">Product Thumbnail</Label>
                  <Input id="product-image" type="file" name="image" onChange={handleProductFileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-title">Title</Label>
                  <Input
                    id="product-title"
                    type="text"
                    name="title"
                    value={product.title || ''}
                    onChange={handleProductInputChange}
                    placeholder="Premium wireless headphones"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    name="description"
                    value={product.description || ''}
                    onChange={handleProductInputChange}
                    placeholder="Describe product features, materials, and any guarantees your store provides."
                    rows={6}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select
                      value={product.category ? String(product.category) : undefined}
                      onValueChange={(value) =>
                        setProduct((prev) => ({
                          ...prev,
                          category: value
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {category?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-brand">Brand</Label>
                    <Input
                      id="product-brand"
                      type="text"
                      name="brand"
                      value={product.brand || ''}
                      onChange={handleProductInputChange}
                      placeholder="Brand name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Sale Price</Label>
                    <Input
                      id="product-price"
                      type="number"
                      name="price"
                      value={product.price ?? ''}
                      onChange={handleProductInputChange}
                      placeholder="79.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-old-price">Regular Price</Label>
                    <Input
                      id="product-old-price"
                      type="number"
                      name="old_price"
                      value={product.old_price ?? ''}
                      onChange={handleProductInputChange}
                      placeholder="99.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-shipping">Shipping Amount</Label>
                    <Input
                      id="product-shipping"
                      type="number"
                      name="shipping_amount"
                      value={product.shipping_amount ?? ''}
                      onChange={handleProductInputChange}
                      placeholder="5.00"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      name="stock_qty"
                      value={product.stock_qty ?? ''}
                      onChange={handleProductInputChange}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-tags">Tags</Label>
                    <Input
                      id="product-tags"
                      type="text"
                      name="tags"
                      value={product.tags || ''}
                      onChange={handleProductInputChange}
                      placeholder="audio, wireless, premium"
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas for better search visibility.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ImageIcon className="h-5 w-5" />
                Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(!gallery || gallery.length === 0) && <p className="text-sm text-muted-foreground">No gallery images added yet.</p>}

                {gallery?.map((item, index) => (
                  <div key={`gallery-${index}`} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[160px_1fr_auto]">
                    <div className="flex items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-200 bg-white">
                      <img
                        src={resolvePreview(item.image) || placeholderImage}
                        alt={`Gallery item ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`gallery-${index}`}>Product Image</Label>
                      <Input id={`gallery-${index}`} type="file" onChange={(event) => handleImageChange(index, event, setGallery)} />
                    </div>
                    <Button type="button" variant="destructive" className="h-fit" onClick={() => handleRemove(index, setGallery)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => handleAddMore(setGallery, { image: null })}>
                <PlusCircle className="h-4 w-4" />
                Add Gallery Image
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ListChecks className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(!specifications || specifications.length === 0) && <p className="text-sm text-muted-foreground">No specification rows added.</p>}

                {specifications?.map((specification, index) => (
                  <div key={`spec-${index}`} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_1fr_auto]">
                    <div className="space-y-2">
                      <Label htmlFor={`spec-title-${index}`}>Title</Label>
                      <Input
                        id={`spec-title-${index}`}
                        type="text"
                        value={specification.title || ''}
                        onChange={(event) => handleInputChange(index, 'title', event.target.value, setSpecifications)}
                        placeholder="Material"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`spec-content-${index}`}>Content</Label>
                      <Input
                        id={`spec-content-${index}`}
                        type="text"
                        value={specification.content || ''}
                        onChange={(event) => handleInputChange(index, 'content', event.target.value, setSpecifications)}
                        placeholder="100% recycled cotton"
                      />
                    </div>
                    <Button type="button" variant="destructive" className="h-fit" onClick={() => handleRemove(index, setSpecifications)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => handleAddMore(setSpecifications, { title: '', content: '' })}>
                <PlusCircle className="h-4 w-4" />
                Add Specification
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Tag className="h-5 w-5" />
                Sizes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(!sizes || sizes.length === 0) && <p className="text-sm text-muted-foreground">No sizes configured.</p>}

                {sizes?.map((size, index) => (
                  <div key={`size-${index}`} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_1fr_auto]">
                    <div className="space-y-2">
                      <Label htmlFor={`size-name-${index}`}>Size</Label>
                      <Input
                        id={`size-name-${index}`}
                        type="text"
                        value={size.name || ''}
                        onChange={(event) => handleInputChange(index, 'name', event.target.value, setSizes)}
                        placeholder="XL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`size-price-${index}`}>Price Impact</Label>
                      <Input
                        id={`size-price-${index}`}
                        type="number"
                        value={size.price ?? ''}
                        onChange={(event) => handleInputChange(index, 'price', event.target.value, setSizes)}
                        placeholder="5.00"
                      />
                    </div>
                    <Button type="button" variant="destructive" className="h-fit" onClick={() => handleRemove(index, setSizes)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => handleAddMore(setSizes, { name: '', price: '' })}>
                <PlusCircle className="h-4 w-4" />
                Add Size
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Palette className="h-5 w-5" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(!colors || colors.length === 0) && <p className="text-sm text-muted-foreground">No color variants added.</p>}

                {colors?.map((color, index) => (
                  <div key={`color-${index}`} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
                    <div className="space-y-2">
                      <Label htmlFor={`color-name-${index}`}>Name</Label>
                      <Input
                        id={`color-name-${index}`}
                        type="text"
                        value={color.name || ''}
                        onChange={(event) => handleInputChange(index, 'name', event.target.value, setColors)}
                        placeholder="Forest green"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`color-code-${index}`}>Hex Code</Label>
                      <Input
                        id={`color-code-${index}`}
                        type="text"
                        value={color.color_code || ''}
                        onChange={(event) => handleInputChange(index, 'color_code', event.target.value, setColors)}
                        placeholder="#1f513f"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`color-image-${index}`}>Image</Label>
                      <Input id={`color-image-${index}`} type="file" onChange={(event) => handleImageChange(index, event, setColors)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-white">
                        <img
                          src={resolvePreview(color.image) || placeholderImage}
                          alt={`Color ${index + 1}`}
                          className="h-full w-full rounded-md object-cover"
                        />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" className="h-fit" onClick={() => handleRemove(index, setColors)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => handleAddMore(setColors, { name: '', color_code: '', image: null })}>
                <PlusCircle className="h-4 w-4" />
                Add Color
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <Button type="submit" className="min-w-[180px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProduct
