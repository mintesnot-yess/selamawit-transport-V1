<template>
  <div class="flex flex-col gap-6 p-6 rounded-xl border shadow-sm bg-card">
    <div class="flex items-start justify-between">
      <div class="flex gap-2 flex-col">
        <h4 class="text-lg font-semibold leading-none tracking-tight">
          Clients
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
        :data="Clients"
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
      title="Create A Client"
      description="Fill the Client Information"
    >
      <form @submit.prevent="handleSubmitAdd" class="flex flex-col h-full">
        <div class="flex-1 space-y-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input
                  v-model="form.name"
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="contact_person">
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input
                  v-model="form.contact_person"
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  v-model="form.phone"
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  v-model="form.address"
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
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
import useClientStore from "@/stores/clients";

export default {
  components: {
    Panel,
    Table,
    LoaderCircle,
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
  },
  data() {
    return {
      form: {
        name: "",
        address: "",

        contact_person: "",
        phone: "",
        active: true,
        isMenuOpen: false,
      },
      showPanel: false,
      loading: false,
      error: "",
      Clients: [],
      columns: [],
    };
  },
  created() {
    this.fetchClients();
    this.ColumnDefinitions();
  },
  methods: {
    async fetchClients() {
      try {
        const response = await useClientStore.getAll();
        this.Clients = response.data || [];
        console.table(this.Clients);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async handleSubmitAdd() {
      this.loading = true;
      this.error = null;
      // If editingClient is set, update the client, else create new

      try {
        const response = await useClientStore.store(this.form);
        await this.fetchClients();

        this.error = "";
        this.showPanel = false;
        this.loading = false;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to save client information";
        console.error("client save error:", error);
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
          header: "Client name",
          cell: ({ row }) => {
            const Client_name = row.getValue("name"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, Client_name);
          },
        },
        {
          accessorKey: "contact_person",
          header: "contact person",
          cell: ({ row }) => {
            const contact_person = row.getValue("contact_person"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, contact_person);
          },
        },
        {
          accessorKey: "phone",
          header: "phone",
          cell: ({ row }) => {
            const phone = row.getValue("phone"); // Access the nested vehicle object
            return h("div", { class: "text-sm" }, phone);
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






