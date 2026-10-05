import { Navigate } from 'react-router-dom';
import { readSession } from '../services/storage/sessionStorage';
import React from 'react';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const session = readSession(window.localStorage);

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};