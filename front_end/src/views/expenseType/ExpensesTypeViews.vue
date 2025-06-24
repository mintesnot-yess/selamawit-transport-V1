<template>
  <div class="flex flex-col gap-6 p-6 rounded-xl border shadow-sm bg-card">
    <div class="flex items-start justify-between">
      <div class="flex gap-2 flex-col">
        <h4 class="text-lg font-semibold leading-none tracking-tight">
          ExpenseTypes
        </h4>
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
        :data="expenseTypes"
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
      title="Create A ExpenseType"
      description="Fill the ExpenseType Information"
    >
      <form @submit.prevent="handleSubmitAdd" class="flex flex-col h-full">
        <div class="flex-1 space-y-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Site name</FormLabel>
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

          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Owner Type</FormLabel>
              <Select v-model="form.category" v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OWNED">OWNED</SelectItem>
                  <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="VEHICLE">VEHICLE</SelectItem>
                  <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
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
import useExpenseStore from "@/stores/expenseTypes";

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
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Loader2,
  },
  data() {
    return {
      showPanel: false,
      expenseTypes: [],
      columns: [],
      error: "",
      loading: false,
      form: {
        name: "",
        category: "",
      },
    };
  },
  created() {
    this.fetchExpenseTypes();
    this.ColumnDefinitions();
  },
  methods: {
    async fetchExpenseTypes() {
      try {
        const response = await useExpenseStore.getAll();
        this.expenseTypes = response.data || [];
        console.table(this.expenseTypes);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async handleSubmitAdd() {
      this.loading = true;
      this.error = null;
      // If editingExpenseType is set, update the expense_type, else create new

      try {
        const response = await useExpenseStore.store(this.form);
        await this.fetchExpenseTypes();

        this.form.name = "";
        this.showPanel = false;
        this.loading = false;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to save expense_type information";
        console.error("ExpenseType save error:", error);
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
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const name = row.getValue("name"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, name);
          },
        },
        {
          accessorKey: "category",
          header: "category",
          cell: ({ row }) => {
            const category = row.getValue("category"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, category);
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






