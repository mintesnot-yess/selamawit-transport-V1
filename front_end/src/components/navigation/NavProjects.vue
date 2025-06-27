<script setup lang="ts">
import { type LucideIcon } from "lucide-vue-next";
import { ChevronRight } from "lucide-vue-next";

// UI Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";

// Define props
defineProps<{
  report: {
    name: string;
    url: string;
    icon: LucideIcon;
    permission: string;
  }[];
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  order: {
    name: string;
    url: string;
    icon: LucideIcon;
    permission: string;
  }[];
  general: {
    name: string;
    url: string;
    icon: LucideIcon;
    permission: string;
  }[];
  systemUser: {
    name: string;
    url: string;
    icon: LucideIcon;
    permission: string;
  }[];
}>();

const { hasPermission, hasAnyPermission } = usePermissions(); // ✅ Safe: called inside setup()
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]">
    <!-- Dashboard -->
    <SidebarMenu>
      <SidebarMenuItem v-for="item in report" :key="item.name">
        <SidebarMenuButton :tooltip="item.name" as-child>
          <router-link :to="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>

    <!-- Orders -->
    <SidebarMenu v-if="hasAnyPermission(['view-order'])">
      <SidebarGroupLabel>Orders</SidebarGroupLabel>
      <SidebarMenuItem v-for="item in order" :key="item.name">
        <template v-if="hasPermission(item.permission)">
          <SidebarMenuButton :tooltip="item.name" as-child>
            <router-link :to="item.url">
              <component :is="item.icon" />
              <span>{{ item.name }}</span>
            </router-link>
          </SidebarMenuButton>
        </template>
      </SidebarMenuItem>
    </SidebarMenu>

    <!-- Report (Collapsible) -->
    <SidebarMenu v-if="hasPermission('view-report')">
      <SidebarGroupLabel>Report</SidebarGroupLabel>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <SidebarMenuSubButton as-child>
                  <a :href="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>

    <!-- General Settings -->
    <SidebarMenu
      v-if="
        hasAnyPermission(['view-expense-type', 'view-employee', 'load-type'])
      "
    >
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenuItem v-for="item in general" :key="item.name">
        <template v-if="hasPermission(item.permission)">
          <SidebarMenuButton :tooltip="item.name" as-child>
            <router-link :to="item.url">
              <component :is="item.icon" />
              <span>{{ item.name }}</span>
            </router-link>
          </SidebarMenuButton>
        </template>
      </SidebarMenuItem>
    </SidebarMenu>

    <!-- User Management -->
    <SidebarMenu
      v-if="hasAnyPermission(['view-client', 'view-system-user', 'view-role'])"
    >
      <SidebarGroupLabel>User Management</SidebarGroupLabel>
      <SidebarMenuItem v-for="item in systemUser" :key="item.name">
        <template v-if="hasPermission(item.permission)">
          <SidebarMenuButton :tooltip="item.name" as-child>
            <router-link :to="item.url">
              <component :is="item.icon" />
              <span>{{ item.name }}</span>
            </router-link>
          </SidebarMenuButton>
        </template>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
 