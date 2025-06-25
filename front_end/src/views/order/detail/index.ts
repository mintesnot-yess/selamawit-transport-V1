 export { default as OrderDetail } from "./OrdersDetail.vue"
 export { default as orderCard } from "./orderCard.vue"
 export { default as Expenses } from "./Expenses.vue"



//  `<Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Expense Type</TableHead>
//               <TableHead class="">Payment Type</TableHead>
//               <TableHead class=""> Amount </TableHead>
//               <TableHead class=""> Date </TableHead>
//               <TableHead class=""> From </TableHead>
//               <TableHead class=""> To </TableHead>
//               <TableHead class=""> Remark </TableHead>
//               <TableHead class=""> </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             <TableRow class="">
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ item.expense_type.category }}
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ item.payment_type ?? "transfer" }}
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ formatCurrency(item.amount) }}
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ formatDate(item.paid_date) }} </TableCell
//               ><TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{
//                   item.from_bank.name + " " + item.from_account.account_number
//                 }}
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ item.to_bank.name + " " + item.to_account }}
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 >{{ item.remark }} </TableCell
//               ><TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 ><img src="" alt="" />
//               </TableCell>
//               <TableCell
//                 v-for="item in expenseData"
//                 :key="item.id"
//                 :v-bind="item.id"
//                 ><div class="flex items-center gap-1 ml-auto">
//                   <DropdownAction
//                     :item="item"
//                     :isEdit="true"
//                     :isDelete="true"
//                     :isShow="false"
//                     @delete="confirmDelete"
//                   />
//                 </div>
//               </TableCell>
//             </TableRow>
//             <!-- <TableRow>
//               <TableCell
//                 class="pt-4 text-center text-muted-foreground"
//                 colspan="5"
//               >
//                 No customers currently being managed by this user.
//               </TableCell>
//             </TableRow> -->
//           </TableBody>
//         </Table>
// `