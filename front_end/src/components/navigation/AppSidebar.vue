<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

// Icons from lucide-vue-next
import {
  ClipboardList,
  Handshake,
  Landmark,
  Layers2,
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  Truck,
  TruckElectricIcon,
  UserLock,
  Users,
  Wallet,
  WalletMinimal,
} from "lucide-vue-next";

// Navigation components
import { NavProjects, NavUser, TeamSwitcher } from "./";

// UI components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  ScrollArea,
} from "@/components/ui";

// Props definition with default values
const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

// Sidebar static data (mock)
const data = {
  user: {
    name: "Minte",
    email: "minte@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Selamawit",
      logo: TruckElectricIcon,
      plan: "Transport",
    },
  ],
  navMain: [
    {
      title: "Report",
      url: "#",
      icon: ClipboardList,
      items: [
        { title: "Own Summary", url: "#", permission: "read-report" },
        {
          title: "Uncollected Payments",
          url: "#",
          permission: "read-report",
        },
        { title: "Quantum", url: "#", permission: "read-report" },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
  ],
  orders: [
    {
      name: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      permission: "read-orders",
    },
    {
      name: "Expenses",
      url: "/expenses",
      icon: Wallet,
      permission: "read-expense",
    },
  ],
  general: [
    {
      name: "Expense Type",
      url: "/expense-type",
      icon: WalletMinimal,
      permission: "read-expense-type",
    },
    {
      name: "Vehicle",
      url: "/vehicles",
      icon: Truck,
      permission: "read-orders",
    },
    {
      name: "Employees",
      url: "/employees",
      icon: Users,
      permission: "read-orders",
    },
    {
      name: "Locations",
      url: "/locations",
      icon: MapPin,
      permission: "read-orders",
    },
    {
      name: "Load Type",
      url: "/load-type",
      icon: Layers2,
      permission: "read-orders",
    },
    {
      name: "Bank",
      url: "banks",
      icon: Landmark,
      permission: "read-orders",
    },
  ],
  systemUser: [
    {
      name: "Clients",
      url: "/clients",
      icon: Handshake,
      permission: "read-orders",
    },
    {
      name: "System Users",
      url: "/users",
      icon: UserLock,
      permission: "read-expense",
    },
    {
      name: "Roles",
      url: "/roles",
      icon: UserLock,
      permission: "read-expense",
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <!-- Header -->
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>

    <!-- Main Content -->
    <SidebarContent>
      <NavProjects
        :report="data.projects"
        :items="data.navMain"
        :order="data.orders"
        :general="data.general"
        :systemUser="data.systemUser"
      />
    </SidebarContent>

    <!-- Footer -->
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>

    <!-- Rail for hover expand/collapse -->
    <SidebarRail />
  </Sidebar>
</template>


<style scoped>
*::-webkit-scrollbar {
  display: none;
}
</style>