import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { ProductForm } from '../../../components/admin/ProductForm';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { prisma } from '../../../lib/prisma';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface NewProductPageProps {
  categories: any[];
}

export default function NewProductPage({ categories }: NewProductPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push(`/admin/products/${data.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Add New Product
            </h1>
            <p className="text-slate-600 mt-1">
              Fill in the details below to create a new product
            </p>
          </div>

          <ProductForm
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
