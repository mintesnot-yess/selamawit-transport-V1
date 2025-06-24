<?php

namespace App\Models;

use Laratrust\Models\Role as RoleModel;

class Role extends RoleModel
{

    // public $guarded = [
    //     'id',
    //     'created_at',
    //     'updated_at',
    //     'created_by',
    //     'updated_by'

    // ];
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'created_by',
        'updated_by'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);

    }



}
