"use client";
import React, { useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { toastMessage } from "@/lib/toast.message";
import ServerSIdeTable from "@/components/GlobalTable/ServerSIdeTable";
import Swal from "sweetalert2";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePermission } from "@/hooks/usePermission";
import { DeleteCategoryApi, GetCategoryApi } from "@/Api/community";
import { ENV } from "@/config";

export default function List() {
  const tableRef = useRef<{ reload: () => void }>(null);
  const navigate = useRouter();
  const permission = usePermission("Communities");

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "name",
        header: "Name",
        meta: { filterType: "text" },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        meta: { filterType: "text" },
      },
      {
        accessorKey: "image",
        header: "Image",
        enableColumnFilter: false,
        cell: ({ row }) => (
          row?.original?.image ? (
            <img 
              src={`${ENV.IMAGE_URL}/logos/${row?.original?.image}`} 
              alt="Category" 
              className="w-10 h-10 object-cover rounded-lg" 
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )
        )
      },
      {
        accessorKey: "isPopular",
        header: "Featured",
        meta: { filterType: "text" },
        cell: ({ row }) => {
          const isPopular = row?.original?.isPopular;
          return isPopular ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              🔥 Popular
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200">
              Normal
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        meta: { filterType: "text" },
        cell: ({ row }) => {
          const isActive = row?.original?.isActive;
          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* EDIT BUTTON */}
            {permission.edit && (
            <button
              type="button"
              onClick={() => {
                navigate.push("/community-category/update-category/" + row?.original?._id);
              }}
              className="
                inline-flex items-center justify-center
                h-9 w-9
                rounded-lg
                border border-gray-300
                bg-white
                text-gray-700
                transition
                hover:bg-gray-100
                hover:text-gray-900
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              title="Edit"
            >
              <EditOutlinedIcon fontSize="small" />
            </button>
            )}

            {/* DELETE BUTTON */}
            {permission.delete && (
            <button
              type="button"
              onClick={() => {
                handleDelete(row?.original?._id);
              }}
              className="
                inline-flex items-center justify-center
                h-9 w-9
                rounded-lg
                bg-red-600
                text-white
                transition
                hover:bg-red-700
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
              "
              title="Delete"
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </button>
            )}
          </div>
        ),
      },
    ];
    return baseColumns;
  }, [navigate, permission.edit, permission.delete]);

  const fetchData = async ({
    pageIndex,
    pageSize,
    filter,
  }: {
    pageIndex: number;
    pageSize: number;
    filter: any;
  }) => {
    const body = {
      page: pageIndex + 1,
      limit: pageSize,
      filter,
    };
    const res = await GetCategoryApi(body);
    return {
      data: res?.data || [],
      total: res?.data?.length || 0,
    };
  };

  const handleDelete = async (id: any) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone. This will delete all groups within this category as well.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reponse: any = await DeleteCategoryApi({ id });
          if (reponse.ok) {
            toastMessage(reponse.message, "success");
            tableRef.current?.reload();
          } else {
            toastMessage(reponse.message, "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <Breadcrumbs path="Community Categories" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Community Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your chat communities
          </p>
        </div>
        {permission.add && (
        <button
          onClick={() => {
            navigate.push("/community-category/add-category");
          }}
          className="
            inline-flex items-center gap-2
            rounded-xl
            bg-[#0f172a] px-6 py-3
            text-sm font-semibold text-white
            shadow-md
            transition-all duration-200
            hover:bg-[#020617]
            hover:shadow-lg
            active:scale-95
            focus:outline-none
            focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2
          "
        >
          <span className="text-lg leading-none">+</span>
          Add Category
        </button>
        )}
      </div>
      {/* Divider */}
      <div className="h-px bg-gray-200" />
      {/* Table */}
      <ServerSIdeTable ref={tableRef} columns={columns} fetchApi={fetchData} />
    </div>
  );
}
