"use client";
import React, { useMemo, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { toastMessage } from "@/lib/toast.message";
import ServerSIdeTable from "@/components/GlobalTable/ServerSIdeTable";
import Swal from "sweetalert2";
import Breadcrumbs from "@/components/Breadcrumbs";
import { DeleteAdApi, GetAdsApi, SeedAdsApi } from "@/Api/advertisement";
import { ENV } from "@/config";

export default function AdsListPage() {
  const tableRef = useRef<{ reload: () => void }>(null);
  const navigate = useRouter();

  const handleSeedAds = async () => {
    try {
      const res: any = await SeedAdsApi();
      if (res?.ok || res?.success) {
        toastMessage("Sample ad model data seeded successfully!", "success");
        tableRef.current?.reload();
      } else {
        toastMessage("Failed to seed sample ads", "error");
      }
    } catch (e) {
      toastMessage("Something went wrong", "error");
    }
  };

  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    const baseColumns: ColumnDef<any, any>[] = [
      {
        accessorKey: "title",
        header: "Ad Title / Campaign",
        meta: { filterType: "text" },
      },
      {
        accessorKey: "image",
        header: "Preview",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const ad = row?.original;
          if (ad?.image) {
            return (
              <img
                src={`${ENV.IMAGE_URL}/logos/${ad.image}`}
                alt="Ad Banner"
                className="w-14 h-9 object-cover rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            );
          }
          if (ad?.adType === "google_adsense") {
            return (
              <span className="inline-flex items-center px-2 py-1 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                AdSense Slot
              </span>
            );
          }
          if (ad?.adType === "custom_script") {
            return (
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                &lt;Script/&gt;
              </span>
            );
          }
          return <span className="text-xs text-gray-400">No Graphic</span>;
        },
      },
      {
        accessorKey: "placement",
        header: "Placement",
        meta: { filterType: "text" },
        cell: ({ row }) => {
          const placement = row?.original?.placement;
          const placementLabels: Record<string, string> = {
            community_sidebar: "Community Sidebar",
            chat_top_banner: "Chat Header Banner",
            chat_bottom_banner: "Chat Footer Banner",
            video_call_banner: "Video Call Sponsor",
            landing_featured: "Landing Featured Card",
          };
          return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {placementLabels[placement] || placement || "Community Sidebar"}
            </span>
          );
        },
      },
      {
        accessorKey: "adType",
        header: "Ad Network / Type",
        cell: ({ row }) => {
          const ad = row?.original;
          const type = ad?.adType;
          const network = ad?.thirdPartyNetwork || "Direct";
          return (
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 w-fit">
                {type === "google_adsense"
                  ? "Google AdSense"
                  : type === "custom_script"
                  ? "Third-Party Script"
                  : type === "iframe_embed"
                  ? "Iframe Embed"
                  : "Direct Banner"}
              </span>
              {network && network !== "Direct Advertiser" && (
                <span className="text-[10px] text-gray-500 font-medium">Provider: {network}</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "clicks",
        header: "Performance / CTR",
        cell: ({ row }) => {
          const clicks = row?.original?.clicks || 0;
          const impressions = row?.original?.impressions || 0;
          const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";
          return (
            <div className="text-xs">
              <span className="font-semibold text-gray-800">{clicks}</span> clicks /{" "}
              <span className="text-gray-500">{impressions} views</span>
              <span className="ml-1.5 font-medium text-emerald-600">({ctr}% CTR)</span>
            </div>
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
              {isActive ? "Live / Active" : "Paused"}
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
            <button
              type="button"
              onClick={() => {
                navigate.push("/ads/update-ad/" + row?.original?._id);
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

            {/* DELETE BUTTON */}
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
          </div>
        ),
      },
    ];
    return baseColumns;
  }, [navigate]);

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
    const res = await GetAdsApi(body);
    return {
      data: res?.data || [],
      total: res?.data?.length || 0,
    };
  };

  const handleDelete = (id: any) => {
    Swal.fire({
      title: "Delete Advertisement?",
      text: "Are you sure you want to remove this third-party or custom advertisement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteAdApi({ id });
          if (response?.ok || response?.success) {
            toastMessage(response?.message || "Advertisement deleted successfully", "success");
            tableRef.current?.reload();
          } else {
            toastMessage(response?.message || "Failed to delete", "error");
          }
        } catch (error) {
          toastMessage("Something went wrong", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs path="Advertisements" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Advertisements & Ad Networks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage third-party ad networks (Google AdSense, Media.net, Carbon Ads) and custom affiliate banners
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSeedAds}
            className="
              px-3.5 py-2
              bg-white border border-gray-300 text-gray-700 text-sm font-medium
              rounded-lg
              hover:bg-gray-50 hover:text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
              transition-all
              shadow-sm
            "
          >
            ⚡ Reset & Seed Sample Ads
          </button>
          <button
            type="button"
            onClick={() => navigate.push("/ads/add-ad")}
            className="
              px-4 py-2
              bg-[#0f172a] text-white text-sm font-medium
              rounded-lg
              hover:bg-[#020617]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a]
              transition-all
              shadow-sm
            "
          >
            Add New Advertisement
          </button>
        </div>
      </div>
      <div className="h-px bg-gray-200" />
      <ServerSIdeTable<any>
        ref={tableRef}
        columns={columns}
        fetchApi={fetchData}
      />
    </div>
  );
}
