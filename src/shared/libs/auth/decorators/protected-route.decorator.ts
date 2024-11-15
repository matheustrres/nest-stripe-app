import { SetMetadata } from '@nestjs/common';

export const IS_PROTECTED_ROUTE = 'isProtectedRoute';
export const ProtectedRoute = () => SetMetadata(IS_PROTECTED_ROUTE, true);
