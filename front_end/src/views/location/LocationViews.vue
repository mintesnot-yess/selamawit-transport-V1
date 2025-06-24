<template>
  <div class="flex flex-col gap-6 p-6 rounded-xl border shadow-sm bg-card">
    <div class="flex items-start justify-between">
      <div class="flex gap-2 flex-col">
        <h4 class="text-lg font-semibold leading-none tracking-tight">
          Locations
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
        :data="locations"
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
      title="Create A Location"
      description="Fill the Location Information"
    >
      <form @submit.prevent="handleSubmitAdd" class="flex flex-col h-full">
        <div class="flex-1 space-y-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Site name</FormLabel>
              <FormControl>
                <Input
                  v-model="form.location_name"
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <div v-if="error" class="text-red-500 text-sm mt-2">
                {{ error }}
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <Button type="submit">
          <span v-if="loading">
            <LoaderCircle
              class="fa-solid size-6 fa-circle-notch animate-spin"
            />
          </span>
          <span v-else> Submit </span>
        </Button>
      </form>
    </Panel>
  </div>
</template>

<script >
import { ArrowUpDown, CirclePlus, LoaderCircle } from "lucide-vue-next";
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
} from "@/components/ui";

import { Table, DropdownAction } from "@/components/table";
import { h, ref, shallowRef } from "vue";
import useLocationStore from "@/stores/locations";

export default {
  components: {
    Panel,
    Table,
    DropdownAction,
    Button,
    LoaderCircle,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Checkbox,
  },
  data() {
    return {
      showPanel: false,
      error: false,
      loading: false,
      locations: [],
      columns: [],
      form: {
        location_name: "",
      },
    };
  },
  created() {
    this.fetchLocation();
    this.ColumnDefinitions();
  },
  methods: {
    async fetchLocation() {
      try {
        const response = await useLocationStore.getAll();
        this.locations = response.data || [];
        console.table(this.locations);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async handleSubmitAdd() {
      this.loading = true;
      this.error = null;
      // If editingLocation is set, update the location, else create new

      try {
        const response = await useLocationStore.store(this.form);
        await this.fetchLocation();

        this.form.name = "";
        this.isSideFormVisible = false;

        this.showPanel = false;
        this.error = false;
        this.loading = false;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to save location information";
        console.error("Location save error:", error);
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
          accessorKey: "location_name",
          header: "location name",
          cell: ({ row }) => {
            const location_name = row.getValue("location_name"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, location_name);
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






