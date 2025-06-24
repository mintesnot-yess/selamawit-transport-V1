<template>
  <div class="flex flex-col gap-6 p-6 rounded-xl">
    <div class="flex items-start justify-between">
      <div>
        <h4 class="text-2xl">Roles & Permissions</h4>
        <p class="text-sm text-muted-foreground">
          Create and manage custom roles to meet your organization's needs.
        </p>
      </div>
    </div>

    <div class="rounded-lg overflow-hidden">
      <div
        class="grid gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6"
      >
        <div
          v-for="(role, index) in roles"
          :key="index"
          class="flex justify-between p-4 rounded-lg bg-background"
        >
          <div class="grid gap-4">
            <div>
              <h6 class="mb-0.5 font-semibold">{{ role.name }}</h6>
            </div>
            <div class="flex items-center space-x-2 text-xs font-medium">
              <div>
                <Users class="h-3.5" />
                <p>12 Users</p>
              </div>
              <Separator orientation="vertical" class="h-5" />
              <div>
                <ShieldCheck class="h-3.5" />
                <p>{{ role.permissions.length }} Permissions</p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button size="icon" variant="outline" class="w-8 h-8">
                <MoreVertical class="h-3.5 w-3.5" />
                <span class="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          @click="showPanel = true"
          class="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg hover:opacity-100 opacity-80 bg-background"
        >
          <PlusCircle class="h-5" />
          <h6>New role</h6>
        </button>
      </div>
    </div>

    <Panel
      v-model="showPanel"
      title="Create A User"
      description="Fill the User Information"
    >
      <form @submit="onSubmit" class="flex flex-col h-full">
        <div class="flex-1 space-y-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Site name</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="pt-2">
            <p class="mb-1 text-sm font-medium">Site User</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <FormField v-slot="{ componentField }" name="latitude">
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" v-bind="componentField" step="any" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div>
                <FormField v-slot="{ componentField }" name="longitude">
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" v-bind="componentField" step="any" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>

          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel>Site address</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="plan_number">
            <FormItem>
              <FormLabel>Site plan number</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <Button type="submit"> Submit </Button>
      </form>
    </Panel>
  </div>
</template>

<script >
import {
  ArrowUpDown,
  CirclePlus,
  MoreVertical,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-vue-next";
import { Panel } from "@/components/panels";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Checkbox,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import { Table, DropdownAction } from "@/components/table";
import { h, ref, shallowRef } from "vue";
import useRoleStore from "@/stores/roles";

export default {
  components: {
    Panel,
    Table,
    DropdownAction,
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Checkbox,
    Separator,
    ArrowUpDown,
    CirclePlus,
    ShieldCheck,
    Users,
    PlusCircle,
    DropdownMenu,

    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    ArrowUpDown,
    CirclePlus,
    MoreVertical,
  },
  data() {
    return {
      showPanel: false,
      roles: [],
      columns: [],
    };
  },
  created() {
    this.fetchExpenses();
    this.ColumnDefinitions();
  },
  methods: {
    async fetchExpenses() {
      try {
        const response = await useRoleStore.getAll();
        this.roles = response.data || [];
        console.table(this.roles);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },

    ColumnDefinitions() {
      this.columns = [
        {
          id: "select",
          header: ({ table }) =>
            h(Checkbox, {
              modelValue:
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate"),
              "onUpdate:modelValue": (value) =>
                table.toggleAllPageRowsSelected(!!value),
              ariaLabel: "Select all",
            }),
          cell: ({ row }) =>
            h(Checkbox, {
              modelValue: row.getIsSelected(),
              "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
              ariaLabel: "Select row",
            }),
          enableSorting: false,
          enableHiding: false,
        },

        {
          id: "index", // Don't use accessorKey for computed fields
          header: "#",
          cell: ({ row }) => {
            const index = row.index + 1; // +1 to start from 1 instead of 0
            return h("div", { class: "text-sm" }, index.toString());
          },
        },
        {
          accessorKey: "name",
          header: "User name",
          cell: ({ row }) => {
            const User_name = row.getValue("name"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, User_name);
          },
        },
        {
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => {
            const email = row.getValue("email"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, email);
          },
        },

        {
          accessorKey: "role",
          header: "role",
          cell: ({ row }) => {
            const role = row.original.role; // Access the nested client object

            return h("div", { class: "text-sm" }, role ? role.name : "");
          },
        },

        {
          id: "actions",
          accessorKey: "actions",
          enableHiding: false,
          header: () =>
            h("div", { class: "relative text-right font-medium " }, ""),

          cell: ({ row }) => {
            const ids = row.original;

            return h("div", { class: "relative text-right font-medium " }, [
              h(DropdownAction, { ids }),
            ]);
          },
        },
      ];
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ETB",
      }).format(value);
    },
    calculateTotal(data) {
      // Flatten the array and reduce to a single sum
      const total = data.flat().reduce((sum, value) => {
        return sum + parseFloat(value || 0);
      }, 0);

      return total;
    },
  },
};
</script>






