<template>
  <div class="flex flex-col gap-6 p-6 rounded-xl border shadow-sm bg-card">
    <div class="flex items-start justify-between">
      <div class="flex gap-2 flex-col">
        <h4 class="text-lg font-semibold leading-none tracking-tight">Users</h4>
        <p class="text-sm text-muted-foreground"></p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          @click="showPanel = true"
          variant="ghost"
          class="text-sm text-muted-foreground flex gap-1 items-center justify-center cursor-pointer"
        >
          <CirclePlus />
          Create New
        </Button>
      </div>
    </div>

    <div class="rounded-lg overflow-hidden">
      <Table
        :columns="columns"
        :data="Users"
        :isPagination="true"
        :isSearchable="true"
        :is-filter-select="true"
        filter-select-column="status"
        filter-select-label="Status"
        :filter-select-options="[
          { label: 'All', value: '__all' },
          { label: 'PENDING', value: 'PENDING' },
          { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
          { label: 'COMPLETED', value: 'COMPLETED' },
          { label: 'CANCELLED', value: 'CANCELLED' },
        ]"
      />
    </div>

    <Panel
      v-model="showPanel"
      title="Create A User"
      description="Fill the User Information"
    >
      <form @submit.prevent="handleSubmitAdd" class="flex flex-col h-full">
        <div class="flex-1 space-y-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-model="form.name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  v-model="form.email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  v-model="form.password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password_confirmation">
            <FormItem>
              <FormLabel>Confirm Password </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  v-model="form.password_confirmation"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select v-model="form.role" v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="item in roles"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.name }}</SelectItem
                  >
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          </FormField>
          <div if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>
        </div>
        <Button
          :disabled="loading"
          type="submit"
          class="w-full py-3.5 rounded-xl"
        >
          <span v-if="!loading">Submit</span>
          <span v-else class="flex items-center gap-2">
            <Loader2 class="h-4 w-4 animate-spin" />
            Processing...
          </span>
        </Button>
      </form>
    </Panel>
  </div>
</template>

<script >
import { ArrowUpDown, CirclePlus, Loader2 } from "lucide-vue-next";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

import { Table, DropdownAction } from "@/components/table";
import { h, ref, shallowRef } from "vue";
import useUserStore from "@/stores/users";

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
    ArrowUpDown,
    CirclePlus,
    Select,
    SelectTrigger,
    SelectValue,
    Loader2,
    SelectContent,
    SelectItem,
  },
  data() {
    return {
      showPanel: false,
      loading: false,
      error: "",
      Users: [],
      roles: [],
      columns: [],
      form: {
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      },
    };
  },
  created() {
    this.fetchUsers();
    this.ColumnDefinitions();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await useUserStore.getAll();
        this.Users = response.data || [];
        this.roles = response.roles || [];
        console.table(this.roles);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },

    async handleSubmitAdd() {
      this.error = null;
      this.loading = true;

      try {
        const response = await useUserStore.store(this.form);
        await this.fetchUsers();
        this.showPanel = false;
        this.error = "";
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to create user";
      } finally {
        this.loading = false;
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






