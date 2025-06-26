<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ChevronDown } from "lucide-vue-next";

// Components
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Checkbox,
} from "@/components/ui";

// Types & Stores
import type { Role, PermissionGroup } from "@/types";
import { useRoleStore } from "@/stores/role";
import { ref } from "vue";

const props = defineProps<{
  role?: Partial<Role> | null;
}>();

const emit = defineEmits<{
  submitted: [];
  cancel: [];
}>();

// Form Schema
const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

const form = useForm({
  validationSchema: toTypedSchema(roleFormSchema),
  initialValues: {
    name: props.role?.name ?? "",
    permissions: props.role?.permissions ?? [],
  },
});

// Store
const roleStore = useRoleStore();
const isLoading = ref(false);

// Accordion state
const expandedGroups = ref<Record<string, boolean>>({});

// Toggle accordion
const toggleGroup = (groupName: string) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName];
};

// Check if group is expanded
const isGroupExpanded = (groupName: string) => {
  return expandedGroups.value[groupName] ?? false;
};

// Submit handler
const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    if (props.role?.id) {
      await roleStore.updateRole(props.role.id, values);
    } else {
      await roleStore.createRole(values);
    }

    emit("submitted");
    form.resetForm();
  } catch (error) {
    console.error("Failed to save role:", error);
  } finally {
    isLoading.value = false;
  }
});

// Cancel handler
const onCancel = () => {
  form.resetForm();
  emit("cancel");
};
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <!-- Role Name Field -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Role Name</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Enter role name"
            v-bind="componentField"
            :disabled="role?.is_protected"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Permissions Section -->
    <FormField name="permissions">
      <FormItem>
        <div class="mb-4">
          <FormLabel class="text-base">Permissions</FormLabel>
          <FormDescription>
            Select permissions to assign to this role
          </FormDescription>
        </div>

        <div class="space-y-2">
          <div
            v-for="group in roleStore.permissionGroups"
            :key="group.name"
            class="rounded-lg border p-2"
          >
            <!-- Group Header -->
            <div
              class="flex items-center justify-between p-2 cursor-pointer"
              @click="toggleGroup(group.name)"
            >
              <span class="font-medium">{{ group.name }}</span>
              <ChevronDown
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': isGroupExpanded(group.name) }"
              />
            </div>

            <!-- Permissions List -->
            <div
              v-show="isGroupExpanded(group.name)"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mt-2"
            >
              <FormField
                v-for="permission in group.permissions"
                :key="permission.id"
                v-slot="{ value, handleChange }"
                :name="'permissions'"
              >
                <FormItem class="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      :checked="value.includes(permission.id)"
                      @update:checked="(checked: any) => {
                        handleChange(
                          checked
                            ? [...value, permission.id]
                            : value.filter((id: string) => id !== permission.id)
                        )
                      }"
                    />
                  </FormControl>
                  <FormLabel class="font-normal">
                    {{ permission.name }}
                  </FormLabel>
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Form Actions -->
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        @click="onCancel"
        :disabled="isLoading"
      >
        Cancel
      </Button>
      <Button type="submit" :loading="isLoading">
        {{ role?.id ? "Update" : "Create" }} Role
      </Button>
    </div>
  </form>
</template>