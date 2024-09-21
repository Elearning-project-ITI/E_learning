<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all materials
        $materials = Material::all();

        // Return a JSON response with the materials
        return response()->json([
            'success' => true,
            'data' => $materials,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
            'type' => 'required|in:pdf,video,audio,text',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 400); // HTTP 400 for Bad Request
        }

        // Create a new material
        $material = Material::create([
            'url' => $request->url,
            'type' => $request->type,
            'course_id' => $request->course_id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $material,
        ], 201); // HTTP 201 for Created
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Fetch a single material by ID
        $material = Material::find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
            ], 404); // HTTP 404 for Not Found
        }

        return response()->json([
            'success' => true,
            'data' => $material,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the material by ID
        $material = Material::find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'url' => 'sometimes|url',
            'type' => 'sometimes|in:pdf,video,audio,text',
            'course_id' => 'sometimes|exists:courses,id',
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 400); // HTTP 400 for Bad Request
        }

        // Update the material with the request data
        $material->update($request->only(['url', 'type', 'course_id']));

        return response()->json([
            'success' => true,
            'data' => $material,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the material by ID
        $material = Material::find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Delete the material
        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material deleted successfully',
        ], 200); // HTTP 200 for OK
    }
}