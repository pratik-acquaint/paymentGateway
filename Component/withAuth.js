"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
  
    useEffect(() => {
      const isAuthenticated = localStorage?.getItem('token') ;

      if (isAuthenticated == 'null' || null) {
        router.push('/');
       }
    }, [])
      
    return <Component {...props} />;
  };
}