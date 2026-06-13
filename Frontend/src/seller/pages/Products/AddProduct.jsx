import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/productService';
import { getSellerProfile } from '../../services/sellerService';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FiSave, FiArrowLeft, FiImage, FiPlus, FiTrash } from 'react-icons/fi';

export const AddProduct = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategories();
  const { brands } = useBrands();

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [imageUrls, setImageUrls] = useState([""]); // Array of image URLs
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(true);
  const [sellerProfileError, setSellerProfileError] = useState("");

  // Available Sizes options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "7", "8", "9", "10", "11", "One Size"];

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      brand: '',
      category: '',
      price: '',
      discountPrice: '',
      stock: '',
      status: 'Active',
      isBestseller: false,
      colors: '',
      sizes: [],
    }
  });

  // Load product if editing
  useEffect(() => {
    const fetchSellerProfile = async () => {
      setSellerProfileLoading(true);
      setSellerProfileError("");
      try {
        const profile = await getSellerProfile();
        setSellerProfile(profile);
      } catch (err) {
        if (err.response?.status === 404) {
          setSellerProfile(null);
        } else {
          setSellerProfileError(err.response?.data?.message || "Failed to load seller profile");
        }
      } finally {
        setSellerProfileLoading(false);
      }
    };

    fetchSellerProfile();

    if (isEdit && id) {
      const fetchProductData = async () => {
        setFetchingProduct(true);
        try {
          const prod = await getProductById(id);
          if (prod) {
            setValue('name', prod.name);
            setValue('sku', prod.sku);
            setValue('brand', prod.brand);
            setValue('category', prod.category);
            setValue('price', prod.price);
            setValue('discountPrice', prod.discountPrice || '');
            setValue('stock', prod.stock);
            setValue('status', prod.status);
            setValue('isBestseller', !!prod.isBestseller);
            setValue('colors', prod.colors?.join(', ') || '');
            setValue('sizes', prod.sizes || []);
            if (prod.images && prod.images.length > 0) {
              setImageUrls(prod.images);
            }
          }
        } catch (err) {
          console.error("Error fetching product details", err);
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProductData();
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (formData) => {
    if (!sellerProfile) {
      alert("Please complete your seller profile before creating products.");
      return;
    }

    setLoading(true);
    // Parse colors and sizes
    const colorsArray = formData.colors 
      ? formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    
    // Filter empty image URLs
    const filteredImages = imageUrls.filter(url => url.trim() !== "");
    const imagesArray = filteredImages.length > 0 
      ? filteredImages 
      : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"];

    const payload = {
      ...formData,
      colors: colorsArray,
      images: imagesArray
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/products');
    } catch (err) {
      alert("Failed to save product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Image inputs helpers
  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageField = (index) => {
    if (imageUrls.length === 1) {
      setImageUrls([""]);
    } else {
      setImageUrls(imageUrls.filter((_, idx) => idx !== index));
    }
  };

  if (fetchingProduct || sellerProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          icon={FiArrowLeft}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isEdit ? "Update details for this catalog item." : "Publish a new apparel item to the store catalog."}
          </p>
        </div>
      </div>

      {sellerProfileError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl font-semibold text-sm">
          {sellerProfileError}
        </div>
      )}
      {!sellerProfile && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl font-semibold text-sm">
          Please complete your seller profile first. <strong>Visit Seller Profile</strong> to continue.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Form Fields */}
          <Card title="Product Information" subtitle="Key details like name, brand and category.">
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Slim-Fit Linen Oxford Shirt"
                  {...register('name', { required: 'Product name is required' })}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:ring-lime-500'} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
              </div>

              {/* SKU & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">SKU Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. OXF-SHR-025"
                    {...register('sku', { required: 'SKU code is required' })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.sku ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:ring-lime-500'} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1`}
                  />
                  {errors.sku && <p className="text-xs text-rose-500 mt-1.5">{errors.sku.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Listing Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-rose-500 mt-1.5">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Brand *</label>
                  <select
                    {...register('brand', { required: 'Brand is required' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brd => (
                      <option key={brd._id} value={brd.name}>{brd.name}</option>
                    ))}
                  </select>
                  {errors.brand && <p className="text-xs text-rose-500 mt-1.5">{errors.brand.message}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Pricing & Inventory" subtitle="Manage item values and stock count.">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Regular Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Regular Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Price must be greater than 0' } })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                  {errors.price && <p className="text-xs text-rose-500 mt-1.5">{errors.price.message}</p>}
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="79.99"
                    {...register('discountPrice', {
                      validate: (value) => {
                        if (!value) return true;
                        const regPrice = parseFloat(watch('price'));
                        return parseFloat(value) < regPrice || 'Sale price must be less than regular price';
                      }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                  {errors.discountPrice && <p className="text-xs text-rose-500 mt-1.5">{errors.discountPrice.message}</p>}
                </div>

                {/* Stock Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Stock Level *</label>
                  <input
                    type="number"
                    placeholder="100"
                    {...register('stock', { required: 'Stock level is required', min: { value: 0, message: 'Stock level cannot be negative' } })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                  {errors.stock && <p className="text-xs text-rose-500 mt-1.5">{errors.stock.message}</p>}
                </div>
              </div>

              {/* Bestseller Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBestseller"
                  {...register('isBestseller')}
                  className="w-4.5 h-4.5 text-lime-600 border-slate-350 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded focus:ring-lime-500 focus:ring-offset-0"
                />
                <label htmlFor="isBestseller" className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                  Mark this product as a Store Bestseller
                </label>
              </div>
            </div>
          </Card>

          <Card title="Product Options" subtitle="Configure sizing charts and color variants.">
            <div className="space-y-5">
              {/* Sizes checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Sizes Available</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {sizeOptions.map((sz) => (
                    <label 
                      key={sz} 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/35 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <input
                        type="checkbox"
                        value={sz}
                        {...register('sizes')}
                        className="w-4 h-4 text-lime-600 border-slate-300 dark:border-slate-800 rounded focus:ring-lime-500 focus:ring-offset-0 shrink-0"
                      />
                      <span>{sz}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors list */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Colors Available (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Classic White, Navy Blue, Crimson Red"
                  {...register('colors')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
                <p className="text-[10px] text-slate-450 mt-1.5">Separate each color with a comma (e.g. White, Black, Red).</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Image Upload URLs */}
        <div className="space-y-6">
          <Card title="Product Images" subtitle="Add image links for previews.">
            <div className="space-y-4">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <FiImage className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-lime-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition-colors shrink-0"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image Preview Thumbnail */}
                  {url.trim() && (
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <img 
                        src={url} 
                        alt={`Preview ${idx+1}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300'; }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold py-2"
                onClick={addImageField}
                icon={FiPlus}
              >
                Add Image URL
              </Button>
            </div>
          </Card>

          <Card title="Publish Options" className="sticky top-20">
            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold"
                loading={loading}
                icon={FiSave}
                disabled={!sellerProfile || !!sellerProfileError || loading}
              >
                {isEdit ? "Update Listing" : "Publish Product"}
              </Button>
              <Button
                variant="outline"
                className="w-full py-2.5"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
