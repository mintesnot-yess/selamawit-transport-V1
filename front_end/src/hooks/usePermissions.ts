import { useProfileStore } from '@/stores/profile';
import { computed } from 'vue';

export function usePermissions() {
    const userStore = useProfileStore();

    /**
     * Checks if the user has a specific permission
     */
    function hasPermission(permission: string): boolean {
        return userStore.permissions.includes(permission);
    }

    /**
     * Checks if the user has any of the specified permissions
     */
    function hasAnyPermission(permissions: string[]): boolean {
        return permissions.some(permission => hasPermission(permission));
    }

    /**
     * Reactive list of all user permissions
     */
    const permissions = computed(() => userStore.permissions);

    return {
        hasPermission,
        hasAnyPermission,
        permissions,
    };
}
