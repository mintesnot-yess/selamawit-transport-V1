<template>
    <div class="flex flex-col space-y-3">
        <GoBack />
        <div class="flex items-start justify-between px-1">
            <div>
                <div class="flex items-center space-x-5 font-normal text-2xl">
                    <h4>Order Details</h4>
                </div>
                <p class="text-sm text-muted-foreground">
                    Manage access order information.
                </p>
            </div>
        </div>

        <main
            class="grid items-start flex-1 gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
        >
            <div
                class="grid items-start gap-1 auto-rows-max md:gap-4 lg:col-span-2 overflow-x-auto"
            >
                <Tabs default-value="expense">
                    <div class="flex items-center">
                        <TabsList>
                            <TabsTrigger value="expense">Expense </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="expense">
                        <Expense
                            :expenseData="expenses"
                            @data-changed="fetchOrder"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    </div>
</template>

<script>
import { ArrowUpDown, CirclePlus, LoaderCircle } from "lucide-vue-next";
import vehicleService from "@/services/vehicle";

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

import { GoBack } from "@/components/navigation";

import { Table, DropdownAction } from "@/components/table";
import { h, ref, shallowRef } from "vue";
import useAccountStore from "@/stores/accounts";
import ConfirmDelete from "@/components/form/ConfirmDelete.vue";
import OrderCard from "./orderCard.vue";
import Tabs from "@/components/ui/tabs/Tabs.vue";
import TabsList from "@/components/ui/tabs/TabsList.vue";
import TabsTrigger from "@/components/ui/tabs/TabsTrigger.vue";
import TabsContent from "@/components/ui/tabs/TabsContent.vue";
import Card from "@/components/ui/card/Card.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import Label from "@/components/ui/label/Label.vue";
import CardFooter from "@/components/ui/card/CardFooter.vue";
import useOrderStore from "@/stores/orders";
import Expense from "./Expenses.vue";
import PaymentCollected from "./PaymentCollected.vue";

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
        LoaderCircle,
        ArrowUpDown,
        CirclePlus,
        ConfirmDelete,
        GoBack,
        OrderCard,
        TabsList,
        Tabs,
        TabsTrigger,
        TabsContent,
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardContent,
        Label,
        CardFooter,
        Expense,
        PaymentCollected,
    },
    data() {
        return {
            loading: false,
            loadingBanks: false,
            error: null,
            vehicle: [],

            columns: [],

            // deleted component

            pagination: {
                current_page: 1,
                per_page: 15,
                total: 0,
                last_page: 1,
                from: 0,
                to: 0,
            },
        };
    },
    created() {
        this.fetchVehicleDetail();
        this.ColumnDefinitions();
    },
    methods: {
        async fetchVehicleDetail() {
            this.loading = true;
            try {
                const id = this.$route.params.id;
                const response = await useVehicleStore.getById(id);
                this.vehicle = response.vehicle;
            } catch (err) {
                this.error = "Unable to load order.";
            } finally {
                this.loading = false;
            }
        },

        updatePagination(meta) {
            this.pagination = {
                current_page: meta.current_page || 1,
                per_page: meta.per_page || this.pagination.per_page,
                total: meta.total || 0,
                last_page: meta.last_page || 1,
                from:
                    meta.from ||
                    ((meta.current_page || 1) - 1) *
                        (meta.per_page || this.pagination.per_page) +
                        1,
                to:
                    meta.to ||
                    Math.min(
                        (meta.current_page || 1) *
                            (meta.per_page || this.pagination.per_page),
                        meta.total || 0,
                    ),
            };
        },

        ColumnDefinitions() {
            this.columns = [
                {
                    id: "select",
                    header: ({ table }) =>
                        h(Checkbox, {
                            modelValue:
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() &&
                                    "indeterminate"),
                            "onUpdate:modelValue": (value) =>
                                table.toggleAllPageRowsSelected(!!value),
                            ariaLabel: "Select all",
                        }),
                    cell: ({ row }) =>
                        h(Checkbox, {
                            modelValue: row.getIsSelected(),
                            "onUpdate:modelValue": (value) =>
                                row.toggleSelected(!!value),
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
                    accessorKey: "account_number",
                    header: "Account Number",
                    cell: ({ row }) => {
                        const account_number = row.getValue("account_number"); // Access the nested vehicle object
                        return h("div", { class: "text-sm" }, account_number);
                    },
                },
            ];
        },

        handleDeleteOrder(order) {
            // Show confirmation and delete
            if (confirm(`Delete order ${order.orderNumber}?`)) {
                // API call to delete
            }
        },
    },
};
</script>

<style scoped>
.max-width {
    max-width: 800px;
}
</style>
