import React, { useEffect, useState } from 'react'
import { CheckCircle2, Image as ImageIcon, ListChecks, Loader2, Palette, PlusCircle, Tag, Trash2 } from 'lucide-react'
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


function AddProduct() {
    const userData = UserData()

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
        vendor: userData?.vendor_id
    });
    const [specifications, setSpecifications] = useState([{ title: '', content: '' }]);
    const [colors, setColors] = useState([{ name: '', color_code: '', image: null }]);
    const [sizes, setSizes] = useState([{ name: '', price: 0.00 }]);
    const [gallery, setGallery] = useState([{ image: null }]);
    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const axios = apiInstance
    const handleAddMore = (setStateFunction, template) => {
        setStateFunction((prevState) => [...prevState, template]);
    };

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        });
    };

    const handleInputChange = (index, field, value, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState];
            newState[index][field] = value;
            return newState;
        });
    };

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState];
                    newState[index].image = { file, preview: reader.result };
                    return newState;
                });
            };

            reader.readAsDataURL(file);
        } else {
            // Handle the case when no file is selected
            setStateFunction((prevState) => {
                const newState = [...prevState];
                newState[index].image = null; // Set image to null
                newState[index].preview = null; // Optionally set preview to null
                return newState;
            });
        }
    };

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        })
    };

    const handleProductFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                        preview: reader.result
                    }
                });
            };

            reader.readAsDataURL(file);
        }
    }


    useEffect(() => {
        const fetchCategory = async () => {
            axios.get('category/').then((res) => {
                setCategory(res.data)
            })
        }
        fetchCategory()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (product.title == "" || product.description == "" || product.price == "" || product.category === null || product.shipping_amount == "" || product.stock_qty == "" || product.image === null) {
            // If any required field is missing, show an error message or take appropriate action
            console.log("Please fill in all required fields");
            setIsLoading(false)

            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields!',
                text: "All fields are required to create a product",
            })
            return;
        }

        try {
            // Create a FormData object
            setIsLoading(true)
            const formData = new FormData();

            // Append product data
            Object.entries(product).forEach(([key, value]) => {
                if (key === 'image' && value) {
                    formData.append(key, value.file);  // Assuming 'value' is an object with 'file' property
                } else {
                    formData.append(key, value);
                }
            });

            // Append specifications data
            specifications.forEach((specification, index) => {
                Object.entries(specification).forEach(([key, value]) => {
                    formData.append(`specifications[${index}][${key}]`, value);
                });
            });


            colors.forEach((color, index) => {
                Object.entries(color).forEach(([key, value]) => {
                    if (key === 'image') {
                        // Only append image if it's a valid file
                        if (value && value.file && value.file.type.startsWith('image/')) {
                            formData.append(`colors[${index}][${key}]`, value.file, value.file.name);
                        }
                        // Skip appending if image is null or empty
                    } else {
                        formData.append(`colors[${index}][${key}]`, value || '');
                    }
                });
            });

            // Append sizes data
            sizes.forEach((size, index) => {
                Object.entries(size).forEach(([key, value]) => {
                    formData.append(`sizes[${index}][${key}]`, value);
                });
            });

            // Append gallery data
            gallery.forEach((item, index) => {
                if (item.image) {
                    formData.append(`gallery[${index}][image]`, item.image.file);
                }
            });

            await axios.post(`vendor-product-create/${userData?.vendor_id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Product Created Successfully',
                text: 'This product has been successfully created',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Could not create product',
                text: 'Please try again in a moment.'
            })
        } finally {
            setIsLoading(false)
        }
    };
    const productImagePreview = product?.image?.preview

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
                <Sidebar />
                <form className="flex-1 space-y-8" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <header className="space-y-2">
                        <h1 className="text-2xl font-semibold text-slate-900">Create Product</h1>
                        <p className="text-sm text-muted-foreground">
                            Upload product information, configure variations, and publish it to your storefront.
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
                                    <img
                                        src={productImagePreview || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                                        alt="Product preview"
                                        className="h-64 w-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-slate-900">
                                        {product.title || 'Untitled product'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {product.description ? product.description.slice(0, 140) : 'Add a compelling description to highlight the main benefits of your product.'}
                                    </p>
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
                                                {category.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.title}
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
                                {gallery.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No gallery images added yet.</p>
                                )}

                                {gallery.map((item, index) => (
                                    <div key={`gallery-${index}`} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[160px_1fr_auto]">
                                        <div className="flex items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-200 bg-white">
                                            <img
                                                src={item.image?.preview || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                                                alt={`Gallery item ${index + 1}`}
                                                className="h-28 w-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`gallery-${index}`}>Product Image</Label>
                                            <Input
                                                id={`gallery-${index}`}
                                                type="file"
                                                onChange={(event) => handleImageChange(index, event, setGallery)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-fit"
                                            onClick={() => handleRemove(index, setGallery)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddMore(setGallery, { image: null })}
                            >
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
                                {specifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No specification rows added.</p>
                                )}

                                {specifications.map((specification, index) => (
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
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-fit"
                                            onClick={() => handleRemove(index, setSpecifications)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddMore(setSpecifications, { title: '', content: '' })}
                            >
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
                                {sizes.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No sizes configured.</p>
                                )}

                                {sizes.map((size, index) => (
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
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-fit"
                                            onClick={() => handleRemove(index, setSizes)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddMore(setSizes, { name: '', price: '' })}
                            >
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
                                {colors.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No color variants added.</p>
                                )}

                                {colors.map((color, index) => (
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
                                            <Input
                                                id={`color-image-${index}`}
                                                type="file"
                                                onChange={(event) => handleImageChange(index, event, setColors)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Preview</Label>
                                            <div className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-white">
                                                <img
                                                    src={color.image?.preview || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                                                    alt={`Color ${index + 1}`}
                                                    className="h-full w-full rounded-md object-cover"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-fit"
                                            onClick={() => handleRemove(index, setColors)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddMore(setColors, { name: '', color_code: '', image: null })}
                            >
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Create Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct