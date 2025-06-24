<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Validator;

class IncomeController extends Controller
{
    /**
     * Display a listing of incomes.
     */
    public function index()
    {
        $incomes = Income::with(["order", "creator", "updater"])->get();

        return response()->json([
            "success" => true,
            "data" => $incomes,
            "message" => "Incomes fetched successfully."
        ]);
    }

    /**
     * Store a newly created income.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "order_id" => "required|exists:orders,id",
            "amount" => "required|numeric|min:0",
            "received_date" => "required|date",
            "bank_id" => "required|exists:banks,id",
            "account_number" => "required|string",
            "attachment" => "nullable|file|mimes:jpg,jpeg,pdf,png|max:2048",
            "payment_type" => "nullable|string",
            "remark" => "nullable|string",
        ]);

        // Handle file upload
        $filePath = null;
        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('attachments/incomes', 'public');
        }

        $income = Income::create([
            "order_id" => $data['order_id'],
            "amount" => $data['amount'],
            "received_date" => $data['received_date'],
            "bank_id" => $data['bank_id'],
            "account_number" => $data['account_number'],
            "payment_type" => $data['payment_type'] ?? null,
            "remark" => $data['remark'] ?? null,
            "attachment" => $filePath,
            "created_by" => Auth::id(),
            "updated_by" => Auth::id(),
        ]);

        return response()->json([
            "success" => true,
            "data" => $income,
            "message" => "Income created successfully."
        ], 201);
    }

    /**
     * Display the specified income.
     */
    public function show($id)
    {
        $income = Income::with(["order", "creator", "updater"])->find($id);

        if (!$income) {
            return response()->json([
                "success" => false,
                "message" => "Income not found."
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $income,
            "message" => "Income fetched successfully."
        ]);
    }

    /**
     * Update the specified income.
     */
    public function update(Request $request, $id)
    {

        $income = Income::find($id);

        if (!$income) {
            return response()->json([
                "success" => false,
                "message" => "Income not found."
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            "order_id" => "sometimes|exists:orders,id",
            "amount" => "sometimes|numeric|min:0",
            "received_date" => "sometimes|date",
            "remark" => "nullable|string",
            "attachment" => "nullable|file|mimes:jpg,jpeg,pdf,png|max:2048",
            "bank_id" => "nullable|exists:banks,id",
            "account_number" => "nullable|string",
            "payment_type" => "nullable|string|in:cash,credit_card,bank_transfer,other",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($income->attachment) {
                Storage::delete($income->attachment);
            }

            $path = $request->file('attachment')->store('income_attachments');
            $data['attachment'] = $path;
        }

        try {
            $income->update($data);

            return response()->json([
                "success" => true,
                "data" => $income,
                "message" => "Income updated successfully."
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to update income",
                "error" => $e->getMessage()
            ], 500);
        }


        // // Handle file upload
        // if ($request->hasFile('attachment')) {
        //     // Optional: delete old file
        //     if ($income->attachment) {
        //         Storage::disk('public')->delete($income->attachment);
        //     }
        //     $data['attachment'] = $request->file('attachment')->store('attachments/incomes', 'public');
        // }

        // $income->update(array_merge($data, [
        //     "updated_by" => Auth::id()
        // ]));

        // return response()->json([
        //     "success" => true,
        //     "data" => $income,
        //     "message" => "Income updated successfully."
        // ]);
    }

    /**
     * Remove the specified income.
     */
    public function destroy($id)
    {
        $income = Income::find($id);

        if (!$income) {
            return response()->json([
                "success" => false,
                "message" => "Income not found."
            ], 404);
        }

        // Optional: delete attachment
        if ($income->attachment) {
            Storage::disk('public')->delete($income->attachment);
        }

        $income->delete();

        return response()->json([
            "success" => true,
            "message" => "Income deleted successfully."
        ], 204);
    }
}