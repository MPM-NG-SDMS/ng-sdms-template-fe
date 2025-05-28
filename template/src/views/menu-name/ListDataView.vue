<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PhArrowLeft, PhCaretDown, PhCheckCircle, PhEye, PhPencilSimple, PhPlus, PhSliders, PhSlidersHorizontal, PhTrash, PhXCircle } from '@phosphor-icons/vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppDateRangePicker from '@/components/AppDateRangePicker.vue';
import { DxDataGrid, DxColumn, DxPaging, DxPager, DxFilterRow, DxHeaderFilter } from 'devextreme-vue/data-grid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CardContent from '@/components/ui/card/CardContent.vue';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'Passive', label: 'Passive' }
];

const dateRangeOptions = [
  { id: 'last7', label: 'Last 7 Days' },
  { id: 'last30', label: 'Last 30 Days' },
  { id: 'last90', label: 'Last 90 Days' }
];

const currentTab = ref('all');
const selectedDateRange = ref('last7');
const showAdvancedFilter = ref(false);

const filterState = ref({
  status: [],
  dateRange: undefined
});

const statusOptions = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'passive', label: 'Passive' },
  { id: 'status2', label: 'Status' }
];

const customers = ref([
  {
    customerId: '0000093939',
    phoneNumber: '081234567890',
    customerName: 'Vincent',
    personalNumber: '1234567890',
    status: 'Active',
    motor: 1,
    lastModified: '2024-01-01',
  },
  {
    customerId: '0000093938',
    phoneNumber: '081234567890',
    customerName: 'Tomly',
    personalNumber: '1234567890',
    status: 'Passive',
    motor: 0,
    lastModified: '2024-01-01',
  }
]);

const showDeleteDialog = ref(false);
const pendingDeleteData = ref(null);

const handleView = (e) => {
  // Implement view logic
};

const handleEdit = (e) => {
  // Implement edit logic
};

const handleDelete = (data) => {
  pendingDeleteData.value = data;
  showDeleteDialog.value = true;
};

const handleConfirmDelete = () => {
  // Implement delete logic here
  showDeleteDialog.value = false;
  pendingDeleteData.value = null;
};

const handleDateRangeSelect = (range) => {
  selectedDateRange.value = range;
};

const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value;
};

const toggleStatus = (statusId) => {
  const index = filterState.value.status.indexOf(statusId);
  if (index === -1) {
    filterState.value.status.push(statusId);
  } else {
    filterState.value.status.splice(index, 1);
  }
};

const clearFilter = () => {
  filterState.value.status = [];
  filterState.value.dateRange = undefined;
  showAdvancedFilter.value = false;
};

const applyFilter = () => {
  showAdvancedFilter.value = false;
  // Implement filter logic
};
</script>

<template>
  <Card>
    <CardContent>
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex flex-row sm:flex-row items-center sm:items-center gap-2">
          <h1 class="text-lg sm:text-xl font-bold">Daftar Customer</h1>
          <Button @click="$router.push('/create')">
            <PhPlus weight="bold" /> Create
          </Button>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button v-for="tab in filterTabs" :key="tab.id" @click="currentTab = tab.id"
              class="px-3 sm:px-4 py-2 rounded-full transition-colors border whitespace-nowrap" :class="{
                'bg-primary text-primary-foreground': currentTab === tab.id,
                'hover:bg-muted': currentTab !== tab.id
              }">
              {{ tab.label }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <!-- Date Range Dropdown -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="gap-2">
                  {{dateRangeOptions.find(opt => opt.id === selectedDateRange)?.label}}
                  <PhCaretDown :size="16" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem v-for="option in dateRangeOptions" :key="option.id"
                  @click="handleDateRangeSelect(option.id)">
                  {{ option.label }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Advanced Filter Button -->
            <Button variant="outline" @click="toggleAdvancedFilter" class="gap-2 rounded-full">
              <PhSliders :size="16" weight="bold" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Advanced Filter Dialog -->
      <Dialog v-model:open="showAdvancedFilter">
        <DialogContent class="sm:max-w-[425px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <DialogDescription>
              Filter transactions by status and date range
            </DialogDescription>
          </DialogHeader>

          <!-- Status Checkboxes -->
          <div class="mb-4">
            <h3 class="text-sm font-medium mb-2">Status</h3>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="status in statusOptions"
                :key="status.id"
                class="flex items-center gap-2 px-3 py-1.5 rounded-md border whitespace-nowrap cursor-pointer"
                :class="{
                  'bg-primary text-primary-foreground': filterState.status.includes(status.id),
                  'bg-background': !filterState.status.includes(status.id)
                }"
              >
                <Checkbox
                  :model-value="filterState.status.includes(status.id)"
                  @update:model-value="() => toggleStatus(status.id)"
                  class="rounded border-gray-300"
                />
                {{ status.label }}
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div class="mb-6">
            <h3 class="text-sm font-medium mb-2">Pilih Range Tanggal</h3>
            <AppDateRangePicker v-model="filterState.dateRange" />
          </div>

          <DialogFooter class="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" @click="clearFilter" class="w-full sm:w-auto"><PhTrash /> Clear</Button>
            <Button @click="applyFilter" class="w-full sm:w-auto"><PhSlidersHorizontal/> Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- DataGrid Section -->
      <DxDataGrid :data-source="customers" :show-borders="true" :hover-state-enabled="true"
        :allow-column-reordering="true" :allow-column-resizing="true" :column-auto-width="true" :show-row-lines="true"
        :column-hiding-enabled="true">
        <DxColumn data-field="actions" caption="Actions" width="120" :allow-filtering="false" :allow-sorting="false"
          cell-template="actionsTemplate" />
        <DxColumn data-field="customerId" caption="Customer ID" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="phoneNumber" caption="Phone Number" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="customerName" caption="Nama Customer" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="personalNumber" caption="Personal Number" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="status" caption="Status" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="motor" caption="Motor" :allow-filtering="true" :allow-sorting="true" />
        <DxColumn data-field="lastModified" caption="Last Modified" :allow-filtering="true" :allow-sorting="true" data-type="date" format="yyyy-MM-dd"/>

        <template #actionsTemplate="{ data }">
          <div class="flex gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <button class="p-1 hover:bg-muted rounded-md" @click="handleView(data)">
                  <PhEye :size="18" weight="regular" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview Booking</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button class="p-1 hover:bg-muted rounded-md" @click="handleEdit(data)">
                  <PhPencilSimple :size="18" weight="regular" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Booking</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button class="p-1 hover:bg-muted rounded-md" @click="handleDelete(data)">
                  <PhXCircle :size="18" weight="regular" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Booking</p>
              </TooltipContent>
            </Tooltip>



          </div>
        </template>

        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxPaging :page-size="10" />
        <DxPager :allowed-page-sizes="[5, 10, 20]" :show-info="true" :show-navigation-buttons="true" :visible="true"
          :display-mode="'full'" />
      </DxDataGrid>
    </CardContent>
  </Card>

  <!-- Delete Confirmation Dialog -->
  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin akan melakukan pembatalan booking pada tanggal tersebut?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <PhArrowLeft :size="16" /> Kembali
        </AlertDialogCancel>
        <AlertDialogAction @click="handleConfirmDelete">
          <PhCheckCircle :size="16" /> Ya, Yakin
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
