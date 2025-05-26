'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogs } from '@/redux/actions/blogActions'
import { AppDispatch, RootState } from '@/redux/store'
import BlogPost from '@/components/blog/BlogPost'
import Blog1 from '@/components/sections/Blog1'
import Blog5 from '@/components/sections/Blog5'
import { Loader2 } from 'lucide-react'

export default function Blog() {
    const dispatch = useDispatch<AppDispatch>()
    const { blogs, loading, error } = useSelector((state: RootState) => state.blog)

    useEffect(() => {
        dispatch(getAllBlogs())
    }, [dispatch])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    return (
        <>
            <Blog1 blogs={blogs.slice(0, 3)} />
            <Blog5 blogs={blogs.slice(3, 6)} />
        </>
    )
}
