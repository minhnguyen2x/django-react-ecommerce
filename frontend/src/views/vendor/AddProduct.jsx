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
                title: 'Không thể tạo sản phẩm',
                text: 'Vui lòng thử lại sau.'
            })
        } finally {
            setIsLoading(false)
        }
    };
    const productImagePreview = product?.image?.preview

    return (
        <div className=" bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row">
                <Sidebar />
                <form className="flex-1 space-y-8" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <header className="space-y-2">
                        <h1 className="text-2xl font-semibold text-slate-900 py-4">Tạo Sản Phẩm</h1>
                        <p className="text-sm text-muted-foreground">
                            Tải lên thông tin sản phẩm, cấu hình biến thể và xuất bản lên cửa hàng của bạn.
                        </p>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <ImageIcon className="h-5 w-5" />
                                    Xem Trước Sản Phẩm
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
                                        {product.title || 'Sản phẩm chưa có tên'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {product.description ? product.description.slice(0, 140) : 'Thêm mô tả hấp dẫn để nôi bật những lợi ích chính của sản phẩm.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-slate-900">Chi Tiết Sản Phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="product-image">Ảnh Thư Viện</Label>
                                    <Input id="product-image" type="file" name="image" onChange={handleProductFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product-title">Tiêu Đề</Label>
                                    <Input
                                        id="product-title"
                                        type="text"
                                        name="title"
                                        value={product.title || ''}
                                        onChange={handleProductInputChange}
                                        placeholder="Tai nghe không dây cao cấp"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product-description">Mô Tả</Label>
                                    <Textarea
                                        id="product-description"
                                        name="description"
                                        value={product.description || ''}
                                        onChange={handleProductInputChange}
                                        placeholder="Mô tả đặc điểm sản phẩm, chất liệu và bảo hành của cửa hàng."
                                        rows={6}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="product-category">Danh Mục</Label>
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
                                                <SelectValue placeholder="Chọn danh mục" />
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
                                        <Label htmlFor="product-brand">Thương Hiệu</Label>
                                        <Input
                                            id="product-brand"
                                            type="text"
                                            name="brand"
                                            value={product.brand || ''}
                                            onChange={handleProductInputChange}
                                            placeholder="Tên thương hiệu"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="product-price">Giá Bán</Label>
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
                                        <Label htmlFor="product-old-price">Giá Gốc</Label>
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
                                        <Label htmlFor="product-shipping">Phí Vận Chuyển</Label>
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
                                        <Label htmlFor="product-stock">Số Lượng Tồn Kho</Label>
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
                                        <Label htmlFor="product-tags">Thẻ Tags</Label>
                                        <Input
                                            id="product-tags"
                                            type="text"
                                            name="tags"
                                            value={product.tags || ''}
                                            onChange={handleProductInputChange}
                                            placeholder="âm thanh, không dây, cao cấp"
                                        />
                                        <p className="text-xs text-muted-foreground">Tách các thẻ bằng dấu phẩy để tăng khả năng tìm kiếm.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <Button type="submit" className="min-w-[180px]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Tạo Sản Phẩm
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